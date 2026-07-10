import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required").max(50),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const reportSchema = z.object({
  gameId: z.coerce.number().int().positive(),
  issueType: z.enum(["Won't load", "Broken graphics", "Lost progress", "Other"]),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().min(10, "Please provide at least 10 characters").max(2000),
});

export const contactSchema = z.object({
  issueType: z.enum(
    ["General inquiry", "Bug report", "Game suggestion", "Partnership", "Other"],
    { errorMap: () => ({ message: "Please select a topic" }) }
  ),
  name: z.string().min(1, "Name is required").max(256),
  email: z.string().email("Invalid email address").max(256),
  subject: z.string().max(256).optional().or(z.literal("")),
  message: z.string().min(10, "Please provide at least 10 characters").max(2000),
});

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(256),
  slug: z
    .string()
    .min(1)
    .max(128)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  sortOrder: z.coerce.number().int().min(0).default(0),
  icon: z.string().max(512).optional().nullable(),
  description: z.string().max(10000).optional().nullable(),
});

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;

export const gameFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(256),
  slug: z
    .string()
    .min(1)
    .max(128)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  description: z.string().max(5000).optional(),
  metaTitle: z.string().max(256).optional(),
  metaDescription: z.string().max(512).optional(),
  thumbnail: z.string().max(512).optional().or(z.literal("")),
  previewVideo: z.string().max(512).optional().nullable(),
  embedPath: z
    .string()
    .min(1, "Embed path is required")
    .max(512)
    .transform(parseEmbedUrl)
    .refine(isValidEmbedUrl, "Use an https URL, local path, or paste an iframe embed code"),
  categoryIds: z.array(z.coerce.number().int()).min(1, "Select at least one category"),
  primaryCategoryId: z.coerce.number().int().optional(),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
export type GameFormInput = z.infer<typeof gameFormSchema>;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Accept a plain URL or pasted `<iframe src="...">` and return the iframe src. */
export function parseEmbedUrl(input: string): string {
  let trimmed = input.trim();
  if (!trimmed) return trimmed;

  // Decode entities / escaped quotes from copied embed code
  trimmed = trimmed
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\\"/g, '"');

  if (/<(?:iframe|embed)/i.test(trimmed)) {
    // src="..." or src='...'
    const quoted = trimmed.match(/\bsrc\s*=\s*["']([^"']+)["']/i);
    if (quoted) return normalizeEmbedSrc(quoted[1]);

    // src=https://... (no quotes)
    const unquoted = trimmed.match(/\bsrc\s*=\s*([^\s>]+)/i);
    if (unquoted) return normalizeEmbedSrc(unquoted[1]);
  }

  // Plain URL (first line if multiline paste)
  const firstLine = trimmed.split(/\r?\n/).find((l) => l.trim()) ?? trimmed;
  return normalizeEmbedSrc(firstLine.trim());
}

function normalizeEmbedSrc(url: string): string {
  let u = url.trim().replace(/^["']|["']$/g, "");
  if (u.startsWith("//")) u = `https:${u}`;

  // Game page → embed URL (CrazyGames-style)
  u = u.replace(
    /^https?:\/\/(www\.)?crazygames\.com\/game\//i,
    "https://www.crazygames.com/embed/"
  );

  return u;
}

export function isValidEmbedUrl(url: string): boolean {
  const parsed = parseEmbedUrl(url);
  if (!parsed) return false;
  if (parsed.startsWith("/")) return parsed.length > 1;
  if (parsed.startsWith("http://") || parsed.startsWith("https://")) {
    try {
      new URL(parsed);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
