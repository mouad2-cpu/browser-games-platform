import { prisma } from "@/lib/db";
import { GameStatus } from "@prisma/client";

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getDashboardStats() {
  const today = startOfToday();

  const [
    totalGames,
    totalUsers,
    playsToday,
    openReports,
    pendingUploads,
    pendingModeration,
    topGamesRaw,
    dailyActiveUsers,
  ] = await Promise.all([
    prisma.game.count(),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.playEvent.count({ where: { createdAt: { gte: today } } }),
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
      where: { createdAt: { gte: today }, userId: { not: null } },
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
    revenueEstimate: Math.round(revenueEstimate * 100) / 100,
    openReports,
    pendingUploads,
    pendingModeration,
    topGames,
  };
}
