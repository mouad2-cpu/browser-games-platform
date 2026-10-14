import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { collectAnalytics } from "@/lib/analytics/collect";
import { getAnalyticsDashboard } from "@/lib/analytics/dashboard";
import { resolveAnalyticsRange } from "@/lib/analytics/range";
import { analyticsCollectSchema } from "@/lib/analytics/schemas";
import { prisma } from "@/lib/db";

const databaseUrl = process.env.DATABASE_URL ?? "";
if (!databaseUrl.includes("_test")) {
  throw new Error("Analytics integration smoke test requires a *_test database");
}

const visitorId = randomUUID();
const secondVisitorId = randomUUID();
const sessionId = randomUUID();
const secondSessionId = randomUUID();
const pageViewId = randomUUID();
const secondPageViewId = randomUUID();
const searchPageViewId = randomUUID();
let playEventId: string | undefined;

const desktopHeaders = new Headers({
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/129.0 Safari/537.36",
  "x-vercel-ip-country": "US",
});
const mobileHeaders = new Headers({
  "user-agent":
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1",
  "x-vercel-ip-country": "CA",
});

function payload(value: Record<string, unknown>) {
  return analyticsCollectSchema.parse(value);
}

async function main() {
  const game = await prisma.game.findFirstOrThrow({
    where: { status: "published" },
    select: { id: true, slug: true },
  });

  await collectAnalytics(
    payload({
      action: "page_view",
      visitorId,
      sessionId,
      pageViewId,
      path: `/game/${game.slug}`,
      gameId: game.id,
      gameSlug: game.slug,
      referrer: "https://www.google.com/search?q=private-query",
      sessionActiveMs: 0,
      pageActiveMs: 0,
      screenWidth: 1440,
      screenHeight: 900,
      events: [
        { id: randomUUID(), name: "session_start" },
        { id: randomUUID(), name: "game_view", gameId: game.id },
        { id: randomUUID(), name: "game_start", gameId: game.id },
        { id: randomUUID(), name: "game_session_start", gameId: game.id },
      ],
    }),
    desktopHeaders,
    "www.zenfungames.com"
  );
  await collectAnalytics(
    payload({
      action: "heartbeat",
      visitorId,
      sessionId,
      pageViewId,
      path: `/game/${game.slug}`,
      gameId: game.id,
      gameSlug: game.slug,
      sessionActiveMs: 15_000,
      pageActiveMs: 15_000,
      performance: {
        loadTimeMs: 800,
        firstContentfulMs: 500,
        largestContentfulMs: 1_200,
        cumulativeLayoutShift: 0.02,
        interactionNextPaintMs: 100,
      },
      events: [],
    }),
    desktopHeaders,
    "www.zenfungames.com"
  );
  await collectAnalytics(
    payload({
      action: "page_view",
      visitorId,
      sessionId,
      pageViewId: searchPageViewId,
      previousPageViewId: pageViewId,
      path: "/search",
      previousPath: `/game/${game.slug}`,
      sessionActiveMs: 16_000,
      pageActiveMs: 0,
      events: [
        {
          id: randomUUID(),
          name: "search",
          metadata: { query: "puzzle", resultCount: 3, zeroResults: false },
        },
        {
          id: randomUUID(),
          name: "click",
          metadata: { destination: "/game/example" },
        },
      ],
    }),
    desktopHeaders,
    "www.zenfungames.com"
  );

  await collectAnalytics(
    payload({
      action: "page_view",
      visitorId: secondVisitorId,
      sessionId: secondSessionId,
      pageViewId: secondPageViewId,
      path: "/",
      sessionActiveMs: 0,
      pageActiveMs: 0,
      screenWidth: 390,
      screenHeight: 844,
      events: [{ id: randomUUID(), name: "session_start" }],
    }),
    mobileHeaders,
    "www.zenfungames.com"
  );

  const play = await prisma.playEvent.create({ data: { gameId: game.id } });
  playEventId = play.id;

  const range = resolveAnalyticsRange({ range: "today" });
  const playCount = await prisma.playEvent.count({
    where: { gameId: game.id, createdAt: { gte: range.start, lt: range.end } },
  });
  assert.ok(playCount >= 1, `Expected a play event in ${JSON.stringify(range)}`);
  const data = await getAnalyticsDashboard(range);
  assert.equal(data.overview.visitors.value, 2);
  assert.equal(data.overview.sessions.value, 2);
  assert.equal(data.overview.pageViews.value, 3);
  assert.ok(data.overview.engagedSessions.value >= 1);
  assert.ok(data.pages.some((row) => row.page === "/search"));
  assert.ok(
    data.games.some((row) => row.gameId === game.id && row.starts >= 1),
    `Expected game ${game.id} in ${JSON.stringify(data.games)}`
  );
  assert.ok(
    data.sources.some((row) => row.dimension === "Google / Organic")
  );
  assert.ok(data.devices.some((row) => row.dimension === "mobile"));
  assert.ok(data.countries.some((row) => row.dimension === "US"));
  assert.ok(data.searches.some((row) => row.query === "puzzle"));
  assert.ok(data.performance.some((row) => row.status === "good"));
  assert.equal(data.seo.searchConsoleConnected, false);

  console.log("analytics database integration checks passed");
}

main()
  .finally(async () => {
    await prisma.analyticsSession.deleteMany({
      where: { id: { in: [sessionId, secondSessionId] } },
    });
    await prisma.analyticsVisitor.deleteMany({
      where: { id: { in: [visitorId, secondVisitorId] } },
    });
    if (playEventId) {
      await prisma.playEvent.deleteMany({ where: { id: playEventId } });
    }
    await prisma.$disconnect();
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
