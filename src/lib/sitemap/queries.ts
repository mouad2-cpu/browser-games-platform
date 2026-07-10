import { GameStatus } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { SITEMAP_REVALIDATE_SECONDS, type SitemapCategoryRow, type SitemapGameRow, type SitemapMenuPageRow } from "./types";

const publishedPlayableWhere = {
  status: GameStatus.published,
  embedPath: { not: null },
} as const;

async function countPublishedGamesUncached(): Promise<number> {
  return prisma.game.count({ where: publishedPlayableWhere });
}

async function fetchGamesPageUncached(chunk: number, pageSize: number): Promise<SitemapGameRow[]> {
  return prisma.game.findMany({
    where: publishedPlayableWhere,
    select: {
      slug: true,
      title: true,
      thumbnail: true,
      updatedAt: true,
    },
    orderBy: { id: "asc" },
    skip: chunk * pageSize,
    take: pageSize,
  });
}

/**
 * Categories with lastmod = latest published game update in that category.
 * Avoids N+1 and keeps lastmod accurate for Google.
 */
async function fetchCategoriesUncached(): Promise<SitemapCategoryRow[]> {
  const rows = await prisma.category.findMany({
    select: {
      slug: true,
      icon: true,
      games: {
        where: { game: publishedPlayableWhere },
        select: { game: { select: { updatedAt: true } } },
        orderBy: { game: { updatedAt: "desc" } },
        take: 1,
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return rows.map((row) => ({
    slug: row.slug,
    icon: row.icon,
    lastModified: row.games[0]?.game.updatedAt ?? null,
  }));
}

async function fetchPublishedMenuPagesUncached(): Promise<SitemapMenuPageRow[]> {
  return prisma.menuPage.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    orderBy: { sortOrder: "asc" },
  });
}

export const getPublishedGameCount = unstable_cache(
  countPublishedGamesUncached,
  ["sitemap-published-game-count"],
  { revalidate: SITEMAP_REVALIDATE_SECONDS, tags: ["sitemap", "sitemap:games"] }
);

export const getSitemapGamesPage = unstable_cache(
  fetchGamesPageUncached,
  ["sitemap-games-page"],
  { revalidate: SITEMAP_REVALIDATE_SECONDS, tags: ["sitemap", "sitemap:games"] }
);

export const getSitemapCategories = unstable_cache(
  fetchCategoriesUncached,
  ["sitemap-categories"],
  { revalidate: SITEMAP_REVALIDATE_SECONDS, tags: ["sitemap", "sitemap:categories"] }
);

export const getSitemapMenuPages = unstable_cache(
  fetchPublishedMenuPagesUncached,
  ["sitemap-menu-pages"],
  { revalidate: SITEMAP_REVALIDATE_SECONDS, tags: ["sitemap", "sitemap:static"] }
);
