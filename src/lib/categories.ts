import { GameStatus } from "@prisma/client";
import { prisma } from "./db";
import {
  normalizeCategoryTilePlacement,
  type HomePlacement,
} from "./home-placements";
import {
  getCategoryHomePlacements,
} from "./home-sections-persistence";

export type CategoryWithCount = {
  id: number;
  slug: string;
  name: string;
  icon: string | null;
  gameCount: number;
};

export type HomeCategorySize = "sm" | "md" | "lg";

export type HomeCategory = {
  id: number;
  slug: string;
  name: string;
  homeLabel: string | null;
  displayName: string;
  icon: string | null;
  homeSize: HomeCategorySize;
  homeSortOrder: number;
  homePlacement: HomePlacement;
  gameCount: number;
};

function normalizeHomeSize(size: string): HomeCategorySize {
  if (size === "sm" || size === "lg") return size;
  return "md";
}

export async function getAllCategories(): Promise<CategoryWithCount[]> {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: {
          games: {
            where: { game: { status: GameStatus.published } },
          },
        },
      },
    },
  });

  return categories.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    icon: c.icon,
    gameCount: c._count.games,
  }));
}

function mapToHomeCategory(
  c: {
    id: number;
    slug: string;
    name: string;
    icon: string | null;
    homeLabel?: string | null;
    homeSize?: string;
    homeSortOrder?: number;
    homePlacement?: string;
    _count: { games: number };
  },
  placementOverride?: string
): HomeCategory {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    homeLabel: c.homeLabel ?? null,
    displayName: c.homeLabel?.trim() || c.name,
    icon: c.icon,
    homeSize: normalizeHomeSize(c.homeSize ?? "md"),
    homeSortOrder: c.homeSortOrder ?? 0,
    homePlacement: normalizeCategoryTilePlacement(placementOverride ?? c.homePlacement),
    gameCount: c._count.games,
  };
}

const categoryCountInclude = {
  _count: {
    select: {
      games: {
        where: { game: { status: GameStatus.published } },
      },
    },
  },
} as const;

export async function getHomeCategories(): Promise<HomeCategory[]> {
  try {
    const categories = await prisma.category.findMany({
      where: { showOnHome: true },
      orderBy: { homeSortOrder: "asc" },
      include: categoryCountInclude,
    });

    const placementOverrides = await getCategoryHomePlacements();

    return categories.map((c) =>
      mapToHomeCategory(c, placementOverrides.get(c.id))
    );
  } catch {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: categoryCountInclude,
    });

    return categories.map((c) => mapToHomeCategory(c));
  }
}

export async function getCategoriesForHomeAdmin() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ showOnHome: "desc" }, { homeSortOrder: "asc" }, { sortOrder: "asc" }],
      include: categoryCountInclude,
    });

    const placementOverrides = await getCategoryHomePlacements();

    return categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      icon: c.icon,
      showOnHome: c.showOnHome,
      homeLabel: c.homeLabel,
      homeSize: normalizeHomeSize(c.homeSize),
      homeSortOrder: c.homeSortOrder,
      homePlacement: normalizeCategoryTilePlacement(
        placementOverrides.get(c.id) ??
          ("homePlacement" in c ? (c as { homePlacement?: string }).homePlacement : undefined)
      ),
      gameCount: c._count.games,
    }));
  } catch {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: categoryCountInclude,
    });

    return categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      icon: c.icon,
      showOnHome: true,
      homeLabel: null,
      homeSize: "md" as const,
      homeSortOrder: c.sortOrder,
      homePlacement: "between_featured_latest" as const,
      gameCount: c._count.games,
    }));
  }
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

/** Earliest / latest published game dates for category SEO footers. */
export async function getCategoryGameDateRange(slug: string): Promise<{
  firstPublished: Date | null;
  latestAdded: Date | null;
}> {
  const where = {
    status: GameStatus.published,
    embedPath: { not: null },
    categories: { some: { category: { slug } } },
  } as const;

  const [oldest, newest] = await Promise.all([
    prisma.game.findFirst({
      where,
      orderBy: [{ releasedAt: "asc" }, { createdAt: "asc" }],
      select: { releasedAt: true, createdAt: true },
    }),
    prisma.game.findFirst({
      where,
      orderBy: [{ releasedAt: "desc" }, { createdAt: "desc" }],
      select: { releasedAt: true, createdAt: true, addedAt: true },
    }),
  ]);

  return {
    firstPublished: oldest?.releasedAt ?? oldest?.createdAt ?? null,
    latestAdded: newest?.addedAt ?? newest?.releasedAt ?? newest?.createdAt ?? null,
  };
}

/** Catalog-wide first/latest dates for New / Popular / All Games SEO footers. */
export async function getCatalogGameDateRange(): Promise<{
  firstPublished: Date | null;
  latestAdded: Date | null;
}> {
  const where = {
    status: GameStatus.published,
    embedPath: { not: null },
  } as const;

  const [oldest, newest] = await Promise.all([
    prisma.game.findFirst({
      where,
      orderBy: [{ releasedAt: "asc" }, { createdAt: "asc" }],
      select: { releasedAt: true, createdAt: true },
    }),
    prisma.game.findFirst({
      where,
      orderBy: [{ releasedAt: "desc" }, { createdAt: "desc" }],
      select: { releasedAt: true, createdAt: true, addedAt: true },
    }),
  ]);

  return {
    firstPublished: oldest?.releasedAt ?? oldest?.createdAt ?? null,
    latestAdded: newest?.addedAt ?? newest?.releasedAt ?? newest?.createdAt ?? null,
  };
}

export async function getTopCategories(limit = 4) {
  const categories = await getAllCategories();
  return categories.slice(0, limit);
}

export async function getCategoryWithGames(id: number) {
  return prisma.category.findUnique({
    where: { id },
    include: {
      games: {
        include: {
          game: {
            select: {
              id: true,
              slug: true,
              title: true,
              thumbnail: true,
              status: true,
              featured: true,
            },
          },
        },
        orderBy: { game: { title: "asc" } },
      },
      _count: { select: { games: true } },
    },
  });
}
