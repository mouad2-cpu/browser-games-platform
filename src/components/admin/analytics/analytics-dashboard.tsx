"use client";

import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
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

type Props = { initialData: AnalyticsDashboardData };
type SortValue = string | number | null;
type Column<T> = {
  id: string;
  label: string;
  render: (row: T) => ReactNode;
  sort: (row: T) => SortValue;
  align?: "left" | "right";
};

const PRESETS = [
  ["today", "Today"],
  ["yesterday", "Yesterday"],
  ["7d", "7 days"],
  ["30d", "30 days"],
  ["90d", "90 days"],
] as const;

export function AnalyticsDashboard({ initialData }: Props) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customFrom, setCustomFrom] = useState(
    initialData.range.start.slice(0, 10)
  );
  const [customTo, setCustomTo] = useState(
    new Date(new Date(initialData.range.end).getTime() - 1).toISOString().slice(0, 10)
  );

  async function loadRange(
    range: string,
    from?: string,
    to?: string
  ) {
    const params = new URLSearchParams({ range });
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/analytics?${params}`, {
        cache: "no-store",
      });
      const body = (await response.json()) as
        | AnalyticsDashboardData
        | { error: string };
      if (!response.ok || "error" in body) {
        throw new Error(
          "error" in body ? body.error : "Could not load analytics"
        );
      }
      setData(body);
      router.replace(`/admin/analytics?${params}`, { scroll: false });
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load analytics"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    async function refreshRealtime() {
      if (document.visibilityState !== "visible") return;
      try {
        const response = await fetch(
          "/api/admin/analytics?section=realtime",
          { cache: "no-store" }
        );
        if (!response.ok) return;
        const realtime = (await response.json()) as {
          activeVisitors: number;
          realtime: RealtimeVisitor[];
        };
        if (!cancelled) {
          setData((current) => ({
            ...current,
            realtime: realtime.realtime,
            overview: {
              ...current.overview,
              activeVisitors: realtime.activeVisitors,
            },
          }));
        }
      } catch {
        // Keep the last successful real-time snapshot.
      }
    }
    const timer = window.setInterval(refreshRealtime, 45_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  const hasCollectedData =
    data.overview.sessions.value > 0 ||
    data.overview.pageViews.value > 0 ||
    data.games.some((game) => game.starts > 0);

  return (
    <div className="mx-auto max-w-[1600px] space-y-6" aria-busy={loading}>
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            First-party analytics
          </p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Analytics</h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--color-muted)]">
            Consented, pseudonymous visitor analytics plus operational game-play
            counts. Times and date boundaries use UTC.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(([value, label]) => (
            <button
              key={value}
              type="button"
              disabled={loading}
              onClick={() => void loadRange(value)}
              className={`rounded-lg border px-3 py-2 text-sm transition ${
                data.range.preset === value
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 sm:flex-row sm:items-end">
        <label className="text-xs text-[var(--color-muted)]">
          Custom from
          <input
            type="date"
            value={customFrom}
            onChange={(event) => setCustomFrom(event.target.value)}
            className="mt-1 block rounded-lg border border-[var(--color-border)] bg-[var(--color-input)] px-3 py-2 text-sm text-white"
          />
        </label>
        <label className="text-xs text-[var(--color-muted)]">
          Custom to
          <input
            type="date"
            value={customTo}
            onChange={(event) => setCustomTo(event.target.value)}
            className="mt-1 block rounded-lg border border-[var(--color-border)] bg-[var(--color-input)] px-3 py-2 text-sm text-white"
          />
        </label>
        <button
          type="button"
          className="btn-secondary h-10"
          disabled={loading || !customFrom || !customTo}
          onClick={() => void loadRange("custom", customFrom, customTo)}
        >
          Apply custom range
        </button>
        <p className="ml-auto text-xs text-[var(--color-muted)]">
          {loading ? "Loading…" : data.range.label}
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200"
        >
          {error}
        </div>
      )}

      {!hasCollectedData && (
        <EmptyState>
          No data available yet. Analytics begins after the database migration is
          applied and a visitor grants consent.
        </EmptyState>
      )}

      <section aria-labelledby="overview-title">
        <SectionHeading
          id="overview-title"
          title="Overview"
          note={`Compared with ${formatDate(data.range.previousStart)}–${formatDate(data.range.previousEnd)} UTC`}
        />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Visitors"
            metric={data.overview.visitors}
            help="Anonymous unique visitor IDs"
          />
          <MetricCard label="Sessions" metric={data.overview.sessions} />
          <MetricCard label="Page views" metric={data.overview.pageViews} />
          <MetricCard
            label="Average session"
            metric={data.overview.averageSessionDurationMs}
            format={formatDuration}
          />
          <MetricCard
            label="Pages / session"
            metric={data.overview.pagesPerSession}
            format={(value) => value.toFixed(2)}
          />
          <MetricCard
            label="Bounce rate"
            metric={data.overview.bounceRate}
            format={(value) => `${value.toFixed(1)}%`}
            help="One-page sessions without 10 seconds of active engagement"
          />
          <MetricCard label="New visitors" metric={data.overview.newVisitors} />
          <MetricCard
            label="Returning visitors"
            metric={data.overview.returningVisitors}
          />
        </div>
      </section>

      <Panel>
        <SectionHeading
          id="traffic-chart"
          title="Traffic overview"
          note="Visitors, sessions, and page views by day"
        />
        <TrafficChart points={data.series} />
      </Panel>

      <section className="grid gap-6 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <SectionHeading
            id="realtime"
            title="Real-time visitors"
            note={`${data.overview.activeVisitors.toLocaleString()} active in the last 2 minutes`}
          />
          <DataTable
            rows={data.realtime}
            rowKey={(row, index) =>
              `${row.currentPage}-${row.sessionStartedAt}-${index}`
            }
            searchText={(row) =>
              `${row.currentPage} ${row.game ?? ""} ${row.country ?? ""} ${row.source}`
            }
            pageSize={8}
            columns={[
              textColumn<RealtimeVisitor>("page", "Current page", (row) => row.currentPage),
              textColumn<RealtimeVisitor>("game", "Game", (row) => row.game ?? "—"),
              textColumn<RealtimeVisitor>("device", "Device", (row) => row.device),
              textColumn<RealtimeVisitor>("country", "Country", (row) =>
                countryName(row.country)
              ),
              textColumn<RealtimeVisitor>("source", "Source", (row) => row.source),
              {
                id: "time",
                label: "Session time",
                render: (row) =>
                  formatDuration(Date.now() - new Date(row.sessionStartedAt).getTime()),
                sort: (row) => new Date(row.sessionStartedAt).getTime(),
                align: "right",
              },
            ]}
          />
        </Panel>
        <Panel>
          <SectionHeading id="engagement" title="Engagement" />
          <dl className="space-y-4">
            <SummaryRow
              label="Median session"
              value={
                data.overview.medianSessionDurationMs === null
                  ? "Not enough data"
                  : formatDuration(data.overview.medianSessionDurationMs)
              }
            />
            <SummaryRow
              label="Engaged sessions"
              value={data.overview.engagedSessions.value.toLocaleString()}
            />
            <SummaryRow
              label="Single-page sessions"
              value={data.overview.singlePageSessions.value.toLocaleString()}
            />
            <SummaryRow
              label="Currently active"
              value={data.overview.activeVisitors.toLocaleString()}
              accent
            />
          </dl>
        </Panel>
      </section>

      <section className="grid gap-6 2xl:grid-cols-2">
        <Panel>
          <SectionHeading id="top-pages" title="Top pages" />
          <PagesTable rows={data.pages} />
        </Panel>
        <Panel>
          <SectionHeading
            id="top-games"
            title="Games analytics"
            note="Starts include historical operational iframe mounts; session detail is consented"
          />
          <GamesTable rows={data.games} />
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <SectionHeading id="sources" title="Traffic sources" />
          <DimensionTable rows={data.sources} />
        </Panel>
        <Panel>
          <SectionHeading
            id="countries"
            title="Countries"
            note="Available only from trusted hosting headers"
          />
          <BarList
            rows={data.countries.map((row) => ({
              ...row,
              dimension: countryName(row.dimension),
            }))}
          />
        </Panel>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Panel>
          <SectionHeading id="devices" title="Devices" />
          <BarList rows={data.devices} />
        </Panel>
        <Panel>
          <SectionHeading id="browsers" title="Browsers" />
          <BarList rows={data.browsers} />
        </Panel>
        <Panel>
          <SectionHeading id="systems" title="Operating systems" />
          <BarList rows={data.operatingSystems} />
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <SectionHeading id="landing" title="Top landing pages" />
          <EntryExitTable rows={data.landingPages} rateLabel="Single-page rate" />
        </Panel>
        <Panel>
          <SectionHeading id="exits" title="Top exit pages" />
          <EntryExitTable rows={data.exitPages} rateLabel="Exit rate" />
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <SectionHeading id="events" title="Event analytics" />
          <DataTable
            rows={data.events}
            rowKey={(row) => row.name}
            searchText={(row) => row.name}
            columns={[
              textColumn<(typeof data.events)[number]>("name", "Event", (row) =>
                row.name.replaceAll("_", " ")
              ),
              numberColumn<(typeof data.events)[number]>("count", "Events", (row) => row.count),
              numberColumn<(typeof data.events)[number]>(
                "visitors",
                "Visitors",
                (row) => row.visitors
              ),
            ]}
          />
        </Panel>
        <Panel>
          <SectionHeading id="searches" title="Top internal searches" />
          <DataTable
            rows={data.searches}
            rowKey={(row) => row.query}
            searchText={(row) => row.query}
            columns={[
              textColumn<(typeof data.searches)[number]>("query", "Query", (row) => row.query),
              numberColumn<(typeof data.searches)[number]>(
                "searches",
                "Searches",
                (row) => row.searches
              ),
              numberColumn<(typeof data.searches)[number]>(
                "clicks",
                "Result clicks",
                (row) => row.resultClicks
              ),
              numberColumn<(typeof data.searches)[number]>(
                "empty",
                "No result",
                (row) => row.noResultSearches
              ),
            ]}
          />
        </Panel>
      </section>

      <Panel>
        <SectionHeading
          id="navigation"
          title="Internal navigation"
          note="Observed previous-page → current-page transitions"
        />
        <DataTable
          rows={data.navigation}
          rowKey={(row) => `${row.from}-${row.to}`}
          searchText={(row) => `${row.from} ${row.to}`}
          columns={[
            textColumn<(typeof data.navigation)[number]>("from", "Previous", (row) => row.from),
            textColumn<(typeof data.navigation)[number]>("to", "Current", (row) => row.to),
            numberColumn<(typeof data.navigation)[number]>(
              "transitions",
              "Transitions",
              (row) => row.transitions
            ),
          ]}
        />
      </Panel>

      <section className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <SectionHeading id="seo" title="SEO analytics" />
          {!data.seo.searchConsoleConnected ? (
            <div className="mb-4 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">
              {data.seo.message}
            </div>
          ) : (
            <div className="mb-5 space-y-4">
              <SearchConsoleTable
                title="Top Search Console queries"
                rows={data.seo.searchQueries}
              />
              <SearchConsoleTable
                title="Top Google Search pages"
                rows={data.seo.searchPages}
              />
            </div>
          )}
          <h3 className="mb-2 text-sm font-semibold">Organic landing pages</h3>
          <DimensionTable rows={data.seo.organicLandingPages} />
        </Panel>
        <Panel>
          <SectionHeading
            id="seo-opportunities"
            title="SEO opportunities"
            note="Based only on observed organic landing traffic"
          />
          {data.seo.opportunities.length === 0 ? (
            <TableEmpty />
          ) : (
            <ul className="space-y-2">
              {data.seo.opportunities.map((item, index) => (
                <li
                  key={`${item.type}-${item.page}-${index}`}
                  className="rounded-lg border border-[var(--color-border)] p-3"
                >
                  <p className="truncate text-sm font-medium">{item.page}</p>
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    {item.detail}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </section>

      <Panel>
        <SectionHeading
          id="performance"
          title="Performance"
          note="Browser-supported Web Vitals and navigation timing only"
        />
        <PerformanceTable rows={data.performance} />
      </Panel>

      <Panel>
        <SectionHeading id="accuracy" title="Accuracy and limitations" />
        <ul className="list-disc space-y-2 pl-5 text-sm text-[var(--color-muted)]">
          {data.limitations.map((limitation) => (
            <li key={limitation}>{limitation}</li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-[var(--color-muted)]">
          Last generated {new Date(data.generatedAt).toLocaleString()}.
        </p>
      </Panel>
    </div>
  );
}

function SectionHeading({
  id,
  title,
  note,
}: {
  id: string;
  title: string;
  note?: string;
}) {
  return (
    <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
      <h2 id={id} className="text-lg font-semibold">
        {title}
      </h2>
      {note && <p className="text-xs text-[var(--color-muted)]">{note}</p>}
    </div>
  );
}

function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`min-w-0 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5 ${className}`}
    >
      {children}
    </section>
  );
}

function MetricCard({
  label,
  metric,
  format = (value) => value.toLocaleString(),
  help,
}: {
  label: string;
  metric: ComparedMetric;
  format?: (value: number) => string;
  help?: string;
}) {
  const positive = (metric.changePercent ?? 0) >= 0;
  return (
    <article
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
      title={help}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold">{format(metric.value)}</p>
      <p
        className={`mt-2 text-xs ${
          metric.changePercent === null
            ? "text-[var(--color-muted)]"
            : positive
              ? "text-emerald-400"
              : "text-rose-400"
        }`}
      >
        {metric.changePercent === null
          ? "No previous data"
          : `${positive ? "+" : ""}${metric.changePercent.toFixed(1)}% vs previous period`}
      </p>
    </article>
  );
}

function TrafficChart({ points }: { points: AnalyticsDashboardData["series"] }) {
  if (points.length === 0) return <TableEmpty />;
  const width = 900;
  const height = 260;
  const padding = 30;
  const max = Math.max(
    1,
    ...points.flatMap((point) => [
      point.visitors,
      point.sessions,
      point.pageViews,
    ])
  );
  const coordinates = (key: "visitors" | "sessions" | "pageViews") =>
    points
      .map((point, index) => {
        const x =
          points.length === 1
            ? width / 2
            : padding + (index / (points.length - 1)) * (width - padding * 2);
        const y =
          height -
          padding -
          (point[key] / max) * (height - padding * 2);
        return `${x},${y}`;
      })
      .join(" ");

  return (
    <div>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="min-w-[600px]"
          role="img"
          aria-label="Traffic overview line chart"
        >
          {[0, 0.25, 0.5, 0.75, 1].map((position) => (
            <line
              key={position}
              x1={padding}
              x2={width - padding}
              y1={padding + position * (height - padding * 2)}
              y2={padding + position * (height - padding * 2)}
              stroke="var(--color-border)"
              strokeWidth="1"
            />
          ))}
          <polyline
            points={coordinates("pageViews")}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="3"
          />
          <polyline
            points={coordinates("sessions")}
            fill="none"
            stroke="#22c55e"
            strokeWidth="3"
          />
          <polyline
            points={coordinates("visitors")}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
          />
        </svg>
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-[var(--color-muted)]">
        <Legend color="#38bdf8" label="Visitors" />
        <Legend color="#22c55e" label="Sessions" />
        <Legend color="#8b5cf6" label="Page views" />
        <span className="ml-auto">
          {points[0]?.date} – {points.at(-1)?.date}
        </span>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

function PagesTable({ rows }: { rows: PageAnalyticsRow[] }) {
  return (
    <DataTable
      rows={rows}
      rowKey={(row) => row.page}
      searchText={(row) => row.page}
      columns={[
        textColumn<PageAnalyticsRow>("page", "Page", (row) => row.page),
        numberColumn<PageAnalyticsRow>("views", "Views", (row) => row.views),
        numberColumn<PageAnalyticsRow>("visitors", "Visitors", (row) => row.visitors),
        durationColumn<PageAnalyticsRow>("time", "Avg time", (row) => row.averageTimeMs),
        numberColumn<PageAnalyticsRow>("entrances", "Entrances", (row) => row.entrances),
        numberColumn<PageAnalyticsRow>("exits", "Exits", (row) => row.exits),
        percentColumn<PageAnalyticsRow>(
          "engagement",
          "Engagement",
          (row) => row.engagementRate
        ),
      ]}
    />
  );
}

function GamesTable({ rows }: { rows: GameAnalyticsRow[] }) {
  return (
    <DataTable
      rows={rows}
      rowKey={(row) => String(row.gameId)}
      searchText={(row) => `${row.title} ${row.slug}`}
      columns={[
        textColumn<GameAnalyticsRow>("game", "Game", (row) => row.title),
        numberColumn<GameAnalyticsRow>("starts", "Starts", (row) => row.starts),
        numberColumn<GameAnalyticsRow>("views", "Page views", (row) => row.pageViews),
        numberColumn<GameAnalyticsRow>("sessions", "Sessions", (row) => row.sessions),
        {
          id: "duration",
          label: "Avg play",
          render: (row) =>
            row.averagePlayDurationMs === null
              ? "Unavailable"
              : formatDuration(row.averagePlayDurationMs),
          sort: (row) => row.averagePlayDurationMs,
          align: "right",
        },
        numberColumn<GameAnalyticsRow>(
          "returning",
          "Returning",
          (row) => row.returningPlayers
        ),
        {
          id: "trend",
          label: "Trend",
          render: (row) =>
            row.trend === "new"
              ? "New"
              : row.trendPercent === null
                ? "Not enough data"
                : `${row.trendPercent > 0 ? "+" : ""}${row.trendPercent.toFixed(1)}%`,
          sort: (row) => row.trendPercent,
          align: "right",
        },
      ]}
    />
  );
}

function DimensionTable({ rows }: { rows: DimensionRow[] }) {
  return (
    <DataTable
      rows={rows}
      rowKey={(row) => row.dimension}
      searchText={(row) => row.dimension}
      columns={[
        textColumn<DimensionRow>("dimension", "Source / page", (row) => row.dimension),
        numberColumn<DimensionRow>("visitors", "Visitors", (row) => row.visitors),
        numberColumn<DimensionRow>("sessions", "Sessions", (row) => row.sessions),
        numberColumn<DimensionRow>("views", "Views", (row) => row.pageViews),
        durationColumn<DimensionRow>(
          "duration",
          "Avg session",
          (row) => row.averageSessionDurationMs
        ),
        numberColumn<DimensionRow>("events", "Events", (row) => row.events),
      ]}
    />
  );
}

function EntryExitTable({
  rows,
  rateLabel,
}: {
  rows: EntryExitRow[];
  rateLabel: string;
}) {
  return (
    <DataTable
      rows={rows}
      rowKey={(row) => row.page}
      searchText={(row) => row.page}
      columns={[
        textColumn<EntryExitRow>("page", "Page", (row) => row.page),
        numberColumn<EntryExitRow>("sessions", "Sessions", (row) => row.sessions),
        numberColumn<EntryExitRow>("visitors", "Visitors", (row) => row.visitors),
        percentColumn<EntryExitRow>("rate", rateLabel, (row) => row.rate),
        durationColumn<EntryExitRow>(
          "duration",
          "Avg session",
          (row) => row.averageSessionDurationMs
        ),
      ]}
    />
  );
}

function PerformanceTable({ rows }: { rows: PerformanceRow[] }) {
  return (
    <DataTable
      rows={rows}
      rowKey={(row) => row.page}
      searchText={(row) => `${row.page} ${row.status}`}
      columns={[
        textColumn<PerformanceRow>("page", "Page", (row) => row.page),
        numberColumn<PerformanceRow>("samples", "Samples", (row) => row.samples),
        nullableMetricColumn("load", "Load", (row) => row.loadTimeMs, "ms"),
        nullableMetricColumn("fcp", "FCP", (row) => row.firstContentfulMs, "ms"),
        nullableMetricColumn("lcp", "LCP", (row) => row.largestContentfulMs, "ms"),
        nullableMetricColumn("cls", "CLS", (row) => row.cumulativeLayoutShift, ""),
        nullableMetricColumn("inp", "INP", (row) => row.interactionNextPaintMs, "ms"),
        textColumn<PerformanceRow>("status", "Status", (row) =>
          row.status === "good"
            ? "Good"
            : row.status === "needs-attention"
              ? "Needs attention"
              : "Not enough data"
        ),
      ]}
    />
  );
}

function SearchConsoleTable({
  title,
  rows,
}: {
  title: string;
  rows: AnalyticsDashboardData["seo"]["searchQueries"];
}) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>
      <DataTable
        rows={rows}
        rowKey={(row) => row.key}
        searchText={(row) => row.key}
        pageSize={5}
        columns={[
          textColumn<(typeof rows)[number]>("key", "Query / page", (row) => row.key),
          numberColumn<(typeof rows)[number]>("clicks", "Clicks", (row) => row.clicks),
          numberColumn<(typeof rows)[number]>(
            "impressions",
            "Impressions",
            (row) => row.impressions
          ),
          percentColumn<(typeof rows)[number]>("ctr", "CTR", (row) => row.ctr),
          {
            id: "position",
            label: "Position",
            render: (row) => row.position.toFixed(1),
            sort: (row) => row.position,
            align: "right",
          },
        ]}
      />
    </div>
  );
}

function BarList({ rows }: { rows: DimensionRow[] }) {
  if (rows.length === 0) return <TableEmpty />;
  const max = Math.max(1, ...rows.map((row) => row.sessions));
  const total = rows.reduce((sum, row) => sum + row.sessions, 0);
  return (
    <ol className="space-y-3">
      {rows.slice(0, 12).map((row) => (
        <li key={row.dimension}>
          <div className="mb-1 flex items-center justify-between gap-3 text-sm">
            <span className="truncate">{row.dimension}</span>
            <span className="shrink-0 text-[var(--color-muted)]">
              {row.sessions.toLocaleString()} ·{" "}
              {total > 0 ? ((row.sessions / total) * 100).toFixed(1) : "0.0"}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--color-input)]">
            <div
              className="h-full rounded-full bg-[var(--color-accent)]"
              style={{ width: `${(row.sessions / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ol>
  );
}

function DataTable<T>({
  rows,
  columns,
  rowKey,
  searchText,
  pageSize = 10,
}: {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T, index: number) => string;
  searchText: (row: T) => string;
  pageSize?: number;
}) {
  const [query, setQuery] = useState("");
  const [sortId, setSortId] = useState("");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const next = needle
      ? rows.filter((row) => searchText(row).toLowerCase().includes(needle))
      : [...rows];
    const column = columns.find((item) => item.id === sortId);
    if (!column) return next;
    return next.sort((left, right) => {
      const a = column.sort(left);
      const b = column.sort(right);
      if (a === null) return 1;
      if (b === null) return -1;
      const result =
        typeof a === "number" && typeof b === "number"
          ? a - b
          : String(a).localeCompare(String(b));
      return direction === "asc" ? result : -result;
    });
  }, [columns, direction, query, rows, searchText, sortId]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function toggleSort(column: Column<T>) {
    if (sortId === column.id) {
      setDirection((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortId(column.id);
      setDirection("desc");
    }
    setPage(1);
  }

  return (
    <div className="min-w-0">
      {rows.length > 8 && (
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          placeholder="Search table"
          aria-label="Search table"
          className="mb-3 w-full max-w-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-input)] px-3 py-2 text-sm"
        />
      )}
      {visible.length === 0 ? (
        <TableEmpty />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-[var(--color-muted)]">
                {columns.map((column) => (
                  <th
                    key={column.id}
                    className={`px-3 py-2 font-medium ${column.align === "right" ? "text-right" : ""}`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(column)}
                      className="inline-flex items-center gap-1 hover:text-white"
                    >
                      {column.label}
                      {sortId === column.id && (
                        <span aria-hidden>{direction === "asc" ? "↑" : "↓"}</span>
                      )}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((row, index) => (
                <tr
                  key={rowKey(row, index)}
                  className="border-b border-[var(--color-border)]/70 last:border-0"
                >
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={`max-w-[360px] truncate px-3 py-3 ${column.align === "right" ? "text-right tabular-nums" : ""}`}
                      title={String(column.sort(row) ?? "")}
                    >
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pageCount > 1 && (
        <div className="mt-3 flex items-center justify-end gap-2 text-xs text-[var(--color-muted)]">
          <button
            type="button"
            className="btn-secondary px-3 py-1.5"
            disabled={currentPage === 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
          >
            Previous
          </button>
          <span>
            {currentPage} / {pageCount}
          </span>
          <button
            type="button"
            className="btn-secondary px-3 py-1.5"
            disabled={currentPage === pageCount}
            onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function textColumn<T>(
  id: string,
  label: string,
  value: (row: T) => string
): Column<T> {
  return {
    id,
    label,
    render: value,
    sort: value,
  };
}

function numberColumn<T>(
  id: string,
  label: string,
  value: (row: T) => number
): Column<T> {
  return {
    id,
    label,
    render: (row) => value(row).toLocaleString(),
    sort: value,
    align: "right",
  };
}

function durationColumn<T>(
  id: string,
  label: string,
  value: (row: T) => number
): Column<T> {
  return {
    id,
    label,
    render: (row) => formatDuration(value(row)),
    sort: value,
    align: "right",
  };
}

function percentColumn<T>(
  id: string,
  label: string,
  value: (row: T) => number
): Column<T> {
  return {
    id,
    label,
    render: (row) => `${value(row).toFixed(1)}%`,
    sort: value,
    align: "right",
  };
}

function nullableMetricColumn(
  id: string,
  label: string,
  value: (row: PerformanceRow) => number | null,
  suffix: string
): Column<PerformanceRow> {
  return {
    id,
    label,
    render: (row) => {
      const metric = value(row);
      return metric === null ? "Unavailable" : `${metric.toLocaleString()}${suffix}`;
    },
    sort: value,
    align: "right",
  };
}

function SummaryRow({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-3 last:border-0">
      <dt className="text-sm text-[var(--color-muted)]">{label}</dt>
      <dd className={accent ? "font-bold text-emerald-400" : "font-semibold"}>
        {value}
      </dd>
    </div>
  );
}

function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-sm text-[var(--color-muted)]">
      {children}
    </div>
  );
}

function TableEmpty() {
  return (
    <div className="rounded-lg border border-dashed border-[var(--color-border)] p-5 text-center text-sm text-[var(--color-muted)]">
      No data available yet
    </div>
  );
}

function formatDuration(milliseconds: number): string {
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) return "0s";
  const totalSeconds = Math.round(milliseconds / 1_000);
  const hours = Math.floor(totalSeconds / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

function formatDate(value: string): string {
  return new Date(value).toISOString().slice(0, 10);
}

function countryName(code: string | null): string {
  if (!code || code === "Unknown") return "Unknown";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}
