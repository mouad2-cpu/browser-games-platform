import { GameStatus } from "@prisma/client";
import { prisma } from "./db";
import { categoryGamesOrderBy, type CategorySort } from "./category-sort";
import { recordUserGameProgress } from "./user-progress";

const PAGE_SIZE = 49;
const LATEST_HOME_LIMIT = 14;

const gameCardSelect = {
  id: true,
  slug: true,
  title: true,
  thumbnail: true,
  previewVideo: true,
  embedPath: true,
} as const;

const topPickSelect = {
  ...gameCardSelect,
  featured: true,
} as const;

export type GameCard = {
  id: number;
  slug: string;
  title: string;
  thumbnail: string | null;
  previewVideo: string | null;
  embedPath: string | null;
};

export type TopPickGame = GameCard & {
  featured: boolean;
};

export type FeaturedBadge = "top" | "hot" | "updated";

export type FeaturedHomeGame = GameCard & {
  badge: FeaturedBadge;
};

export type GameDetail = GameCard & {
  description: string | null;
  embedPath: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  categories: { slug: string; name: string }[];
  playCount: number;
  releasedAt: Date | null;
  updatedAt: Date;
};

function toGameCard(game: {
  id: number;
  slug: string;
  title: string;
  thumbnail: string | null;
  previewVideo: string | null;
  embedPath: string | null;
}): GameCard {
  return {
    id: game.id,
    slug: game.slug,
    title: game.title,
    thumbnail: game.thumbnail,
    previewVideo: game.previewVideo,
    embedPath: game.embedPath,
  };
}

export async function getGameBySlug(slug: string): Promise<GameDetail | null> {
  const game = await prisma.game.findFirst({
    where: { slug, status: GameStatus.published, embedPath: { not: null } },
    include: {
      categories: {
        include: { category: { select: { slug: true, name: true } } },
      },
      _count: { select: { playEvents: true } },
    },
  });

  if (!game) return null;

  return {
    id: game.id,
    slug: game.slug,
    title: game.title,
    description: game.description,
    thumbnail: game.thumbnail,
    previewVideo: game.previewVideo,
    embedPath: game.embedPath,
    metaTitle: game.metaTitle,
    metaDescription: game.metaDescription,
    categories: game.categories.map((c) => c.category),
    playCount: game._count.playEvents,
    releasedAt: game.releasedAt,
    updatedAt: game.updatedAt,
  };
}

export async function getFeaturedGames(limit = 8): Promise<GameCard[]> {
  const games = await prisma.game.findMany({
    where: { status: GameStatus.published, featured: true },
    orderBy: { releasedAt: "desc" },
    take: limit,
    select: gameCardSelect,
  });
  return games.map(toGameCard);
}

export async function getFeaturedGamesForHome(limit = 14): Promise<FeaturedHomeGame[]> {
  const games = await prisma.game.findMany({
    where: { status: GameStatus.published, featured: true },
    orderBy: { releasedAt: "desc" },
    take: limit,
    select: {
      ...gameCardSelect,
      updatedAt: true,
      _count: { select: { playEvents: true } },
    },
  });

  const maxPlays = Math.max(...games.map((g) => g._count.playEvents), 0);
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  return games.map((game) => {
    let badge: FeaturedBadge = "top";
    if (game.updatedAt.getTime() >= weekAgo) {
      badge = "updated";
    } else if (maxPlays > 0 && game._count.playEvents >= maxPlays * 0.4) {
      badge = "hot";
    }

    return {
      ...toGameCard(game),
      badge,
    };
  });
}

export async function getContinuePlayingGames(
  recentSlugs: string[],
  limit?: number
): Promise<GameCard[]> {
  if (recentSlugs.length === 0) return [];

  const slugs = limit ? recentSlugs.slice(0, limit) : recentSlugs;
  const games = await prisma.game.findMany({
    where: { slug: { in: slugs }, status: GameStatus.published },
    select: gameCardSelect,
  });

  const bySlug = new Map(games.map((game) => [game.slug, game]));
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((game): game is NonNullable<typeof game> => !!game)
    .map(toGameCard);
}

function toTopPickGame(game: {
  id: number;
  slug: string;
  title: string;
  thumbnail: string | null;
  previewVideo: string | null;
  embedPath: string | null;
  featured: boolean;
}): TopPickGame {
  return { ...toGameCard(game), featured: game.featured };
}

export async function getTopPicksForYou(
  recentSlugs: string[] = [],
  limit = 12
): Promise<TopPickGame[]> {
  const excludeIds = new Set<number>();
  let picks: TopPickGame[] = [];

  if (recentSlugs.length > 0) {
    const recentGames = await prisma.game.findMany({
      where: { slug: { in: recentSlugs }, status: GameStatus.published },
      select: {
        id: true,
        categories: { select: { categoryId: true } },
      },
    });

    for (const game of recentGames) excludeIds.add(game.id);

    const categoryIds = [
      ...new Set(recentGames.flatMap((g) => g.categories.map((c) => c.categoryId))),
    ];

    if (categoryIds.length > 0) {
      const related = await prisma.game.findMany({
        where: {
          status: GameStatus.published,
          id: { notIn: [...excludeIds] },
          categories: { some: { categoryId: { in: categoryIds } } },
        },
        orderBy: { playEvents: { _count: "desc" } },
        take: limit,
        select: topPickSelect,
      });

      for (const game of related) excludeIds.add(game.id);
      picks = related.map(toTopPickGame);
    }
  }

  if (picks.length < limit) {
    const popular = await prisma.game.findMany({
      where: {
        status: GameStatus.published,
        id: { notIn: [...excludeIds] },
      },
      orderBy: { playEvents: { _count: "desc" } },
      take: limit - picks.length,
      select: topPickSelect,
    });

    for (const game of popular) excludeIds.add(game.id);
    picks = [...picks, ...popular.map(toTopPickGame)];
  }

  if (picks.length < limit) {
    const filler = await prisma.game.findMany({
      where: {
        status: GameStatus.published,
        id: { notIn: [...excludeIds] },
      },
      orderBy: [{ featured: "desc" }, { releasedAt: "desc" }],
      take: limit - picks.length,
      select: topPickSelect,
    });
    picks = [...picks, ...filler.map(toTopPickGame)];
  }

  return picks.slice(0, limit);
}

