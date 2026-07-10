"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { requirePermission, PERMISSIONS } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";
import { normalizeCategoryTilePlacement } from "@/lib/home-placements";
import {
  getNextHomeCategorySortOrder,
  updateCategoryHomePlacement,
} from "@/lib/home-sections-persistence";

async function requireCategoryAdmin() {
  const session = await getSession();
  return requirePermission(session, PERMISSIONS.CATEGORIES_MANAGE);
}

function revalidateHomeCategoryPaths() {
  revalidatePath("/");
  revalidatePath("/admin/homepage");
}

function parseHomeSize(value: string): "sm" | "md" | "lg" {
  if (value === "sm" || value === "lg") return value;
  return "md";
}

export async function addCategoryToHomeAction(categoryId: number) {
  try {
    const session = await requireCategoryAdmin();
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) return { error: "Category not found." };

    const homeSortOrder = await getNextHomeCategorySortOrder();

    await prisma.category.update({
      where: { id: categoryId },
      data: {
        showOnHome: true,
        homeSortOrder,
      },
    });

    await logAudit({
      userId: session.userId,
      action: "category.home.add",
      entityType: "category",
      entityId: String(categoryId),
    });

    revalidateHomeCategoryPaths();
    return { ok: true as const };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function removeCategoryFromHomeAction(categoryId: number) {
  try {
    const session = await requireCategoryAdmin();

    await prisma.category.update({
      where: { id: categoryId },
      data: { showOnHome: false },
    });

    await logAudit({
      userId: session.userId,
      action: "category.home.remove",
      entityType: "category",
      entityId: String(categoryId),
    });

    revalidateHomeCategoryPaths();
    return { ok: true as const };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function updateHomeCategoryAction(categoryId: number, formData: FormData) {
  try {
    const session = await requireCategoryAdmin();

    const homeLabel = String(formData.get("homeLabel") ?? "").trim();
    const homeSize = parseHomeSize(String(formData.get("homeSize") ?? "md"));
    const homeSortOrder = parseInt(String(formData.get("homeSortOrder") ?? "0"), 10) || 0;
    const homePlacement = normalizeCategoryTilePlacement(String(formData.get("homePlacement") ?? ""));

    await prisma.category.update({
      where: { id: categoryId },
      data: {
        homeLabel: homeLabel || null,
        homeSize,
        homeSortOrder,
        showOnHome: true,
      },
    });

    await updateCategoryHomePlacement(categoryId, homePlacement);

    await logAudit({
      userId: session.userId,
      action: "category.home.update",
      entityType: "category",
      entityId: String(categoryId),
    });

    revalidateHomeCategoryPaths();
    return { ok: true as const };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}
