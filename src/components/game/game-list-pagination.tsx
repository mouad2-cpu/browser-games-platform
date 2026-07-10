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

export function GameListPagination({ page, totalPages, path, sort }: Props) {
  const { t } = useLanguage();
  const hrefOptions = sort ? { sort } : undefined;

  if (totalPages <= 1) return null;

  return (
    <nav className="mt-8 flex items-center justify-center gap-4">
      {page > 1 && (
        <Link
          href={buildPaginatedHref(path, page - 1, hrefOptions)}
          className="rounded-lg bg-[var(--color-surface)] px-4 py-2 text-sm transition hover:bg-[var(--color-surface-hover)]"
        >
          {t("common.previous")}
        </Link>
      )}
      <span className="text-sm text-[var(--color-muted)]">
        {t("common.pageOf", { page, total: totalPages })}
      </span>
      {page < totalPages && (
        <Link
          href={buildPaginatedHref(path, page + 1, hrefOptions)}
          className="rounded-lg bg-[var(--color-surface)] px-4 py-2 text-sm transition hover:bg-[var(--color-surface-hover)]"
        >
          {t("common.next")}
        </Link>
      )}
    </nav>
  );
}
