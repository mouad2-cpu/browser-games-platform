import { SITE_HOME_PRIMARY_IMAGE, SITE_LOGO, SITE_NAME } from "@/lib/site-config";
import type {
  AggregateRatingInput,
  BreadcrumbItemInput,
  CollectionPageInput,
  FaqItemInput,
  HomePageGraphInput,
  ImageObjectInput,
  JsonLdGraph,
  JsonLdObject,
  ListItemInput,
  SimpleListItemInput,
  VideoGameInput,
  WebPageInput,
} from "./types";
import { absoluteUrl, toIsoDate, toIsoDateTime } from "./urls";
import { pruneUndefined, validateJsonLd } from "./validate";

/** Minimum total votes before emitting AggregateRating (avoids thin/spammy markup). */
export const MIN_AGGREGATE_RATING_VOTES = 5;

/** Site content language for Schema.org (English-only for now). */
export const SITE_IN_LANGUAGE = "en";

/** Stable @id anchors — every reference in the homepage graph resolves to one of these. */
export const SITE_IDS = {
  organization: absoluteUrl("/#organization"),
  website: absoluteUrl("/#website"),
  webpage: absoluteUrl("/#webpage"),
  logo: absoluteUrl("/#logo"),
  primaryImage: absoluteUrl("/#primaryimage"),
  breadcrumb: absoluteUrl("/#breadcrumb"),
  featuredList: absoluteUrl("/#featured-games"),
} as const;

export function buildSiteLogoImageObject(): JsonLdObject {
  return buildImageObjectSchema({
    id: SITE_IDS.logo,
    url: SITE_LOGO.path,
    alt: SITE_LOGO.alt,
    description: `${SITE_NAME} logo`,
    width: SITE_LOGO.width,
    height: SITE_LOGO.height,
    encodingFormat: SITE_LOGO.encodingFormat,
    // Brand mark for Organization logo/image — not a page hero / primary page image.
    representativeOfPage: false,
  });
}

/**
 * Optional dedicated homepage image. Not used as WebPage.primaryImageOfPage
 * until you explicitly opt in — logo must never substitute as the homepage image.
 */
export function buildHomePrimaryImageObject(): JsonLdObject | null {
  if (!SITE_HOME_PRIMARY_IMAGE) return null;

  return buildImageObjectSchema({
    id: SITE_IDS.primaryImage,
    url: SITE_HOME_PRIMARY_IMAGE.path,
    alt: SITE_HOME_PRIMARY_IMAGE.alt,
    description: SITE_HOME_PRIMARY_IMAGE.description,
    width: SITE_HOME_PRIMARY_IMAGE.width,
    height: SITE_HOME_PRIMARY_IMAGE.height,
    encodingFormat: SITE_HOME_PRIMARY_IMAGE.encodingFormat,
    representativeOfPage: true,
  });
}

export function buildOrganizationSchema(overrides: Partial<JsonLdObject> = {}): JsonLdObject {
  return pruneUndefined({
    "@type": "Organization",
    "@id": SITE_IDS.organization,
    name: SITE_NAME,
    url: absoluteUrl("/"),
    // Both properties reference the same ImageObject node (Google Organization + logo guidelines).
    logo: { "@id": SITE_IDS.logo },
    image: { "@id": SITE_IDS.logo },
    ...overrides,
  });
}

export function buildWebSiteSchema(overrides: Partial<JsonLdObject> = {}): JsonLdObject {
  return pruneUndefined({
    "@type": "WebSite",
    "@id": SITE_IDS.website,
    name: SITE_NAME,
    url: absoluteUrl("/"),
    inLanguage: SITE_IN_LANGUAGE,
    publisher: { "@id": SITE_IDS.organization },
    // Matches the real search form: GET /search?s={query}
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl("/search")}?s={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    ...overrides,
  });
}

export function buildImageObjectSchema(input: ImageObjectInput): JsonLdObject {
  const url = absoluteUrl(input.url);
  return pruneUndefined({
    "@type": "ImageObject",
    "@id": input.id,
    name: input.alt,
    caption: input.alt,
    description: input.description ?? input.alt,
    contentUrl: url,
    url,
    width: input.width,
    height: input.height,
    encodingFormat: input.encodingFormat,
    representativeOfPage: input.representativeOfPage,
  });
}

