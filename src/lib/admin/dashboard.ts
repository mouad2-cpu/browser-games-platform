import { getAnalyticsPeriodSummary } from "@/lib/analytics/dashboard";
import { resolveAnalyticsRange } from "@/lib/analytics/range";
import { prisma } from "@/lib/db";
import { GameStatus } from "@prisma/client";

export async function getDashboardStats() {
  const todayRange = resolveAnalyticsRange({ range: "today" });
  const todayStart = todayRange.start;
  const todayEnd = todayRange.end;

  const [
    totalGames,
    totalUsers,
    playsToday,
    visitorsToday,
    openReports,
    pendingUploads,
    pendingModeration,
    topGamesRaw,
    dailyActiveUsers,
  ] = await Promise.all([
    prisma.game.count(),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.playEvent.count({
      where: { createdAt: { gte: todayStart, lt: todayEnd } },
    }),
    getAnalyticsPeriodSummary(todayStart, todayEnd).then(
      (summary) => summary.visitors
    ),
    prisma.gameReport.count({ where: { status: "OPEN" } }),
    prisma.gameUpload.count({ where: { status: "PENDING" } }),
    prisma.moderationFlag.count({ where: { status: "PENDING" } }),
    prisma.game.findMany({
      where: { status: GameStatus.published },
      orderBy: { playEvents: { _count: "desc" } },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        _count: { select: { playEvents: true } },
      },
    }),
    prisma.playEvent.groupBy({
      by: ["userId"],
      where: {
        createdAt: { gte: todayStart, lt: todayEnd },
        userId: { not: null },
      },
    }),
  ]);

  const topGames = topGamesRaw.map((g) => ({
    id: g.id,
    title: g.title,
    slug: g.slug,
    playCount: g._count.playEvents,
  }));

  const totalPlays = await prisma.playEvent.count();
  const revenueEstimate = totalPlays * 0.002;

  return {
    totalGames,
    totalUsers,
    dailyActiveUsers: dailyActiveUsers.length,
    playsToday,
    visitorsToday,
    revenueEstimate: Math.round(revenueEstimate * 100) / 100,
    openReports,
    pendingUploads,
    pendingModeration,
    topGames,
  };
}
