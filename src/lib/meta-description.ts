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
