import { prisma } from "./db";

export type MenuPageItem = {
  id: number;
  title: string;
  slug: string;
  icon: string | null;
  sortOrder: number;
};

import { menuPageDelegate } from "@/lib/prisma-delegates";

function menuPageClient() {
  return menuPageDelegate();
}

export async function getMenuPagesForNav(): Promise<MenuPageItem[]> {
  const client = menuPageClient();
  if (!client) return [];

  return client.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      title: true,
      slug: true,
      icon: true,
      sortOrder: true,
    },
  });
}

export async function getMenuPageBySlug(slug: string) {
  const client = menuPageClient();
  if (!client) return null;

  return client.findFirst({
    where: { slug, published: true },
  });
}

export async function getAllMenuPagesAdmin() {
  const client = menuPageClient();
  if (!client) return [];

  return client.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function getMenuPageById(id: number) {
  const client = menuPageClient();
  if (!client) return null;

  return client.findUnique({ where: { id } });
}