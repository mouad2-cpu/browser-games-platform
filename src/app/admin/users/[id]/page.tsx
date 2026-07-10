import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      playEvents: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { game: { select: { title: true, slug: true } } },
      },
      auditLogs: { orderBy: { createdAt: "desc" }, take: 10 },
      developerProfile: true,
    },
  });

  if (!user) notFound();

  return (
    <div>
      <Link href="/admin/users" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]">
        ← Users
      </Link>
      <h1 className="mt-2 mb-6 text-2xl font-bold">{user.username}</h1>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <InfoCard label="Email" value={user.email} />
        <InfoCard label="Role" value={user.role} />
        <InfoCard label="Status" value={user.isBanned ? "Banned" : "Active"} />
      </div>

      {user.bannedReason && (
        <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
          Ban reason: {user.bannedReason}
        </p>
      )}

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">Recent Activity</h2>
        <ul className="divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)]">
          {user.playEvents.length === 0 ? (
            <li className="px-4 py-3 text-sm text-[var(--color-muted)]">No play history</li>
          ) : (
            user.playEvents.map((e) => (
              <li key={e.id} className="flex justify-between px-4 py-3 text-sm">
                <span>Played {e.game.title}</span>
                <span className="text-[var(--color-muted)]">{e.createdAt.toLocaleString()}</span>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--color-surface)] p-4">
      <p className="text-xs text-[var(--color-muted)]">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