export function buildWebPageSchema(input: WebPageInput): JsonLdObject {
  const path = input.path ?? "/";
  const pageUrl = absoluteUrl(path);

  return pruneUndefined({
    "@type": "WebPage",
    "@id": path === "/" ? SITE_IDS.webpage : `${pageUrl}#webpage`,
    url: pageUrl,
    name: input.name,
    description: input.description,
    inLanguage: input.inLanguage ?? SITE_IN_LANGUAGE,
    isPartOf: { "@id": SITE_IDS.website },
    about: { "@id": SITE_IDS.organization },
    breadcrumb: input.breadcrumbId ? { "@id": input.breadcrumbId } : undefined,
    mainEntity: input.mainEntityId ? { "@id": input.mainEntityId } : undefined,
  });
}

export function buildBreadcrumbListSchema(
  items: BreadcrumbItemInput[],
  options: { id?: string } = {}
): JsonLdObject {
  return pruneUndefined({
    "@type": "BreadcrumbList",
    "@id": options.id,
    itemListElement: items.map((item, index) =>
      pruneUndefined({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.itemId ? { "@id": item.itemId } : absoluteUrl(item.path),
      })
    ),
  });
}

/**
 * Full ItemList used on collection pages (embeds a lightweight VideoGame item).
 * Prefer buildSimpleItemListSchema on the homepage to avoid duplicate VideoGame entities.
 */
export function buildItemListSchema(
  items: ListItemInput[],
  options: { name?: string; path?: string; numberOfItems?: number; id?: string } = {}
): JsonLdObject {
  return pruneUndefined({
    "@type": "ItemList",
    "@id": options.id,
    name: options.name,
    url: options.path ? absoluteUrl(options.path) : undefined,
    numberOfItems: options.numberOfItems ?? items.length,
    itemListElement: items.map((item, index) =>
      pruneUndefined({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path),
        item: pruneUndefined({
          "@type": "VideoGame",
          name: item.name,
          url: absoluteUrl(item.path),
          image: item.image ? absoluteUrl(item.image) : undefined,
        }),
      })
    ),
  });
}

/**
 * Homepage featured ItemList.
 * Each ListItem links to the game entity via item.@id (canonical game URL with #game),
 * matching VideoGame @ids emitted on game pages — no duplicated nested VideoGame payload.
 */
export function buildFeaturedItemListSchema(
  items: SimpleListItemInput[],
  options: { name: string; id: string; path?: string }
): JsonLdObject {
  return pruneUndefined({
    "@type": "ItemList",
    "@id": options.id,
    name: options.name,
    url: options.path ? absoluteUrl(options.path) : undefined,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) =>
      pruneUndefined({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "VideoGame",
          "@id": absoluteUrl(`${item.path}#game`),
          name: item.name,
          url: absoluteUrl(item.path),
        },
      })
    ),
  });
}

/**
 * Convert like/dislike votes to a 0–10 AggregateRating (matches on-page display).
 * Returns null when there are not enough ratings.
 */
export function buildAggregateRatingSchema(
  input: AggregateRatingInput | null | undefined
): JsonLdObject | null {
  if (!input) return null;
  const ratingCount = input.likes + input.dislikes;
  if (ratingCount < MIN_AGGREGATE_RATING_VOTES) return null;

  const ratingValue = Number(((input.likes / ratingCount) * 10).toFixed(1));

  return pruneUndefined({
    "@type": "AggregateRating",
    ratingValue,
    ratingCount,
    bestRating: 10,
    worstRating: 0,
  });
}

export function buildVideoGameSchema(
  input: VideoGameInput,
  options: { imageId?: string; screenshotIds?: string[] } = {}
): JsonLdObject {
  const description = input.description?.trim() || undefined;
  const aggregateRating = buildAggregateRatingSchema(input.aggregateRating);
  const keywords = buildVideoGameKeywords(input);

  return pruneUndefined({
    "@type": ["VideoGame", "SoftwareApplication"],
    "@id": absoluteUrl(`${input.path}#game`),
    name: input.name,
    description,
    url: absoluteUrl(input.path),
    inLanguage: SITE_IN_LANGUAGE,
    keywords: keywords || undefined,
    image: options.imageId ? { "@id": options.imageId } : undefined,
    screenshot:
      options.screenshotIds && options.screenshotIds.length > 0
        ? options.screenshotIds.map((id) => ({ "@id": id }))
        : undefined,
    genre: input.genres?.length ? input.genres : undefined,
    // Reference the sitewide Organization — do not nest a duplicate Organization object.
    publisher: { "@id": SITE_IDS.organization },
    author: { "@id": SITE_IDS.organization },
    operatingSystem: "Web Browser",
    applicationCategory: "GameApplication",
    gamePlatform: "Web Browser",
    playMode: "https://schema.org/SinglePlayer",
    datePublished: toIsoDate(input.datePublished),
    dateModified: toIsoDateTime(input.dateModified) ?? toIsoDate(input.dateModified),
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      category: "free",
    },
    aggregateRating: aggregateRating ?? undefined,
    isAccessibleForFree: true,
  });
}

