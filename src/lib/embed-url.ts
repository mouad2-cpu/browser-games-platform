/**
 * Normalize third-party embed URLs so games stay in our iframe when possible.
 * GameDistribution works best via embed.gamedistribution.com + gd_sdk_referrer_url.
 * CrazyGames game-file hotlinks (games.crazygames.com) often sitelock-redirect — use /embed/.
 */

const ALLOWED_EMBED_HOST_SUFFIXES = [
  "gamedistribution.com",
  "crazygames.com",
  "famobi.com",
  "gamemonetize.com",
  "seagames.com",
] as const;

export function isAllowedEmbedHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return ALLOWED_EMBED_HOST_SUFFIXES.some(
    (suffix) => host === suffix || host.endsWith(`.${suffix}`)
  );
}

export function isAllowedEmbedUrl(embedUrl: string): boolean {
  try {
    const url = new URL(embedUrl);
    return url.protocol === "https:" && isAllowedEmbedHost(url.hostname);
  } catch {
    return false;
  }
}

function gameSlugFromPageUrl(pageUrl: string): string | null {
  try {
    const page = new URL(pageUrl);
    const match = page.pathname.match(/\/game\/([^/]+)\/?$/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export function normalizeEmbedUrl(embedPath: string, pageUrl: string): string {
  const trimmed = embedPath.trim();
  if (!trimmed) return trimmed;

  try {
    const url = new URL(trimmed);

    // CrazyGames: never hotlink games.crazygames.com file URLs — they sitelock / redirect off-site.
    if (
      url.hostname === "games.crazygames.com" ||
      url.hostname.endsWith(".games.crazygames.com")
    ) {
      const slug = gameSlugFromPageUrl(pageUrl);
      if (slug) return `https://www.crazygames.com/embed/${slug}`;

      const parts = url.pathname.split("/").filter(Boolean);
      // /en_US/{game-id}/index.html
      const gameId = parts.length >= 2 ? parts[1] : null;
      if (gameId) {
        const cleaned = gameId.replace(/-[a-z0-9]{2,4}$/i, "");
        return `https://www.crazygames.com/embed/${cleaned || gameId}`;
      }
    }

    if (
      url.hostname === "www.crazygames.com" ||
      url.hostname === "crazygames.com"
    ) {
      // /game/slug → /embed/slug
      const gameMatch = url.pathname.match(/^\/game\/([^/]+)\/?$/i);
      if (gameMatch) return `https://www.crazygames.com/embed/${gameMatch[1]}`;
      return trimmed;
    }

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
