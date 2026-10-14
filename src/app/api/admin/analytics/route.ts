import { NextRequest, NextResponse } from "next/server";
import { adminApiAuth } from "@/lib/admin/api-auth";
import { PERMISSIONS } from "@/lib/rbac";
import {
  getAnalyticsDashboard,
  getRealtimeAnalytics,
} from "@/lib/analytics/dashboard";
import { resolveAnalyticsRange } from "@/lib/analytics/range";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await adminApiAuth(PERMISSIONS.ANALYTICS_VIEW);
  if (auth.error) return auth.error;

  if (request.nextUrl.searchParams.get("section") === "realtime") {
    try {
      return NextResponse.json(await getRealtimeAnalytics());
    } catch (error) {
      console.error("Realtime analytics query failed", error);
      return NextResponse.json(
        { error: "Could not load real-time analytics" },
        { status: 500 }
      );
    }
  }

  let range;
  try {
    range = resolveAnalyticsRange({
      range: request.nextUrl.searchParams.get("range") ?? undefined,
      from: request.nextUrl.searchParams.get("from") ?? undefined,
      to: request.nextUrl.searchParams.get("to") ?? undefined,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid analytics date range" },
      { status: 400 }
    );
  }

  try {
    return NextResponse.json(await getAnalyticsDashboard(range));
  } catch (error) {
    console.error("Analytics dashboard query failed", error);
    return NextResponse.json(
      { error: "Could not load analytics" },
      { status: 500 }
    );
  }
}
