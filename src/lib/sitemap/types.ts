import type { MetadataRoute } from "next";

/** Google's hard limit per sitemap file. */
export const MAX_URLS_PER_SITEMAP = 50_000;

/** Revalidate sitemap payloads (seconds). */
export const SITEMAP_REVALIDATE_SECONDS = 3600;

/** Named sitemap segments (excluding auto-split game chunks). */
export const SITEMAP_SEGMENTS = [
  "static",
  "categories",
  "tags",
  "collections",
  "images",
] as const;

export type SitemapNamedSegment = (typeof SITEMAP_SEGMENTS)[number];

/** Full segment id: named segment or `games-{chunk}`. */
export type SitemapSegmentId = SitemapNamedSegment | `games-${number}`;

export type SitemapChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

export type SitemapEntry = {
  path: string;
  lastModified?: Date;
  changeFrequency?: SitemapChangeFrequency;
  priority?: number;
  /** Absolute or site-relative image URLs (image sitemap / page images). */
  images?: string[];
};

export type SitemapGameRow = {
  slug: string;
  title: string;
  thumbnail: string | null;
  updatedAt: Date;
};

export type SitemapCategoryRow = {
  slug: string;
  icon: string | null;
  lastModified: Date | null;
};

export type SitemapMenuPageRow = {
  slug: string;
  updatedAt: Date;
};
