"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/validators";
import { createCategory, updateCategory } from "@/app/actions/admin/categories";
import { CategoryIcon } from "@/components/category/category-icon";
import {
  CATEGORY_ICON_PRESETS,
  getCategoryIconComponent,
  CATEGORY_ICON_COLOR,
  resolveCategoryIconKey,
} from "@/lib/category-icons";

type CategoryData = {
  id?: number;
  name: string;
  slug: string;
  icon: string | null;
  sortOrder: number;
  description?: string | null;
};

type Props = {
  category?: CategoryData;
};

export function CategoryForm({ category }: Props) {
  const router = useRouter();
  const isEdit = !!category?.id;

  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugManual, setSlugManual] = useState(isEdit);
  const [icon, setIcon] = useState(
    category?.icon ? resolveCategoryIconKey(category.icon, category.slug) : "zap"
  );
  const [sortOrder, setSortOrder] = useState(category?.sortOrder ?? 0);
  const [description, setDescription] = useState(category?.description ?? "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slugManual && name) setSlug(slugify(name));
  }, [name, slugManual]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("slug", slug);
    formData.set("icon", icon);
    formData.set("sortOrder", String(sortOrder));
    formData.set("description", description);

    const iconFileInput = (e.currentTarget.elements.namedItem("iconFile") as HTMLInputElement | null)?.files?.[0];
    if (iconFileInput && iconFileInput.size > 0) {
      formData.set("iconFile", iconFileInput);
    }

    try {
      if (isEdit && category?.id) {
        const result = await updateCategory(category.id, formData);
        if (result?.error) {
          setError(result.error);
          return;
        }
        setSuccess("Category saved.");
        router.refresh();
      } else {
        const result = await createCategory(formData);
        if (result?.error) {
          setError(result.error);
          return;
        }
        if (result?.id) {
          router.push(`/admin/categories/${result.id}`);
        }
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}
      {success && <p className="rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-400">{success}</p>}

      <input type="hidden" name="icon" value={icon} readOnly />

      <div className="form-field">
        <label className="form-label">Icon preview</label>
        <div className="flex aspect-[5/4] max-w-[140px] flex-col items-center justify-between rounded-2xl bg-[#1a2030] px-3 py-5">
          <span className="flex flex-1 items-center justify-center">
            <CategoryIcon icon={icon} name={name || "Category"} slug={slug} size="md" />
          </span>
          <span className="mt-2 text-sm font-semibold">{name || "Category"}</span>
        </div>
      </div>

      <div className="form-field">
        <label className="form-label">Choose icon</label>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {CATEGORY_ICON_PRESETS.map(({ key, label }) => {
            const PresetIcon = getCategoryIconComponent(key);
            const selected = icon === key;
            return (
              <button
                key={key}
                type="button"
                title={label}
                onClick={() => setIcon(key)}
                className={`flex aspect-[5/4] flex-col items-center justify-between rounded-xl px-2 py-3 transition ${
                  selected
                    ? "bg-[#1a2030] ring-2 ring-[var(--color-accent)]"
                    : "bg-[var(--color-surface)] hover:bg-[#1a2030]"
                }`}
              >
                <PresetIcon size={28} strokeWidth={1.75} color={CATEGORY_ICON_COLOR} />
                <span className="mt-1 text-[10px] font-medium text-[var(--color-muted)]">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="iconFile" className="form-label">Or upload custom icon image</label>
        <input id="iconFile" name="iconFile" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="form-input" />
      </div>

      <div className="form-field">
        <label htmlFor="name" className="form-label">Name *</label>
        <input id="name" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="form-field">
        <label htmlFor="slug" className="form-label">Slug *</label>
        <input
          id="slug"
          className="form-input"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugManual(true);
          }}
          required
          pattern="[a-z0-9-]+"
        />
      </div>

      <div className="form-field">
        <label htmlFor="description" className="form-label">
          Category page description
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          className="form-input min-h-[120px] resize-y"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Shown on the public category page. Leave empty for a default description."
        />
      </div>

      <div className="form-field">
        <label htmlFor="sortOrder" className="form-label">Sort order</label>
        <input
          id="sortOrder"
          type="number"
          min={0}
          className="form-input w-32"
          value={sortOrder}
          onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Saving..." : isEdit ? "Save changes" : "Create category"}
        </button>
        {!isEdit && (
          <button type="button" onClick={() => router.push("/admin/categories")} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
