import Link from "next/link";
import { ReportStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { ReportsTable } from "@/components/admin/reports-table";

type Props = {
  searchParams: Promise<{ filter?: string; type?: string }>;
};

export default async function AdminReportsPage({ searchParams }: Props) {
  const { filter: filterParam, type } = await searchParams;
  const filter = filterParam === "all" ? "all" : "open";

  const reports = await prisma.gameReport.findMany({
    where: {
      ...(filter === "open" ? { status: ReportStatus.OPEN } : {}),
      ...(type ? { reportType: type as never } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      game: { select: { title: true, slug: true } },
    },
  });

  const types = ["GAME_ISSUE", "USER", "TOXIC_CONTENT", "COPYRIGHT"];

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Reports</h1>
      <p className="mb-4 text-sm text-[var(--color-muted)]">
        Game issues, user reports, toxic content, and copyright complaints.
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        {types.map((t) => (
          <Link
            key={t}
            href={`/admin/reports?type=${t}`}
            className={`rounded-lg px-3 py-1.5 text-xs ${
              type === t
                ? "bg-[var(--color-accent)] text-white"
                : "bg-[var(--color-surface)] text-[var(--color-muted)]"
            }`}
          >
            {t.replace("_", " ")}
          </Link>
        ))}
        <Link href="/admin/reports" className="rounded-lg bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-muted)]">
          All types
        </Link>
      </div>
      <ReportsTable reports={reports} filter={filter} />
    </div>
  );
}
