import type { AnalyticsDateRange } from "@/lib/analytics/range";

export type SearchConsoleMetric = {
  key: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type SearchConsoleReport = {
  connected: boolean;
  message: string;
  queries: SearchConsoleMetric[];
  pages: SearchConsoleMetric[];
};

/**
 * Adapter boundary for a future Search Console connection. A provider must
 * return API-sourced values; first-party traffic is never used to fabricate
 * queries, impressions, CTR, or ranking positions.
 */
export interface SearchConsoleProvider {
  getReport(range: AnalyticsDateRange): Promise<SearchConsoleReport>;
}

export async function getSearchConsoleReport(
  range: AnalyticsDateRange,
  provider?: SearchConsoleProvider
): Promise<SearchConsoleReport> {
  if (provider) return provider.getReport(range);
  return {
    connected: false,
    message:
      "Search queries, impressions, CTR, and average position require a Google Search Console integration. They are not inferred or fabricated.",
    queries: [],
    pages: [],
  };
}
