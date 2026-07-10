import { ModerationActions } from "@/components/admin/moderation-actions";
import { prisma } from "@/lib/db";

export default async function ModerationPage() {
  const [flags, pendingUploads, bannedUsers] = await Promise.all([
    prisma.moderationFlag.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.gameUpload.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: { isBanned: true } }),
  ]);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Moderation</h1>
      <p className="mb-6 text-sm text-[var(--color-muted)]">
        Flagged content queue, user flags, and approval workflow.
      </p>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Pending Flags" value={flags.length} />
        <Stat label="Pending Uploads" value={pendingUploads} />
        <Stat label="Banned Users" value={bannedUsers} />
      </div>

      <h2 className="mb-3 text-lg font-semibold">Flagged Items</h2>
      {flags.length === 0 ? (
        <p className="text-[var(--color-muted)]">No pending moderation flags.</p>
      ) : (
        <div className="space-y-3">
          {flags.map((flag) => (
            <div key={flag.id} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium">{flag.entityType}: {flag.entityId}</span>
                <span className="text-[var(--color-muted)]">{flag.createdAt.toLocaleDateString()}</span>
              </div>
              <p className="mb-3 text-sm text-[var(--color-muted)]">{flag.reason}</p>
              <ModerationActions flagId={flag.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-[var(--color-surface)] p-4">
      <p className="text-sm text-[var(--color-muted)]">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
