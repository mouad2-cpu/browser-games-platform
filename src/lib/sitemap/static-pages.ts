import { getMenuPageHref } from "@/lib/menu-page-routes";
import type { SitemapEntry, SitemapMenuPageRow } from "./types";

/**
 * Indexable static / marketing pages only.
 * Excludes search, admin, auth, personalized, and API surfaces.
 */
export const STATIC_SITEMAP_PATHS: ReadonlyArray<{
  path: string;
  changeFrequency: SitemapEntry["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.4 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.4 },
  { path: "/information-for-parents", changeFrequency: "monthly", priority: 0.3 },
  { path: "/terms-of-service", changeFrequency: "yearly", priority: 0.2 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/cookie-statement", changeFrequency: "yearly", priority: 0.2 },
  { path: "/dmca-notice", changeFrequency: "yearly", priority: 0.2 },
  { path: "/community-guidelines-policy", changeFrequency: "yearly", priority: 0.2 },
] as const;

export const SITEMAP_EXCLUDED_PATH_PREFIXES = [
  "/admin",
  "/api",
  "/login",
  "/register",
  "/dashboard",
  "/_next",
  "/search",
] as const;

export const SITEMAP_EXCLUDED_PATHS = [
  "/continue-playing",
  "/top-picks",
  "/search",
] as const;

/** Real public collection routes only (no invented SEO URLs). */
export const COLLECTION_SITEMAP_PATHS: ReadonlyArray<{
  path: string;
  changeFrequency: SitemapEntry["changeFrequency"];
  priority: number;
}> = [
  { path: "/new", changeFrequency: "daily", priority: 0.8 },
  { path: "/popular", changeFrequency: "daily", priority: 0.8 },
  { path: "/all-games", changeFrequency: "daily", priority: 0.7 },
] as const;

export function buildStaticSitemapEntries(
  menuPages: SitemapMenuPageRow[],
  options?: { now?: Date; homepageLastmod?: Date | string | null }
): SitemapEntry[] {
  const now = options?.now ?? new Date();
  const homepageLastmod = options?.homepageLastmod ?? now;

  const staticEntries: SitemapEntry[] = STATIC_SITEMAP_PATHS.map((page) => ({
    path: page.path,
    lastModified: page.path === "/" ? homepageLastmod : now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const reserved = new Set<string>([
    ...STATIC_SITEMAP_PATHS.map((p) => p.path),
    ...SITEMAP_EXCLUDED_PATHS,
    ...COLLECTION_SITEMAP_PATHS.map((p) => p.path),
  ]);

  const cmsEntries: SitemapEntry[] = [];
  for (const page of menuPages) {
    const href = getMenuPageHref(page.slug);
    if (reserved.has(href)) continue;
    if (SITEMAP_EXCLUDED_PATH_PREFIXES.some((prefix) => href.startsWith(prefix))) continue;

    cmsEntries.push({
      path: href,
      lastModified: page.updatedAt,
      changeFrequency: "monthly",
      priority: 0.4,
    });
    reserved.add(href);
  }

  return [...staticEntries, ...cmsEntries];
}
