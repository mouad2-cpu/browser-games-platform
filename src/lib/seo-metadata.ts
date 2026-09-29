import type { Metadata } from "next";
import { SITE_HOME_PRIMARY_IMAGE, SITE_LOGO, SITE_NAME } from "@/lib/site-config";
import { absoluteUrl } from "@/lib/structured-data/urls";
import { descriptionToMetaDescription, fitSerpDescription } from "@/lib/meta-description";

export function parsePageNumber(pageParam?: string): number {
  return Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
}

function defaultSocialImage() {
  if (SITE_HOME_PRIMARY_IMAGE) {
    return {
      url: SITE_HOME_PRIMARY_IMAGE.path,
      width: SITE_HOME_PRIMARY_IMAGE.width,
      height: SITE_HOME_PRIMARY_IMAGE.height,
      alt: SITE_HOME_PRIMARY_IMAGE.alt,
    };
  }
  return {
    url: SITE_LOGO.path,
    width: SITE_LOGO.width,
    height: SITE_LOGO.height,
    alt: SITE_LOGO.alt,
  };
}

type BuildPageMetadataOptions = {
  path: string;
  title: string;
  description: string;
  /** Site-relative or absolute image URLs for OG/Twitter. */
  images?: string[];
  /** Alt text applied to each social image. */
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  /** When false, emit noindex. Default true. */
  index?: boolean;
  follow?: boolean;
  /** Open Graph / Twitter title (defaults to `title`). */
  ogTitle?: string;
  /** Skip the root layout title template (e.g. `| ZenFun Games`). */
  absoluteTitle?: boolean;
  /** Keep the description exactly as written, including when it is longer than 160 characters. */
  exactDescription?: boolean;
};

/** Title tags stay at or under 60 characters, with the keyword first. */
const META_TITLE_LIMIT = 60;

/**
 * Full document title. The visible H1 must use this same string.
 * Adds the site name when it still fits.
 */
export function mirrorTitle(phrase: string): string {
  const clean = phrase.trim();
  if (!clean) return SITE_NAME;
  if (clean.includes(SITE_NAME)) {
    return clean.length <= META_TITLE_LIMIT ? clean : `${clean.slice(0, META_TITLE_LIMIT - 1).trimEnd()}…`;
  }
  const branded = `${clean} | ${SITE_NAME}`;
  if (branded.length <= META_TITLE_LIMIT) return branded;
  return clean.length <= META_TITLE_LIMIT ? clean : `${clean.slice(0, META_TITLE_LIMIT - 1).trimEnd()}…`;
}

/**
 * Game page title. Includes the site name when it still fits.
 * Example: `Slope Unblocked | ZenFun Games`
 */
export function formatGameMetaTitle(gameTitle: string): string {
  const name = gameTitle.trim();
  return mirrorTitle(`${name} Unblocked`);
}

/** Previous auto title. Replaced so seeded rows pick up the new formula. */
export function isLegacyGameMetaTitle(value: string, gameTitle: string): boolean {
  const name = gameTitle.trim();
  const trimmed = value.trim();
  return (
    trimmed === `${name} Unblocked ⚡ Play Free` ||
    trimmed === `${name} Unblocked ⚡ Play Free | ${SITE_NAME}`
  );
}

/** Prefer a hand-written meta title. Fall back to {@link formatGameMetaTitle}. */
export function resolveGameMetaTitle(gameTitle: string, custom?: string | null): string {
  const trimmed = custom?.trim();
  if (trimmed && !isLegacyGameMetaTitle(trimmed, gameTitle)) return trimmed;
  return formatGameMetaTitle(gameTitle);
}

/** Default game meta description when the stored blurb is missing or auto-generated. */
export function formatGameMetaDescription(gameTitle: string): string {
  const name = gameTitle.trim();
  const head = `Play ${name} unblocked for free on ${SITE_NAME}.`;
  return fitSerpDescription([
    `${head} Open this HTML5 browser game and start instantly, with no download and no account, on desktop, tablet, or mobile.`,
    `${head} Start instantly in your browser — no download, no account — on desktop, tablet, or mobile.`,
    `${head} Start this HTML5 game instantly in your browser, with no download, on desktop or mobile.`,
    `${head} Start this free HTML5 game in your browser now. No download needed.`,
    `${head} Play it free in your browser. No download needed at all.`,
  ]);
}

