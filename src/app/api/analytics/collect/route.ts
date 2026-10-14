import { NextRequest, NextResponse } from "next/server";
import {
  AnalyticsIdentityError,
  collectAnalytics,
} from "@/lib/analytics/collect";
import { analyticsCollectSchema } from "@/lib/analytics/schemas";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
const MAX_BODY_BYTES = 32_768;

function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const expectedHost =
      request.headers.get("x-forwarded-host") ?? request.nextUrl.host;
    return new URL(origin).host === expectedHost;
  } catch {
    return false;
  }
}

async function readJsonBody(request: NextRequest): Promise<unknown> {
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    throw new Error("UNSUPPORTED_MEDIA_TYPE");
  }
  if (!request.body) throw new Error("INVALID_JSON");

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new Error("PAYLOAD_TOO_LARGE");
    }
    text += decoder.decode(value, { stream: true });
  }
  text += decoder.decode();
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error("INVALID_JSON");
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const ip = getClientIp(request);
  const ipLimit = rateLimit(`analytics:ip:${ip}`, 300, 5 * 60_000);
  if (!ipLimit.allowed) {
    return NextResponse.json(
      { error: "Too many analytics requests" },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.max(1, Math.ceil((ipLimit.retryAfterMs ?? 1_000) / 1_000))
          ),
        },
      }
    );
  }

  let json: unknown;
  try {
    json = await readJsonBody(request);
  } catch (error) {
    const code = error instanceof Error ? error.message : "INVALID_JSON";
    if (code === "PAYLOAD_TOO_LARGE") {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }
    if (code === "UNSUPPORTED_MEDIA_TYPE") {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 415 }
      );
    }
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = analyticsCollectSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid analytics payload" },
      { status: 400 }
    );
  }

  const visitorLimit = rateLimit(
    `analytics:visitor:${parsed.data.visitorId}`,
    180,
    5 * 60_000
  );
  if (!visitorLimit.allowed) {
    return NextResponse.json(
      { error: "Too many analytics requests" },
      { status: 429 }
    );
  }

  try {
    const siteHostname = (
      request.headers.get("x-forwarded-host") ?? request.nextUrl.host
    )
      .split(":")[0]
      .toLowerCase();
    await collectAnalytics(parsed.data, request.headers, siteHostname);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof AnalyticsIdentityError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("Analytics collection failed", error);
    return NextResponse.json(
      { error: "Analytics collection failed" },
      { status: 500 }
    );
  }
}
