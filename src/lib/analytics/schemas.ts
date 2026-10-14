import { z } from "zod";
import { ANALYTICS_EVENT_NAMES } from "@/lib/analytics/constants";

const idSchema = z.string().uuid();
const pathSchema = z
  .string()
  .trim()
  .min(1)
  .max(768)
  .refine((value) => value.startsWith("/"), "Path must be site-relative");
const optionalText = (max: number) => z.string().trim().max(max).optional();
const durationSchema = z.number().int().min(0).max(86_400_000);

const metadataValueSchema = z.union([
  z.string().max(255),
  z.number().finite(),
  z.boolean(),
  z.null(),
]);

const metadataSchema = z
  .record(z.string().max(64), metadataValueSchema)
  .refine((value) => Object.keys(value).length <= 12, "Too many metadata fields");

export const analyticsEventSchema = z.object({
  id: idSchema,
  name: z.enum(ANALYTICS_EVENT_NAMES),
  gameId: z.number().int().positive().optional(),
  gameSlug: optionalText(128),
  durationMs: durationSchema.optional(),
  metadata: metadataSchema.optional(),
});

const performanceSchema = z
  .object({
    loadTimeMs: durationSchema.optional(),
    domContentLoadedMs: durationSchema.optional(),
    firstContentfulMs: durationSchema.optional(),
    largestContentfulMs: durationSchema.optional(),
    cumulativeLayoutShift: z.number().finite().min(0).max(100).optional(),
    interactionNextPaintMs: durationSchema.optional(),
  })
  .optional();

export const analyticsCollectSchema = z
  .object({
    action: z.enum([
      "page_view",
      "heartbeat",
      "page_leave",
      "events",
      "session_end",
    ]),
    visitorId: idSchema,
    sessionId: idSchema,
    pageViewId: idSchema,
    previousPageViewId: idSchema.optional(),
    path: pathSchema,
    title: optionalText(512),
    referrer: optionalText(768),
    previousPath: pathSchema.optional(),
    gameId: z.number().int().positive().optional(),
    gameSlug: optionalText(128),
    sessionActiveMs: durationSchema.default(0),
    pageActiveMs: durationSchema.default(0),
    screenWidth: z.number().int().min(1).max(10_000).optional(),
    screenHeight: z.number().int().min(1).max(10_000).optional(),
    utm: z
      .object({
        source: optionalText(128),
        medium: optionalText(128),
        campaign: optionalText(255),
        term: optionalText(255),
        content: optionalText(255),
      })
      .optional(),
    performance: performanceSchema,
    events: z.array(analyticsEventSchema).max(20).default([]),
  })
  .strict();

export type AnalyticsCollectInput = z.infer<typeof analyticsCollectSchema>;
