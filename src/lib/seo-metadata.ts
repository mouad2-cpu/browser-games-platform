import type { Metadata } from "next";
import { SITE_HOME_PRIMARY_IMAGE, SITE_LOGO, SITE_NAME } from "@/lib/site-config";
import { absoluteUrl } from "@/lib/structured-data/urls";

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
  /** When false, emit noindex. Default true. */
  index?: boolean;
  follow?: boolean;
  /** Open Graph / Twitter title (defaults to `title`). */
  ogTitle?: string;
};

/** Shared HTML metadata: canonical, robots, Open Graph, Twitter. */
export function buildPageMetadata({
  path,
  title,
  description,
  images,
  index = true,
  follow = true,
  ogTitle,
}: BuildPageMetadataOptions): Metadata {
  const canonical = absoluteUrl(path);
  const resolvedOgTitle = ogTitle ?? title;
  const hasCustomImages = Boolean(images?.length);
  const ogImages = hasCustomImages
    ? images!.map((url) => ({ url }))
    : [defaultSocialImage()];

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index, follow },
    openGraph: {
      title: resolvedOgTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: hasCustomImages ? "summary_large_image" : "summary",
      title: resolvedOgTitle,
      description,
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
  });
}

/** Stronger `<head>` copy for collection routes (also used in JSON-LD). */
export const LIST_PAGE_META = {
  popular: {
    path: "/popular",
    title: "Popular Unblocked Games & Free Online Games",
    description:
      "Play the most popular unblocked games and free online browser games on ZenFun Games. Instant HTML5 play with no downloads — desktop, tablet, or mobile.",
  },
  new: {
    path: "/new",
    title: "New Unblocked Games & Free Online Games",
    description:
      "Discover the newest free online games and unblocked HTML5 browser games on ZenFun Games. Play instantly — no downloads required.",
  },
  "all-games": {
    path: "/all-games",
    title: "All Free Online Games & Unblocked Browser Games",
    description:
      "Browse the full catalog of free online games and unblocked HTML5 browser games on ZenFun Games. Play instantly on any device.",
  },
  "top-picks": {
    path: "/top-picks",
    title: "Top Picks — Free Online Games",
    description:
      "Recommended free online games and unblocked browser games on ZenFun Games. A curated mix of popular and featured HTML5 titles.",
  },
  "continue-playing": {
    path: "/continue-playing",
    title: "Continue Playing",
    description:
      "Resume free online games you recently played on ZenFun Games. Jump back into your HTML5 browser favorites instantly.",
  },
} as const;
