"use server";

import { revalidatePath } from "next/cache";
import { revalidateSitemap } from "@/lib/sitemap";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { requirePermission, PERMISSIONS } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";
import { slugify } from "@/lib/validators";
import { menuPageDelegate, PRISMA_REGEN_HINT } from "@/lib/prisma-delegates";

async function requireMenuAdmin() {
  const session = await getSession();
  return requirePermission(session, PERMISSIONS.MENU_MANAGE);
}

function parseMenuPageForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim() || slugify(title);
  const icon = String(formData.get("icon") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "").trim() || null;
  const sortOrder = parseInt(String(formData.get("sortOrder") ?? "0"), 10) || 0;
  const published = formData.get("published") === "on";

  if (!title) return { error: "Title is required." as const };
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { error: "Slug must use lowercase letters, numbers, and hyphens only." as const };
  }

  return { title, slug, icon, content, sortOrder, published };
}

function revalidateMenuPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/admin/menu");
  if (slug) revalidatePath(`/pages/${slug}`);
  revalidateSitemap();
}

export async function createMenuPageAction(formData: FormData) {
  try {
    const session = await requireMenuAdmin();
    const menuPage = menuPageDelegate();
    if (!menuPage) return { error: PRISMA_REGEN_HINT };

    const parsed = parseMenuPageForm(formData);
    if ("error" in parsed) return { error: parsed.error };

    const existing = await menuPage.findUnique({ where: { slug: parsed.slug } });
    if (existing) return { error: "A page with this slug already exists." };

    const page = await menuPage.create({ data: parsed });

    await logAudit({
      userId: session.userId,
      action: "menu_page.create",
      entityType: "menu_page",
      entityId: String(page.id),
    });

    revalidateMenuPaths(page.slug);
    return { ok: true as const, id: page.id };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function updateMenuPageAction(id: number, formData: FormData) {
  try {
    const session = await requireMenuAdmin();
    const menuPage = menuPageDelegate();
    if (!menuPage) return { error: PRISMA_REGEN_HINT };

    const parsed = parseMenuPageForm(formData);
    if ("error" in parsed) return { error: parsed.error };

    const existing = await menuPage.findFirst({
      where: { slug: parsed.slug, NOT: { id } },
    });
    if (existing) return { error: "A page with this slug already exists." };

    const page = await menuPage.update({
      where: { id },
      data: parsed,
    });

    await logAudit({
      userId: session.userId,
      action: "menu_page.update",
      entityType: "menu_page",
      entityId: String(page.id),
    });

    revalidateMenuPaths(page.slug);
    return { ok: true as const };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function deleteMenuPageAction(formData: FormData) {
  try {
    const session = await requireMenuAdmin();
    const menuPage = menuPageDelegate();
    if (!menuPage) return { error: PRISMA_REGEN_HINT };

    const id = parseInt(String(formData.get("id") ?? ""), 10);
    if (!id) return { error: "Invalid page." };

    const page = await menuPage.delete({ where: { id } });

    await logAudit({
      userId: session.userId,
      action: "menu_page.delete",
      entityType: "menu_page",
      entityId: String(id),
    });

    revalidateMenuPaths(page.slug);
    revalidatePath("/admin/menu");
    redirect("/admin/menu");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}
