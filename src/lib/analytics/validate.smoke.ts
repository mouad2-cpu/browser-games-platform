import assert from "node:assert/strict";
import { analyticsCollectSchema } from "@/lib/analytics/schemas";
import { resolveAnalyticsRange } from "@/lib/analytics/range";
import { hasPermission, PERMISSIONS } from "@/lib/rbac";

const now = new Date("2026-10-14T18:00:00.000Z");
const week = resolveAnalyticsRange({ range: "7d" }, now);
assert.equal(week.start.toISOString(), "2026-10-08T00:00:00.000Z");
assert.equal(week.end.toISOString(), now.toISOString());
assert.throws(() =>
  resolveAnalyticsRange({
    range: "custom",
    from: "2026-10-20",
    to: "2026-10-10",
  })
);

const payload = {
  action: "page_view",
  visitorId: "11111111-1111-4111-8111-111111111111",
  sessionId: "22222222-2222-4222-8222-222222222222",
  pageViewId: "33333333-3333-4333-8333-333333333333",
  path: "/game/test",
  events: [],
};
assert.equal(analyticsCollectSchema.safeParse(payload).success, true);
assert.equal(
  analyticsCollectSchema.safeParse({
    ...payload,
    path: "https://invalid.example",
  }).success,
  false
);

assert.equal(hasPermission("ANALYST", PERMISSIONS.ANALYTICS_VIEW), true);
assert.equal(hasPermission("MODERATOR", PERMISSIONS.ANALYTICS_VIEW), false);

console.log("analytics smoke checks passed");
