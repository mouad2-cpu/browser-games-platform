import { buildImagesSitemapXml } from "@/lib/sitemap";
import { serveSitemapXml } from "@/lib/sitemap/serve";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {
  return serveSitemapXml(() => buildImagesSitemapXml(0));
}
