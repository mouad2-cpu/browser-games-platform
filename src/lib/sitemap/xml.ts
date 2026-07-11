import { sitemapAbsoluteUrl } from "./base-url";
import type { SitemapEntry, SitemapImageEntry } from "./types";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toLastmod(value?: Date): string | undefined {
  if (!value || Number.isNaN(value.getTime())) return undefined;
  return value.toISOString();
}

function renderUrlEntry(entry: SitemapEntry): string {
  const loc = sitemapAbsoluteUrl(entry.path);
  const lastmod = toLastmod(entry.lastModified);
  const lines = [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
  ];

  if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
  if (entry.changeFrequency) {
    lines.push(`    <changefreq>${entry.changeFrequency}</changefreq>`);
  }
  if (typeof entry.priority === "number") {
    lines.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
  }

  for (const image of entry.imagesDetailed ?? []) {
    lines.push(...renderImageBlock(image));
  }

  // Fallback: plain image URLs (still valid image extensions on page URLs)
  for (const src of entry.images ?? []) {
    if (!src?.trim()) continue;
    lines.push(...renderImageBlock({ loc: src }));
  }

  lines.push("  </url>");
  return lines.join("\n");
}

function renderImageBlock(image: SitemapImageEntry): string[] {
  const loc = sitemapAbsoluteUrl(image.loc);
  const block = [
    "    <image:image>",
    `      <image:loc>${escapeXml(loc)}</image:loc>`,
  ];
  if (image.title?.trim()) {
    block.push(`      <image:title>${escapeXml(image.title.trim())}</image:title>`);
  }
  if (image.caption?.trim()) {
    block.push(`      <image:caption>${escapeXml(image.caption.trim())}</image:caption>`);
  }
  block.push("    </image:image>");
  return block;
}

/** Standard urlset (with optional image extension). */
export function renderUrlsetXml(entries: SitemapEntry[]): string {
  const unique = dedupeEntries(entries);
  const body = unique.map(renderUrlEntry).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`;
}

/** Sitemap index XML. */
export function renderSitemapIndexXml(
  sitemaps: Array<{ path: string; lastModified?: Date }>
): string {
  const seen = new Set<string>();
  const body = sitemaps
    .map((item) => {
      const loc = sitemapAbsoluteUrl(item.path);
      if (seen.has(loc)) return null;
      seen.add(loc);
      const lastmod = toLastmod(item.lastModified);
      return [
        "  <sitemap>",
        `    <loc>${escapeXml(loc)}</loc>`,
        lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
        "  </sitemap>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .filter(Boolean)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>
`;
}

export function sitemapXmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

function dedupeEntries(entries: SitemapEntry[]): SitemapEntry[] {
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
