"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { AnalyticsEventDetail } from "@/lib/analytics/client";
import {
  ANALYTICS_ACTIVE_TIMEOUT_MS,
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_CONSENT_KEY,
  ANALYTICS_HEARTBEAT_MS,
  ANALYTICS_SESSION_KEY,
  ANALYTICS_SESSION_TIMEOUT_MS,
  ANALYTICS_TRACK_EVENT,
  ANALYTICS_VISITOR_KEY,
} from "@/lib/analytics/constants";

type Consent = "accepted" | "declined" | null;

type StoredSession = {
  id: string;
  activeMs: number;
  lastSeenAt: number;
  previousPath?: string;
  previousPageViewId?: string;
};

type QueuedEvent = AnalyticsEventDetail & { id: string };

type PerformanceMetrics = {
  loadTimeMs?: number;
  domContentLoadedMs?: number;
  firstContentfulMs?: number;
  largestContentfulMs?: number;
  cumulativeLayoutShift?: number;
  interactionNextPaintMs?: number;
};

type CurrentView = {
  id: string;
  path: string;
  activeMs: number;
  lastClock: number;
  gameId?: number;
  gameSlug?: string;
  performance: PerformanceMetrics;
};

function readConsent(): Consent {
  try {
    const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
    return value === "accepted" || value === "declined" ? value : null;
  } catch {
    return null;
  }
}

function readStoredSession(): StoredSession | null {
  try {
    const raw = window.sessionStorage.getItem(ANALYTICS_SESSION_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<StoredSession>;
    if (
      typeof value.id !== "string" ||
      typeof value.activeMs !== "number" ||
      typeof value.lastSeenAt !== "number"
    ) {
      return null;
    }
    return value as StoredSession;
  } catch {
    return null;
  }
}

function getVisitorId(): string {
  try {
    const current = window.localStorage.getItem(ANALYTICS_VISITOR_KEY);
    if (current) return current;
    const next = crypto.randomUUID();
    window.localStorage.setItem(ANALYTICS_VISITOR_KEY, next);
    return next;
  } catch {
    return crypto.randomUUID();
  }
}

function postPayload(payload: object, beacon = false): Promise<void> {
  const body = JSON.stringify(payload);
  if (beacon && navigator.sendBeacon) {
    const accepted = navigator.sendBeacon(
      "/api/analytics/collect",
      new Blob([body], { type: "application/json" })
    );
    return accepted
      ? Promise.resolve()
      : Promise.reject(new Error("Beacon was rejected"));
  }

  return fetch("/api/analytics/collect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Analytics request failed with ${response.status}`);
    }
  });
}

class AnalyticsRuntime {
  private visitorId = getVisitorId();
  private sessionId: string;
  private sessionActiveMs = 0;
  private lastSeenAt = Date.now();
  private previousPath?: string;
  private previousPageViewId?: string;
  private view?: CurrentView;
  private events: QueuedEvent[] = [];
  private eventTimer?: number;
  private heartbeatTimer?: number;
  private newSession = true;
  private observers: PerformanceObserver[] = [];
  private currentPath = "/";
  private initialPerformanceAvailable = true;
  private wasActive = false;

  constructor() {
    const stored = readStoredSession();
    if (stored && Date.now() - stored.lastSeenAt <= ANALYTICS_SESSION_TIMEOUT_MS) {
      this.sessionId = stored.id;
      this.sessionActiveMs = stored.activeMs;
      this.lastSeenAt = stored.lastSeenAt;
      this.previousPath = stored.previousPath;
      this.previousPageViewId = stored.previousPageViewId;
      this.newSession = false;
    } else {
      if (stored?.previousPageViewId && stored.previousPath) {
        void postPayload(
          this.payloadForStoredSession(stored, "session_end"),
          true
        ).catch(() => {});
      }
      this.sessionId = crypto.randomUUID();
    }

    window.addEventListener(ANALYTICS_TRACK_EVENT, this.onTrackEvent);
    document.addEventListener("click", this.onDocumentClick, true);
    document.addEventListener("visibilitychange", this.onVisibilityChange);
    window.addEventListener("focus", this.onFocus);
    window.addEventListener("blur", this.onBlur);
    window.addEventListener("pagehide", this.onPageHide);
    this.heartbeatTimer = window.setInterval(
      this.heartbeat,
      ANALYTICS_HEARTBEAT_MS
    );
    this.startPerformanceObservers();
    this.wasActive = this.isActive();
    window.__zenfunAnalyticsReady = true;
  }

