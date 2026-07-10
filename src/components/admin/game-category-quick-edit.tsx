"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  addGameToCategoryAction,
  removeGameFromCategoryAction,
} from "@/app/actions/admin/games";
import { CategoryIcon } from "@/components/category/category-icon";

type Category = { id: number; name: string; slug: string; icon?: string | null };

type Props = {
  gameId: number;
  categories: Category[];
  categoryIds: number[];
  primaryCategoryId: number | null;
};

export function GameCategoryQuickEdit({
  gameId,
  categories,
  categoryIds: initialCategoryIds,
  primaryCategoryId,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(initialCategoryIds);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelected(initialCategoryIds);
  }, [gameId, initialCategoryIds.join(",")]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  async function toggleCategory(categoryId: number) {
    const isMember = selected.includes(categoryId);
    if (isMember && selected.length <= 1) {
      setError("A game must stay in at least one category.");
      return;
    }

    setError("");
    setBusyId(categoryId);

    const formData = new FormData();
    formData.set("gameId", String(gameId));
    formData.set("categoryId", String(categoryId));

    const result = isMember
      ? await removeGameFromCategoryAction(formData)
      : await addGameToCategoryAction(formData);

    setBusyId(null);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setSelected((prev) =>
      isMember ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
    router.refresh();
  }

  const memberCategories = categories.filter((c) => selected.includes(c.id));

  return (
    <div className="relative min-w-[160px]" ref={panelRef}>
      <div className="flex flex-wrap items-center gap-1.5">
        {memberCategories.length === 0 ? (
          <span className="text-xs text-[var(--color-muted)]">No categories</span>
        ) : (
          memberCategories.map((cat) => (
            <span
              key={cat.id}
              className={`inline-flex items-center gap-1 rounded-full pl-2 pr-1 py-0.5 text-xs ${
                primaryCategoryId === cat.id
                  ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
                  : "bg-[var(--color-surface)] text-[var(--color-muted)]"
              }`}
            >
              <Link href={`/admin/categories/${cat.id}`} className="hover:underline">
                {cat.name}
                {primaryCategoryId === cat.id ? " ★" : ""}
              </Link>
              {selected.length > 1 && (
                <button
                  type="button"
                  disabled={busyId === cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className="rounded px-1 text-[var(--color-muted)] hover:bg-red-500/20 hover:text-red-400 disabled:opacity-50"
                  title={`Remove from ${cat.name}`}
                  aria-label={`Remove from ${cat.name}`}
                >
                  ×
                </button>
              )}
            </span>
          ))
        )}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full border border-dashed border-[var(--color-border)] px-2 py-0.5 text-xs text-[var(--color-accent)] hover:border-[var(--color-accent)]"
        >
          {open ? "Close" : "+ Category"}
        </button>
      </div>

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}

      {open && (
        <div className="absolute left-0 top-full z-20 mt-2 w-64 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-3 shadow-xl">
          <p className="mb-2 text-xs font-medium text-[var(--color-muted)]">
            Click to add or remove
          </p>
          <div className="flex max-h-48 flex-col gap-1 overflow-y-auto">
            {categories.map((cat) => {
              const active = selected.includes(cat.id);
              const loading = busyId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  disabled={loading || (active && selected.length <= 1)}
                  onClick={() => toggleCategory(cat.id)}
                  className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition disabled:opacity-50 ${
                    active
                      ? "bg-[var(--color-accent)]/15 text-[var(--color-text)]"
                      : "hover:bg-[var(--color-surface)] text-[var(--color-muted)]"
                  }`}
                >
                  <CategoryIcon icon={cat.icon ?? null} name={cat.name} size="sm" />
                  <span className="flex-1">{cat.name}</span>
                  <span className="text-xs">{loading ? "…" : active ? "✓" : "+"}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
