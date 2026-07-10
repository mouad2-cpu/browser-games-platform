import type { CategorySort } from "./category-sort";

export function buildPaginatedHref(
  path: string,
  page: number,
  options?: { sort?: CategorySort }
): string {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (options?.sort && options.sort !== "popular") params.set("sort", options.sort);
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}
