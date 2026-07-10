"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CategoryIcon } from "@/components/category/category-icon";
import {
  createHomePageSectionAction,
  deleteHomePageSectionAction,
  updateHomePageSectionAction,
} from "@/app/actions/admin/home-sections";
import type { HomePageSectionAdmin } from "@/lib/home-sections";
import { HomePlacementSelect } from "@/components/admin/home-placement-select";

type AvailableCategory = {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  _count: { games: number };
};

type Props = {
  sections: HomePageSectionAdmin[];
  availableCategories: AvailableCategory[];
  disabled?: boolean;
};

const LAYOUT_OPTIONS = [
  { value: "row", label: "Row (scroll like Continue playing)" },
  { value: "bento", label: "Bento (like Top picks)" },
  { value: "grid", label: "Grid (compact)" },
] as const;

export function HomePageSectionsManager({ sections, availableCategories, disabled = false }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [addCategoryId, setAddCategoryId] = useState("");

  function refresh() {
    router.refresh();
  }

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    formData.set("categoryId", addCategoryId);
    startTransition(async () => {
      const result = await createHomePageSectionAction(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setAddCategoryId("");
      refresh();
    });
  }

  function handleSave(sectionId: number, form: HTMLFormElement) {
    setError("");
    const formData = new FormData(form);
    startTransition(async () => {
      const result = await updateHomePageSectionAction(sectionId, formData);
      if (result.error) setError(result.error);
      else refresh();
    });
  }

  function handleRemove(sectionId: number, name: string) {
    if (!confirm(`Remove "${name}" from the homepage?`)) return;
    setError("");
    startTransition(async () => {
      const result = await deleteHomePageSectionAction(sectionId);
      if (result.error) setError(result.error);
      else refresh();
    });
  }

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
      )}

      <p className="text-sm text-[var(--color-muted)]">
        Add category game rows below Continue playing and Top picks — same style as those sections.
      </p>

      {sections.length === 0 ? (
        <p className="rounded-xl border border-[var(--color-border)] px-4 py-8 text-center text-[var(--color-muted)]">
          No game sections yet. Add a category below.
        </p>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <form
              key={section.id}
              onSubmit={(e) => {
                e.preventDefault();
                handleSave(section.id, e.currentTarget);
              }}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4"
            >
              <div className="flex flex-wrap items-start gap-4">
                <CategoryIcon
                  icon={section.categoryIcon}
                  name={section.categoryName}
                  slug={section.categorySlug}
                  size="md"
                />

                <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="form-field mb-0">
                    <label className="form-label">Section title</label>
                    <input
                      name="title"
                      defaultValue={section.title ?? ""}
                      placeholder={section.categoryName}
                      className="form-input"
                    />
                  </div>

                  <div className="form-field mb-0">
                    <label className="form-label">Layout</label>
                    <select name="layout" defaultValue={section.layout} className="form-input">
                      {LAYOUT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field mb-0">
                    <label className="form-label">Games to show</label>
                    <input
                      name="gameLimit"
                      type="number"
                      min={1}
                      max={49}
                      defaultValue={section.gameLimit}
                      className="form-input"
                    />
                  </div>

                  <HomePlacementSelect defaultValue={section.placement} />

                  <div className="form-field mb-0">
                    <label className="form-label">Sort order</label>
                    <input
                      name="sortOrder"
                      type="number"
                      min={0}
                      defaultValue={section.sortOrder}
                      className="form-input"
                    />
                  </div>

                  <div className="form-field mb-0 flex items-end">
                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name="published"
                        defaultChecked={section.published}
                        className="size-4 rounded border-[var(--color-border)]"
                      />
                      Published on homepage
                    </label>
                  </div>

                  <div className="form-field mb-0">
                    <label className="form-label">Category</label>
                    <input
                      value={`${section.categoryName} (${section.gameCount} games)`}
                      readOnly
                      className="form-input opacity-60"
                    />
                  </div>
                </div>

                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                  <button type="submit" disabled={pending || disabled} className="btn-primary text-sm">
                    Save
                  </button>
                  <button
                    type="button"
                    disabled={pending || disabled}
                    onClick={() => handleRemove(section.id, section.title ?? section.categoryName)}
                    className="btn-secondary text-sm text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </form>
          ))}
        </div>
      )}

      {availableCategories.length > 0 && (
        <form onSubmit={handleAdd} className="rounded-xl border border-dashed border-[var(--color-border)] p-4">
          <h3 className="mb-3 font-semibold">Add category section to homepage</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="form-field mb-0">
              <label className="form-label">Category *</label>
              <select
                value={addCategoryId}
                onChange={(e) => setAddCategoryId(e.target.value)}
                required
                className="form-input"
              >
                <option value="">Select category…</option>
                {availableCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat._count.games} games)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field mb-0">
              <label className="form-label">Title (optional)</label>
              <input name="title" placeholder="Uses category name" className="form-input" />
            </div>

            <div className="form-field mb-0">
              <label className="form-label">Layout</label>
              <select name="layout" defaultValue="row" className="form-input">
                {LAYOUT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <HomePlacementSelect defaultValue="between_top_picks_featured" />

            <div className="form-field mb-0">
              <label className="form-label">Games to show</label>
              <input name="gameLimit" type="number" min={1} max={49} defaultValue={14} className="form-input" />
            </div>
          </div>

          <input type="hidden" name="published" value="on" />

          <button type="submit" disabled={pending || disabled || !addCategoryId} className="btn-primary mt-4">
            Add to homepage
          </button>
        </form>
      )}
    </div>
  );
}
