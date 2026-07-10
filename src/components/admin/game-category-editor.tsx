"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateGameCategories } from "@/app/actions/admin/games";
import { CategoryIcon } from "@/components/category/category-icon";

type Category = { id: number; name: string; slug: string; icon?: string | null };

type Props = {
  gameId: number;
  categories: Category[];
  categoryIds: number[];
  primaryCategoryId: number | null;
};

export function GameCategoryEditor({
  gameId,
  categories,
  categoryIds: initialCategoryIds,
  primaryCategoryId: initialPrimaryId,
}: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<number[]>(initialCategoryIds);
  const [primaryId, setPrimaryId] = useState<number | "">(
    initialPrimaryId ?? initialCategoryIds[0] ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setSelected(initialCategoryIds);
    setPrimaryId(initialPrimaryId ?? initialCategoryIds[0] ?? "");
  }, [gameId, initialCategoryIds.join(","), initialPrimaryId]);

  const dirty =
    JSON.stringify([...selected].sort()) !== JSON.stringify([...initialCategoryIds].sort()) ||
    Number(primaryId) !== (initialPrimaryId ?? initialCategoryIds[0] ?? null);

  function toggleCategory(id: number) {
    setError("");
    setMessage("");
    setSelected((prev) => {
      const next = prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id];
      if (next.length === 0) {
        setPrimaryId("");
        return next;
      }
      if (!next.includes(Number(primaryId))) {
        setPrimaryId(next[0]);
      }
      return next;
    });
  }

  async function handleSave() {
    if (selected.length === 0) {
      setError("Pick at least one category.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.set("gameId", String(gameId));
    formData.set("primaryCategoryId", String(primaryId || selected[0]));
    selected.forEach((id) => formData.append("categoryIds", String(id)));

    const result = await updateGameCategories(formData);
    setSaving(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setMessage("Categories saved.");
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-semibold">Categories</h2>
          <p className="text-xs text-[var(--color-muted)]">
            Click to add or remove. Save when done.
          </p>
        </div>
        <Link href="/admin/categories" className="text-xs text-[var(--color-accent)] hover:underline">
          Manage categories →
        </Link>
      </div>

      {error && <p className="mb-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}
      {message && (
        <p className="mb-3 rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-400">{message}</p>
      )}

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const active = selected.includes(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
                active
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/15 text-[var(--color-text)]"
                  : "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-muted)] hover:border-[var(--color-accent)]/50"
              }`}
            >
              <CategoryIcon icon={cat.icon ?? null} name={cat.name} size="sm" />
              {cat.name}
              {active && primaryId === cat.id && (
                <span className="rounded bg-[var(--color-accent)] px-1.5 py-0.5 text-[10px] font-medium text-white">
                  Primary
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="form-field min-w-[180px] flex-1">
            <label htmlFor="quickPrimaryCategory" className="form-label text-xs">
              Primary category
            </label>
            <select
              id="quickPrimaryCategory"
              className="form-input"
              value={primaryId}
              onChange={(e) => setPrimaryId(parseInt(e.target.value, 10))}
            >
              {categories
                .filter((c) => selected.includes(c.id))
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !dirty || selected.length === 0}
            className="btn-primary text-sm disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save categories"}
          </button>
        </div>
      )}

      {selected.length === 0 && (
        <p className="mt-3 text-xs text-amber-400">Select at least one category for this game.</p>
      )}
    </div>
  );
}
