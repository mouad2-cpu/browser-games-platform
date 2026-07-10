"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/validators";
import { createMenuPageAction, updateMenuPageAction } from "@/app/actions/admin/menu-pages";
import { MENU_PAGE_ICON_PRESETS } from "@/lib/menu-page-icons";
import { getMenuPageHref } from "@/lib/menu-page-routes";

type MenuPageData = {
  id?: number;
  title: string;
  slug: string;
  icon: string | null;
  content: string | null;
  sortOrder: number;
  published: boolean;
};

type Props = {
  page?: MenuPageData;
};

export function MenuPageForm({ page }: Props) {
  const router = useRouter();
  const isEdit = !!page?.id;

  const [title, setTitle] = useState(page?.title ?? "");
  const [slug, setSlug] = useState(page?.slug ?? "");
  const [slugManual, setSlugManual] = useState(isEdit);
  const [icon, setIcon] = useState(page?.icon ?? "file-text");
  const [content, setContent] = useState(page?.content ?? "");
  const [sortOrder, setSortOrder] = useState(page?.sortOrder ?? 0);
  const [published, setPublished] = useState(page?.published ?? true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slugManual && title) setSlug(slugify(title));
  }, [title, slugManual]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("slug", slug);
    formData.set("icon", icon);
    formData.set("content", content);
    formData.set("sortOrder", String(sortOrder));
    if (published) formData.set("published", "on");

    try {
      if (isEdit && page?.id) {
        const result = await updateMenuPageAction(page.id, formData);
        if (result?.error) {
          setError(result.error);
          return;
        }
        setSuccess("Page saved.");
        router.refresh();
      } else {
        const result = await createMenuPageAction(formData);
        if (result?.error) {
          setError(result.error);
          return;
        }
        if (result?.id) {
          router.push(`/admin/menu/pages/${result.id}`);
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

      <div className="form-field">
        <label className="form-label">Icon</label>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
          {MENU_PAGE_ICON_PRESETS.map(({ key, label, Icon }) => {
            const selected = icon === key;
            return (
              <button
                key={key}
                type="button"
                title={label}
                onClick={() => setIcon(key)}
                className={`flex flex-col items-center gap-1 rounded-xl px-2 py-3 transition ${
                  selected
                    ? "bg-[#1a2030] ring-2 ring-[var(--color-accent)]"
                    : "bg-[var(--color-surface)] hover:bg-[#1a2030]"
                }`}
              >
                <Icon className="size-5" strokeWidth={2} />
                <span className="text-[10px] text-[var(--color-muted)]">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="title" className="form-label">Title *</label>
        <input
          id="title"
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
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
        <p className="mt-1 text-xs text-[var(--color-muted)]">Public URL: {getMenuPageHref(slug || "your-slug")}</p>
      </div>

      <div className="form-field">
        <label htmlFor="content" className="form-label">Content</label>
        <textarea
          id="content"
          className="form-input min-h-[200px] resize-y"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write page content. Separate paragraphs with a blank line."
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

      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="size-4 rounded border-[var(--color-border)]"
        />
        Published (visible in sidebar menu)
      </label>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Saving..." : isEdit ? "Save changes" : "Create page"}
        </button>
        {!isEdit && (
          <button type="button" onClick={() => router.push("/admin/menu")} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
