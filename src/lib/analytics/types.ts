export type ComparedMetric = {
  value: number;
  previous: number;
  changePercent: number | null;
};

export type AnalyticsDashboardData = {
  generatedAt: string;
  range: {
    preset: string;
    label: string;
    start: string;
    end: string;
    previousStart: string;
    previousEnd: string;
    timezone: "UTC";
  };
  overview: {
    visitors: ComparedMetric;
    sessions: ComparedMetric;
    pageViews: ComparedMetric;
    pagesPerSession: ComparedMetric;
    averageSessionDurationMs: ComparedMetric;
    medianSessionDurationMs: number | null;
    bounceRate: ComparedMetric;
    newVisitors: ComparedMetric;
    returningVisitors: ComparedMetric;
    engagedSessions: ComparedMetric;
    singlePageSessions: ComparedMetric;
    activeVisitors: number;
  };
  series: Array<{
    date: string;
    visitors: number;
    sessions: number;
    pageViews: number;
  }>;
  realtime: RealtimeVisitor[];
  pages: PageAnalyticsRow[];
  games: GameAnalyticsRow[];
  sources: DimensionRow[];
  countries: DimensionRow[];
  devices: DimensionRow[];
  browsers: DimensionRow[];
  operatingSystems: DimensionRow[];
  landingPages: EntryExitRow[];
  exitPages: EntryExitRow[];
  navigation: Array<{ from: string; to: string; transitions: number }>;
  events: Array<{ name: string; count: number; visitors: number }>;
  searches: Array<{
    query: string;
    searches: number;
    resultClicks: number;
    noResultSearches: number;
  }>;
  performance: PerformanceRow[];
  seo: {
    searchConsoleConnected: boolean;
    message: string;
    searchQueries: Array<{
      key: string;
      clicks: number;
      impressions: number;
      ctr: number;
      position: number;
    }>;
    searchPages: Array<{
      key: string;
      clicks: number;
      impressions: number;
      ctr: number;
      position: number;
    }>;
    organicLandingPages: DimensionRow[];
    opportunities: Array<{
      type: "growth" | "decline" | "game";
      page: string;
      detail: string;
    }>;
  };
  limitations: string[];
};

export type RealtimeVisitor = {
  currentPage: string;
  game: string | null;
  device: string;
  country: string | null;
  source: string;
  sessionStartedAt: string;
  lastSeenAt: string;
};

export type PageAnalyticsRow = {
  page: string;
  views: number;
  visitors: number;
  averageTimeMs: number;
  entrances: number;
  exits: number;
  engagementRate: number;
};

export type GameAnalyticsRow = {
  gameId: number;
  slug: string;
  title: string;
  pageViews: number;
  starts: number;
  sessions: number;
  averagePlayDurationMs: number | null;
  returningPlayers: number;
  trendPercent: number | null;
  trend: "up" | "down" | "flat" | "new";
};

export type DimensionRow = {
  dimension: string;
  visitors: number;
  sessions: number;
  pageViews: number;
  averageSessionDurationMs: number;
  events: number;
};

export type EntryExitRow = {
  page: string;
  sessions: number;
  visitors: number;
  rate: number;
  averageSessionDurationMs: number;
};

export type PerformanceRow = {
  page: string;
  samples: number;
  loadTimeMs: number | null;
  domContentLoadedMs: number | null;
  firstContentfulMs: number | null;
  largestContentfulMs: number | null;
  cumulativeLayoutShift: number | null;
  interactionNextPaintMs: number | null;
  status: "good" | "needs-attention" | "insufficient-data";
};
