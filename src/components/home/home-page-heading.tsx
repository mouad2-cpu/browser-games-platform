"use client";

import { useLanguage } from "@/components/layout/language-provider";

/** Page H1 — must appear before any section H2s for SEO heading order. */
export function HomePageHeading() {
  const { t } = useLanguage();

  return (
    <header className="w-full px-2 pt-3 pb-1 sm:px-3">
      <h1 className="text-[28px] font-bold leading-tight tracking-tight sm:text-[32px]">
        {t("home.heading")}
      </h1>
    </header>
  );
}
