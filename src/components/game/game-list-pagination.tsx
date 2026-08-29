"use client";

import Link from "next/link";
import { useLanguage } from "@/components/layout/language-provider";
import type { CategorySort } from "@/lib/category-sort";
import { buildPaginatedHref } from "@/lib/pagination-href";

type Props = {
  page: number;
  totalPages: number;
  path: string;
  sort?: CategorySort;
};

function getPaginationItems(page: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 9) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const visiblePages = new Set([1, totalPages]);
  for (let candidate = page - 2; candidate <= page + 2; candidate += 1) {
    if (candidate > 1 && candidate < totalPages) visiblePages.add(candidate);
  }

  const sortedPages = [...visiblePages].sort((a, b) => a - b);
  const items: Array<number | "ellipsis"> = [];
  for (const candidate of sortedPages) {
    const previous = items.at(-1);
    if (typeof previous === "number" && candidate - previous > 1) {
      items.push("ellipsis");
    }
    items.push(candidate);
  }
  return items;
}

export function GameListPagination({ page, totalPages, path, sort }: Props) {
  const { t } = useLanguage();
  const hrefOptions = sort ? { sort } : undefined;
  const paginationItems = getPaginationItems(page, totalPages);

  if (totalPages <= 1) return null;

  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link
          href={buildPaginatedHref(path, page - 1, hrefOptions)}
          className="rounded-lg bg-[var(--color-surface)] px-4 py-2 text-sm transition hover:bg-[var(--color-surface-hover)]"
        >
          {t("common.previous")}
        </Link>
      )}
      <ol className="flex flex-wrap items-center justify-center gap-1">
        {paginationItems.map((item, index) => (
          <li key={item === "ellipsis" ? `ellipsis-${index}` : item}>
            {item === "ellipsis" ? (
              <span className="px-1.5 text-sm text-[var(--color-muted)]" aria-hidden>
                …
              </span>
            ) : item === page ? (
              <span
                aria-current="page"
                className="flex size-9 items-center justify-center rounded-lg bg-[var(--color-accent)] text-sm font-semibold text-white"
              >
                {item}
              </span>
            ) : (
              <Link
                href={buildPaginatedHref(path, item, hrefOptions)}
                className="flex size-9 items-center justify-center rounded-lg bg-[var(--color-surface)] text-sm transition hover:bg-[var(--color-surface-hover)]"
              >
                {item}
              </Link>
            )}
          </li>
        ))}
      </ol>
      {page < totalPages && (
        <Link
          href={buildPaginatedHref(path, page + 1, hrefOptions)}
          className="rounded-lg bg-[var(--color-surface)] px-4 py-2 text-sm transition hover:bg-[var(--color-surface-hover)]"
        >
          {t("common.next")}
        </Link>
      )}
      <span className="sr-only">{t("common.pageOf", { page, total: totalPages })}</span>
    </nav>
  );
}
