"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronUp } from "lucide-react";
import {
  CATEGORY_SORT_OPTIONS,
  type CategorySort,
  buildCategoryPageHref,
} from "@/lib/category-sort";
import { useLanguage } from "@/components/layout/language-provider";

type Props = {
  slug: string;
  sort: CategorySort;
};

export function CategorySortDropdown({ slug, sort }: Props) {
  const router = useRouter();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const sortLabels: Record<CategorySort, string> = {
    new: t("common.sortNew"),
    popular: t("common.sortTop"),
  };

  const currentLabel = sortLabels[sort] ?? t("common.sortTop");

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function selectOption(value: CategorySort) {
    setOpen(false);
    router.push(buildCategoryPageHref(slug, 1, value));
  }

  const alternateOptions = CATEGORY_SORT_OPTIONS.filter((option) => option.value !== sort);

  return (
    <div ref={rootRef} className="relative w-[168px]">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("common.sortGames")}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/35 bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:border-white/50"
      >
        <span className="truncate">{currentLabel}</span>
        <ChevronUp
          aria-hidden
          className={`size-4 shrink-0 text-white transition-transform ${open ? "" : "rotate-180"}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("common.sortOptions")}
          className="absolute right-0 top-[calc(100%+8px)] z-30 flex w-full flex-col gap-1.5"
        >
          {alternateOptions.map((option) => (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={false}
                  onClick={() => selectOption(option.value)}
                  className="flex w-full items-center rounded-2xl bg-[#161626] px-4 py-2.5 text-left text-sm font-medium text-white transition hover:bg-[#1e2038]"
                >
                  {sortLabels[option.value]}
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
