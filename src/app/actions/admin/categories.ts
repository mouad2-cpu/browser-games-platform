"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { requirePermission, PERMISSIONS } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";
import { unlinkGameFromCategory } from "@/lib/admin/game-category-links";
import { revalidateGameCategoryPaths } from "@/lib/admin/revalidate-game-categories";
import { categoryFormSchema, slugify } from "@/lib/validators";

async function requireCategoryAdmin() {
  const session = await getSession();
  return requirePermission(session, PERMISSIONS.CATEGORIES_MANAGE);
}

async function resolveIcon(formData: FormData, slug: string, currentIcon?: string | null) {
  const iconInput = String(formData.get("icon") ?? "").trim();
  const iconFile = formData.get("iconFile");

  if (iconFile instanceof File && iconFile.size > 0) {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowed.includes(iconFile.type)) {
      return { error: "Invalid icon type. Use JPEG, PNG, WebP, or SVG." } as const;
    }
    if (iconFile.size > 512 * 1024) {
      return { error: "Icon must be under 512KB." } as const;
    }
    const ext = iconFile.name.split(".").pop() ?? "png";
    const filename = `${slug}-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "icons");
    await mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await iconFile.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);
    return { icon: `/uploads/icons/${filename}` } as const;
  }

  return { icon: iconInput || currentIcon || null } as const;
}

function parseCategoryForm(formData: FormData, icon: string | null) {
  const description = String(formData.get("description") ?? "").trim();
  return categoryFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    sortOrder: formData.get("sortOrder") ?? 0,
    icon: icon || undefined,
    description: description || null,
  });
}

export async function createCategory(formData: FormData) {
  try {
    const session = await requireCategoryAdmin();

    const slug = String(formData.get("slug") || slugify(String(formData.get("name") || "")));
    const iconResult = await resolveIcon(formData, slug);
    if ("error" in iconResult) return { error: iconResult.error };

    const parsed = parseCategoryForm(formData, iconResult.icon);
    if (!parsed.success) {
      return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
    }

    const existing = await prisma.category.findUnique({ where: { slug: parsed.data.slug } });
    if (existing) return { error: "A category with this slug already exists." };

    const category = await prisma.category.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        sortOrder: parsed.data.sortOrder,
        homeSortOrder: parsed.data.sortOrder,
        icon: parsed.data.icon ?? null,
        description: parsed.data.description ?? null,
      },
    });

    await logAudit({
      userId: session.userId,
      action: "category.create",
      entityType: "category",
      entityId: String(category.id),
    });

    revalidatePath("/");
    revalidatePath("/admin/categories");
    return { ok: true as const, id: category.id };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function updateCategory(categoryId: number, formData: FormData) {
  try {
    const session = await requireCategoryAdmin();

    const existing = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!existing) return { error: "Category not found" };

    const slug = String(formData.get("slug") || existing.slug);
    const iconResult = await resolveIcon(formData, slug, existing.icon);
    if ("error" in iconResult) return { error: iconResult.error };

    const parsed = parseCategoryForm(formData, iconResult.icon);
    if (!parsed.success) {
      return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
    }

    const slugTaken = await prisma.category.findFirst({
      where: { slug: parsed.data.slug, NOT: { id: categoryId } },
    });
    if (slugTaken) return { error: "A category with this slug already exists." };

    await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        sortOrder: parsed.data.sortOrder,
        icon: parsed.data.icon ?? null,
        description: parsed.data.description ?? null,
      },
    });

    await logAudit({
      userId: session.userId,
      action: "category.update",
      entityType: "category",
      entityId: String(categoryId),
    });

    revalidatePath("/");
    revalidatePath(`/c/${parsed.data.slug}`);
    revalidatePath("/admin/categories");
    revalidatePath(`/admin/categories/${categoryId}`);
    return { ok: true as const };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function deleteCategory(categoryId: number) {
  const session = await requireCategoryAdmin();

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) return { error: "Category not found" };

  await prisma.category.delete({ where: { id: categoryId } });

  await logAudit({
    userId: session.userId,
    action: "category.delete",
    entityType: "category",
    entityId: String(categoryId),
  });

  revalidatePath("/");
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function removeGameFromCategory(categoryId: number, gameId: number) {
  try {
    const session = await requireCategoryAdmin();

    const result = await unlinkGameFromCategory(gameId, categoryId);
    if ("error" in result) return { error: result.error };

    await logAudit({
      userId: session.userId,
      action: "category.remove_game",
      entityType: "category",
      entityId: String(categoryId),
      metadata: { gameId },
    });

    revalidateGameCategoryPaths(result.slug, gameId, categoryId);
    return { ok: true as const };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function deleteCategoryAction(formData: FormData) {
  const categoryId = parseInt(String(formData.get("categoryId")), 10);
  if (categoryId) await deleteCategory(categoryId);
}

export async function removeGameFromCategoryAction(formData: FormData) {
  const categoryId = parseInt(String(formData.get("categoryId")), 10);
  const gameId = parseInt(String(formData.get("gameId")), 10);
  if (!categoryId || !gameId) return { error: "Invalid request" };
  return removeGameFromCategory(categoryId, gameId);
}
