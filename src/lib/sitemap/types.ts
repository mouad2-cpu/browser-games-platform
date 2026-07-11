import type { MetadataRoute } from "next";

/** Google's hard limit per sitemap file. */
export const MAX_URLS_PER_SITEMAP = 50_000;

/** Revalidate sitemap payloads (seconds). Soft TTL — also busted via revalidateTag. */
export const SITEMAP_REVALIDATE_SECONDS = 3600;

export const SITEMAP_CACHE_TAGS = {
  all: "sitemap",
  games: "sitemap:games",
  categories: "sitemap:categories",
  pages: "sitemap:pages",
  collections: "sitemap:collections",
  images: "sitemap:images",
} as const;

export type SitemapChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

export type SitemapImageEntry = {
  loc: string;
  title?: string;
  caption?: string;
};

export type SitemapEntry = {
  path: string;
  lastModified?: Date;
  changeFrequency?: SitemapChangeFrequency;
  priority?: number;
  /** Simple image URLs (converted to image:image). */
  images?: string[];
  /** Rich image entries for dedicated image sitemap. */
  imagesDetailed?: SitemapImageEntry[];
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
