/** Accessible alt text for game thumbnails and cover art. */
export function getGameImageAlt(
  title: string,
  options?: { omitUnblocked?: boolean }
): string {
  const trimmed = title.trim();
  if (!trimmed) return "Game logo";
  if (trimmed === "Retro Drift") {
    return "Retro Drift online racing game with a car drifting around a track";
  }
  if (trimmed === "Cars Arena") {
    return "Cars Arena cover art with cars in a stadium";
  }
  if (options?.omitUnblocked) return `${trimmed} cover art`;
  return `${trimmed} cover art, a free unblocked browser game`;
}

/** Related-game alts on these pages should not say "unblocked". */
export function pageOmitsUnblockedAlt(pathname: string | null): boolean {
  return (
    pathname === "/game/retro-drift" ||
    pathname === "/game/cars-arena" ||
    pathname === "/game/mr-bullet-2"
  );
}
