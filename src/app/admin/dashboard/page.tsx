import Link from "next/link";
import { getDashboardStats } from "@/lib/admin/dashboard";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Dashboard</h1>
      <p className="mb-6 text-sm text-[var(--color-muted)]">
        Platform overview — content, users, revenue, and safety at a glance.
      </p>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Games" value={stats.totalGames} href="/admin/games" />
        <StatCard label="Total Users" value={stats.totalUsers} href="/admin/users" />
        <StatCard label="Daily Active Users" value={stats.dailyActiveUsers} />
        <StatCard label="Plays Today" value={stats.playsToday} href="/admin/analytics" />
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Revenue Estimate"
          value={`$${stats.revenueEstimate.toFixed(2)}`}
          subtitle="Based on play events"
        />
        <StatCard label="Open Reports" value={stats.openReports} href="/admin/reports" />
        <StatCard label="Pending Uploads" value={stats.pendingUploads} href="/admin/uploads/review" />
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-lg font-semibold">Top Games</h2>
          <ul className="divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)]">
            {stats.topGames.map((game, i) => (
              <li key={game.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[var(--color-muted)]">{i + 1}</span>
                  <Link
                    href={`/admin/games/${game.id}`}
                    className="font-medium hover:text-[var(--color-accent)]"
                  >
                    {game.title}
                  </Link>
                </div>
                <span className="text-sm text-[var(--color-muted)]">
                  {game.playCount.toLocaleString()} plays
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-lg font-semibold">Quick Actions</h2>
          <div className="grid gap-2">
            <QuickLink href="/admin/menu" label="Manage sidebar menu" />
            <QuickLink href="/admin/menu/pages/new" label="Add menu page" />
            <QuickLink href="/admin/games/new" label="Add new game" />
            <QuickLink href="/admin/uploads/review" label="Review developer uploads" />
            <QuickLink href="/admin/moderation" label="Moderation queue" />
            <QuickLink href="/admin/ads/campaigns" label="Manage ad campaigns" />
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  subtitle,
  href,
}: {
  label: string;
  value: string | number;
  subtitle?: string;
  href?: string;
}) {
  const content = (
    <div className="rounded-xl bg-[var(--color-surface)] p-4">
      <p className="text-sm text-[var(--color-muted)]">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-[var(--color-muted)]">{subtitle}</p>}
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-[var(--color-border)] px-4 py-3 text-sm transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
    >
      {label} →
    </Link>
  );
}
