import { buildSitemapIndexXml } from "@/lib/sitemap";
import { serveSitemapXml } from "@/lib/sitemap/serve";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

/** Sitemap index — https://www.zenfungames.com/sitemap.xml */
export async function GET() {
  return serveSitemapXml(buildSitemapIndexXml);
}
