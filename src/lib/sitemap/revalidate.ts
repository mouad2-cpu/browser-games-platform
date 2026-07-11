import { revalidateTag } from "next/cache";
import { SITEMAP_CACHE_TAGS } from "./types";

/** Bust all sitemap caches after content changes (games, categories, pages, images). */
export function revalidateSitemap(): void {
  // Next.js 16 requires a cache life profile as the second argument.
  const profile = "max";
  revalidateTag(SITEMAP_CACHE_TAGS.all, profile);
  revalidateTag(SITEMAP_CACHE_TAGS.games, profile);
  revalidateTag(SITEMAP_CACHE_TAGS.categories, profile);
  revalidateTag(SITEMAP_CACHE_TAGS.pages, profile);
  revalidateTag(SITEMAP_CACHE_TAGS.collections, profile);
  revalidateTag(SITEMAP_CACHE_TAGS.images, profile);
}