  page(path: string) {
    if (this.view?.path === path) return;
    if (this.view) this.leavePage(false);

    this.currentPath = path;
    const gameSlug = path.startsWith("/game/")
      ? decodeURIComponent(path.slice("/game/".length)).split("/")[0]
      : undefined;
    this.view = {
      id: crypto.randomUUID(),
      path,
      activeMs: 0,
      lastClock: performance.now(),
      gameSlug,
      performance: this.initialPerformanceAvailable
        ? this.readInitialPerformance()
        : {},
    };
    this.initialPerformanceAvailable = false;
    this.wasActive = this.isActive();

    if (this.newSession) {
      this.events.push({ id: crypto.randomUUID(), name: "session_start" });
      this.newSession = false;
    }

    void this.send("page_view").catch(() => {});
    const queued = window.__zenfunAnalyticsQueue?.splice(0) ?? [];
    queued.forEach((detail) => {
      this.onTrackEvent(new CustomEvent(ANALYTICS_TRACK_EVENT, { detail }));
    });
  }

  destroy() {
    this.accrue();
    this.persist();
    window.clearInterval(this.heartbeatTimer);
    window.clearTimeout(this.eventTimer);
    window.removeEventListener(ANALYTICS_TRACK_EVENT, this.onTrackEvent);
    document.removeEventListener("click", this.onDocumentClick, true);
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    window.removeEventListener("focus", this.onFocus);
    window.removeEventListener("blur", this.onBlur);
    window.removeEventListener("pagehide", this.onPageHide);
    this.observers.forEach((observer) => observer.disconnect());
    window.__zenfunAnalyticsReady = false;
  }

  private payloadForStoredSession(
    stored: StoredSession,
    action: "session_end"
  ) {
    return {
      action,
      visitorId: this.visitorId,
      sessionId: stored.id,
      pageViewId: stored.previousPageViewId,
      path: stored.previousPath,
      sessionActiveMs: stored.activeMs,
      pageActiveMs: 0,
      events: [],
    };
  }

  private isActive() {
    return document.visibilityState === "visible" && document.hasFocus();
  }

  private accrue() {
    if (!this.view) return;
    const now = performance.now();
    const elapsed = Math.min(
      Math.max(now - this.view.lastClock, 0),
      ANALYTICS_HEARTBEAT_MS * 1.5
    );
    if (this.wasActive) {
      this.view.activeMs += elapsed;
      this.sessionActiveMs += elapsed;
    }
    this.view.lastClock = now;
  }

  private persist() {
    if (!this.view) return;
    const value: StoredSession = {
      id: this.sessionId,
      activeMs: Math.round(this.sessionActiveMs),
      lastSeenAt: this.lastSeenAt,
      previousPath: this.view.path,
      previousPageViewId: this.view.id,
    };
    try {
      window.sessionStorage.setItem(
        ANALYTICS_SESSION_KEY,
        JSON.stringify(value)
      );
    } catch {
      // Tracking is best-effort when browser storage is unavailable.
    }
  }

  private buildPayload(action: string, queuedEvents: QueuedEvent[]) {
    if (!this.view) throw new Error("No active analytics page view");
    const params = new URLSearchParams(window.location.search);
    return {
      action,
      visitorId: this.visitorId,
      sessionId: this.sessionId,
      pageViewId: this.view.id,
      previousPageViewId: this.previousPageViewId,
      path: this.view.path,
      title: document.title.slice(0, 512),
      referrer: document.referrer || undefined,
      previousPath: this.previousPath,
      gameId: this.view.gameId,
      gameSlug: this.view.gameSlug,
      sessionActiveMs: Math.round(this.sessionActiveMs),
      pageActiveMs: Math.round(this.view.activeMs),
      screenWidth: window.screen?.width,
      screenHeight: window.screen?.height,
      utm: {
        source: params.get("utm_source")?.slice(0, 128) || undefined,
        medium: params.get("utm_medium")?.slice(0, 128) || undefined,
        campaign: params.get("utm_campaign")?.slice(0, 255) || undefined,
        term: params.get("utm_term")?.slice(0, 255) || undefined,
        content: params.get("utm_content")?.slice(0, 255) || undefined,
      },
      performance: this.view.performance,
      events: queuedEvents,
    };
  }

