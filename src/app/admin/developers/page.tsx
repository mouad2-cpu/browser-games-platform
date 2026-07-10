import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function DevelopersPage() {
  const developers = await prisma.developer.findMany({
    include: {
      user: { select: { username: true, email: true } },
      _count: { select: { uploads: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Developers</h1>
      <p className="mb-6 text-sm text-[var(--color-muted)]">
        Developer profiles, submitted games, revenue share, and payout status.
      </p>
      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--color-surface)] text-[var(--color-muted)]">
            <tr>
              <th className="px-4 py-3">Developer</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Uploads</th>
              <th className="px-4 py-3">Rev Share</th>
              <th className="px-4 py-3">Revenue</th>
              <th className="px-4 py-3">Payout</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {developers.map((dev) => (
              <tr key={dev.id} className="bg-[var(--color-bg)]">
                <td className="px-4 py-3">
                  <Link href={`/admin/developers/${dev.id}`} className="font-medium hover:text-[var(--color-accent)]">
                    {dev.user.username}
                  </Link>
                </td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{dev.companyName ?? "—"}</td>
                <td className="px-4 py-3">{dev._count.uploads}</td>
                <td className="px-4 py-3">{(dev.revenueShare * 100).toFixed(0)}%</td>
                <td className="px-4 py-3">${dev.totalRevenue.toFixed(2)}</td>
                <td className="px-4 py-3">{dev.payoutStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
