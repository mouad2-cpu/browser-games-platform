import { GameStatus } from "@prisma/client";

/**
 * A game is publicly discoverable only when its page can actually be played.
 * Reuse this filter for public cards, hubs, categories, and sitemaps so crawlers
 * never receive internal links to game pages that intentionally return 404.
 */
export const publishedPlayableGameWhere = {
  status: GameStatus.published,
  embedPath: { not: null },
} as const;
