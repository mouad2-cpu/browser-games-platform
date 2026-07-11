export const CONTACT_EMAIL = "jorfmouad1@gmail.com";
export const LEGAL_EMAIL = CONTACT_EMAIL;
export const SITE_NAME = "ZenFun Games";

const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Normalize production host to https://www.zenfungames.com for SEO consistency. */
function normalizeSiteUrl(raw: string): string {
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1") {
      return url.origin.replace(/\/+$/, "");
    }
    if (host === "zenfungames.com" || host === "www.zenfungames.com") {
      return "https://www.zenfungames.com";
    }
    if (url.protocol === "http:" && !host.includes("localhost")) {
      url.protocol = "https:";
    }
    return url.origin.replace(/\/+$/, "");
  } catch {
    return raw.replace(/\/+$/, "");
  }
}

export const SITE_URL = normalizeSiteUrl(RAW_SITE_URL);

/** Primary brand mark used in UI, sitemap, and ImageObject structured data. */
export const SITE_LOGO = {
  path: "/zenfun-brand.png",
  width: 220,
  height: 96,
  encodingFormat: "image/png",
  alt: SITE_NAME,
} as const;

/**
 * Optional dedicated homepage primary/OG image.
 * Homepage WebPage currently omits primaryImageOfPage until a real page image exists
 * (do not substitute the logo).
 */
export const SITE_HOME_PRIMARY_IMAGE: {
  path: string;
  width: number;
  height: number;
  encodingFormat: string;
  alt: string;
  description: string;
} | null = null;
