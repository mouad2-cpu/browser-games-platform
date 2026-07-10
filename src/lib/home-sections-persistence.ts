import { Prisma } from "@prisma/client";
import { prisma } from "./db";

type SectionWriteData = {
  title: string | null;
  layout: string;
  gameLimit: number;
  sortOrder: number;
  placement: string;
  published: boolean;
};

function isUnknownPlacementFieldError(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientValidationError)) return false;
  const message = error.message;
  return message.includes("Unknown argument `placement`") || message.includes("Unknown argument `homePlacement`");
}

async function writeSectionPlacement(id: number, placement: string) {
  await prisma.$executeRaw`
    UPDATE HomePageSection SET placement = ${placement} WHERE id = ${id}
  `;
}

async function writeCategoryPlacement(categoryId: number, homePlacement: string) {
  await prisma.$executeRaw`
    UPDATE Category SET homePlacement = ${homePlacement} WHERE id = ${categoryId}
  `;
}

export async function getNextHomePageSectionSortOrder(): Promise<number> {
  try {
    const result = await prisma.homePageSection.aggregate({ _max: { sortOrder: true } });
    return (result._max.sortOrder ?? -1) + 1;
  } catch {
    const rows = await prisma.$queryRaw<Array<{ nextOrder: number }>>`
      SELECT COALESCE(MAX(sortOrder), -1) + 1 AS nextOrder FROM HomePageSection
    `;
    return rows[0]?.nextOrder ?? 0;
  }
}

export async function getNextHomeCategorySortOrder(): Promise<number> {
  const result = await prisma.category.aggregate({
    where: { showOnHome: true },
    _max: { homeSortOrder: true },
  });
  return (result._max.homeSortOrder ?? -1) + 1;
}

export async function createHomePageSectionRecord(
  categoryId: number,
  data: SectionWriteData
) {
  const base = {
    title: data.title,
    layout: data.layout,
    gameLimit: data.gameLimit,
    sortOrder: data.sortOrder,
    published: data.published,
  };

  try {
    return await prisma.homePageSection.create({
      data: { categoryId, ...base, placement: data.placement },
    });
  } catch (error) {
    if (!isUnknownPlacementFieldError(error)) throw error;

    const section = await prisma.homePageSection.create({
      data: { categoryId, ...base },
    });
    await writeSectionPlacement(section.id, data.placement);
    return section;
  }
}

export async function updateHomePageSectionRecord(id: number, data: SectionWriteData) {
  const base = {
    title: data.title,
    layout: data.layout,
    gameLimit: data.gameLimit,
    sortOrder: data.sortOrder,
    published: data.published,
  };

  try {
    return await prisma.homePageSection.update({
      where: { id },
      data: { ...base, placement: data.placement },
    });
  } catch (error) {
    if (!isUnknownPlacementFieldError(error)) throw error;

    await prisma.homePageSection.update({ where: { id }, data: base });
    await writeSectionPlacement(id, data.placement);
  }
}

export async function getHomePageSectionPlacements(): Promise<Map<number, string>> {
  try {
    const rows = await prisma.$queryRaw<Array<{ id: number; placement: string }>>`
      SELECT id, placement FROM HomePageSection
    `;
    return new Map(rows.map((row) => [row.id, row.placement]));
  } catch {
    return new Map();
  }
}

export async function updateCategoryHomePlacement(categoryId: number, homePlacement: string) {
  try {
    await prisma.category.update({
      where: { id: categoryId },
      data: { homePlacement },
    });
  } catch (error) {
    if (!isUnknownPlacementFieldError(error)) throw error;
    await writeCategoryPlacement(categoryId, homePlacement);
  }
}

export async function getCategoryHomePlacements(): Promise<Map<number, string>> {
  try {
    const rows = await prisma.$queryRaw<Array<{ id: number; homePlacement: string }>>`
      SELECT id, homePlacement FROM Category WHERE showOnHome = true
    `;
    return new Map(rows.map((row) => [row.id, row.homePlacement]));
  } catch {
    return new Map();
  }
}