/** Short, relevant keyword string — title, genre, and format terms only. */
function buildVideoGameKeywords(input: VideoGameInput): string {
  const parts = [
    input.name,
    ...(input.genres ?? []).slice(0, 2),
    "Browser Game",
    "HTML5 Game",
    "Unblocked Game",
  ]
    .map((part) => part.trim())
    .filter(Boolean);

  return [...new Set(parts)].join(", ");
}

export function buildCollectionPageSchema(input: CollectionPageInput): JsonLdObject[] {
  const pageUrl = absoluteUrl(input.path);
  const itemListId = `${pageUrl}#itemlist`;
  const breadcrumbId = `${pageUrl}#breadcrumb`;
  const itemList = pruneUndefined({
    ...buildItemListSchema(input.items, {
      name: input.name,
      path: input.path,
    }),
    "@id": itemListId,
  });

  const collectionPage = pruneUndefined({
    "@type": "CollectionPage",
    "@id": `${pageUrl}#collection`,
    name: input.name,
    description: input.description,
    url: pageUrl,
    isPartOf: { "@id": SITE_IDS.website },
    mainEntity: { "@id": itemListId },
    breadcrumb: input.breadcrumbs?.length ? { "@id": breadcrumbId } : undefined,
  });

  const nodes: JsonLdObject[] = [collectionPage, itemList];

  if (input.breadcrumbs?.length) {
    nodes.push(buildBreadcrumbListSchema(input.breadcrumbs, { id: breadcrumbId }));
  }

  return nodes;
}

export function buildFaqPageSchema(
  items: FaqItemInput[],
  options: { path?: string } = {}
): JsonLdObject {
  const path = options.path ?? "/contact";
  return pruneUndefined({
    "@type": "FAQPage",
    "@id": absoluteUrl(`${path}#faq`),
    mainEntity: items.map((item) =>
      pruneUndefined({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })
    ),
  });
}

/**
 * Homepage @graph:
 * ImageObject → Organization → WebSite → WebPage → BreadcrumbList → ItemList(featured)
 *
 * Why WebPage (not CollectionPage): the homepage is the site entry point with
 * site-level WebSite/Organization markup, SEO copy, and multiple sections.
 * CollectionPage fits singular curated lists (/new, /c/[slug]); WebPage +
 * mainEntity ItemList is the Google-recommended pattern for a multi-section home.
 *
 * primaryImageOfPage is intentionally omitted: the homepage has no representative
 * page image, and the brand logo must not be used as a substitute.
 */
export function buildHomePageGraph(input: HomePageGraphInput = {}): JsonLdGraph {
  const name = input.name ?? SITE_NAME;
  const description =
    input.description ??
    `${SITE_NAME} features the latest and best free online games. Play fun HTML5 games in your browser with no downloads.`;
  const inLanguage = input.inLanguage ?? SITE_IN_LANGUAGE;

  const logo = buildSiteLogoImageObject();
  const featuredGames = dedupeSimpleListItems(input.featuredGames ?? []);
  const hasFeaturedList = featuredGames.length > 0;

  const nodes: JsonLdObject[] = [
    logo,
    buildOrganizationSchema(),
    buildWebSiteSchema({
      inLanguage,
      description,
    }),
    buildWebPageSchema({
      name,
      description,
      path: "/",
      inLanguage,
      breadcrumbId: SITE_IDS.breadcrumb,
      mainEntityId: hasFeaturedList ? SITE_IDS.featuredList : undefined,
    }),
    buildBreadcrumbListSchema([{ name: "Home", path: "/" }], {
      id: SITE_IDS.breadcrumb,
    }),
  ];

  if (hasFeaturedList) {
    nodes.push(
      buildFeaturedItemListSchema(featuredGames, {
        id: SITE_IDS.featuredList,
        name: "Featured Free Online Games",
        path: "/",
      })
    );
  }

  return buildGraph(nodes);
}

