import { buildGamesSitemapXml } from "@/lib/sitemap";
import { serveSitemapXml } from "@/lib/sitemap/serve";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

/** Primary games sitemap (chunk 0) — /sitemap-games.xml */
export async function GET() {
  return serveSitemapXml(() => buildGamesSitemapXml(0));
}
