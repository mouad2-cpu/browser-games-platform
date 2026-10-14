import { z } from "zod";

export const analyticsRangeQuerySchema = z.object({
  range: z
    .enum(["today", "yesterday", "7d", "30d", "90d", "custom"])
    .default("30d"),
  from: z.string().optional(),
  to: z.string().optional(),
});

export type AnalyticsRangePreset = z.infer<
  typeof analyticsRangeQuerySchema
>["range"];

export type AnalyticsDateRange = {
  preset: AnalyticsRangePreset;
  label: string;
  start: Date;
  end: Date;
  previousStart: Date;
  previousEnd: Date;
};

function startOfUtcDay(value: Date): Date {
  return new Date(
    Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate())
  );
}

function parseDate(value?: string): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== value
    ? null
    : parsed;
}

export function resolveAnalyticsRange(
  input: { range?: string; from?: string; to?: string },
  now = new Date()
): AnalyticsDateRange {
  const parsed = analyticsRangeQuerySchema.parse(input);
  const today = startOfUtcDay(now);
  let start: Date;
  let end = now;
  let label: string;

  switch (parsed.range) {
    case "today":
      start = today;
      label = "Today";
      break;
    case "yesterday":
      start = new Date(today.getTime() - 24 * 60 * 60_000);
      end = today;
      label = "Yesterday";
      break;
    case "7d":
      start = new Date(today.getTime() - 6 * 24 * 60 * 60_000);
      label = "Last 7 days";
      break;
    case "90d":
      start = new Date(today.getTime() - 89 * 24 * 60 * 60_000);
      label = "Last 90 days";
      break;
    case "custom": {
      const customStart = parseDate(parsed.from);
      const customEnd = parseDate(parsed.to);
      if (!customStart || !customEnd || customStart > customEnd) {
        throw new Error("A valid custom date range is required");
      }
      start = customStart;
      end = new Date(customEnd.getTime() + 24 * 60 * 60_000);
      if (end > now) end = now;
      if (end <= start || end.getTime() - start.getTime() > 366 * 24 * 60 * 60_000) {
        throw new Error("Custom ranges must be between 1 and 366 days");
      }
      label = `${parsed.from} to ${parsed.to}`;
      break;
    }
    case "30d":
    default:
      start = new Date(today.getTime() - 29 * 24 * 60 * 60_000);
      label = "Last 30 days";
      break;
  }

  const duration = end.getTime() - start.getTime();
  return {
    preset: parsed.range,
    label,
    start,
    end,
    previousStart: new Date(start.getTime() - duration),
    previousEnd: start,
  };
}
