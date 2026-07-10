"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";
import { CategoryIcon } from "@/components/category/category-icon";
import {
  addCategoryToHomeAction,
  removeCategoryFromHomeAction,
  updateHomeCategoryAction,
} from "@/app/actions/admin/home-categories";
import { HomePlacementSelect } from "@/components/admin/home-placement-select";
import type { HomePlacement } from "@/lib/home-placements";

type CategoryRow = {
  id: number;
  slug: string;
  name: string;
  icon: string | null;
  showOnHome: boolean;
  homeLabel: string | null;
  homeSize: "sm" | "md" | "lg";
  homeSortOrder: number;
  homePlacement: HomePlacement;
  gameCount: number;
};

type Props = {
  categories: CategoryRow[];
};

const SIZE_OPTIONS = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
] as const;

export function HomeCategoriesManager({ categories }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [addId, setAddId] = useState("");

  const onHome = categories.filter((c) => c.showOnHome);
  const available = categories.filter((c) => !c.showOnHome);

  function refresh() {
    router.refresh();
  }

  function handleAdd() {
    const id = parseInt(addId, 10);
    if (!id) return;
    setError("");
    startTransition(async () => {
      const result = await addCategoryToHomeAction(id);
      if (result.error) {
        setError(result.error);
        return;
      }
      setAddId("");
      refresh();
    });
  }

  function handleRemove(id: number) {
    if (!confirm("Remove this category from the homepage? It will stay in the sidebar menu.")) return;
    setError("");
    startTransition(async () => {
      const result = await removeCategoryFromHomeAction(id);
      if (result.error) setError(result.error);
      else refresh();
    });
  }

  function handleSave(id: number, form: HTMLFormElement) {
    setError("");
    const formData = new FormData(form);
    startTransition(async () => {
      const result = await updateHomeCategoryAction(id, formData);
      if (result.error) setError(result.error);
      else refresh();
    });
  }

  return (
    <div className="space-y-8">
      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
      )}

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Homepage categories</h2>
            <p className="text-sm text-[var(--color-muted)]">
              These appear in the Categories section on the home page. Change the display name, size, or order.
            </p>
          </div>
          <Link href="/admin/categories/new" className="btn-secondary text-sm">
            Create new category
          </Link>
        </div>

        {onHome.length === 0 ? (
          <p className="rounded-xl border border-[var(--color-border)] px-4 py-8 text-center text-[var(--color-muted)]">
            No categories on the homepage yet. Add one below.
          </p>
        ) : (
          <div className="space-y-4">
            {onHome.map((cat) => (
              <form
                key={cat.id}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave(cat.id, e.currentTarget);
                }}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4"
              >
                <div className="flex flex-wrap items-start gap-4">
                  <CategoryIcon icon={cat.icon} name={cat.name} slug={cat.slug} size="md" />

                  <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="form-field mb-0">
                      <label className="form-label">Display name</label>
                      <input
                        name="homeLabel"
                        defaultValue={cat.homeLabel ?? ""}
                        placeholder={cat.name}
                        className="form-input"
                      />
                      <p className="mt-1 text-xs text-[var(--color-muted)]">Leave blank to use: {cat.name}</p>
                    </div>

                    <div className="form-field mb-0">
                      <label className="form-label">Size</label>
                      <select name="homeSize" defaultValue={cat.homeSize} className="form-input">
                        {SIZE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <HomePlacementSelect
                      name="homePlacement"
                      defaultValue={cat.homePlacement}
                      label="Tile position on homepage"
                    />

                    <div className="form-field mb-0">
                      <label className="form-label">Sort order</label>
                      <input
                        name="homeSortOrder"
                        type="number"
                        min={0}
                        defaultValue={cat.homeSortOrder}
                        className="form-input"
                      />
                    </div>

                    <div className="form-field mb-0">
                      <label className="form-label">Category slug</label>
                      <input value={cat.slug} readOnly className="form-input opacity-60" />
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                    <button type="submit" disabled={pending} className="btn-primary text-sm">
                      Save
                    </button>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => handleRemove(cat.id)}
                      className="btn-secondary text-sm text-red-400"
                    >
                      Remove from home
                    </button>
                    <Link href={`/admin/categories/${cat.id}`} className="btn-secondary text-sm text-center">
                      Edit category
                    </Link>
                  </div>
                </div>
              </form>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Add category to homepage</h2>
        <p className="mb-4 text-sm text-[var(--color-muted)]">
          Pick a category that is not on the home page yet.
        </p>

        {available.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">All categories are already on the homepage.</p>
        ) : (
          <div className="flex flex-wrap items-end gap-3">
            <div className="form-field mb-0 min-w-[220px] flex-1">
              <label htmlFor="add-category" className="form-label">Category</label>
              <select
                id="add-category"
                value={addId}
                onChange={(e) => setAddId(e.target.value)}
                className="form-input"
              >
                <option value="">Select category…</option>
                {available.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.gameCount} games)
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              disabled={pending || !addId}
              className="btn-primary"
            >
              Add to homepage
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
