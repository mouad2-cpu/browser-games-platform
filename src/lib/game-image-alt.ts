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
  if (options?.omitUnblocked) return `${trimmed} cover art`;
  return `${trimmed} cover art, a free unblocked browser game`;
}
