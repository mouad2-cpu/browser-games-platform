import { NextResponse } from "next/server";
import { adminApiAuth } from "@/lib/admin/api-auth";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";

export async function GET() {
  const auth = await adminApiAuth(PERMISSIONS.ANALYTICS_VIEW);
  if (auth.error) return auth.error;

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
          slug: true,
          _count: { select: { playEvents: true } },
        },
      }),
      prisma.adCampaign.aggregate({
        _sum: { impressions: true, clicks: true },
      }),
    ]);

  const topGames = topGamesRaw.map((g) => ({
    title: g.title,
    slug: g.slug,
    playCount: g._count.playEvents,
  }));

  const impressions = campaignStats._sum.impressions ?? 0;
  const clicks = campaignStats._sum.clicks ?? 0;
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;

  return NextResponse.json({
    totalPlays,
    playsToday,
    playsWeek,
    topGames,
    ctr: Math.round(ctr * 100) / 100,
    impressions,
    clicks,
  });
}
