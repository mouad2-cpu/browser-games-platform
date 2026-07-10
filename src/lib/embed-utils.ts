/** Client-safe helpers for embed URLs (no Node.js imports). */

export function isLocalGameEmbed(embedPath: string): boolean {
  return embedPath.startsWith("/uploads/games/");
}
