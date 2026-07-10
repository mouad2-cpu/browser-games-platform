import type { FaqItemInput } from "@/lib/structured-data/types";

/**
 * Shared About + FAQ block used by category pages and collection pages
 * (New / Popular / All Games / Top Picks / Continue Playing).
 */
export type SeoContentBlock = {
  aboutTitle: string;
  paragraphs: string[];
  faqs: FaqItemInput[];
};

export type SeoDateRange = {
  firstPublished: Date | null;
  latestAdded: Date | null;
};
