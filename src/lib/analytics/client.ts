"use client";

import {
  ANALYTICS_CONSENT_KEY,
  ANALYTICS_TRACK_EVENT,
  type AnalyticsEventName,
} from "@/lib/analytics/constants";

export type AnalyticsEventDetail = {
  name: AnalyticsEventName;
  gameId?: number;
  gameSlug?: string;
  durationMs?: number;
  metadata?: Record<string, string | number | boolean | null>;
};

declare global {
  interface Window {
    __zenfunAnalyticsReady?: boolean;
    __zenfunAnalyticsQueue?: AnalyticsEventDetail[];
  }
}

export function trackAnalyticsEvent(detail: AnalyticsEventDetail): void {
  if (typeof window === "undefined") return;
  try {
    if (window.localStorage.getItem(ANALYTICS_CONSENT_KEY) !== "accepted") {
      return;
    }
  } catch {
    return;
  }
  if (!window.__zenfunAnalyticsReady) {
    window.__zenfunAnalyticsQueue ??= [];
    window.__zenfunAnalyticsQueue.push(detail);
    return;
  }
  window.dispatchEvent(new CustomEvent(ANALYTICS_TRACK_EVENT, { detail }));
}
