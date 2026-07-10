"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp } from "lucide-react";
import { useLanguage } from "@/components/layout/language-provider";

export function HomePageFooterActions() {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  async function handleRandomGame() {
    setLoading(true);
    try {
      const res = await fetch("/api/games/random");
      const data = await res.json();
      if (data.slug) {
        router.push(`/game/${data.slug}`);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleBackToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-3 px-2 pb-6 pt-2 sm:px-3">
      <button
        type="button"
        onClick={handleRandomGame}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-[#111] disabled:opacity-60"
      >
        <span aria-hidden className="text-base leading-none">
          🎲
        </span>
        {loading ? t("common.loading") : t("common.randomGame")}
      </button>

      <button
        type="button"
        onClick={handleBackToTop}
        className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
      >
        <ArrowUp className="h-4 w-4" aria-hidden />
        {t("common.backToTop")}
      </button>
    </div>
  );
}
