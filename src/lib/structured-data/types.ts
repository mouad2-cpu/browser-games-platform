/**
 * Schema.org JSON-LD types used by ZenFun Games.
 * Keep these intentionally narrow — only properties we emit.
 */

export type JsonLdPrimitive = string | number | boolean | null;
export type JsonLdValue = JsonLdPrimitive | JsonLdObject | JsonLdValue[];
export type JsonLdObject = {
  "@type"?: string | string[];
  "@id"?: string;
  "@context"?: string | Record<string, unknown>;
  [key: string]: JsonLdValue | undefined;
};

export type JsonLdGraph = {
  "@context": "https://schema.org";
  "@graph": JsonLdObject[];
};

export type BreadcrumbItemInput = {
  name: string;
  path: string;
  /** Prefer an @id reference to a graph entity (WebPage, CollectionPage, etc.). */
  itemId?: string;
};

export type ListItemInput = {
  name: string;
  path: string;
  image?: string | null;
};

/** Homepage featured list item — referenced via ListItem.item @id. */
export type SimpleListItemInput = {
  name: string;
  path: string;
};

export type ImageObjectInput = {
  url: string;
  /** Accessible name / caption for the image. */
  alt?: string;
  description?: string;
  width?: number;
  height?: number;
  encodingFormat?: string;
  /** Stable @id when the image is a first-class graph node. */
  id?: string;
  /** True when this image represents the page (e.g. homepage brand mark). */
  representativeOfPage?: boolean;
};

export type WebPageInput = {
  name: string;
  description: string;
  path?: string;
  inLanguage?: string | string[];
  /** @id of a BreadcrumbList node in the same @graph. */
  breadcrumbId?: string;
  /** @id of the page's mainEntity (e.g. featured ItemList). */
  mainEntityId?: string;
};

export type HomePageGraphInput = {
  name?: string;
  description?: string;
  inLanguage?: string | string[];
  /** Featured/trending games shown on the homepage (already fetched by the page). */
  featuredGames?: SimpleListItemInput[];
};

export type AggregateRatingInput = {
  likes: number;
  dislikes: number;
};

export type VideoGameInput = {
  name: string;
  description: string | null;
  path: string;
  image?: string | null;
  /** Optional known thumbnail dimensions (omit when unknown — never invent). */
  imageWidth?: number;
  imageHeight?: number;
  screenshots?: Array<string | null | undefined>;
  /** Parallel optional dimensions for screenshots (same order). */
  screenshotSizes?: Array<{ width?: number; height?: number } | null | undefined>;
  genres?: string[];
  datePublished?: string | Date | null;
  dateModified?: string | Date | null;
  publisherName?: string;
  authorName?: string;
  aggregateRating?: AggregateRatingInput | null;
};

export type CollectionPageInput = {
  name: string;
  description: string;
  path: string;
  items: ListItemInput[];
  breadcrumbs?: BreadcrumbItemInput[];
};

export type FaqItemInput = {
  question: string;
  answer: string;
};

export type ValidationIssue = {
  path: string;
  message: string;
  severity: "error" | "warning";
};

export type ValidationResult = {
  valid: boolean;
  issues: ValidationIssue[];
};