  private async send(action: string, beacon = false) {
    if (!this.view) return;
    this.accrue();
    this.lastSeenAt = Date.now();
    const queued = this.events.splice(0, 20);
    const payload = this.buildPayload(action, queued);
    this.persist();

    try {
      await postPayload(payload, beacon);
    } catch (error) {
      this.events.unshift(...queued);
      throw error;
    }
  }

  private leavePage(beacon: boolean) {
    if (!this.view) return;
    this.accrue();
    const leavingView = this.view;
    void this.send("page_leave", beacon).catch(() => {});
    this.previousPath = leavingView.path;
    this.previousPageViewId = leavingView.id;
    this.view = undefined;
  }

  private restartSession() {
    if (!this.view) return;
    const path = this.view.path;
    this.events.push({ id: crypto.randomUUID(), name: "session_end" });
    void this.send("session_end", true).catch(() => {});
    this.previousPath = undefined;
    this.previousPageViewId = undefined;
    this.sessionId = crypto.randomUUID();
    this.sessionActiveMs = 0;
    this.newSession = true;
    this.view = undefined;
    this.page(path);
  }

  private heartbeat = () => {
    if (!this.view || !this.isActive()) {
      this.wasActive = false;
      return;
    }
    this.wasActive = true;
    if (Date.now() - this.lastSeenAt > ANALYTICS_SESSION_TIMEOUT_MS) {
      this.restartSession();
      return;
    }
    void this.send("heartbeat").catch(() => {});
  };

  private onVisibilityChange = () => {
    this.accrue();
    this.wasActive = this.isActive();
    if (document.visibilityState === "hidden") {
      void this.send("heartbeat", true).catch(() => {});
      return;
    }
    if (Date.now() - this.lastSeenAt > ANALYTICS_SESSION_TIMEOUT_MS) {
      this.restartSession();
    }
  };

  private onFocus = () => {
    this.accrue();
    this.wasActive = this.isActive();
    if (Date.now() - this.lastSeenAt > ANALYTICS_SESSION_TIMEOUT_MS) {
      this.restartSession();
    }
  };

  private onBlur = () => {
    this.accrue();
    this.wasActive = false;
  };

  private onPageHide = () => {
    if (!this.view) return;
    this.accrue();
    this.wasActive = false;
    void this.send("page_leave", true).catch(() => {});
  };

  private onTrackEvent = (rawEvent: Event) => {
    const detail = (rawEvent as CustomEvent<AnalyticsEventDetail>).detail;
    if (!detail?.name || !this.view) return;
    if (Date.now() - this.lastSeenAt > ANALYTICS_SESSION_TIMEOUT_MS) {
      this.restartSession();
      if (!this.view) return;
    }
    if (detail.gameId) this.view.gameId = detail.gameId;
    if (detail.gameSlug) this.view.gameSlug = detail.gameSlug;
    this.events.push({ ...detail, id: crypto.randomUUID() });

    if (detail.name === "game_exit" || detail.name === "game_session_end") {
      void this.send("events", true).catch(() => {});
      return;
    }
    if (this.events.length >= 10) {
      void this.send("events").catch(() => {});
      return;
    }
    window.clearTimeout(this.eventTimer);
    this.eventTimer = window.setTimeout(() => {
      void this.send("events").catch(() => {});
    }, 5_000);
  };

