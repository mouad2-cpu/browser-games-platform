import { MAX_URLS_PER_SITEMAP, SITEMAP_SEGMENTS, type SitemapSegmentId } from "./types";

/** Encode a games chunk into a segment id. */
export function gamesSegmentId(chunk: number): SitemapSegmentId {
  return `games-${chunk}`;
}

/** Parse `games-12` → 12, otherwise null. */
export function parseGamesChunk(id: string): number | null {
  const match = /^games-(\d+)$/.exec(id);
  if (!match) return null;
  return Number.parseInt(match[1], 10);
}

export function isNamedSegment(id: string): id is (typeof SITEMAP_SEGMENTS)[number] {
  return (SITEMAP_SEGMENTS as readonly string[]).includes(id);
}

/** How many game sitemap files are needed for `totalGames` URLs. */
export function gameSitemapChunkCount(totalGames: number): number {
  if (totalGames <= 0) return 1; // keep an empty games-0 so the index stays stable
  return Math.ceil(totalGames / MAX_URLS_PER_SITEMAP);
}

/** Build the full list of sitemap segment ids for the index. */
export function listSitemapSegmentIds(totalPublishedGames: number): SitemapSegmentId[] {
  const gameChunks = gameSitemapChunkCount(totalPublishedGames);
  return [
    ...SITEMAP_SEGMENTS,
    ...Array.from({ length: gameChunks }, (_, chunk) => gamesSegmentId(chunk)),
  ];
}
