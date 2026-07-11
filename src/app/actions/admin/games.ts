"use server";

import { revalidatePath } from "next/cache";
import { revalidateSitemap } from "@/lib/sitemap";

import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { GameStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { requirePermission, PERMISSIONS } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";
import { linkGameToCategory, unlinkGameFromCategory } from "@/lib/admin/game-category-links";
import { revalidateGameCategoryPaths } from "@/lib/admin/revalidate-game-categories";
import { saveUploadedGame } from "@/lib/admin/save-game-files";
import { MAX_PREVIEW_VIDEO_BYTES, MAX_THUMBNAIL_BYTES, maxSizeLabel } from "@/lib/admin/upload-limits";
import { isLocalGameEmbed } from "@/lib/embed-utils";
import { gameFormSchema, parseEmbedUrl } from "@/lib/validators";

async function requireAdmin() {
  const session = await getSession();
  return requirePermission(session, PERMISSIONS.GAMES_EDIT);
}

async function resolveEmbedPath(
  formData: FormData,
  slug: string,
  currentEmbedPath?: string | null
): Promise<{ embedPath: string } | { error: string }> {
  const embedMode = (formData.get("embedMode") as string) || "url";

  if (embedMode === "game") {
    const gameIndex = formData.get("gameIndex");
    const folderFiles = formData.getAll("gameFiles");
    const hasUpload =
      (gameIndex instanceof File && gameIndex.size > 0) ||
      folderFiles.some((f) => f instanceof File && f.size > 0);

    if (hasUpload) {
      const result = await saveUploadedGame(slug, formData);
      if ("error" in result) return result;
      return { embedPath: result.embedPath };
    }

    if (currentEmbedPath && isLocalGameEmbed(currentEmbedPath)) {
      return { embedPath: currentEmbedPath };
    }

    return { error: "Upload index.html or a game folder" };
  }

  const embedPath = parseEmbedUrl((formData.get("embedPath") as string) || "");
  if (!embedPath) return { error: "Embed path is required" };
  return { embedPath };
}

function parseCategoryIds(formData: FormData): number[] {
  return formData.getAll("categoryIds").map((id) => parseInt(String(id), 10)).filter(Boolean);
}

async function resolvePreviewVideo(
  formData: FormData,
  slug: string,
  currentPreviewVideo?: string | null
): Promise<{ previewVideo: string | null } | { error: string }> {
  const previewVideoFile = formData.get("previewVideoFile");
  if (previewVideoFile instanceof File && previewVideoFile.size > 0) {
    const allowed = ["video/mp4", "video/webm", "video/quicktime"];
    if (!allowed.includes(previewVideoFile.type)) {
      return { error: "Preview video must be MP4, WebM, or MOV." };
    }
    if (previewVideoFile.size > MAX_PREVIEW_VIDEO_BYTES) {
      return { error: `Preview video must be under ${maxSizeLabel(MAX_PREVIEW_VIDEO_BYTES)}.` };
    }
    const ext = previewVideoFile.name.split(".").pop()?.toLowerCase() ?? "mp4";
    const filename = `${slug}-preview-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "previews");
    await mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await previewVideoFile.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);
    return { previewVideo: `/uploads/previews/${filename}` };
  }

  const url = String(formData.get("previewVideo") ?? "").trim();
  if (url) return { previewVideo: url };
  return { previewVideo: currentPreviewVideo ?? null };
}

export async function createGame(formData: FormData) {
  try {
    const session = await requireAdmin();

    const slug = formData.get("slug") as string;
    const categoryIds = parseCategoryIds(formData);

    if (categoryIds.length === 0) {
      return { error: "Select at least one category." };
    }

    const embedResult = await resolveEmbedPath(formData, slug);
    if ("error" in embedResult) return { error: embedResult.error };

    const previewResult = await resolvePreviewVideo(formData, slug);
    if ("error" in previewResult) return { error: previewResult.error };

    const raw = {
      title: formData.get("title") as string,
      slug,
      description: (formData.get("description") as string) || undefined,
      metaTitle: (formData.get("metaTitle") as string) || undefined,
      metaDescription: (formData.get("metaDescription") as string) || undefined,
      thumbnail: (formData.get("thumbnail") as string) || undefined,
      previewVideo: previewResult.previewVideo || undefined,
      embedPath: embedResult.embedPath,
      categoryIds,
      primaryCategoryId: parseInt(String(formData.get("primaryCategoryId") || categoryIds[0]), 10),
      featured: formData.get("featured") === "on",
      status: formData.get("status") as "draft" | "published",
    };

    const thumbnailFile = formData.get("thumbnailFile");
    if (thumbnailFile instanceof File && thumbnailFile.size > 0) {
      const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!allowed.includes(thumbnailFile.type)) {
        return { error: "Invalid thumbnail type. Use JPEG, PNG, WebP, or GIF." };
      }
      if (thumbnailFile.size > MAX_THUMBNAIL_BYTES) {
        return { error: `Thumbnail must be under ${maxSizeLabel(MAX_THUMBNAIL_BYTES)}.` };
      }
      const ext = thumbnailFile.name.split(".").pop() ?? "jpg";
      const filename = `${raw.slug}-${Date.now()}.${ext}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads", "thumbnails");
      await mkdir(uploadDir, { recursive: true });
      const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
      await writeFile(path.join(uploadDir, filename), buffer);
      raw.thumbnail = `/uploads/thumbnails/${filename}`;
    }

    const parsed = gameFormSchema.safeParse(raw);
    if (!parsed.success) {
      return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
    }

    const existing = await prisma.game.findUnique({ where: { slug: parsed.data.slug } });
    if (existing) {
      return { error: "A game with this slug already exists." };
    }

    const isPublished = parsed.data.status === "published";
    const now = new Date();

    const game = await prisma.game.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        description: parsed.data.description,
        metaTitle: parsed.data.metaTitle,
        metaDescription: parsed.data.metaDescription,
        thumbnail: parsed.data.thumbnail || null,
        previewVideo: parsed.data.previewVideo ?? null,
        embedPath: parsed.data.embedPath,
        featured: parsed.data.featured,
        status: parsed.data.status as GameStatus,
        primaryCategoryId: parsed.data.primaryCategoryId ?? parsed.data.categoryIds[0],
        addedAt: now,
        releasedAt: isPublished ? now : null,
        categories: {
          create: parsed.data.categoryIds.map((categoryId) => ({ categoryId })),
        },
      },
    });

    await logAudit({
      userId: session.userId,
      action: "game.create",
      entityType: "game",
      entityId: String(game.id),
    });

    revalidatePath("/");
    revalidatePath("/admin/games");
    revalidateSitemap();
    return { ok: true as const, id: game.id };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function updateGame(gameId: number, formData: FormData) {
  try {
    const session = await requireAdmin();

  const slug = formData.get("slug") as string;
  const categoryIds = parseCategoryIds(formData);

  const existing = await prisma.game.findUnique({ where: { id: gameId } });
  if (!existing) return { error: "Game not found" };

  const embedResult = await resolveEmbedPath(formData, slug, existing.embedPath);
  if ("error" in embedResult) return { error: embedResult.error };

  const previewResult = await resolvePreviewVideo(formData, slug, existing.previewVideo);
  if ("error" in previewResult) return { error: previewResult.error };

  const raw = {
    title: formData.get("title") as string,
    slug,
    description: (formData.get("description") as string) || undefined,
    metaTitle: (formData.get("metaTitle") as string) || undefined,
    metaDescription: (formData.get("metaDescription") as string) || undefined,
    thumbnail: (formData.get("thumbnail") as string) || undefined,
    previewVideo: previewResult.previewVideo ?? undefined,
    embedPath: embedResult.embedPath,
    categoryIds,
    primaryCategoryId: parseInt(String(formData.get("primaryCategoryId") || categoryIds[0]), 10),
    featured: formData.get("featured") === "on",
    status: formData.get("status") as "draft" | "published",
  };

  const thumbnailFile = formData.get("thumbnailFile");
  if (thumbnailFile instanceof File && thumbnailFile.size > 0) {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(thumbnailFile.type)) {
      return { error: "Invalid thumbnail type." };
    }
    if (thumbnailFile.size > MAX_THUMBNAIL_BYTES) {
      return { error: `Thumbnail must be under ${maxSizeLabel(MAX_THUMBNAIL_BYTES)}.` };
    }
    const ext = thumbnailFile.name.split(".").pop() ?? "jpg";
    const filename = `${raw.slug}-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "thumbnails");
    await mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);
    raw.thumbnail = `/uploads/thumbnails/${filename}`;
  }

  const parsed = gameFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const slugConflict = await prisma.game.findFirst({
    where: { slug: parsed.data.slug, NOT: { id: gameId } },
  });
  if (slugConflict) {
    return { error: "A game with this slug already exists." };
  }

  const isPublished = parsed.data.status === "published";
  const wasPublished = existing.status === GameStatus.published;

  await prisma.$transaction([
    prisma.gameCategory.deleteMany({ where: { gameId } }),
    prisma.game.update({
      where: { id: gameId },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        description: parsed.data.description,
        metaTitle: parsed.data.metaTitle,
        metaDescription: parsed.data.metaDescription,
        thumbnail: parsed.data.thumbnail || null,
        previewVideo: parsed.data.previewVideo ?? null,
        embedPath: parsed.data.embedPath,
        featured: parsed.data.featured,
        status: parsed.data.status as GameStatus,
        primaryCategoryId: parsed.data.primaryCategoryId ?? parsed.data.categoryIds[0],
        releasedAt: isPublished && !wasPublished ? new Date() : existing.releasedAt,
        categories: {
          create: parsed.data.categoryIds.map((categoryId) => ({ categoryId })),
        },
      },
    }),
  ]);

  await logAudit({
    userId: session.userId,
    action: "game.update",
    entityType: "game",
    entityId: String(gameId),
  });

  revalidatePath("/");
  revalidatePath(`/game/${parsed.data.slug}`);
  revalidatePath("/admin/games");
  revalidateSitemap();
  return { ok: true as const };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function deleteGame(gameId: number) {
  const session = await getSession();
  requirePermission(session, PERMISSIONS.GAMES_DELETE);
  await prisma.game.delete({ where: { id: gameId } });
  await logAudit({
    userId: session!.userId,
    action: "game.delete",
    entityType: "game",
    entityId: String(gameId),
  });
  revalidatePath("/");
  revalidatePath("/admin/games");
  revalidateSitemap();
  redirect("/admin/games");
}

export async function deleteGameAction(formData: FormData) {
  const gameId = parseInt(String(formData.get("gameId")), 10);
  if (gameId) await deleteGame(gameId);
}

export async function updateGameCategories(formData: FormData) {
  try {
    const session = await requireAdmin();

    const gameId = parseInt(String(formData.get("gameId")), 10);
    if (!gameId) return { error: "Invalid game." };

    const categoryIds = formData
      .getAll("categoryIds")
      .map((id) => parseInt(String(id), 10))
      .filter(Boolean);

    if (categoryIds.length === 0) {
      return { error: "Select at least one category." };
    }

    const primaryCategoryId = parseInt(String(formData.get("primaryCategoryId")), 10);
    if (!primaryCategoryId || !categoryIds.includes(primaryCategoryId)) {
      return { error: "Choose a primary category from the selected list." };
    }

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      select: { slug: true },
    });
    if (!game) return { error: "Game not found." };

    await prisma.$transaction([
      prisma.gameCategory.deleteMany({ where: { gameId } }),
      prisma.game.update({
        where: { id: gameId },
        data: {
          primaryCategoryId,
          categories: {
            create: categoryIds.map((categoryId) => ({ categoryId })),
          },
        },
      }),
    ]);

    await logAudit({
      userId: session.userId,
      action: "game.update_categories",
      entityType: "game",
      entityId: String(gameId),
      metadata: { categoryIds, primaryCategoryId },
    });

    revalidatePath("/");
    revalidatePath("/admin/games");
    revalidateSitemap();
    revalidatePath(`/admin/games/${gameId}`);
    revalidatePath(`/game/${game.slug}`);
    return { ok: true as const };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function addGameToCategoryAction(formData: FormData) {
  try {
    const session = await requireAdmin();
    const gameId = parseInt(String(formData.get("gameId")), 10);
    const categoryId = parseInt(String(formData.get("categoryId")), 10);
    if (!gameId || !categoryId) return { error: "Invalid request." };

    const result = await linkGameToCategory(gameId, categoryId);
    if ("error" in result) return { error: result.error };

    await logAudit({
      userId: session.userId,
      action: "game.add_category",
      entityType: "game",
      entityId: String(gameId),
      metadata: { categoryId },
    });

    revalidateGameCategoryPaths(result.slug, gameId, categoryId);
    return { ok: true as const };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function removeGameFromCategoryAction(formData: FormData) {
  try {
    const session = await requireAdmin();
    const gameId = parseInt(String(formData.get("gameId")), 10);
    const categoryId = parseInt(String(formData.get("categoryId")), 10);
    if (!gameId || !categoryId) return { error: "Invalid request." };

    const result = await unlinkGameFromCategory(gameId, categoryId);
    if ("error" in result) return { error: result.error };

    await logAudit({
      userId: session.userId,
      action: "game.remove_category",
      entityType: "game",
      entityId: String(gameId),
      metadata: { categoryId },
    });

    revalidateGameCategoryPaths(result.slug, gameId, categoryId);
    return { ok: true as const };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function toggleGameFeaturedAction(formData: FormData) {
  try {
    const session = await requireAdmin();
    const gameId = parseInt(String(formData.get("gameId")), 10);
    if (!gameId) return { error: "Invalid game." };

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      select: { id: true, slug: true, featured: true },
    });
    if (!game) return { error: "Game not found." };

    const featured = !game.featured;

    await prisma.game.update({
      where: { id: gameId },
      data: { featured },
    });

    await logAudit({
      userId: session.userId,
      action: featured ? "game.feature" : "game.unfeature",
      entityType: "game",
      entityId: String(gameId),
    });

    revalidatePath("/");
    revalidatePath("/top-picks");
    revalidatePath("/admin/games");
    revalidatePath(`/admin/games/${gameId}`);
    revalidatePath(`/game/${game.slug}`);
    revalidateSitemap();
    return { ok: true as const, featured };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}
