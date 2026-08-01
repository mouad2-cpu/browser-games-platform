/**
 * Normalize third-party embed URLs so games stay in our iframe when possible.
 * GameDistribution works best via embed.gamedistribution.com + gd_sdk_referrer_url.
 */
export function normalizeEmbedUrl(embedPath: string, pageUrl: string): string {
  const trimmed = embedPath.trim();
  if (!trimmed) return trimmed;

  try {
    const url = new URL(trimmed);

    if (url.hostname === "embed.gamedistribution.com") {
      url.searchParams.set("gd_sdk_referrer_url", pageUrl);
      return url.toString();
    }

    if (url.hostname === "html5.gamedistribution.com") {
      const clean = new URL(url.toString());
      clean.searchParams.delete("gd_sdk_referrer_url");
      const gameUrl = clean.toString();

      const wrapped = new URL("https://embed.gamedistribution.com/");
      wrapped.searchParams.set("url", gameUrl.endsWith("/") ? gameUrl : `${gameUrl}/`);
      wrapped.searchParams.set("gd_sdk_referrer_url", pageUrl);
      return wrapped.toString();
    }

    return trimmed;
  } catch {
    return trimmed;
  }
}
