import { getMenuPageHref } from "@/lib/menu-page-routes";
import type { SitemapEntry, SitemapMenuPageRow } from "./types";

/**
 * Hard-coded public marketing / utility pages.
 * Excludes admin, auth, API, personalized, and error routes.
 */
export const STATIC_SITEMAP_PATHS: ReadonlyArray<{
  path: string;
  changeFrequency: SitemapEntry["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/search", changeFrequency: "weekly", priority: 0.5 },
  { path: "/about", changeFrequency: "monthly", priority: 0.4 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.4 },
  { path: "/information-for-parents", changeFrequency: "monthly", priority: 0.3 },
  { path: "/terms-of-service", changeFrequency: "yearly", priority: 0.2 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/cookie-statement", changeFrequency: "yearly", priority: 0.2 },
  { path: "/dmca-notice", changeFrequency: "yearly", priority: 0.2 },
  { path: "/community-guidelines-policy", changeFrequency: "yearly", priority: 0.2 },
] as const;

/** Paths that must never appear in any sitemap. */
export const SITEMAP_EXCLUDED_PATH_PREFIXES = [
  "/admin",
  "/api",
  "/login",
  "/register",
  "/dashboard",
  "/_next",
] as const;

/**
 * Personalized / non-canonical list pages — keep out of the sitemap
 * to avoid thin or user-specific URLs.
 */
export const SITEMAP_EXCLUDED_PATHS = [
  "/continue-playing",
  "/top-picks",
] as const;

export function buildStaticSitemapEntries(
  menuPages: SitemapMenuPageRow[],
  now = new Date()
): SitemapEntry[] {
  const staticEntries: SitemapEntry[] = STATIC_SITEMAP_PATHS.map((page) => ({
    path: page.path,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const reserved = new Set(STATIC_SITEMAP_PATHS.map((p) => p.path));
  for (const excluded of SITEMAP_EXCLUDED_PATHS) reserved.add(excluded);

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
