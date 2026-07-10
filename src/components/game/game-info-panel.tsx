"use client";

import Link from "next/link";
import { useLanguage } from "@/components/layout/language-provider";

type Category = { slug: string; name: string };

type Props = {
  likes: number;
  dislikes: number;
  playCount: number;
  releasedAt: string | Date | null;
  showPlayCount?: boolean;
  developerName?: string | null;
  categories?: Category[];
};

function formatDate(date: string | Date, locale: string) {
  return new Date(date).toLocaleDateString(locale, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatPlayCount(count: number) {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toLocaleString();
}

function displayRating(likes: number, dislikes: number): string {
  const total = likes + dislikes;
  if (total === 0) return "—";
  return ((likes / total) * 10).toFixed(1);
}

export function GameInfoPanel({
  likes,
  dislikes,
  playCount,
  releasedAt,
  showPlayCount = false,
  developerName,
  categories = [],
}: Props) {
  const { t, locale } = useLanguage();

  const items: { label: string; value: string }[] = [];

  if (developerName?.trim()) {
    items.push({ label: t("game.developer"), value: developerName.trim() });
  }

  items.push({ label: t("game.rating"), value: displayRating(likes, dislikes) });

  if (showPlayCount) {
    items.push({ label: t("game.plays"), value: formatPlayCount(playCount) });
  }

  items.push(
    {
      label: t("game.released"),
      value: releasedAt ? formatDate(releasedAt, locale) : "—",
    },
    { label: t("game.platforms"), value: t("game.platformWeb") }
  );

  const columnCount = items.length + (categories.length > 0 ? 1 : 0);
  const gridClass =
    columnCount >= 4
      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
      : "grid-cols-2 sm:grid-cols-3";

  return (
    <div className={`mb-6 grid gap-x-6 gap-y-3 rounded-2xl bg-[var(--color-surface)] p-4 ${gridClass}`}>
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-xs text-[var(--color-muted)]">{item.label}</dt>
          <dd className="mt-0.5 text-sm font-medium text-[var(--color-text)]">{item.value}</dd>
        </div>
      ))}

      {categories.length > 0 && (
        <div>
          <dt className="text-xs text-[var(--color-muted)]">{t("game.tags")}</dt>
          <dd className="mt-1 flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/c/${cat.slug}`}
                className="rounded-full bg-[var(--color-bg)] px-2.5 py-1 text-xs font-medium text-[var(--color-muted)] transition hover:text-[var(--color-accent)]"
              >
                {cat.name}
              </Link>
            ))}
          </dd>
        </div>
      )}
    </div>
  );
}