/** Seeded blurbs all open with this sentence. */
export function isGeneratedGameMetaDescription(value: string, gameTitle: string): boolean {
  const plain = descriptionToMetaDescription(value, 400);
  return plain.startsWith(`Play ${gameTitle.trim()} free online on ${SITE_NAME}.`);
}

/** Use a unique description when one exists; otherwise the standard game blurb. */
export function resolveGameMetaDescription(gameTitle: string, raw?: string | null): string {
  const trimmed = raw?.trim();
  if (trimmed && !isGeneratedGameMetaDescription(trimmed, gameTitle)) {
    return descriptionToMetaDescription(trimmed);
  }
  return formatGameMetaDescription(gameTitle);
}

/** Shared HTML metadata: canonical, robots, Open Graph, Twitter. */
export function buildPageMetadata({
  path,
  title,
  description,
  images,
  imageAlt,
  imageWidth,
  imageHeight,
  index = true,
  follow = true,
  ogTitle,
  absoluteTitle = false,
  exactDescription = false,
}: BuildPageMetadataOptions): Metadata {
  const canonical = absoluteUrl(path);
  const resolvedOgTitle = ogTitle ?? title;
  const hasCustomImages = Boolean(images?.length);
  const ogImages = hasCustomImages
    ? images!.map((url) => ({
        url,
        ...(imageAlt ? { alt: imageAlt } : {}),
        ...(imageWidth ? { width: imageWidth } : {}),
        ...(imageHeight ? { height: imageHeight } : {}),
      }))
    : [defaultSocialImage()];
  const metaDescription = exactDescription
    ? description.replace(/\s+/g, " ").trim()
    : descriptionToMetaDescription(description, 160);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: metaDescription,
    alternates: { canonical },
    robots: {
      index,
      follow,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
      googleBot: {
        index,
        follow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: resolvedOgTitle,
      description: metaDescription,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: hasCustomImages ? "summary_large_image" : "summary",
      title: resolvedOgTitle,
      description: metaDescription,
      images: ogImages.map((img) => img.url),
    },
  };
}

/** Collection/list pages: canonical to clean path; noindex when paginated or forced. */
export function buildCollectionPageMetadata(options: {
  path: string;
  title: string;
  description: string;
  page?: number;
  forceNoIndex?: boolean;
}): Metadata {
  const page = options.page ?? 1;
  const index = !options.forceNoIndex && page <= 1;
  return buildPageMetadata({
    path: options.path,
    title: options.title,
    description: options.description,
    index,
    absoluteTitle: true,
  });
}

/** Stronger `<head>` copy for collection routes (also used in JSON-LD). */
export const LIST_PAGE_META = {
  popular: {
    path: "/popular",
    title: "Popular Unblocked Games | ZenFun Games",
    description:
      "Play the most popular unblocked games on ZenFun Games. These free HTML5 browser games open instantly, with no download, on desktop, tablet, or mobile.",
  },
  new: {
    path: "/new",
    title: "New Unblocked Games | ZenFun Games",
    description:
      "Play the newest unblocked games on ZenFun Games. Fresh free HTML5 titles are added often and start instantly, with no download, on desktop or mobile now.",
  },
  "all-games": {
    path: "/all-games",
    title: "All Free Online Games | ZenFun Games",
    description:
      "Browse every free online game on ZenFun Games. This unblocked HTML5 catalog starts in your browser, with no download, on desktop, tablet, or mobile today.",
  },
  "top-picks": {
    path: "/top-picks",
    title: "Top Game Picks | ZenFun Games",
    description:
      "Play recommended free games on ZenFun Games. This short list mixes popular and featured unblocked HTML5 titles you can open instantly, with no download.",
  },
  "continue-playing": {
    path: "/continue-playing",
    title: "Continue Playing | ZenFun Games",
    description:
      "Jump back into the free unblocked games you recently opened on ZenFun Games. They start again in your browser instantly, with no download required today.",
  },
} as const;
