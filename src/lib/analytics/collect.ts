import { Prisma } from "@prisma/client";
import { ANALYTICS_ENGAGED_MS } from "@/lib/analytics/constants";
import type { AnalyticsCollectInput } from "@/lib/analytics/schemas";
import { prisma } from "@/lib/db";

type TrafficSource = {
  category:
    | "google_organic"
    | "bing_organic"
    | "direct"
    | "social"
    | "referral"
    | "other_search"
    | "other";
  source?: string;
  medium?: string;
  referrer?: string;
};

const SEARCH_HOSTS = [
  "duckduckgo.",
  "yahoo.",
  "yandex.",
  "baidu.",
  "ecosia.",
  "ask.",
];
const SOCIAL_HOSTS = [
  "facebook.",
  "instagram.",
  "tiktok.",
  "twitter.",
  "x.com",
  "reddit.",
  "pinterest.",
  "linkedin.",
  "youtube.",
  "discord.",
];

export class AnalyticsIdentityError extends Error {}

function cleanReferrer(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`.slice(0, 768);
  } catch {
    return undefined;
  }
}

function hostnameOf(value?: string): string {
  if (!value) return "";
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return "";
  }
}

export function classifyTraffic(
  input: AnalyticsCollectInput,
  siteHostname: string
): TrafficSource {
  const source = input.utm?.source?.toLowerCase();
  const medium = input.utm?.medium?.toLowerCase();
  const referrer = cleanReferrer(input.referrer);
  const hostname = hostnameOf(referrer);

  if (source || medium) {
    if (medium === "organic") {
      return {
        category:
          source === "google"
            ? "google_organic"
            : source === "bing"
              ? "bing_organic"
              : "other_search",
        source,
        medium: medium ?? "organic",
        referrer,
      };
    }
    if (
      medium === "social" ||
      medium === "social-media" ||
      SOCIAL_HOSTS.some((host) => source?.includes(host.replace(".", "")))
    ) {
      return { category: "social", source, medium, referrer };
    }
    if (medium === "referral") {
      return { category: "referral", source, medium, referrer };
    }
    return { category: "other", source, medium, referrer };
  }

  if (!hostname || hostname === siteHostname || hostname.endsWith(`.${siteHostname}`)) {
    return { category: "direct", referrer };
  }
  if (hostname.includes("google.")) {
    return {
      category: "google_organic",
      source: "google",
      medium: "organic",
      referrer,
    };
  }
  if (hostname.includes("bing.")) {
    return {
      category: "bing_organic",
      source: "bing",
      medium: "organic",
      referrer,
    };
  }
  if (SEARCH_HOSTS.some((host) => hostname.includes(host))) {
    return {
      category: "other_search",
      source: hostname,
      medium: "organic",
      referrer,
    };
  }
  if (SOCIAL_HOSTS.some((host) => hostname.includes(host))) {
    return {
      category: "social",
      source: hostname,
      medium: "social",
      referrer,
    };
  }
  return {
    category: "referral",
    source: hostname,
    medium: "referral",
    referrer,
  };
}

export function resolveCountry(headers: Headers): string | undefined {
  const value =
    headers.get("x-vercel-ip-country") ??
    headers.get("cf-ipcountry") ??
    headers.get("x-country-code");
  const country = value?.trim().toUpperCase();
  return country && /^[A-Z]{2}$/.test(country) && country !== "XX"
    ? country
    : undefined;
}

export function parseClient(userAgent: string, screenWidth?: number) {
  const ua = userAgent.toLowerCase();
  const isTablet =
    /ipad|tablet|kindle|silk/.test(ua) ||
    (/android/.test(ua) && !/mobile/.test(ua));
  const isMobile = /mobi|iphone|ipod|android/.test(ua);
  const deviceType =
    isTablet || (screenWidth !== undefined && screenWidth >= 600 && screenWidth < 1024)
      ? "tablet"
      : isMobile || (screenWidth !== undefined && screenWidth < 600)
        ? "mobile"
        : "desktop";

  const browser = /edg\//.test(ua)
    ? "Edge"
    : /opr\/|opera/.test(ua)
      ? "Opera"
      : /samsungbrowser/.test(ua)
        ? "Samsung Internet"
        : /firefox|fxios/.test(ua)
          ? "Firefox"
          : /chrome|crios/.test(ua)
            ? "Chrome"
            : /safari/.test(ua)
              ? "Safari"
              : "Other";

  const operatingSystem = /windows/.test(ua)
    ? "Windows"
    : /iphone|ipad|ipod/.test(ua)
      ? "iOS"
      : /android/.test(ua)
        ? "Android"
        : /mac os|macintosh/.test(ua)
          ? "macOS"
          : /linux/.test(ua)
            ? "Linux"
            : "Other";

  return { deviceType, browser, operatingSystem };
}

function maxDuration(value: number): number {
  return Math.min(Math.max(Math.round(value), 0), 86_400_000);
}

export async function collectAnalytics(
  input: AnalyticsCollectInput,
  requestHeaders: Headers,
  siteHostname: string
): Promise<void> {
  const now = new Date();
  const traffic = classifyTraffic(input, siteHostname);
  const country = resolveCountry(requestHeaders);
  const client = parseClient(
    requestHeaders.get("user-agent") ?? "",
    input.screenWidth
  );

  await prisma.$transaction(async (tx) => {
    await ensureSession(tx, input, {
      now,
      traffic,
      country,
      ...client,
    });

    const session = await tx.analyticsSession.findUnique({
      where: { id: input.sessionId },
      select: {
        visitorId: true,
        activeDurationMs: true,
        pageViewCount: true,
        engaged: true,
      },
    });
    if (!session || session.visitorId !== input.visitorId) {
      throw new AnalyticsIdentityError("Session identity does not match visitor");
    }

    let createdPageViews = 0;
    if (input.action === "page_view") {
      if (input.previousPageViewId) {
        await tx.analyticsPageView.updateMany({
          where: {
            id: input.previousPageViewId,
            sessionId: input.sessionId,
          },
          data: {
            nextPath: input.path,
            isExit: false,
            endedAt: now,
          },
        });
      }
    }

    const pageViewResult = await tx.analyticsPageView.createMany({
      data: [
        {
          id: input.pageViewId,
          sessionId: input.sessionId,
          visitorId: input.visitorId,
          path: input.path,
          title: input.title,
          referrer: cleanReferrer(input.referrer),
          previousPath: input.previousPath,
          gameId: input.gameId,
          gameSlug: input.gameSlug,
          isEntrance: session.pageViewCount === 0,
        },
      ],
      skipDuplicates: true,
    });
    createdPageViews = pageViewResult.count;

    const eventResult =
      input.events.length > 0
        ? await tx.analyticsEvent.createMany({
            data: input.events.map((event) => ({
              id: event.id,
              sessionId: input.sessionId,
              visitorId: input.visitorId,
              pageViewId: input.pageViewId,
              eventName: event.name,
              pagePath: input.path,
              gameId: event.gameId ?? input.gameId,
              gameSlug: event.gameSlug ?? input.gameSlug,
              durationMs:
                event.durationMs === undefined
                  ? undefined
                  : maxDuration(event.durationMs),
              metadata: event.metadata,
            })),
            skipDuplicates: true,
          })
        : { count: 0 };

    const meaningfulEvent = input.events.some((event) =>
      [
        "click",
        "external_link_click",
        "search_result_click",
        "share",
      ].includes(event.name)
    );
    const sessionActiveMs = Math.max(
      session.activeDurationMs,
      maxDuration(input.sessionActiveMs)
    );
    const engaged =
      session.engaged ||
      sessionActiveMs >= ANALYTICS_ENGAGED_MS ||
      session.pageViewCount + createdPageViews > 1 ||
      meaningfulEvent;
    const endingSession = input.action === "session_end";

    await tx.analyticsSession.update({
      where: { id: input.sessionId },
      data: {
        lastSeenAt: now,
        pageViewCount:
          createdPageViews > 0 ? { increment: createdPageViews } : undefined,
        eventCount:
          eventResult.count > 0 ? { increment: eventResult.count } : undefined,
        engaged,
        screenWidth: input.screenWidth,
        screenHeight: input.screenHeight,
      },
    });
    await tx.$executeRaw(Prisma.sql`
      UPDATE AnalyticsSession
      SET activeDurationMs = GREATEST(activeDurationMs, ${sessionActiveMs})
      WHERE id = ${input.sessionId}
    `);

    const navigationData: Prisma.AnalyticsSessionUpdateManyMutationInput = {
      previousPage:
        input.action === "page_view" ? input.previousPath : undefined,
      currentPage: input.path,
      currentPageViewId: input.pageViewId,
      exitPage: input.path,
      currentGameId: endingSession ? null : input.gameId,
      currentGameSlug: endingSession ? null : input.gameSlug,
      endedAt: endingSession ? now : undefined,
    };
    if (input.action === "page_view") {
      await tx.analyticsSession.update({
        where: { id: input.sessionId },
        data: navigationData,
      });
    } else {
      await tx.analyticsSession.updateMany({
        where: {
          id: input.sessionId,
          currentPageViewId: input.pageViewId,
        },
        data: navigationData,
      });
    }

    const pageData: Prisma.AnalyticsPageViewUpdateManyMutationInput = {
      lastSeenAt: now,
      gameId: input.gameId,
      gameSlug: input.gameSlug,
    };

    if (input.action === "page_leave" || endingSession) {
      pageData.endedAt = now;
    }
    if (input.performance) {
      Object.assign(pageData, input.performance);
    }

    await tx.analyticsPageView.updateMany({
      where: {
        id: input.pageViewId,
        sessionId: input.sessionId,
      },
      data: pageData,
    });
    await tx.$executeRaw(Prisma.sql`
      UPDATE AnalyticsPageView
      SET activeDurationMs = GREATEST(activeDurationMs, ${maxDuration(input.pageActiveMs)})
      WHERE id = ${input.pageViewId} AND sessionId = ${input.sessionId}
    `);

    await tx.analyticsVisitor.update({
      where: { id: input.visitorId },
      data: { lastSeenAt: now },
    });
  });
}

type SessionContext = {
  now: Date;
  traffic: TrafficSource;
  country?: string;
  deviceType: string;
  browser: string;
  operatingSystem: string;
};

async function ensureSession(
  tx: Prisma.TransactionClient,
  input: AnalyticsCollectInput,
  context: SessionContext
) {
  await tx.analyticsVisitor.upsert({
    where: { id: input.visitorId },
    create: {
      id: input.visitorId,
      firstSeenAt: context.now,
      lastSeenAt: context.now,
      sessionCount: 0,
    },
    update: {
      lastSeenAt: context.now,
    },
  });

  const created = await tx.analyticsSession.createMany({
    data: [
      {
        id: input.sessionId,
        visitorId: input.visitorId,
        startedAt: context.now,
        lastSeenAt: context.now,
        landingPage: input.path,
        exitPage: input.path,
        currentPage: input.path,
        currentPageViewId: input.pageViewId,
        previousPage: input.previousPath,
        currentGameId: input.gameId,
        currentGameSlug: input.gameSlug,
        referrer: context.traffic.referrer,
        sourceCategory: context.traffic.category,
        source: input.utm?.source ?? context.traffic.source,
        medium: input.utm?.medium ?? context.traffic.medium,
        campaign: input.utm?.campaign,
        term: input.utm?.term,
        content: input.utm?.content,
        country: context.country,
        deviceType: context.deviceType,
        browser: context.browser,
        operatingSystem: context.operatingSystem,
        screenWidth: input.screenWidth,
        screenHeight: input.screenHeight,
      },
    ],
    skipDuplicates: true,
  });
  if (created.count > 0) {
    await tx.analyticsVisitor.update({
      where: { id: input.visitorId },
      data: { sessionCount: { increment: 1 } },
    });
  }

  const session = await tx.analyticsSession.findUnique({
    where: { id: input.sessionId },
    select: { visitorId: true },
  });
  if (!session || session.visitorId !== input.visitorId) {
    throw new AnalyticsIdentityError("Session identity does not match visitor");
  }
}
