/** Accessible alt text for game thumbnails and cover art. */
export function getGameImageAlt(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) return "Game logo";
  if (trimmed === "Retro Drift") {
    return "Retro Drift online racing game with a car drifting around a track";
  }
  return `${trimmed} cover art, a free unblocked browser game`;
}
