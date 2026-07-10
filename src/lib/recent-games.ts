export const RECENT_GAMES_COOKIE = "bgp_recent_games";
export const MAX_RECENT_GAMES = 24;

export function parseRecentGameSlugs(value?: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, MAX_RECENT_GAMES);
}

export function appendRecentGameSlug(current: string[], slug: string): string[] {
  return [slug, ...current.filter((s) => s !== slug)].slice(0, MAX_RECENT_GAMES);
}

export function serializeRecentGameSlugs(slugs: string[]): string {
  return slugs.join(",");
}
