import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { publishedPlayableGameWhere } from "@/lib/game-visibility";
import {
  SITEMAP_CACHE_TAGS,
  SITEMAP_REVALIDATE_SECONDS,
  type SitemapCategoryRow,
  type SitemapGameRow,
  type SitemapMenuPageRow,
} from "./types";

async function countPublishedGamesUncached(): Promise<number> {
  return prisma.game.count({ where: publishedPlayableGameWhere });
}

async function fetchGamesPageUncached(chunk: number, pageSize: number): Promise<SitemapGameRow[]> {
  return prisma.game.findMany({
    where: publishedPlayableGameWhere,
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

async function fetchLatestGameUpdatedAtUncached(): Promise<Date | null> {
  const row = await prisma.game.findFirst({
    where: publishedPlayableGameWhere,
    select: { updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
  return row?.updatedAt ?? null;
}

async function fetchCategoriesUncached(): Promise<SitemapCategoryRow[]> {
  const rows = await prisma.category.findMany({
    select: {
      slug: true,
      icon: true,
      games: {
        where: { game: publishedPlayableGameWhere },
        select: { game: { select: { updatedAt: true } } },
        orderBy: { game: { updatedAt: "desc" } },
        take: 1,
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return rows
    .filter((row) => row.games.length > 0)
    .map((row) => ({
      slug: row.slug,
      icon: row.icon,
      lastModified: row.games[0].game.updatedAt,
    }));
}

async function fetchPublishedMenuPagesUncached(): Promise<SitemapMenuPageRow[]> {
  return prisma.menuPage.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    orderBy: { sortOrder: "asc" },
  });
}

const cacheOpts = (tags: string[]) => ({
  revalidate: SITEMAP_REVALIDATE_SECONDS,
  tags,
});

export const getPublishedGameCount = unstable_cache(
  countPublishedGamesUncached,
  ["sitemap-published-game-count-v3"],
  cacheOpts([SITEMAP_CACHE_TAGS.all, SITEMAP_CACHE_TAGS.games])
);

export const getSitemapGamesPage = unstable_cache(
  fetchGamesPageUncached,
  ["sitemap-games-page-v3"],
  cacheOpts([SITEMAP_CACHE_TAGS.all, SITEMAP_CACHE_TAGS.games])
);

export const getLatestGameUpdatedAt = unstable_cache(
  fetchLatestGameUpdatedAtUncached,
  ["sitemap-latest-game-updated-v3"],
  cacheOpts([SITEMAP_CACHE_TAGS.all, SITEMAP_CACHE_TAGS.games, SITEMAP_CACHE_TAGS.collections])
);

export const getSitemapCategories = unstable_cache(
  fetchCategoriesUncached,
  ["sitemap-categories-v3"],
  cacheOpts([SITEMAP_CACHE_TAGS.all, SITEMAP_CACHE_TAGS.categories])
);

export const getSitemapMenuPages = unstable_cache(
  fetchPublishedMenuPagesUncached,
  ["sitemap-menu-pages-v2"],
  cacheOpts([SITEMAP_CACHE_TAGS.all, SITEMAP_CACHE_TAGS.pages])
);