/**
 * Game page @graph (WebPage is the central hub):
 * ImageObject(s) → VideoGame → WebPage → BreadcrumbList → FAQPage
 *
 * Organization is referenced by @id only (defined on the homepage graph).
 */
export function buildGamePageGraph(input: {
  game: VideoGameInput;
  breadcrumbs: BreadcrumbItemInput[];
  faqs?: FaqItemInput[];
}): JsonLdGraph {
  const gamePath = input.game.path;
  const gameUrl = absoluteUrl(gamePath);
  const gameId = `${gameUrl}#game`;
  const webpageId = `${gameUrl}#webpage`;
  const breadcrumbId = `${gameUrl}#breadcrumb`;

  const imageNodes: JsonLdObject[] = [];
  let imageId: string | undefined;
  let screenshotIds: string[] | undefined;

  if (input.game.image?.trim()) {
    imageId = `${gameUrl}#image`;
    imageNodes.push(
      buildImageObjectSchema({
        id: imageId,
        url: input.game.image,
        alt: `${input.game.name} logo`,
        description: `${input.game.name} game thumbnail`,
        width: input.game.imageWidth,
        height: input.game.imageHeight,
        encodingFormat: guessImageEncodingFormat(input.game.image),
        representativeOfPage: false,
      })
    );
  }

  const screenshotUrls = (input.game.screenshots ?? []).filter(
    (url): url is string => Boolean(url?.trim())
  );
  if (screenshotUrls.length > 0) {
    screenshotIds = screenshotUrls.map((_, index) => `${gameUrl}#screenshot-${index + 1}`);
    screenshotUrls.forEach((url, index) => {
      const size = input.game.screenshotSizes?.[index];
      imageNodes.push(
        buildImageObjectSchema({
          id: screenshotIds![index],
          url,
          alt: `${input.game.name} screenshot ${index + 1}`,
          description: `${input.game.name} screenshot ${index + 1}`,
          width: size?.width,
          height: size?.height,
          encodingFormat: guessImageEncodingFormat(url),
          representativeOfPage: false,
        })
      );
    });
  }

  const videoGame = buildVideoGameSchema(input.game, { imageId, screenshotIds });

  const webPage = buildWebPageSchema({
    name: input.game.name,
    description:
      input.game.description?.trim() ||
      `Play ${input.game.name} free online in your browser on ${SITE_NAME}.`,
    path: gamePath,
    inLanguage: SITE_IN_LANGUAGE,
    breadcrumbId,
    mainEntityId: gameId,
  });

  const breadcrumbs = input.breadcrumbs.map((crumb, index, all) => {
    if (crumb.itemId) return crumb;
    // Default game-page wiring: Home WebPage → Category CollectionPage → Game WebPage
    if (index === 0 && crumb.path === "/") {
      return { ...crumb, itemId: SITE_IDS.webpage };
    }
    if (index === all.length - 1) {
      return { ...crumb, itemId: webpageId };
    }
    if (crumb.path.startsWith("/c/")) {
      return { ...crumb, itemId: absoluteUrl(`${crumb.path}#collection`) };
    }
    return crumb;
  });

  const nodes: JsonLdObject[] = [
    ...imageNodes,
    videoGame,
    webPage,
    buildBreadcrumbListSchema(breadcrumbs, { id: breadcrumbId }),
  ];

  if (input.faqs?.length) {
    nodes.push(buildFaqPageSchema(input.faqs, { path: gamePath }));
  }

  return buildGraph(nodes);
}

export function buildGraph(nodes: JsonLdObject[]): JsonLdGraph {
  const graph = nodes.map(pruneUndefined);
  const payload: JsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  if (process.env.NODE_ENV !== "production") {
    const result = validateJsonLd(payload);
    if (!result.valid) {
      console.warn("[structured-data] validation issues:", result.issues);
    }
  }

  return payload;
}

/** Prefer first occurrence so homepage list order matches visible featured order. */
function dedupeSimpleListItems(items: SimpleListItemInput[]): SimpleListItemInput[] {
  const seen = new Set<string>();
  const out: SimpleListItemInput[] = [];
  for (const item of items) {
    if (seen.has(item.path)) continue;
    seen.add(item.path);
    out.push(item);
  }
  return out;
}

function guessImageEncodingFormat(url: string): string | undefined {
  const path = url.split("?")[0]?.toLowerCase() ?? "";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  if (path.endsWith(".webp")) return "image/webp";
  if (path.endsWith(".gif")) return "image/gif";
  if (path.endsWith(".svg")) return "image/svg+xml";
  return undefined;
}
