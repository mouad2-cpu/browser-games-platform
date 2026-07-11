import { MAX_URLS_PER_SITEMAP } from "./types";

/** How many game sitemap files are needed. Always ≥ 1. */
export function gameSitemapChunkCount(totalGames: number): number {
  if (totalGames <= 0) return 1;
  return Math.ceil(totalGames / MAX_URLS_PER_SITEMAP);
}

/**
 * Public path for a games chunk.
 * Chunk 0 → /sitemap-games.xml (canonical name from requirements).
 * Chunk N → /sitemap-games-N.xml
 */
export function gamesSitemapPath(chunk: number): string {
  if (chunk <= 0) return "/sitemap-games.xml";
  return `/sitemap-games-${chunk}.xml`;
}

/** Paths listed in the sitemap index for all game chunks. */
export function listGamesSitemapPaths(totalPublishedGames: number): string[] {
  const chunks = gameSitemapChunkCount(totalPublishedGames);
  return Array.from({ length: chunks }, (_, chunk) => gamesSitemapPath(chunk));
}
