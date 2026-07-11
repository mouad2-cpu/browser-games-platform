import { sitemapXmlResponse } from "@/lib/sitemap/xml";

export async function serveSitemapXml(build: () => Promise<string>): Promise<Response> {
  const xml = await build();
  return sitemapXmlResponse(xml);
}
