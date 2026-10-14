import { prisma } from "@/lib/db";

const MINIMUM_RETENTION_DAYS = 90;
const DEFAULT_RETENTION_DAYS = 365;
const BATCH_SIZE = 1_000;

function retentionDays(): number {
  const parsed = Number.parseInt(
    process.env.ANALYTICS_RAW_RETENTION_DAYS ?? "",
    10
  );
  if (!Number.isFinite(parsed)) return DEFAULT_RETENTION_DAYS;
  return Math.max(parsed, MINIMUM_RETENTION_DAYS);
}

async function deleteExpiredSessions(cutoff: Date): Promise<number> {
  let deleted = 0;
  while (true) {
    const rows = await prisma.analyticsSession.findMany({
      where: { startedAt: { lt: cutoff } },
      orderBy: { startedAt: "asc" },
      take: BATCH_SIZE,
      select: { id: true },
    });
    if (rows.length === 0) return deleted;
    const result = await prisma.analyticsSession.deleteMany({
      where: { id: { in: rows.map((row) => row.id) } },
    });
    deleted += result.count;
  }
}

async function main() {
  const days = retentionDays();
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1_000);
  const deletedSessions = await deleteExpiredSessions(cutoff);
  const deletedVisitors = await prisma.analyticsVisitor.deleteMany({
    where: {
      lastSeenAt: { lt: cutoff },
      sessions: { none: {} },
    },
  });
  const anonymizedPlays = await prisma.playEvent.updateMany({
    where: {
      createdAt: { lt: cutoff },
      ip: { not: null },
    },
    data: { ip: null },
  });

  console.log(
    JSON.stringify({
      retentionDays: days,
      cutoff: cutoff.toISOString(),
      deletedSessions,
      deletedVisitors: deletedVisitors.count,
      anonymizedLegacyPlayEvents: anonymizedPlays.count,
    })
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
