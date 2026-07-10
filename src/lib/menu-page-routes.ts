/** Maps menu page slugs to their public routes (when not using /pages/[slug]). */
const MENU_SLUG_ROUTES: Record<string, string> = {
  contact: "/contact",
  about: "/about",
  terms: "/terms-of-service",
  "terms-of-service": "/terms-of-service",
  privacy: "/privacy-policy",
  "privacy-policy": "/privacy-policy",
  cookies: "/cookie-statement",
  "cookie-statement": "/cookie-statement",
  "information-for-parents": "/information-for-parents",
  "dmca-notice": "/dmca-notice",
  "community-guidelines-policy": "/community-guidelines-policy",
  "all-games": "/all-games",
};

export function getMenuPageHref(slug: string): string {
  return MENU_SLUG_ROUTES[slug] ?? `/pages/${slug}`;
}

export function isMenuPageLinkActive(pathname: string, slug: string): boolean {
  const href = getMenuPageHref(slug);
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}?`);
}

const SIDEBAR_HIDDEN_PATHS = [
  "/about",
  "/contact",
  "/information-for-parents",
  "/terms-of-service",
  "/privacy-policy",
  "/cookie-statement",
  "/dmca-notice",
  "/community-guidelines-policy",
] as const;

export function isSidebarHiddenPath(pathname: string): boolean {
  if (pathname.startsWith("/pages/")) return true;
  return SIDEBAR_HIDDEN_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export const DEFAULT_SIDEBAR_PAGE_SLUGS = [
  "about",
  "information-for-parents",
  "terms-of-service",
  "privacy-policy",
  "cookie-statement",
  "dmca-notice",
  "community-guidelines-policy",
] as const;

const SLUG_ALIASES: Record<string, string> = {
  terms: "terms-of-service",
  privacy: "privacy-policy",
  cookies: "cookie-statement",
};

export function normalizeMenuPageSlug(slug: string): string {
  return SLUG_ALIASES[slug] ?? slug;
}
