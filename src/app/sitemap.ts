import type { MetadataRoute } from "next";
import {
  buildSegmentSitemap,
  getSitemapIndexIds,
} from "@/lib/sitemap";

/**
 * Sitemap index at `/sitemap.xml`.
 * Child sitemaps: `/sitemap/{id}.xml`
 *   - static, categories, tags, collections, images
 *   - games-0, games-1, … (auto-split at 50,000 URLs)
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps
 * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
 */
export async function generateSitemaps() {
  return getSitemapIndexIds();
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id;
  return buildSegmentSitemap(id);
}
