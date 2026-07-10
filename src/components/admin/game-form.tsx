"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { slugify, parseEmbedUrl } from "@/lib/validators";
import { isLocalGameEmbed } from "@/lib/embed-utils";
import { createGame, updateGame } from "@/app/actions/admin/games";
import { CategoryIcon } from "@/components/category/category-icon";
import { EmbedPreview } from "./embed-preview";
import { GameThumbnail } from "./game-thumbnail";
import { descriptionToMetaDescription } from "@/lib/meta-description";
import { GameFeaturedToggle } from "./game-featured-toggle";
import { DESCRIPTION_FORMAT_HINT } from "@/components/game/game-description";

type EmbedMode = "url" | "game";

type Category = { id: number; name: string; slug: string; icon?: string | null };

type GameData = {
  id?: number;
  title: string;
  slug: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  thumbnail: string;
  previewVideo: string;
  embedPath: string;
  featured: boolean;
  status: "draft" | "published";
  primaryCategoryId: number | null;
  categoryIds: number[];
};

type Props = {
  categories: Category[];
  game?: GameData;
};

export function GameForm({ categories, game }: Props) {
  const router = useRouter();
  const isEdit = !!game?.id;

  const [title, setTitle] = useState(game?.title ?? "");
  const [slug, setSlug] = useState(game?.slug ?? "");
  const [slugManual, setSlugManual] = useState(isEdit);
  const [description, setDescription] = useState(game?.description ?? "");
  const [metaTitle, setMetaTitle] = useState(game?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(game?.metaDescription ?? "");
  const [thumbnail, setThumbnail] = useState(game?.thumbnail ?? "");
  const [previewVideo, setPreviewVideo] = useState(game?.previewVideo ?? "");
  const [embedMode, setEmbedMode] = useState<EmbedMode>(
    game?.embedPath && isLocalGameEmbed(game.embedPath) ? "game" : "url"
  );
  const [embedPath, setEmbedPath] = useState(
    game?.embedPath && !isLocalGameEmbed(game.embedPath) ? game.embedPath : ""
  );
  const [localEmbedPath, setLocalEmbedPath] = useState(
    game?.embedPath && isLocalGameEmbed(game.embedPath) ? game.embedPath : ""
  );
  const [showEmbedPreview, setShowEmbedPreview] = useState(!!game?.embedPath);
  const [featured, setFeatured] = useState(game?.featured ?? false);
  const [status, setStatus] = useState<"draft" | "published">(game?.status ?? "published");
  const [selectedCategories, setSelectedCategories] = useState<number[]>(game?.categoryIds ?? []);
  const [primaryCategoryId, setPrimaryCategoryId] = useState<number | "">(
    game?.primaryCategoryId ?? game?.categoryIds[0] ?? ""
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slugManual && title) setSlug(slugify(title));
  }, [title, slugManual]);

  function handleEmbedChange(value: string) {
    setEmbedPath(/<(?:iframe|embed)/i.test(value) ? parseEmbedUrl(value) : value);
  }

  function toggleCategory(id: number) {
    setSelectedCategories((prev) => {
      const next = prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id];
      if (!next.includes(Number(primaryCategoryId))) {
        setPrimaryCategoryId(next[0] ?? "");
      }
      return next;
    });
  }

  const previewSrc = embedMode === "game" ? localEmbedPath : parseEmbedUrl(embedPath);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (selectedCategories.length === 0) {
      setError("Select at least one category.");
      return;
    }

    if (embedMode === "url") {
      const url = parseEmbedUrl(embedPath);
      if (!url) {
        setError("Enter a valid embed URL or iframe code.");
        return;
      }
    } else {
      const indexFile = (e.currentTarget.elements.namedItem("gameIndex") as HTMLInputElement | null)?.files?.[0];
      const folderFiles = (e.currentTarget.elements.namedItem("gameFiles") as HTMLInputElement | null)?.files;
      const hasUpload = (indexFile && indexFile.size > 0) || (folderFiles && folderFiles.length > 0);
      if (!hasUpload && !localEmbedPath) {
        setError("Upload index.html or a game folder.");
        return;
      }
    }

    setLoading(true);

    try {
      const indexFile = (e.currentTarget.elements.namedItem("gameIndex") as HTMLInputElement | null)?.files?.[0];
      const folderFiles = (e.currentTarget.elements.namedItem("gameFiles") as HTMLInputElement | null)?.files;
      const thumbnailFile = (e.currentTarget.elements.namedItem("thumbnailFile") as HTMLInputElement | null)?.files?.[0];
      const previewVideoFile = (e.currentTarget.elements.namedItem("previewVideoFile") as HTMLInputElement | null)?.files?.[0];

      const hasGameUpload =
        (indexFile && indexFile.size > 0) || (folderFiles && folderFiles.length > 0);
      const needsFileUpload =
        (embedMode === "game" && hasGameUpload) ||
        (thumbnailFile && thumbnailFile.size > 0) ||
        (previewVideoFile && previewVideoFile.size > 0);

      let uploadedEmbedPath = embedMode === "url" ? parseEmbedUrl(embedPath) : localEmbedPath;
      let uploadedThumbnail = thumbnail;
      let uploadedPreviewVideo = previewVideo;

      if (needsFileUpload) {
        const uploadData = new FormData();
        uploadData.set("slug", slug);
        uploadData.set("embedMode", embedMode);
        if (indexFile && indexFile.size > 0) uploadData.set("gameIndex", indexFile);
        if (folderFiles) {
          for (let i = 0; i < folderFiles.length; i++) {
            uploadData.append("gameFiles", folderFiles[i]);
          }
        }
        if (thumbnailFile && thumbnailFile.size > 0) uploadData.set("thumbnailFile", thumbnailFile);
        if (previewVideoFile && previewVideoFile.size > 0) {
          uploadData.set("previewVideoFile", previewVideoFile);
        }

        const uploadRes = await fetch("/api/admin/games/upload", {
          method: "POST",
          body: uploadData,
        });
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok || uploadJson.error) {
          setError(uploadJson.error ?? "File upload failed.");
          return;
        }

        if (uploadJson.embedPath) uploadedEmbedPath = uploadJson.embedPath;
        if (uploadJson.thumbnail) uploadedThumbnail = uploadJson.thumbnail;
        if (uploadJson.previewVideo) uploadedPreviewVideo = uploadJson.previewVideo;
      }

      const formData = new FormData();
      formData.set("title", title);
      formData.set("slug", slug);
      formData.set("description", description);
      formData.set("metaTitle", metaTitle);
      formData.set(
        "metaDescription",
        metaDescription.trim() || descriptionToMetaDescription(description)
      );
      formData.set("thumbnail", uploadedThumbnail);
      formData.set("previewVideo", uploadedPreviewVideo);
      formData.set("embedMode", "url");
      formData.set("embedPath", uploadedEmbedPath || parseEmbedUrl(embedPath) || localEmbedPath);
      if (primaryCategoryId) formData.set("primaryCategoryId", String(primaryCategoryId));
      if (featured) formData.set("featured", "on");
      formData.set("status", status);
      selectedCategories.forEach((id) => formData.append("categoryIds", String(id)));

      if (isEdit && game?.id) {
        const result = await updateGame(game.id, formData);
        if (result?.error) {
          setError(result.error);
          return;
        }
        if (uploadedEmbedPath?.startsWith("/uploads/games/")) {
          setLocalEmbedPath(uploadedEmbedPath);
        }
        router.refresh();
      } else {
        const result = await createGame(formData);
        if (result?.error) {
          setError(result.error);
          return;
        }
        router.push("/admin/games");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="max-w-2xl space-y-4">
      {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}

      {!isEdit && (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div className="mb-3">
            <span className="form-label">Featured</span>
            <p className="text-xs text-[var(--color-muted)]">
              Featured games get a Top badge and appear higher in Top picks.
            </p>
          </div>
          <GameFeaturedToggle featured={featured} onChange={setFeatured} />
        </div>
      )}

      <div className="form-field">
        <label htmlFor="title" className="form-label">Title *</label>
        <input id="title" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="form-field">
        <label htmlFor="slug" className="form-label">Slug *</label>
        <input id="slug" className="form-input" value={slug} onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }} required pattern="[a-z0-9-]+" />
      </div>

      <div className="form-field">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea id="description" className="form-input min-h-[160px]" value={description} onChange={(e) => setDescription(e.target.value)} />
        <p className="mt-1 text-xs text-[var(--color-muted)]">{DESCRIPTION_FORMAT_HINT}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="form-field">
          <label htmlFor="metaTitle" className="form-label">Meta title (SEO)</label>
          <input id="metaTitle" className="form-input" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="metaDescription" className="form-label">Meta description (SEO)</label>
          <input id="metaDescription" className="form-input" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            Leave empty to use the game description automatically.
          </p>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="thumbnailFile" className="form-label">Thumbnail upload</label>
        {thumbnail && (
          <div className="mb-3 max-w-xs overflow-hidden rounded-lg border border-[var(--color-border)] p-1">
            <GameThumbnail src={thumbnail} title={title || "Game"} size="lg" className="max-w-none rounded-md" />
          </div>
        )}
        <input id="thumbnailFile" name="thumbnailFile" type="file" accept="image/*" className="form-input" />
        <p className="mt-1 text-xs text-[var(--color-muted)]">JPEG, PNG, WebP, or GIF — max 10MB.</p>
        <input type="hidden" name="thumbnail" value={thumbnail} />
      </div>

      <div className="form-field">
        <label htmlFor="previewVideo" className="form-label">Hover preview video URL</label>
        <input
          id="previewVideo"
          className="form-input"
          value={previewVideo}
          onChange={(e) => setPreviewVideo(e.target.value)}
          placeholder="https://…/preview.mp4 or /uploads/previews/…"
        />
        <p className="mt-1 text-xs text-[var(--color-muted)]">
          Optional short MP4/WebM clip shown when users hover the game card.
        </p>
      </div>

      <div className="form-field">
        <label htmlFor="previewVideoFile" className="form-label">Or upload preview video</label>
        <input id="previewVideoFile" name="previewVideoFile" type="file" accept="video/mp4,video/webm,video/quicktime" className="form-input" />
      </div>

      <div className="form-field">
        <span className="form-label">Game source *</span>
        <div className="mb-3 flex gap-2">
          <button type="button" className={`rounded-lg px-4 py-2 text-sm font-medium ${embedMode === "url" ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-surface)] text-[var(--color-muted)]"}`} onClick={() => setEmbedMode("url")}>External URL</button>
          <button type="button" className={`rounded-lg px-4 py-2 text-sm font-medium ${embedMode === "game" ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-surface)] text-[var(--color-muted)]"}`} onClick={() => setEmbedMode("game")}>Upload Game</button>
        </div>

        {embedMode === "url" ? (
          <textarea
            id="embedPath"
            className="form-input min-h-[80px] font-mono text-sm"
            value={embedPath}
            onChange={(e) => handleEmbedChange(e.target.value)}
            onBlur={(e) => setEmbedPath(parseEmbedUrl(e.target.value))}
            required={embedMode === "url"}
            placeholder="https://www.crazygames.com/embed/my-game"
          />
        ) : (
          <>
            {localEmbedPath && <p className="mb-2 text-xs text-green-400">Current: {localEmbedPath}</p>}
            <input id="gameIndex" name="gameIndex" type="file" accept=".html,.htm" className="form-input mb-3" />
            <input id="gameFiles" name="gameFiles" type="file" className="form-input" {...({ webkitdirectory: "", directory: "" } as React.InputHTMLAttributes<HTMLInputElement>)} multiple />
          </>
        )}

        {previewSrc && (
          <div className="mt-3">
            <button type="button" className="text-sm text-[var(--color-accent)] hover:underline" onClick={() => setShowEmbedPreview((v) => !v)}>
              {showEmbedPreview ? "Hide" : "Show"} iframe preview
            </button>
            {showEmbedPreview && (
              <div className="mt-2">
                <EmbedPreview embedPath={previewSrc} title={title || "Preview"} />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="form-field">
        <span className="form-label">Categories *</span>
        {selectedCategories.length === 0 && (
          <p className="mb-2 text-xs text-amber-400">Pick at least one category to enable saving.</p>
        )}
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={selectedCategories.includes(cat.id)} onChange={() => toggleCategory(cat.id)} />
              <CategoryIcon icon={cat.icon ?? null} name={cat.name} size="sm" />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      {selectedCategories.length > 0 && (
        <div className="form-field">
          <label htmlFor="primaryCategoryId" className="form-label">Primary category</label>
          <select id="primaryCategoryId" className="form-input" value={primaryCategoryId} onChange={(e) => setPrimaryCategoryId(parseInt(e.target.value, 10))}>
            {categories.filter((c) => selectedCategories.includes(c.id)).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="status">Status:</label>
          <select id="status" className="form-input w-auto" value={status} onChange={(e) => setStatus(e.target.value as "draft" | "published")}>
            <option value="published">Published (visible on site)</option>
            <option value="draft">Draft (admin only)</option>
          </select>
        </div>
      </div>

      <button type="submit" className="btn-primary" disabled={loading || selectedCategories.length === 0}>
        {loading ? "Saving..." : isEdit ? "Update Game" : "Create Game"}
      </button>
    </form>
  );
}
