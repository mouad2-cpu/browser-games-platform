import { Prisma } from "@prisma/client";
import { ANALYTICS_ACTIVE_TIMEOUT_MS } from "@/lib/analytics/constants";
import type { AnalyticsDateRange } from "@/lib/analytics/range";
import { getSearchConsoleReport } from "@/lib/analytics/search-console";
import type {
  AnalyticsDashboardData,
  ComparedMetric,
  DimensionRow,
  EntryExitRow,
  GameAnalyticsRow,
  PageAnalyticsRow,
  PerformanceRow,
  RealtimeVisitor,
} from "@/lib/analytics/types";
import { prisma } from "@/lib/db";

type RawSummary = {
  visitors: bigint | number;
  sessions: bigint | number;
  averageDuration: number | null;
  engagedSessions: bigint | number;
  singlePageSessions: bigint | number;
  bouncedSessions: bigint | number;
  newVisitors: bigint | number;
  returningVisitors: bigint | number;
};

type Summary = {
  visitors: number;
  sessions: number;
  pageViews: number;
  averageDuration: number;
  pagesPerSession: number;
  bounceRate: number;
  engagedSessions: number;
  singlePageSessions: number;
  newVisitors: number;
  returningVisitors: number;
};

const numberOf = (value: unknown): number => Number(value ?? 0);
const rounded = (value: unknown, digits = 0): number => {
  const factor = 10 ** digits;
  return Math.round(numberOf(value) * factor) / factor;
};

function compare(value: number, previous: number): ComparedMetric {
  return {
    value,
    previous,
    changePercent:
      previous === 0
        ? value === 0
          ? 0
          : null
        : rounded(((value - previous) / previous) * 100, 1),
  };
}

async function getSummary(start: Date, end: Date): Promise<Summary> {
  const [sessionRows, pageViews] = await Promise.all([
    prisma.$queryRaw<RawSummary[]>(Prisma.sql`
      SELECT
        COUNT(DISTINCT s.visitorId) AS visitors,
        COUNT(*) AS sessions,
        COALESCE(AVG(s.activeDurationMs), 0) AS averageDuration,
        COALESCE(SUM(CASE WHEN s.engaged = true THEN 1 ELSE 0 END), 0) AS engagedSessions,
        COALESCE(SUM(CASE WHEN s.pageViewCount = 1 THEN 1 ELSE 0 END), 0) AS singlePageSessions,
        COALESCE(SUM(CASE WHEN s.pageViewCount = 1 AND s.engaged = false THEN 1 ELSE 0 END), 0) AS bouncedSessions,
        COUNT(DISTINCT CASE WHEN v.firstSeenAt >= ${start} AND v.firstSeenAt < ${end} THEN s.visitorId END) AS newVisitors,
        COUNT(DISTINCT CASE WHEN v.firstSeenAt < ${start} THEN s.visitorId END) AS returningVisitors
      FROM AnalyticsSession s
      INNER JOIN AnalyticsVisitor v ON v.id = s.visitorId
      WHERE s.startedAt >= ${start} AND s.startedAt < ${end}
    `),
    prisma.analyticsPageView.count({
      where: { startedAt: { gte: start, lt: end } },
    }),
  ]);

  const row = sessionRows[0];
  const sessions = numberOf(row?.sessions);
  const bounced = numberOf(row?.bouncedSessions);
  return {
    visitors: numberOf(row?.visitors),
    sessions,
    pageViews,
    averageDuration: rounded(row?.averageDuration),
    pagesPerSession: sessions > 0 ? rounded(pageViews / sessions, 2) : 0,
    bounceRate: sessions > 0 ? rounded((bounced / sessions) * 100, 1) : 0,
    engagedSessions: numberOf(row?.engagedSessions),
    singlePageSessions: numberOf(row?.singlePageSessions),
    newVisitors: numberOf(row?.newVisitors),
    returningVisitors: numberOf(row?.returningVisitors),
  };
}