export async function getTopPicksPaginated(
  recentSlugs: string[] = [],
  page = 1,
  pageSize = PAGE_SIZE
): Promise<{ games: TopPickGame[]; total: number; pageSize: number }> {
  const allPicks = await getTopPicksForYou(recentSlugs, 500);
  const total = allPicks.length;
  const start = (page - 1) * pageSize;
  return {
    games: allPicks.slice(start, start + pageSize),
    total,
    pageSize,
  };
}

export async function getLatestGames(limit = LATEST_HOME_LIMIT): Promise<GameCard[]> {
  const games = await prisma.game.findMany({
    where: { status: GameStatus.published },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: gameCardSelect,
  });
  return games.map(toGameCard);
}

export async function getLatestGamesPaginated(
  page = 1,
  pageSize = PAGE_SIZE
): Promise<{ games: GameCard[]; total: number; pageSize: number }> {
  const where = { status: GameStatus.published };
  const [games, total] = await Promise.all([
    prisma.game.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: gameCardSelect,
    }),
    prisma.game.count({ where }),
  ]);
  return { games: games.map(toGameCard), total, pageSize };
}

export async function getPopularGamesPaginated(
  page = 1,
  pageSize = PAGE_SIZE
): Promise<{ games: GameCard[]; total: number; pageSize: number }> {
  const where = { status: GameStatus.published };
  const [games, total] = await Promise.all([
    prisma.game.findMany({
      where,
      orderBy: { playEvents: { _count: "desc" } },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: gameCardSelect,
    }),
    prisma.game.count({ where }),
  ]);
  return { games: games.map(toGameCard), total, pageSize };
}

export async function getAllGamesPaginated(
  page = 1,
  pageSize = PAGE_SIZE
): Promise<{ games: GameCard[]; total: number; pageSize: number }> {
  const where = { status: GameStatus.published };
  const [games, total] = await Promise.all([
    prisma.game.findMany({
      where,
      orderBy: { title: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: gameCardSelect,
    }),
    prisma.game.count({ where }),
  ]);
  return { games: games.map(toGameCard), total, pageSize };
}

export async function getRandomGameSlug(): Promise<string | null> {
  const count = await prisma.game.count({
    where: { status: GameStatus.published, embedPath: { not: null } },
  });
  if (count === 0) return null;

  const skip = Math.floor(Math.random() * count);
  const game = await prisma.game.findFirst({
    where: { status: GameStatus.published, embedPath: { not: null } },
    skip,
    select: { slug: true },
  });
  return game?.slug ?? null;
}

export async function getGamesByCategory(
  categorySlug: string,
  page = 1,
  sort: CategorySort = "popular"
): Promise<{ games: GameCard[]; total: number; pageSize: number }> {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });
  if (!category) return { games: [], total: 0, pageSize: PAGE_SIZE };

  const where = {
    status: GameStatus.published,
    categories: { some: { categoryId: category.id } },
  };

  const [games, total] = await Promise.all([
    prisma.game.findMany({
      where,
      orderBy: categoryGamesOrderBy(sort),
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: gameCardSelect,
    }),
    prisma.game.count({ where }),
  ]);

  return { games: games.map(toGameCard), total, pageSize: PAGE_SIZE };
}

export async function searchGames(
  query: string,
  page = 1
): Promise<{ games: GameCard[]; total: number; pageSize: number }> {
  const trimmed = query.trim();
  if (!trimmed) return { games: [], total: 0, pageSize: PAGE_SIZE };

  const where = {
    status: GameStatus.published,
    OR: [
      { title: { contains: trimmed } },
      { slug: { contains: trimmed } },
    ],
  };

  const [games, total] = await Promise.all([
    prisma.game.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: gameCardSelect,
    }),
    prisma.game.count({ where }),
  ]);

  return { games: games.map(toGameCard), total, pageSize: PAGE_SIZE };
}

export async function getRelatedGames(
  gameId: number,
  limit = 8
): Promise<GameCard[]> {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: { categories: { select: { categoryId: true } } },
  });
  if (!game) return [];

  const categoryIds = game.categories.map((c) => c.categoryId);
  if (categoryIds.length === 0) return [];

  const games = await prisma.game.findMany({
    where: {
      status: GameStatus.published,
      id: { not: gameId },
      categories: { some: { categoryId: { in: categoryIds } } },
    },
    orderBy: { playEvents: { _count: "desc" } },
    take: limit,
    select: gameCardSelect,
  });

  return games.map(toGameCard);
}

export async function recordPlay(
  gameId: number,
  opts?: { userId?: string; ip?: string }
): Promise<void> {
  await prisma.playEvent.create({
    data: { gameId, userId: opts?.userId, ip: opts?.ip },
  });

  if (opts?.userId) {
    await recordUserGameProgress(opts.userId, gameId);
  }
}

export { PAGE_SIZE, LATEST_HOME_LIMIT };
