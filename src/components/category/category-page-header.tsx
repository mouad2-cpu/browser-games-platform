"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/layout/language-provider";
import { CategorySortDropdown } from "./category-sort-dropdown";
import {
  type CategorySort,
} from "@/lib/category-sort";

type Props = {
  slug: string;
  name: string;
  title: string;
  description: string;
  sort: CategorySort;
};

export function CategoryPageHeader({ slug, name, title, description, sort }: Props) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  return (
    <header className="mb-6 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
      <div className="min-w-0 flex-1">
        <nav aria-label={t("common.breadcrumb")} className="mb-2 text-sm text-[var(--color-accent)]">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="transition hover:text-[var(--color-accent-hover)]">
                {t("common.gamesBreadcrumb")}
              </Link>
            </li>
            <li aria-hidden className="text-[var(--color-muted)]">
              »
            </li>
            <li className="text-[var(--color-muted)]">{name}</li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h1>

        <div className="mt-3 min-w-0">
          {!expanded ? (
            <div className="flex min-w-0 items-center gap-2">
              <p className="min-w-0 flex-1 truncate text-sm text-[var(--color-muted)] sm:text-[15px]">
                {description}
              </p>
              {description.length > 80 && (
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="shrink-0 text-sm font-medium text-[var(--color-accent)] transition hover:text-[var(--color-accent-hover)]"
                >
                  {t("common.showMore")}
                </button>
              )}
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-[var(--color-muted)] sm:text-[15px]">
              {description}{" "}
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="font-medium text-[var(--color-accent)] transition hover:text-[var(--color-accent-hover)]"
              >
                {t("common.showLess")}
              </button>
            </p>
          )}
        </div>
      </div>

      <div className="shrink-0 self-start sm:self-auto">
        <CategorySortDropdown slug={slug} sort={sort} />
      </div>
    </header>
  );
}
