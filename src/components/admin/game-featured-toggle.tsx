"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toggleGameFeaturedAction } from "@/app/actions/admin/games";

type Props = {
  gameId?: number;
  featured: boolean;
  onChange?: (featured: boolean) => void;
  compact?: boolean;
};

export function GameFeaturedToggle({
  gameId,
  featured: initialFeatured,
  onChange,
  compact = false,
}: Props) {
  const router = useRouter();
  const [featured, setFeatured] = useState(initialFeatured);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFeatured(initialFeatured);
  }, [gameId, initialFeatured]);

  async function handleToggle() {
    const notify = (next: boolean) => {
      if (typeof onChange === "function") onChange(next);
    };

    const next = !featured;

    if (!gameId) {
      setFeatured(next);
      notify(next);
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.set("gameId", String(gameId));

    const result = await toggleGameFeaturedAction(formData);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    const saved = result?.featured ?? next;
    setFeatured(saved);
    notify(saved);
    router.refresh();
  }

  const buttonClass = compact
    ? `rounded-full px-3 py-1 text-xs font-semibold transition disabled:opacity-50 ${
        featured
          ? "bg-[#f5c518] text-black hover:bg-[#e0b310]"
          : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:border-[var(--color-accent)]"
      }`
    : `w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 sm:w-auto ${
        featured
          ? "bg-[#f5c518] text-black hover:bg-[#e0b310]"
          : "border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] hover:border-[var(--color-accent)]"
      }`;

  const label = loading
    ? "Saving…"
    : featured
      ? compact
        ? "Featured ★"
        : "Featured ★ — Remove"
      : compact
        ? "Feature"
        : "Mark as featured";

  return (
    <div className={compact ? "" : "w-full"}>
      <button type="button" onClick={handleToggle} disabled={loading} className={buttonClass}>
        {label}
      </button>
      {error && <p className={`mt-1 text-red-400 ${compact ? "text-xs" : "text-sm"}`}>{error}</p>}
    </div>
  );
}