async function getMedianDuration(start: Date, end: Date): Promise<number | null> {
  const where = { startedAt: { gte: start, lt: end } };
  const count = await prisma.analyticsSession.count({ where });
  if (count === 0) return null;
  const rows = await prisma.analyticsSession.findMany({
    where,
    orderBy: [{ activeDurationMs: "asc" }, { id: "asc" }],
    skip: Math.floor((count - 1) / 2),
    take: count % 2 === 0 ? 2 : 1,
    select: { activeDurationMs: true },
  });
  return rounded(
    rows.reduce((sum, row) => sum + row.activeDurationMs, 0) / rows.length
  );
}

async function getSeries(start: Date, end: Date) {
  type SeriesRow = {
    date: string;
    visitors?: bigint | number;
    sessions?: bigint | number;
    pageViews?: bigint | number;
  };
  const [sessions, pageViews] = await Promise.all([
    prisma.$queryRaw<SeriesRow[]>(Prisma.sql`
      SELECT
        DATE_FORMAT(startedAt, '%Y-%m-%d') AS date,
        COUNT(DISTINCT visitorId) AS visitors,
        COUNT(*) AS sessions
      FROM AnalyticsSession
      WHERE startedAt >= ${start} AND startedAt < ${end}
      GROUP BY DATE_FORMAT(startedAt, '%Y-%m-%d')
      ORDER BY date ASC
    `),
    prisma.$queryRaw<SeriesRow[]>(Prisma.sql`
      SELECT DATE_FORMAT(startedAt, '%Y-%m-%d') AS date, COUNT(*) AS pageViews
      FROM AnalyticsPageView
      WHERE startedAt >= ${start} AND startedAt < ${end}
      GROUP BY DATE_FORMAT(startedAt, '%Y-%m-%d')
      ORDER BY date ASC
    `),
  ]);

  const points = new Map<
    string,
    { date: string; visitors: number; sessions: number; pageViews: number }
  >();
  for (const row of sessions) {
    points.set(row.date, {
      date: row.date,
      visitors: numberOf(row.visitors),
      sessions: numberOf(row.sessions),
      pageViews: 0,
    });
  }
  for (const row of pageViews) {
    const point = points.get(row.date) ?? {
      date: row.date,
      visitors: 0,
      sessions: 0,
      pageViews: 0,
    };
    point.pageViews = numberOf(row.pageViews);
    points.set(row.date, point);
  }
  return Array.from(points.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
}

async function getRealtime(): Promise<{
  visitors: RealtimeVisitor[];
  activeVisitors: number;
}> {
  const cutoff = new Date(Date.now() - ANALYTICS_ACTIVE_TIMEOUT_MS);
  const where = {
    lastSeenAt: { gte: cutoff },
    endedAt: null,
  };
  const [sessions, countRows] = await Promise.all([
    prisma.analyticsSession.findMany({
      where,
      orderBy: { lastSeenAt: "desc" },
      take: 100,
      select: {
        currentPage: true,
        currentGameSlug: true,
        deviceType: true,
        country: true,
        sourceCategory: true,
        startedAt: true,
        lastSeenAt: true,
      },
    }),
    prisma.$queryRaw<Array<{ count: bigint | number }>>(Prisma.sql`
      SELECT COUNT(DISTINCT visitorId) AS count
      FROM AnalyticsSession
      WHERE lastSeenAt >= ${cutoff} AND endedAt IS NULL
    `),
  ]);
  return {
    activeVisitors: numberOf(countRows[0]?.count),
    visitors: sessions.map((session) => ({
      currentPage: session.currentPage,
      game: session.currentGameSlug,
      device: session.deviceType,
      country: session.country,
      source: sourceLabel(session.sourceCategory),
      sessionStartedAt: session.startedAt.toISOString(),
      lastSeenAt: session.lastSeenAt.toISOString(),
    })),
  };
}

async function getPages(start: Date, end: Date): Promise<PageAnalyticsRow[]> {
  type Row = {
    page: string;
    views: bigint | number;
    visitors: bigint | number;
    averageTimeMs: number;
    entrances: bigint | number;
    exits: bigint | number;
    engaged: bigint | number;
  };
  const inactiveCutoff = new Date(Date.now() - ANALYTICS_ACTIVE_TIMEOUT_MS);
  const rows = await prisma.$queryRaw<Row[]>(Prisma.sql`
    SELECT
      path AS page,
      COUNT(*) AS views,
      COUNT(DISTINCT visitorId) AS visitors,
      COALESCE(AVG(activeDurationMs), 0) AS averageTimeMs,
      SUM(CASE WHEN isEntrance = true THEN 1 ELSE 0 END) AS entrances,
      SUM(
        CASE
          WHEN isExit = true AND (endedAt IS NOT NULL OR lastSeenAt < ${inactiveCutoff})
          THEN 1 ELSE 0
        END
      ) AS exits,
      SUM(CASE WHEN activeDurationMs >= 10000 THEN 1 ELSE 0 END) AS engaged
    FROM AnalyticsPageView
    WHERE startedAt >= ${start} AND startedAt < ${end}
    GROUP BY path
    ORDER BY views DESC
    LIMIT 500
  `);
  return rows.map((row) => ({
    page: row.page,
    views: numberOf(row.views),
    visitors: numberOf(row.visitors),
    averageTimeMs: rounded(row.averageTimeMs),
    entrances: numberOf(row.entrances),
    exits: numberOf(row.exits),
    engagementRate:
      numberOf(row.views) > 0
        ? rounded((numberOf(row.engaged) / numberOf(row.views)) * 100, 1)
        : 0,
  }));
}

type RawGameCount = {
  gameId: number;
  count: bigint | number;
};
type RawGamePage = {
  gameId: number;
  pageViews: bigint | number;
  sessions: bigint | number;
};

async function getGames(
  range: AnalyticsDateRange
): Promise<GameAnalyticsRow[]> {
  const [starts, previousStarts, pages, sessions, durations, returning] =
    await Promise.all([
      prisma.$queryRaw<RawGameCount[]>(Prisma.sql`
        SELECT gameId, COUNT(*) AS count
        FROM PlayEvent
        WHERE createdAt >= ${range.start} AND createdAt < ${range.end}
        GROUP BY gameId
      `),
      prisma.$queryRaw<RawGameCount[]>(Prisma.sql`
        SELECT gameId, COUNT(*) AS count
        FROM PlayEvent
        WHERE createdAt >= ${range.previousStart} AND createdAt < ${range.previousEnd}
        GROUP BY gameId
      `),
      prisma.$queryRaw<RawGamePage[]>(Prisma.sql`
        SELECT gameId, COUNT(*) AS pageViews, COUNT(DISTINCT sessionId) AS sessions
        FROM AnalyticsPageView
        WHERE gameId IS NOT NULL
          AND startedAt >= ${range.start} AND startedAt < ${range.end}
        GROUP BY gameId
      `),
      prisma.$queryRaw<RawGameCount[]>(Prisma.sql`
        SELECT gameId, COUNT(DISTINCT sessionId) AS count
        FROM AnalyticsEvent
        WHERE eventName = 'game_session_start'
          AND gameId IS NOT NULL
          AND createdAt >= ${range.start} AND createdAt < ${range.end}
        GROUP BY gameId
      `),
      prisma.$queryRaw<Array<{ gameId: number; averageDuration: number }>>(Prisma.sql`
        SELECT gameId, AVG(durationMs) AS averageDuration
        FROM AnalyticsEvent
        WHERE eventName = 'game_session_end'
          AND gameId IS NOT NULL
          AND durationMs IS NOT NULL
          AND createdAt >= ${range.start} AND createdAt < ${range.end}
        GROUP BY gameId
      `),
      prisma.$queryRaw<RawGameCount[]>(Prisma.sql`
        SELECT e.gameId, COUNT(DISTINCT e.visitorId) AS count
        FROM AnalyticsEvent e
        INNER JOIN AnalyticsVisitor v ON v.id = e.visitorId
        WHERE e.eventName = 'game_session_start'
          AND e.gameId IS NOT NULL
          AND e.createdAt >= ${range.start} AND e.createdAt < ${range.end}
          AND v.firstSeenAt < ${range.start}
        GROUP BY e.gameId
      `),
    ]);

  const ids = new Set<number>();
  [starts, previousStarts, pages, sessions].forEach((rows) =>
    rows.forEach((row) => ids.add(Number(row.gameId)))
  );
  if (ids.size === 0) return [];

  const games = await prisma.game.findMany({
    where: { id: { in: Array.from(ids) } },
    select: { id: true, slug: true, title: true },
  });
  const index = <T extends { gameId: number }>(rows: T[]) =>
    new Map(rows.map((row) => [Number(row.gameId), row]));
  const startMap = index(starts);
  const previousMap = index(previousStarts);
  const pageMap = index(pages);
  const sessionMap = index(sessions);
  const durationMap = index(durations);
  const returningMap = index(returning);

  return games
    .map((game) => {
      const currentStarts = numberOf(startMap.get(game.id)?.count);
      const oldStarts = numberOf(previousMap.get(game.id)?.count);
      const trendPercent =
        oldStarts > 0
          ? rounded(((currentStarts - oldStarts) / oldStarts) * 100, 1)
          : null;
      return {
        gameId: game.id,
        slug: game.slug,
        title: game.title,
        pageViews: numberOf(pageMap.get(game.id)?.pageViews),
        starts: currentStarts,
        sessions:
          numberOf(sessionMap.get(game.id)?.count) ||
          numberOf(pageMap.get(game.id)?.sessions),
        averagePlayDurationMs: durationMap.has(game.id)
          ? rounded(durationMap.get(game.id)?.averageDuration)
          : null,
        returningPlayers: numberOf(returningMap.get(game.id)?.count),
        trendPercent,
        trend:
          oldStarts === 0 && currentStarts > 0
            ? ("new" as const)
            : trendPercent !== null && trendPercent > 1
              ? ("up" as const)
              : trendPercent !== null && trendPercent < -1
                ? ("down" as const)
                : ("flat" as const),
      };
    })
    .sort((a, b) => b.starts - a.starts || b.pageViews - a.pageViews);
}

const DIMENSION_COLUMNS = {
  sourceCategory: Prisma.raw("sourceCategory"),
  country: Prisma.raw("country"),
  deviceType: Prisma.raw("deviceType"),
  browser: Prisma.raw("browser"),
  operatingSystem: Prisma.raw("operatingSystem"),
} as const;

async function getDimension(
  column: keyof typeof DIMENSION_COLUMNS,
  start: Date,
  end: Date
): Promise<DimensionRow[]> {
  type Row = {
    dimension: string | null;
    visitors: bigint | number;
    sessions: bigint | number;
    pageViews: bigint | number;
    averageDuration: number;
    events: bigint | number;
  };
  const dimension = DIMENSION_COLUMNS[column];
  const rows = await prisma.$queryRaw<Row[]>(Prisma.sql`
    SELECT
      COALESCE(${dimension}, 'Unknown') AS dimension,
      COUNT(DISTINCT visitorId) AS visitors,
      COUNT(*) AS sessions,
      COALESCE(SUM(pageViewCount), 0) AS pageViews,
      COALESCE(AVG(activeDurationMs), 0) AS averageDuration,
      COALESCE(SUM(eventCount), 0) AS events
    FROM AnalyticsSession
    WHERE startedAt >= ${start} AND startedAt < ${end}
    GROUP BY ${dimension}
    ORDER BY sessions DESC
    LIMIT 100
  `);
  return rows.map((row) => ({
    dimension:
      column === "sourceCategory"
        ? sourceLabel(row.dimension ?? "other")
        : row.dimension ?? "Unknown",
    visitors: numberOf(row.visitors),
    sessions: numberOf(row.sessions),
    pageViews: numberOf(row.pageViews),
    averageSessionDurationMs: rounded(row.averageDuration),
    events: numberOf(row.events),
  }));
}

async function getLandingPages(
  start: Date,
  end: Date
): Promise<EntryExitRow[]> {
  type Row = {
    page: string;
    sessions: bigint | number;
    visitors: bigint | number;
    averageDuration: number;
    singlePage: bigint | number;
  };
  const rows = await prisma.$queryRaw<Row[]>(Prisma.sql`
    SELECT
      landingPage AS page,
      COUNT(*) AS sessions,
      COUNT(DISTINCT visitorId) AS visitors,
      COALESCE(AVG(activeDurationMs), 0) AS averageDuration,
      SUM(CASE WHEN pageViewCount = 1 THEN 1 ELSE 0 END) AS singlePage
    FROM AnalyticsSession
    WHERE startedAt >= ${start} AND startedAt < ${end}
    GROUP BY landingPage
    ORDER BY sessions DESC
    LIMIT 200
  `);
  return rows.map((row) => ({
    page: row.page,
    sessions: numberOf(row.sessions),
    visitors: numberOf(row.visitors),
    rate:
      numberOf(row.sessions) > 0
        ? rounded((numberOf(row.singlePage) / numberOf(row.sessions)) * 100, 1)
        : 0,
    averageSessionDurationMs: rounded(row.averageDuration),
  }));
}

async function getExitPages(
  start: Date,
  end: Date
): Promise<EntryExitRow[]> {
  type Row = {
    page: string;
    sessions: bigint | number;
    visitors: bigint | number;
    averageDuration: number;
    views: bigint | number | null;
  };
  const inactiveCutoff = new Date(Date.now() - ANALYTICS_ACTIVE_TIMEOUT_MS);
  const rows = await prisma.$queryRaw<Row[]>(Prisma.sql`
    SELECT
      s.exitPage AS page,
      COUNT(*) AS sessions,
      COUNT(DISTINCT s.visitorId) AS visitors,
      COALESCE(AVG(s.activeDurationMs), 0) AS averageDuration,
      MAX(p.views) AS views
    FROM AnalyticsSession s
    LEFT JOIN (
      SELECT path, COUNT(*) AS views
      FROM AnalyticsPageView
      WHERE startedAt >= ${start} AND startedAt < ${end}
      GROUP BY path
    ) p ON p.path = s.exitPage
    WHERE s.exitPage IS NOT NULL
      AND s.startedAt >= ${start} AND s.startedAt < ${end}
      AND (s.endedAt IS NOT NULL OR s.lastSeenAt < ${inactiveCutoff})
    GROUP BY s.exitPage
    ORDER BY sessions DESC
    LIMIT 200
  `);
  return rows.map((row) => {
    const sessions = numberOf(row.sessions);
    const views = numberOf(row.views);
    return {
      page: row.page,
      sessions,
      visitors: numberOf(row.visitors),
      rate: views > 0 ? rounded((sessions / views) * 100, 1) : 0,
      averageSessionDurationMs: rounded(row.averageDuration),
    };
  });
}

async function getNavigation(start: Date, end: Date) {
  type Row = {
    fromPage: string;
    toPage: string;
    transitions: bigint | number;
  };
  const rows = await prisma.$queryRaw<Row[]>(Prisma.sql`
    SELECT previousPath AS fromPage, path AS toPage, COUNT(*) AS transitions
    FROM AnalyticsPageView
    WHERE previousPath IS NOT NULL
      AND startedAt >= ${start} AND startedAt < ${end}
    GROUP BY previousPath, path
    ORDER BY transitions DESC
    LIMIT 100
  `);
  return rows.map((row) => ({
    from: row.fromPage,
    to: row.toPage,
    transitions: numberOf(row.transitions),
  }));
}

async function getEvents(start: Date, end: Date, pageViews: number) {
  type Row = {
    name: string;
    count: bigint | number;
    visitors: bigint | number;
  };
  const rows = await prisma.$queryRaw<Row[]>(Prisma.sql`
    SELECT eventName AS name, COUNT(*) AS count, COUNT(DISTINCT visitorId) AS visitors
    FROM AnalyticsEvent
    WHERE createdAt >= ${start} AND createdAt < ${end}
    GROUP BY eventName
    ORDER BY count DESC
  `);
  const pageVisitorRows = await prisma.$queryRaw<
    Array<{ visitors: bigint | number }>
  >(Prisma.sql`
    SELECT COUNT(DISTINCT visitorId) AS visitors
    FROM AnalyticsPageView
    WHERE startedAt >= ${start} AND startedAt < ${end}
  `);
  return [
    {
      name: "page_view",
      count: pageViews,
      visitors: numberOf(pageVisitorRows[0]?.visitors),
    },
    ...rows.map((row) => ({
      name: row.name,
      count: numberOf(row.count),
      visitors: numberOf(row.visitors),
    })),
  ].sort((a, b) => b.count - a.count);
}

async function getSearches(start: Date, end: Date) {
  type Row = {
    query: string | null;
    count: bigint | number;
    noResults: bigint | number;
  };
  const [searchRows, clickRows] = await Promise.all([
    prisma.$queryRaw<Row[]>(Prisma.sql`
      SELECT
        JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.query')) AS query,
        COUNT(*) AS count,
        SUM(
          CASE
            WHEN CAST(JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.resultCount')) AS UNSIGNED) = 0
            THEN 1 ELSE 0
          END
        ) AS noResults
      FROM AnalyticsEvent
      WHERE eventName = 'search'
        AND createdAt >= ${start} AND createdAt < ${end}
        AND JSON_EXTRACT(metadata, '$.query') IS NOT NULL
      GROUP BY JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.query'))
      ORDER BY count DESC
      LIMIT 100
    `),
    prisma.$queryRaw<Array<{ query: string | null; count: bigint | number }>>(Prisma.sql`
      SELECT
        JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.query')) AS query,
        COUNT(*) AS count
      FROM AnalyticsEvent
      WHERE eventName = 'search_result_click'
        AND createdAt >= ${start} AND createdAt < ${end}
        AND JSON_EXTRACT(metadata, '$.query') IS NOT NULL
      GROUP BY JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.query'))
    `),
  ]);
  const clicks = new Map(
    clickRows.map((row) => [row.query ?? "", numberOf(row.count)])
  );
  return searchRows
    .filter((row) => Boolean(row.query))
    .map((row) => ({
      query: row.query!,
      searches: numberOf(row.count),
      resultClicks: clicks.get(row.query!) ?? 0,
      noResultSearches: numberOf(row.noResults),
    }));
}

async function getPerformance(
  start: Date,
  end: Date
): Promise<PerformanceRow[]> {
  type Row = {
    page: string;
    samples: bigint | number;
    loadTime: number | null;
    domContentLoaded: number | null;
    firstContentful: number | null;
    largestContentful: number | null;
    layoutShift: number | null;
    interactionNextPaint: number | null;
  };
  const rows = await prisma.$queryRaw<Row[]>(Prisma.sql`
    SELECT
      path AS page,
      COUNT(*) AS samples,
      AVG(loadTimeMs) AS loadTime,
      AVG(domContentLoadedMs) AS domContentLoaded,
      AVG(firstContentfulMs) AS firstContentful,
      AVG(largestContentfulMs) AS largestContentful,
      AVG(cumulativeLayoutShift) AS layoutShift,
      AVG(interactionNextPaintMs) AS interactionNextPaint
    FROM AnalyticsPageView
    WHERE startedAt >= ${start} AND startedAt < ${end}
      AND (
        loadTimeMs IS NOT NULL OR
        firstContentfulMs IS NOT NULL OR
        largestContentfulMs IS NOT NULL OR
        cumulativeLayoutShift IS NOT NULL OR
        interactionNextPaintMs IS NOT NULL
      )
    GROUP BY path
    ORDER BY samples DESC
    LIMIT 100
  `);
  return rows.map((row) => {
    const lcp = row.largestContentful === null ? null : rounded(row.largestContentful);
    const cls = row.layoutShift === null ? null : rounded(row.layoutShift, 3);
    const inp =
      row.interactionNextPaint === null
        ? null
        : rounded(row.interactionNextPaint);
    return {
      page: row.page,
      samples: numberOf(row.samples),
      loadTimeMs: row.loadTime === null ? null : rounded(row.loadTime),
      domContentLoadedMs:
        row.domContentLoaded === null ? null : rounded(row.domContentLoaded),
      firstContentfulMs:
        row.firstContentful === null ? null : rounded(row.firstContentful),
      largestContentfulMs: lcp,
      cumulativeLayoutShift: cls,
      interactionNextPaintMs: inp,
      status:
        lcp === null && cls === null && inp === null
          ? "insufficient-data"
          : (lcp !== null && lcp > 2_500) ||
              (cls !== null && cls > 0.1) ||
              (inp !== null && inp > 200)
            ? "needs-attention"
            : "good",
    };
  });
}

async function getOrganicPages(
  start: Date,
  end: Date
): Promise<DimensionRow[]> {
  type Row = {
    dimension: string;
    visitors: bigint | number;
    sessions: bigint | number;
    pageViews: bigint | number;
    averageDuration: number;
    events: bigint | number;
  };
  const rows = await prisma.$queryRaw<Row[]>(Prisma.sql`
    SELECT
      landingPage AS dimension,
      COUNT(DISTINCT visitorId) AS visitors,
      COUNT(*) AS sessions,
      COALESCE(SUM(pageViewCount), 0) AS pageViews,
      COALESCE(AVG(activeDurationMs), 0) AS averageDuration,
      COALESCE(SUM(eventCount), 0) AS events
    FROM AnalyticsSession
    WHERE sourceCategory IN ('google_organic', 'bing_organic', 'other_search')
      AND startedAt >= ${start} AND startedAt < ${end}
    GROUP BY landingPage
    ORDER BY sessions DESC
    LIMIT 100
  `);
  return rows.map((row) => ({
    dimension: row.dimension,
    visitors: numberOf(row.visitors),
    sessions: numberOf(row.sessions),
    pageViews: numberOf(row.pageViews),
    averageSessionDurationMs: rounded(row.averageDuration),
    events: numberOf(row.events),
  }));
}

function getSeoOpportunities(
  current: DimensionRow[],
  previous: DimensionRow[]
) {
  const old = new Map(previous.map((row) => [row.dimension, row.sessions]));
  const opportunities: AnalyticsDashboardData["seo"]["opportunities"] = [];
  for (const row of current) {
    const previousSessions = old.get(row.dimension) ?? 0;
    if (previousSessions >= 5) {
      const change = ((row.sessions - previousSessions) / previousSessions) * 100;
      if (change >= 25) {
        opportunities.push({
          type: "growth",
          page: row.dimension,
          detail: `Organic sessions increased ${rounded(change, 1)}% versus the previous period.`,
        });
      } else if (change <= -25) {
        opportunities.push({
          type: "decline",
          page: row.dimension,
          detail: `Organic sessions decreased ${Math.abs(rounded(change, 1))}% versus the previous period.`,
        });
      }
    }
    if (row.dimension.startsWith("/game/") && row.sessions > 0) {
      opportunities.push({
        type: "game",
        page: row.dimension,
        detail: `${row.sessions.toLocaleString()} organic game sessions in this period.`,
      });
    }
  }
  const currentPages = new Set(current.map((row) => row.dimension));
  for (const row of previous) {
    if (!currentPages.has(row.dimension) && row.sessions >= 5) {
      opportunities.push({
        type: "decline",
        page: row.dimension,
        detail: `Organic sessions decreased 100% versus the previous period.`,
      });
    }
  }
  return opportunities.slice(0, 50);
}

function sourceLabel(value: string): string {
  const labels: Record<string, string> = {
    google_organic: "Google / Organic",
    bing_organic: "Bing / Organic",
    direct: "Direct",
    social: "Social",
    referral: "Referral",
    other_search: "Other search engines",
    other: "Other",
  };
  return labels[value] ?? value;
}

export async function getAnalyticsDashboard(
  range: AnalyticsDateRange
): Promise<AnalyticsDashboardData> {
  const [
    current,
    previous,
    median,
    series,
    realtimeResult,
    pages,
    games,
    sources,
    countries,
    devices,
    browsers,
    operatingSystems,
    landingPages,
    navigation,
    searches,
    performanceRows,
    organicPages,
    previousOrganicPages,
    searchConsole,
  ] = await Promise.all([
    getSummary(range.start, range.end),
    getSummary(range.previousStart, range.previousEnd),
    getMedianDuration(range.start, range.end),
    getSeries(range.start, range.end),
    getRealtime(),
    getPages(range.start, range.end),
    getGames(range),
    getDimension("sourceCategory", range.start, range.end),
    getDimension("country", range.start, range.end),
    getDimension("deviceType", range.start, range.end),
    getDimension("browser", range.start, range.end),
    getDimension("operatingSystem", range.start, range.end),
    getLandingPages(range.start, range.end),
    getNavigation(range.start, range.end),
    getSearches(range.start, range.end),
    getPerformance(range.start, range.end),
    getOrganicPages(range.start, range.end),
    getOrganicPages(range.previousStart, range.previousEnd),
    getSearchConsoleReport(range),
  ]);
  const [exitPages, events] = await Promise.all([
    getExitPages(range.start, range.end),
    getEvents(range.start, range.end, current.pageViews),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    range: {
      preset: range.preset,
      label: range.label,
      start: range.start.toISOString(),
      end: range.end.toISOString(),
      previousStart: range.previousStart.toISOString(),
      previousEnd: range.previousEnd.toISOString(),
      timezone: "UTC",
    },
    overview: {
      visitors: compare(current.visitors, previous.visitors),
      sessions: compare(current.sessions, previous.sessions),
      pageViews: compare(current.pageViews, previous.pageViews),
      pagesPerSession: compare(
        current.pagesPerSession,
        previous.pagesPerSession
      ),
      averageSessionDurationMs: compare(
        current.averageDuration,
        previous.averageDuration
      ),
      medianSessionDurationMs: median,
      bounceRate: compare(current.bounceRate, previous.bounceRate),
      newVisitors: compare(current.newVisitors, previous.newVisitors),
      returningVisitors: compare(
        current.returningVisitors,
        previous.returningVisitors
      ),
      engagedSessions: compare(
        current.engagedSessions,
        previous.engagedSessions
      ),
      singlePageSessions: compare(
        current.singlePageSessions,
        previous.singlePageSessions
      ),
      activeVisitors: realtimeResult.activeVisitors,
    },
    series,
    realtime: realtimeResult.visitors,
    pages,
    games,
    sources,
    countries,
    devices,
    browsers,
    operatingSystems,
    landingPages,
    exitPages,
    navigation,
    events,
    searches,
    performance: performanceRows,
    seo: {
      searchConsoleConnected: searchConsole.connected,
      message: searchConsole.message,
      searchQueries: searchConsole.queries,
      searchPages: searchConsole.pages,
      organicLandingPages: organicPages,
      opportunities: getSeoOpportunities(organicPages, previousOrganicPages),
    },
    limitations: [
      "Game starts currently mean that the game iframe mounted; embedded games do not expose reliable completion events.",
      "Session and page duration include only visible, focused time received through lifecycle updates and 45-second heartbeats.",
      "Country appears only when the hosting platform supplies a trusted country header.",
      "First-party analytics starts collecting only after visitor consent and after this migration is deployed.",
    ],
  };
}

export async function getRealtimeAnalytics() {
  const result = await getRealtime();
  return {
    generatedAt: new Date().toISOString(),
    activeVisitors: result.activeVisitors,
    realtime: result.visitors,
  };
}
