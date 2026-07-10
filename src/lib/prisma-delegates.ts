import { prisma } from "./db";

export const PRISMA_REGEN_HINT =
  "Database client is out of date. Stop the dev server (Ctrl+C), run: npx prisma generate, then npm run dev";

export function homePageSectionDelegate() {
  if (typeof prisma.homePageSection?.findMany !== "function") {
    return null;
  }
  return prisma.homePageSection;
}

export function menuPageDelegate() {
  if (typeof prisma.menuPage?.findMany !== "function") {
    return null;
  }
  return prisma.menuPage;
}

export function contactMessageDelegate() {
  if (typeof prisma.contactMessage?.create !== "function") {
    return null;
  }
  return prisma.contactMessage;
}

export const HOME_SECTIONS_UNAVAILABLE = PRISMA_REGEN_HINT;
