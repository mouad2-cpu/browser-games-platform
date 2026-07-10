import { GameStatus } from "@prisma/client";
import type { GameCard } from "./games";
import { prisma } from "./db";
import { homePageSectionDelegate } from "./prisma-delegates";
import {
  normalizeHomePlacement,
  type HomePlacement,
} from "./home-placements";
import {
  getHomePageSectionPlacements,
} from "./home-sections-persistence";

export type HomeSectionLayout = "row" | "bento" | "grid";

export type HomePageSectionWithGames = {
  id: number;
  title: string;
  categorySlug: string;
  layout: HomeSectionLayout;
  placement: HomePlacement;
  sortOrder: number;
  games: GameCard[];
};

function normalizeLayout(layout: string): HomeSectionLayout {
  if (layout === "bento" || layout === "grid") return layout;
  return "row";
}

const gameCardSelect = {
  id: true,
  slug: true,
  title: true,
  thumbnail: true,
  previewVideo: true,
  embedPath: true,
} as const;

export async function getHomePageSectionsWithGames(): Promise<HomePageSectionWithGames[]> {
  const homePageSection = homePageSectionDelegate();
  if (!homePageSection) return [];

  try {
    const sections = await homePageSection.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      include: {
        category: {
          include: {
            games: {
              where: { game: { status: GameStatus.published } },
              orderBy: { game: { createdAt: "desc" } },
              take: 49,
              include: {
                game: { select: gameCardSelect },
              },
            },
          },
        },
      },
    });

    const placementOverrides = await getHomePageSectionPlacements();

    return sections
      .map((section) => {
        const games = section.category.games
          .slice(0, section.gameLimit)
          .map((g) => g.game);

        if (games.length === 0) return null;

        const placement = normalizeHomePlacement(
          placementOverrides.get(section.id) ??
            ("placement" in section ? (section as { placement?: string }).placement : undefined)
        );

        return {
          id: section.id,
          title: section.title?.trim() || section.category.name,
          categorySlug: section.category.slug,
          layout: normalizeLayout(section.layout),
          placement,
          sortOrder: section.sortOrder,
          games,
        };
      })
      .filter((s): s is HomePageSectionWithGames => s !== null);
  } catch {
    return [];
  }
}

export type HomePageSectionAdmin = {
  id: number;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  categoryIcon: string | null;
  title: string | null;
  layout: HomeSectionLayout;
  gameLimit: number;
  sortOrder: number;
  placement: HomePlacement;
  published: boolean;
  gameCount: number;
};

export async function getHomePageSectionsAdmin(): Promise<HomePageSectionAdmin[]> {
  const homePageSection = homePageSectionDelegate();
  if (!homePageSection) return [];

  try {
    const sections = await homePageSection.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        category: {
          include: {
            _count: {
              select: {
                games: {
                  where: { game: { status: GameStatus.published } },
                },
              },
            },
          },
        },
      },
    });

    const placementOverrides = await getHomePageSectionPlacements();

    return sections.map((s) => ({
      id: s.id,
      categoryId: s.categoryId,
      categoryName: s.category.name,
      categorySlug: s.category.slug,
      categoryIcon: s.category.icon,
      title: s.title,
      layout: normalizeLayout(s.layout),
      gameLimit: s.gameLimit,
      sortOrder: s.sortOrder,
      placement: normalizeHomePlacement(
        placementOverrides.get(s.id) ??
          ("placement" in s ? (s as { placement?: string }).placement : undefined)
      ),
      published: s.published,
      gameCount: s.category._count.games,
    }));
  } catch {
    return [];
  }
}

export async function getCategoriesWithoutHomeSection() {
  const homePageSection = homePageSectionDelegate();

  try {
    const used = homePageSection
      ? await homePageSection.findMany({ select: { categoryId: true } })
      : [];
    const usedIds = used.map((s) => s.categoryId);

    return prisma.category.findMany({
      where: usedIds.length > 0 ? { id: { notIn: usedIds } } : undefined,
      orderBy: { name: "asc" },
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
  } catch {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
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
  }
}
