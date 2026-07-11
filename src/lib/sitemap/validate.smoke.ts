/**
 * Smoke-test sitemap helpers.
 * Run: npx tsx src/lib/sitemap/validate.smoke.ts
 */
import { getSitemapBaseUrl, sitemapAbsoluteUrl } from "./base-url";
import { dedupeSitemapEntries, toMetadataSitemap } from "./build-entries";
import { gameSitemapChunkCount, gamesSitemapPath, listGamesSitemapPaths } from "./segments";
import { buildStaticSitemapEntries, COLLECTION_SITEMAP_PATHS } from "./static-pages";
import { MAX_URLS_PER_SITEMAP } from "./types";
import { renderSitemapIndexXml, renderUrlsetXml } from "./xml";

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

assert(gameSitemapChunkCount(0) === 1, "empty catalog still exposes games sitemap");
assert(gameSitemapChunkCount(1) === 1, "1 game → 1 chunk");
assert(gameSitemapChunkCount(MAX_URLS_PER_SITEMAP) === 1, "exactly 50k → 1 chunk");
assert(gameSitemapChunkCount(MAX_URLS_PER_SITEMAP + 1) === 2, "50k+1 → 2 chunks");

assert(gamesSitemapPath(0) === "/sitemap-games.xml", "chunk 0 uses sitemap-games.xml");
assert(gamesSitemapPath(1) === "/sitemap-games-1.xml", "chunk 1 uses numbered file");

const gamePaths = listGamesSitemapPaths(MAX_URLS_PER_SITEMAP + 1);
assert(gamePaths[0] === "/sitemap-games.xml", "first games path is canonical");
assert(gamePaths[1] === "/sitemap-games-1.xml", "second games path numbered");

const staticEntries = buildStaticSitemapEntries([
  { slug: "about", updatedAt: new Date("2026-01-01") },
  { slug: "custom-page", updatedAt: new Date("2026-02-01") },
]);
assert(
  staticEntries.some((e) => e.path === "/about"),
  "static includes about"
);
assert(
  staticEntries.some((e) => e.path === "/pages/custom-page"),
  "CMS page without dedicated route uses /pages/{slug}"
);
assert(
  !staticEntries.some((e) => e.path === "/search"),
  "search is excluded from pages sitemap"
);
assert(
  COLLECTION_SITEMAP_PATHS.some((p) => p.path === "/popular"),
  "collections include /popular"
);
assert(
  !COLLECTION_SITEMAP_PATHS.some((p) => p.path === "/featured"),
  "non-existent collection routes are not invented"
);

const deduped = dedupeSitemapEntries([
  { path: "/game/a", priority: 0.9 },
  { path: "/game/a", priority: 0.1 },
  { path: "/game/b", priority: 0.8 },
]);
assert(deduped.length === 2, "dedupe keeps unique paths");
assert(deduped[0]?.priority === 0.9, "dedupe keeps first entry");

const meta = toMetadataSitemap([{ path: "/game/demo", lastModified: new Date("2026-03-01") }]);
assert(meta[0]?.url.includes("/game/demo"), "metadata sitemap absolutizes url");

const indexXml = renderSitemapIndexXml([
  { path: "/sitemap-pages.xml" },
  { path: "/sitemap-games.xml", lastModified: new Date("2026-03-01") },
]);
assert(indexXml.includes("<sitemapindex"), "index root element");
assert(indexXml.includes("sitemap-pages.xml"), "index lists pages");
assert(indexXml.includes("sitemap-games.xml"), "index lists games");
assert(indexXml.includes("<lastmod>"), "index can include lastmod");

const indexXmlCachedDates = renderSitemapIndexXml([
  { path: "/sitemap-pages.xml", lastModified: "2026-03-01T00:00:00.000Z" },
]);
assert(
  indexXmlCachedDates.includes("2026-03-01T00:00:00.000Z"),
  "index lastmod accepts ISO strings from unstable_cache"
);

const urlset = renderUrlsetXml([
  {
    path: "/game/demo",
    lastModified: new Date("2026-04-01T12:00:00.000Z"),
    changeFrequency: "weekly",
    priority: 0.9,
    imagesDetailed: [{ loc: "/uploads/thumbnails/demo.png", title: "Demo logo" }],
  },
  {
    path: "/game/cached",
    lastModified: "2026-05-01T00:00:00.000Z",
  },
]);
assert(urlset.includes("<urlset"), "urlset root");
assert(urlset.includes("<changefreq>weekly</changefreq>"), "changefreq present");
assert(urlset.includes("<priority>0.9</priority>"), "priority present");
assert(urlset.includes("xmlns:image="), "image namespace present");
assert(urlset.includes("<image:image>"), "image extension present");
assert(urlset.includes("<image:loc>"), "image loc present");
assert(urlset.includes("2026-04-01T12:00:00.000Z"), "lastmod from game timestamp");
assert(urlset.includes("2026-05-01T00:00:00.000Z"), "urlset lastmod accepts ISO strings");

const origin = getSitemapBaseUrl();
assert(typeof origin === "string" && origin.length > 0, "sitemap base url defined");
assert(
  sitemapAbsoluteUrl("/game/x").endsWith("/game/x"),
  "absolute sitemap url keeps path"
);

console.log("sitemap smoke tests passed");
