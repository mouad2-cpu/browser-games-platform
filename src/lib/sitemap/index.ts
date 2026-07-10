import type { MetadataRoute } from "next";
import { isCategoryIconImage } from "@/lib/category-icons";
import { getGameImageAlt } from "@/lib/game-image-alt";
import { absoluteUrl } from "@/lib/structured-data/urls";
import { toMetadataSitemap } from "./build-entries";
import {
  getPublishedGameCount,
  getSitemapCategories,
  getSitemapGamesPage,
  getSitemapMenuPages,
} from "./queries";
import { isNamedSegment, listSitemapSegmentIds, parseGamesChunk } from "./segments";
import { buildStaticSitemapEntries } from "./static-pages";
import {
  MAX_URLS_PER_SITEMAP,
  type SitemapEntry,
  type SitemapSegmentId,
} from "./types";

export async function getSitemapIndexIds(): Promise<Array<{ id: SitemapSegmentId }>> {
  const totalGames = await getPublishedGameCount();
  return listSitemapSegmentIds(totalGames).map((id) => ({ id }));
}

export async function buildSegmentSitemap(segmentId: string): Promise<MetadataRoute.Sitemap> {
  const gamesChunk = parseGamesChunk(segmentId);
  if (gamesChunk != null) {
    return buildGamesSitemap(gamesChunk);
  }

  if (!isNamedSegment(segmentId)) {
    return [];
  }

  switch (segmentId) {
    case "static":
      return buildStaticSitemap();
    case "categories":
      return buildCategoriesSitemap();
    case "tags":
      // Tags currently alias categories (/c/[slug]). Dedicated tag routes can swap this later.
      return buildTagsSitemap();
    case "collections":
      return buildCollectionsSitemap();
    case "images":
      return buildImagesSitemap();
    default:
      return [];
  }
}

async function buildStaticSitemap(): Promise<MetadataRoute.Sitemap> {
  const menuPages = await getSitemapMenuPages();
  const entries = buildStaticSitemapEntries(menuPages).map((entry) =>
    entry.path === "/"
      ? { ...entry, images: ["/zenfun-brand.png"] }
      : entry
  );
  return toMetadataSitemap(entries);
}

async function buildGamesSitemap(chunk: number): Promise<MetadataRoute.Sitemap> {
  const games = await getSitemapGamesPage(chunk, MAX_URLS_PER_SITEMAP);

  const entries: SitemapEntry[] = games.map((game) => ({
    path: `/game/${game.slug}`,
    lastModified: game.updatedAt,
    changeFrequency: "weekly",
    priority: 0.9,
    // Image sitemap extension on the game URL (Google-supported).
    images: game.thumbnail ? [game.thumbnail] : undefined,
  }));

  return toMetadataSitemap(entries);
}

async function buildCategoriesSitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await getSitemapCategories();
  const now = new Date();

  const entries: SitemapEntry[] = categories.map((category) => ({
    path: `/c/${category.slug}`,
    lastModified: category.lastModified ?? now,
    changeFrequency: "weekly",
    priority: 0.8,
    images: isCategoryIconImage(category.icon) ? [category.icon!] : undefined,
  }));

  return toMetadataSitemap(entries);
}

/**
 * Tag URLs — today categories are the public taxonomy (`/c/{slug}`).
 * Kept as a separate sitemap so Search Console can track tag coverage
 * once dedicated `/tag/{slug}` routes exist without restructuring the index.
 */
async function buildTagsSitemap(): Promise<MetadataRoute.Sitemap> {
  // Avoid duplicate URLs with the categories sitemap until real tags exist.
  return [];
}

async function buildCollectionsSitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: SitemapEntry[] = [
    {
      path: "/new",
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      path: "/popular",
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      path: "/all-games",
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
  ];

  return toMetadataSitemap(entries);
}

/**
 * Dedicated images sitemap.
 *
 * Game thumbnails and category icons are attached on their primary URL
 * entries (`games-*` / `categories`) to avoid duplicate page URLs across
 * sitemaps (Google Search Central). This segment stays in the index for
 * future gallery / screenshot pages.
 */
async function buildImagesSitemap(): Promise<MetadataRoute.Sitemap> {
  return [];
}

/** Absolute URLs for every child sitemap (for diagnostics / custom tooling). */
export async function getChildSitemapUrls(): Promise<string[]> {
  const ids = await getSitemapIndexIds();
  return ids.map(({ id }) => absoluteUrl(`/sitemap/${id}.xml`));
}

export function getSitemapIndexUrl(): string {
  return absoluteUrl("/sitemap.xml");
}

/** Optional helper if you need image title metadata outside MetadataRoute. */
export function gameImageTitle(title: string): string {
  return getGameImageAlt(title);
}
