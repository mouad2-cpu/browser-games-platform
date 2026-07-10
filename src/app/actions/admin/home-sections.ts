"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { requirePermission, PERMISSIONS } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";
import { homePageSectionDelegate, PRISMA_REGEN_HINT } from "@/lib/prisma-delegates";
import { normalizeHomePlacement } from "@/lib/home-placements";
import {
  createHomePageSectionRecord,
  getNextHomePageSectionSortOrder,
  updateHomePageSectionRecord,
} from "@/lib/home-sections-persistence";

async function requireCategoryAdmin() {
  const session = await getSession();
  return requirePermission(session, PERMISSIONS.CATEGORIES_MANAGE);
}

function revalidateHomePaths() {
  revalidatePath("/");
  revalidatePath("/admin/homepage");
}

function parseLayout(value: string): "row" | "bento" | "grid" {
  if (value === "bento" || value === "grid") return value;
  return "row";
}

function parseSectionForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim() || null;
  const layout = parseLayout(String(formData.get("layout") ?? "row"));
  const gameLimit = Math.min(49, Math.max(1, parseInt(String(formData.get("gameLimit") ?? "14"), 10) || 14));
  const sortOrder = parseInt(String(formData.get("sortOrder") ?? "0"), 10) || 0;
  const placement = normalizeHomePlacement(String(formData.get("placement") ?? ""));
  const published = formData.get("published") === "on";

  return { title, layout, gameLimit, sortOrder, placement, published };
}

export async function createHomePageSectionAction(formData: FormData) {
  try {
    const session = await requireCategoryAdmin();
    const homePageSection = homePageSectionDelegate();
    if (!homePageSection) return { error: PRISMA_REGEN_HINT };

    const categoryId = parseInt(String(formData.get("categoryId") ?? ""), 10);
    if (!categoryId) return { error: "Select a category." };

    const existing = await homePageSection.findUnique({ where: { categoryId } });
    if (existing) return { error: "This category already has a homepage section." };

    const parsed = parseSectionForm(formData);
    parsed.sortOrder = await getNextHomePageSectionSortOrder();

    const section = await createHomePageSectionRecord(categoryId, parsed);

    await logAudit({
      userId: session.userId,
      action: "home_section.create",
      entityType: "home_section",
      entityId: String(section.id),
    });

    revalidateHomePaths();
    return { ok: true as const };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function updateHomePageSectionAction(sectionId: number, formData: FormData) {
  try {
    const session = await requireCategoryAdmin();
    const homePageSection = homePageSectionDelegate();
    if (!homePageSection) return { error: PRISMA_REGEN_HINT };

    const parsed = parseSectionForm(formData);

    await updateHomePageSectionRecord(sectionId, parsed);

    await logAudit({
      userId: session.userId,
      action: "home_section.update",
      entityType: "home_section",
      entityId: String(sectionId),
    });

    revalidateHomePaths();
    return { ok: true as const };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function deleteHomePageSectionAction(sectionId: number) {
  try {
    const session = await requireCategoryAdmin();
    const homePageSection = homePageSectionDelegate();
    if (!homePageSection) return { error: PRISMA_REGEN_HINT };

    await homePageSection.delete({ where: { id: sectionId } });

    await logAudit({
      userId: session.userId,
      action: "home_section.delete",
      entityType: "home_section",
      entityId: String(sectionId),
    });

    revalidateHomePaths();
    return { ok: true as const };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}
