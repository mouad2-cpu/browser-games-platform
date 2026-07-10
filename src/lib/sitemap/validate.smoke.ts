/**
 * Smoke-test sitemap segment helpers.
 * Run: npx tsx src/lib/sitemap/validate.smoke.ts
 */
import { dedupeSitemapEntries, toMetadataSitemap } from "./build-entries";
import { gameSitemapChunkCount, listSitemapSegmentIds, parseGamesChunk } from "./segments";
import { buildStaticSitemapEntries } from "./static-pages";
import { MAX_URLS_PER_SITEMAP } from "./types";

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

assert(gameSitemapChunkCount(0) === 1, "empty catalog still exposes games-0");
assert(gameSitemapChunkCount(1) === 1, "1 game → 1 chunk");
assert(gameSitemapChunkCount(MAX_URLS_PER_SITEMAP) === 1, "exactly 50k → 1 chunk");
assert(gameSitemapChunkCount(MAX_URLS_PER_SITEMAP + 1) === 2, "50k+1 → 2 chunks");

const ids = listSitemapSegmentIds(MAX_URLS_PER_SITEMAP + 1);
assert(ids.includes("static"), "index includes static");
assert(ids.includes("categories"), "index includes categories");
assert(ids.includes("tags"), "index includes tags");
assert(ids.includes("collections"), "index includes collections");
assert(ids.includes("images"), "index includes images");
assert(ids.includes("games-0"), "index includes games-0");
assert(ids.includes("games-1"), "index includes games-1");
assert(parseGamesChunk("games-3") === 3, "parse games chunk");
assert(parseGamesChunk("static") === null, "named segments are not game chunks");

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
  !staticEntries.some((e) => e.path === "/new"),
  "collections paths stay out of static sitemap"
);

const deduped = dedupeSitemapEntries([
  { path: "/game/a" },
  { path: "/game/a" },
  { path: "/game/b" },
]);
assert(deduped.length === 2, "dedupe removes duplicate paths");

const meta = toMetadataSitemap([
  {
    path: "/game/demo",
    lastModified: new Date("2026-03-01"),
    images: ["/uploads/demo.png"],
  },
]);
assert(meta[0]?.url.includes("/game/demo"), "metadata url is absolute");
assert(Array.isArray(meta[0]?.images) && meta[0].images!.length === 1, "images preserved");

console.log("sitemap smoke tests passed");
