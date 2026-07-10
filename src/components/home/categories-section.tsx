"use client";

import Link from "next/link";
import type { HomeCategory, HomeCategorySize } from "@/lib/categories";
import { CategoryIcon } from "@/components/category/category-icon";
import { useLanguage } from "@/components/layout/language-provider";
import { HomeSectionTitle } from "./home-section-title";

type Props = {
  categories: HomeCategory[];
};

const sizeStyles: Record<
  HomeCategorySize,
  { tile: string; icon: "sm" | "md" | "lg"; label: string }
> = {
  sm: {
    tile: "col-span-1 aspect-[4/3] rounded-xl px-2 py-3",
    icon: "sm",
    label: "text-xs",
  },
  md: {
    tile: "col-span-1 aspect-[5/4] rounded-2xl px-3 py-5",
    icon: "md",
    label: "text-sm",
  },
  lg: {
    tile: "col-span-2 row-span-2 aspect-auto min-h-[160px] rounded-2xl px-4 py-6 sm:min-h-[180px]",
    icon: "lg",
    label: "text-base",
  },
};

export function CategoriesSection({ categories }: Props) {
  const { t } = useLanguage();
  if (categories.length === 0) return null;

  return (
    <section className="w-full px-0 pt-2 pb-0">
      <HomeSectionTitle className="mb-1.5 px-2 sm:px-3">{t("home.categories")}</HomeSectionTitle>
      <div className="grid grid-cols-2 auto-rows-fr gap-2 px-2 sm:grid-cols-3 sm:gap-3 sm:px-3 md:grid-cols-4 lg:grid-cols-6">
        {categories.map((cat) => {
          const styles = sizeStyles[cat.homeSize] ?? sizeStyles.md;
          return (
            <Link
              key={cat.slug}
              href={`/c/${cat.slug}`}
              className={`group flex flex-col items-center justify-between bg-[#1a2030] text-center transition hover:scale-[1.02] hover:bg-[#222838] ${styles.tile}`}
            >
              <span className="flex flex-1 items-center justify-center">
                <CategoryIcon
                  icon={cat.icon}
                  name={cat.displayName}
                  slug={cat.slug}
                  size={styles.icon}
                  className="transition group-hover:scale-110"
                />
              </span>
              <span className={`mt-2 font-semibold text-white ${styles.label}`}>
                {cat.displayName}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
