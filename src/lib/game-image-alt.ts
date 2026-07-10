/** Accessible alt text for game thumbnails and cover art. */
export function getGameImageAlt(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) return "Game logo";
  return `${trimmed} logo`;
}
