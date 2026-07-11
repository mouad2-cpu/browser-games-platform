import type { MetadataRoute } from "next";
import { sitemapAbsoluteUrl } from "./base-url";
import type { SitemapEntry } from "./types";

/** Deduplicate by absolute sitemap URL (first wins). */
export function dedupeSitemapEntries(entries: SitemapEntry[]): SitemapEntry[] {
  const seen = new Set<string>();
  const out: SitemapEntry[] = [];

  for (const entry of entries) {
    const key = sitemapAbsoluteUrl(entry.path);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(entry);
  }

  return out;
}

/** Convert internal entries → Next.js MetadataRoute.Sitemap (legacy helper). */
export function toMetadataSitemap(entries: SitemapEntry[]): MetadataRoute.Sitemap {
  return dedupeSitemapEntries(entries).map((entry) => {
    const images = (entry.images ?? [])
      .filter((src): src is string => Boolean(src?.trim()))
      .map((src) => sitemapAbsoluteUrl(src));

    return {
      url: sitemapAbsoluteUrl(entry.path),
      lastModified: entry.lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      ...(images.length > 0 ? { images } : {}),
    };
  });
}
