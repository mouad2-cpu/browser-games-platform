/** Snippet length Google shows under a title. */
export const SERP_DESCRIPTION_MIN = 150;
export const SERP_DESCRIPTION_MAX = 160;

/**
 * Pick a complete meta description in the 150–160 window.
 * Never ends on a cut word. A finished sentence slightly outside the window
 * is kept when no complete line fits.
 */
export function fitSerpDescription(candidates: string[]): string {
  const clean = candidates.map((text) => text.replace(/\s+/g, " ").trim()).filter(Boolean);
  if (clean.length === 0) return "";

  const inRange = clean.find(
    (text) => text.length >= SERP_DESCRIPTION_MIN && text.length <= SERP_DESCRIPTION_MAX
  );
  if (inRange) return inRange;

  const addons = [" Play now.", " No install.", " It is free."];
  const shorterFirst = clean
    .filter((text) => text.length < SERP_DESCRIPTION_MIN)
    .sort((a, b) => b.length - a.length);
  for (const text of shorterFirst) {
    for (const addon of addons) {
      const next = `${text}${addon}`;
      if (next.length >= SERP_DESCRIPTION_MIN && next.length <= SERP_DESCRIPTION_MAX) return next;
    }
  }

  const underMax = clean
    .filter((text) => text.length <= SERP_DESCRIPTION_MAX)
    .sort((a, b) => b.length - a.length);
  if (underMax[0]) return underMax[0];

  const shortest = clean.slice().sort((a, b) => a.length - b.length)[0];
  const cut = shortest.slice(0, SERP_DESCRIPTION_MAX);
  const period = cut.lastIndexOf(".");
  if (period >= 80) return cut.slice(0, period + 1);
  return shortest;
}

/** One-candidate wrapper around {@link fitSerpDescription}. */
export function toSerpDescription(text: string): string {
  return fitSerpDescription([text]);
}

/** Plain-text excerpt for SEO meta tags from a game/markdown description. */
export function descriptionToMetaDescription(text: string, maxLength = 160): string {
  const plain = text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/!!([^!]+)!!/g, "$1")
    .replace(/\^\^([^^]+)\^\^/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/^[-•]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!plain) return "";
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength - 1).trimEnd()}…`;
}
