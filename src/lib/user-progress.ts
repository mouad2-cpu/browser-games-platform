import { cookies } from "next/headers";
import { GameStatus } from "@prisma/client";
import { getSession } from "./auth";
import { prisma } from "./db";
import {
  MAX_RECENT_GAMES,
  parseRecentGameSlugs,
  RECENT_GAMES_COOKIE,
} from "./recent-games";

function hasUserGameProgress() {
  return "userGameProgress" in prisma && prisma.userGameProgress != null;
}

export async function getUserRecentGameSlugs(
  userId: string,
  limit = MAX_RECENT_GAMES
): Promise<string[]> {
  if (!hasUserGameProgress()) return [];

  const rows = await prisma.userGameProgress.findMany({
    where: {
      userId,
      game: { status: GameStatus.published },
    },
    orderBy: { lastPlayedAt: "desc" },
    take: limit,
    select: { game: { select: { slug: true } } },
  });

  return rows.map((row) => row.game.slug);
}

export async function mergeGuestProgressIntoUser(
  userId: string,
  slugs: string[]
): Promise<void> {
  if (slugs.length === 0 || !hasUserGameProgress()) return;

  const games = await prisma.game.findMany({
    where: { slug: { in: slugs }, status: GameStatus.published },
    select: { id: true, slug: true },
  });
  const slugToId = new Map(games.map((game) => [game.slug, game.id]));

  const now = Date.now();
  await Promise.all(
    slugs.map((slug, index) => {
      const gameId = slugToId.get(slug);
      if (!gameId) return Promise.resolve();

      const lastPlayedAt = new Date(now - index * 1000);
      return prisma.userGameProgress.upsert({
        where: { userId_gameId: { userId, gameId } },
        create: { userId, gameId, lastPlayedAt },
        update: { lastPlayedAt },
      });
    })
  );
}

export async function recordUserGameProgress(
  userId: string,
  gameId: number,
  progressData?: string | null
): Promise<void> {
  if (!hasUserGameProgress()) return;

  await prisma.userGameProgress.upsert({
    where: { userId_gameId: { userId, gameId } },
    create: {
      userId,
      gameId,
      lastPlayedAt: new Date(),
      progressData: progressData ?? null,
    },
    update: {
      lastPlayedAt: new Date(),
      ...(progressData !== undefined ? { progressData } : {}),
    },
  });
}

export async function resolveRecentGameSlugs(
  userId: string | null | undefined,
  cookieSlugs: string[]
): Promise<string[]> {
  if (!userId) return cookieSlugs;
  if (!hasUserGameProgress()) return cookieSlugs;

  try {
    if (cookieSlugs.length > 0) {
      await mergeGuestProgressIntoUser(userId, cookieSlugs);
    }

    const dbSlugs = await getUserRecentGameSlugs(userId);
    return dbSlugs.length > 0 ? dbSlugs : cookieSlugs;
  } catch {
    return cookieSlugs;
  }
}

export async function getRecentGameSlugsFromRequest(): Promise<string[]> {
  const [session, cookieStore] = await Promise.all([getSession(), cookies()]);
  const cookieSlugs = parseRecentGameSlugs(cookieStore.get(RECENT_GAMES_COOKIE)?.value);
  return resolveRecentGameSlugs(session?.userId, cookieSlugs);
}

export async function syncGuestProgressFromRequest(userId: string): Promise<void> {
  const cookieStore = await cookies();
  const cookieSlugs = parseRecentGameSlugs(cookieStore.get(RECENT_GAMES_COOKIE)?.value);
  await mergeGuestProgressIntoUser(userId, cookieSlugs);
}
