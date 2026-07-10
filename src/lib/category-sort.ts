import type { Prisma } from "@prisma/client";
import { buildPaginatedHref } from "./pagination-href";

export const CATEGORY_SORT_VALUES = ["new", "popular"] as const;
export type CategorySort = (typeof CATEGORY_SORT_VALUES)[number];

export const CATEGORY_SORT_OPTIONS: { value: CategorySort; label: string }[] = [
  { value: "new", label: "New games" },
  { value: "popular", label: "Top games" },
];

export function parseCategorySort(value: string | undefined): CategorySort {
  if (value && CATEGORY_SORT_VALUES.includes(value as CategorySort)) {
    return value as CategorySort;
  }
  return "popular";
}

export function categoryGamesOrderBy(sort: CategorySort): Prisma.GameOrderByWithRelationInput {
  switch (sort) {
    case "popular":
      return { playEvents: { _count: "desc" } };
    case "new":
    default:
      return { createdAt: "desc" };
  }
}

export function buildCategoryPageHref(
  slug: string,
  page: number,
  sort: CategorySort
): string {
  return buildPaginatedHref(`/c/${slug}`, page, { sort });
}
