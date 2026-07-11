import { isCategoryIconImage } from "@/lib/category-icons";
import { getGameImageAlt } from "@/lib/game-image-alt";
import { SITE_LOGO } from "@/lib/site-config";
import { sitemapAbsoluteUrl } from "./base-url";
import {
  getLatestGameUpdatedAt,
  getPublishedGameCount,
  getSitemapCategories,
  getSitemapGamesPage,
  getSitemapMenuPages,
} from "./queries";
import { listGamesSitemapPaths } from "./segments";
import {
  COLLECTION_SITEMAP_PATHS,
  buildStaticSitemapEntries,
} from "./static-pages";
import { MAX_URLS_PER_SITEMAP, type SitemapEntry } from "./types";
import { renderSitemapIndexXml, renderUrlsetXml } from "./xml";

export { getSitemapBaseUrl, sitemapAbsoluteUrl } from "./base-url";
export { revalidateSitemap } from "./revalidate";
export { gamesSitemapPath, listGamesSitemapPaths, gameSitemapChunkCount } from "./segments";

export function getSitemapIndexUrl(): string {
  return sitemapAbsoluteUrl("/sitemap.xml");
}

/** Child sitemap paths advertised by /sitemap.xml */
export async function getChildSitemapIndexEntries(): Promise<
  Array<{ path: string; lastModified?: Date }>
> {
  const [totalGames, latestGame] = await Promise.all([
    getPublishedGameCount(),
    getLatestGameUpdatedAt(),
  ]);
  const lastmod = latestGame ?? undefined;

  return [
    { path: "/sitemap-pages.xml", lastModified: lastmod },
    { path: "/sitemap-categories.xml", lastModified: lastmod },
    { path: "/sitemap-collections.xml", lastModified: lastmod },
    { path: "/sitemap-images.xml", lastModified: lastmod },
    ...listGamesSitemapPaths(totalGames).map((path) => ({
      path,
      lastModified: lastmod,
    })),
  ];
}

export async function buildSitemapIndexXml(): Promise<string> {
  const entries = await getChildSitemapIndexEntries();
  return renderSitemapIndexXml(entries);
}

export async function buildPagesSitemapXml(): Promise<string> {
  const [menuPages, latestGame] = await Promise.all([
    getSitemapMenuPages(),
    getLatestGameUpdatedAt(),
  ]);
  const entries = buildStaticSitemapEntries(menuPages, {
    homepageLastmod: latestGame,
  });
  return renderUrlsetXml(entries);
}

export async function buildCategoriesSitemapXml(): Promise<string> {
  const categories = await getSitemapCategories();
  const now = new Date();
  const entries: SitemapEntry[] = categories.map((category) => ({
    path: `/c/${category.slug}`,
    lastModified: category.lastModified ?? now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));
  return renderUrlsetXml(entries);
}

export async function buildCollectionsSitemapXml(): Promise<string> {
  const latestGame = await getLatestGameUpdatedAt();
  const lastModified = latestGame ?? new Date();
  const entries: SitemapEntry[] = COLLECTION_SITEMAP_PATHS.map((page) => ({
    path: page.path,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
  return renderUrlsetXml(entries);
}

export async function buildGamesSitemapXml(chunk = 0): Promise<string> {
  const games = await getSitemapGamesPage(chunk, MAX_URLS_PER_SITEMAP);
  const entries: SitemapEntry[] = games.map((game) => ({
    path: `/game/${game.slug}`,
    lastModified: game.updatedAt,
    changeFrequency: "weekly",
    priority: 0.9,
  }));
  return renderUrlsetXml(entries);
}

/**
 * Google image sitemap: page URL + image:image children.
 * Includes homepage logo, game thumbnails, and category icons when image-based.
 */
export async function buildImagesSitemapXml(chunk = 0): Promise<string> {
  const [games, categories, latestGame] = await Promise.all([
    getSitemapGamesPage(chunk, MAX_URLS_PER_SITEMAP),
    chunk === 0 ? getSitemapCategories() : Promise.resolve([]),
    getLatestGameUpdatedAt(),
  ]);

  const entries: SitemapEntry[] = [];

  if (chunk === 0) {
    entries.push({
      path: "/",
      lastModified: latestGame ?? new Date(),
      changeFrequency: "daily",
      priority: 1,
      imagesDetailed: [
        {
          loc: SITE_LOGO.path,
          title: SITE_LOGO.alt,
          caption: `${SITE_LOGO.alt} logo`,
        },
        {
          loc: "/zenfun-icon.png",
          title: SITE_LOGO.alt,
          caption: `${SITE_LOGO.alt} icon`,
        },
      ],
    });

    for (const category of categories) {
      if (!isCategoryIconImage(category.icon)) continue;
      entries.push({
        path: `/c/${category.slug}`,
        lastModified: category.lastModified ?? latestGame ?? new Date(),
        changeFrequency: "weekly",
        priority: 0.5,
        imagesDetailed: [
          {
            loc: category.icon!,
            title: `${category.slug} category icon`,
          },
        ],
      });
    }
  }

  for (const game of games) {
    if (!game.thumbnail?.trim()) continue;
    entries.push({
      path: `/game/${game.slug}`,
      lastModified: game.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
      imagesDetailed: [
        {
          loc: game.thumbnail,
          title: getGameImageAlt(game.title),
          caption: getGameImageAlt(game.title),
        },
      ],
    });
  }

  return renderUrlsetXml(entries);
}

/** Absolute child sitemap URLs (diagnostics). */
export async function getChildSitemapUrls(): Promise<string[]> {
  const entries = await getChildSitemapIndexEntries();
  return entries.map((e) => sitemapAbsoluteUrl(e.path));
}
