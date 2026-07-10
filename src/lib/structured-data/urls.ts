import { SITE_URL } from "@/lib/site-config";

/** Strip trailing slash from the site origin. */
export function getSiteOrigin(): string {
  return SITE_URL.replace(/\/+$/, "");
}

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  const origin = getSiteOrigin();
  if (!path || path === "/") return origin;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

/** ISO-8601 date (YYYY-MM-DD) for Schema.org date fields. */
export function toIsoDate(value: string | Date | null | undefined): string | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
}

/** ISO-8601 datetime for Schema.org dateModified when time precision helps. */
export function toIsoDateTime(value: string | Date | null | undefined): string | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}
