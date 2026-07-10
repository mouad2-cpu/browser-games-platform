import { prisma } from "@/lib/db";

export default async function AnalyticsPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [totalPlays, playsToday, playsWeek, topGamesRaw, campaignStats] =
    await Promise.all([
      prisma.playEvent.count(),
      prisma.playEvent.count({ where: { createdAt: { gte: today } } }),
      prisma.playEvent.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.game.findMany({
        orderBy: { playEvents: { _count: "desc" } },
        take: 10,
        select: {
          title: true,
          _count: { select: { playEvents: true } },
        },
      }),
      prisma.adCampaign.aggregate({ _sum: { impressions: true, clicks: true } }),
    ]);

  const topGames = topGamesRaw.map((g) => ({
    title: g.title,
    playCount: g._count.playEvents,
  }));

  const impressions = campaignStats._sum.impressions ?? 0;
  const clicks = campaignStats._sum.clicks ?? 0;
  const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : "0";

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Analytics</h1>
      <p className="mb-6 text-sm text-[var(--color-muted)]">
        Game plays, retention signals, CTR, and traffic performance.
      </p>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total Plays" value={totalPlays.toLocaleString()} />
        <Stat label="Plays Today" value={playsToday.toLocaleString()} />
        <Stat label="Plays (7 days)" value={playsWeek.toLocaleString()} />
        <Stat label="Ad CTR" value={`${ctr}%`} />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Top Games by Plays</h2>
        <ul className="divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)]">
          {topGames.map((g, i) => (
            <li key={g.title} className="flex justify-between px-4 py-3 text-sm">
              <span>{i + 1}. {g.title}</span>
              <span className="text-[var(--color-muted)]">{g.playCount.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--color-surface)] p-4">
      <p className="text-sm text-[var(--color-muted)]">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