  private onDocumentClick = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element) || !this.view) return;
    const anchor = target.closest("a[href]");
    if (!(anchor instanceof HTMLAnchorElement)) return;

    let destination: URL;
    try {
      destination = new URL(anchor.href, window.location.href);
    } catch {
      return;
    }

    if (destination.origin !== window.location.origin) {
      this.onTrackEvent(
        new CustomEvent(ANALYTICS_TRACK_EVENT, {
          detail: {
            name: "external_link_click",
            metadata: { destination: destination.hostname.slice(0, 255) },
          } satisfies AnalyticsEventDetail,
        })
      );
      return;
    }

    this.onTrackEvent(
      new CustomEvent(ANALYTICS_TRACK_EVENT, {
        detail: {
          name:
            this.currentPath === "/search" &&
            destination.pathname.startsWith("/game/")
              ? "search_result_click"
              : "click",
          metadata: {
            destination: destination.pathname.slice(0, 255),
            ...(this.currentPath === "/search"
              ? {
                  query:
                    new URLSearchParams(window.location.search)
                      .get("s")
                      ?.slice(0, 120) ?? "",
                }
              : {}),
          },
        } satisfies AnalyticsEventDetail,
      })
    );
  };

  private readInitialPerformance(): PerformanceMetrics {
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming | undefined;
    const fcp = performance.getEntriesByName("first-contentful-paint")[0];
    return {
      loadTimeMs: navigation
        ? Math.max(0, Math.round(navigation.loadEventEnd - navigation.startTime))
        : undefined,
      domContentLoadedMs: navigation
        ? Math.max(
            0,
            Math.round(
              navigation.domContentLoadedEventEnd - navigation.startTime
            )
          )
        : undefined,
      firstContentfulMs: fcp ? Math.round(fcp.startTime) : undefined,
    };
  }

  private startPerformanceObservers() {
    if (!("PerformanceObserver" in window)) return;

    const observe = (
      type: string,
      callback: (entry: PerformanceEntry) => void
    ) => {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach(callback);
        });
        observer.observe({ type, buffered: true });
        this.observers.push(observer);
      } catch {
        // Unsupported metrics remain unavailable.
      }
    };

    observe("largest-contentful-paint", (entry) => {
      if (this.view) this.view.performance.largestContentfulMs = Math.round(entry.startTime);
    });
    observe("layout-shift", (entry) => {
      const shift = entry as PerformanceEntry & {
        value?: number;
        hadRecentInput?: boolean;
      };
      if (this.view && !shift.hadRecentInput && shift.value) {
        this.view.performance.cumulativeLayoutShift =
          (this.view.performance.cumulativeLayoutShift ?? 0) + shift.value;
      }
    });
    observe("event", (entry) => {
      const timing = entry as PerformanceEntry & {
        duration: number;
        interactionId?: number;
      };
      if (!this.view || !timing.interactionId) return;
      this.view.performance.interactionNextPaintMs = Math.max(
        this.view.performance.interactionNextPaintMs ?? 0,
        Math.round(timing.duration)
      );
    });
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const runtime = useRef<AnalyticsRuntime | null>(null);
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsent(readConsent());
    setReady(true);
  }, []);

  useEffect(() => {
    function onConsentChange(event: Event) {
      const next = (event as CustomEvent<Consent>).detail;
      if (next === null || next === "accepted" || next === "declined") {
        setConsent(next);
      }
    }
    window.addEventListener(ANALYTICS_CONSENT_EVENT, onConsentChange);
    return () =>
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, onConsentChange);
  }, []);

  useEffect(() => {
    if (consent !== "accepted") {
      runtime.current?.destroy();
      runtime.current = null;
      return;
    }
    runtime.current ??= new AnalyticsRuntime();
    runtime.current.page(pathname);
  }, [consent, pathname]);

  useEffect(
    () => () => {
      runtime.current?.destroy();
      runtime.current = null;
    },
    []
  );

  function chooseConsent(next: Exclude<Consent, null>) {
    try {
      window.localStorage.setItem(ANALYTICS_CONSENT_KEY, next);
      if (next === "declined") {
        window.localStorage.removeItem(ANALYTICS_VISITOR_KEY);
        window.sessionStorage.removeItem(ANALYTICS_SESSION_KEY);
      }
    } catch {
      // Keep the in-memory choice for this page.
    }
    setConsent(next);
    window.dispatchEvent(
      new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: next })
    );
  }

  if (!ready || consent !== null) return null;

  return (
    <aside
      className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-3xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-2xl sm:flex sm:items-center sm:gap-5"
      aria-label="Analytics consent"
    >
      <p className="flex-1 text-sm leading-6 text-[var(--color-muted)]">
        ZenFun Games uses pseudonymous first-party analytics and, when
        configured, Google Analytics to improve games and site performance.
        This can include a random browser ID and site search terms, but not full
        IP addresses or account details.{" "}
        <Link href="/cookie-statement" className="text-white underline">
          Learn more
        </Link>
      </p>
      <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => chooseConsent("declined")}
        >
          Decline
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={() => chooseConsent("accepted")}
        >
          Allow analytics
        </button>
      </div>
    </aside>
  );
}

export function isRecentlyActive(lastSeenAt: number): boolean {
  return Date.now() - lastSeenAt <= ANALYTICS_ACTIVE_TIMEOUT_MS;
}
