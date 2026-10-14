export const ANALYTICS_CONSENT_KEY = "zenfun-analytics-consent";
export const ANALYTICS_VISITOR_KEY = "zenfun-analytics-visitor";
export const ANALYTICS_SESSION_KEY = "zenfun-analytics-session";

export const ANALYTICS_HEARTBEAT_MS = 45_000;
export const ANALYTICS_ACTIVE_TIMEOUT_MS = 2 * 60_000;
export const ANALYTICS_SESSION_TIMEOUT_MS = 30 * 60_000;
export const ANALYTICS_ENGAGED_MS = 10_000;

export const ANALYTICS_EVENT_NAMES = [
  "session_start",
  "session_end",
  "game_view",
  "game_start",
  "game_exit",
  "game_session_start",
  "game_session_end",
  "click",
  "external_link_click",
  "search",
  "search_result_click",
  "share",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];

export const ANALYTICS_CONSENT_EVENT = "zenfun:analytics-consent";
export const ANALYTICS_TRACK_EVENT = "zenfun:analytics-track";
