import { buildGamesSitemapXml } from "@/lib/sitemap";
import { serveSitemapXml } from "@/lib/sitemap/serve";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

type Props = { params: Promise<{ chunk: string }> };

/** Extra game chunks — /sitemap-games-1.xml, /sitemap-games-2.xml, … */
export async function GET(_request: Request, { params }: Props) {
  const { chunk: raw } = await params;
  const chunk = Number.parseInt(raw, 10);
  if (!Number.isFinite(chunk) || chunk < 1) {
    return new Response("Not Found", { status: 404 });
  }
  return serveSitemapXml(() => buildGamesSitemapXml(chunk));
}
