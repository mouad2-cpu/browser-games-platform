import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getCategoryGameDateRange } from "@/lib/categories";
import { getGamesByCategory } from "@/lib/games";
import { GameGrid } from "@/components/game/game-grid";
import { GameListPagination } from "@/components/game/game-list-pagination";
import { CategoryPageHeader } from "@/components/category/category-page-header";
import {
  getCategoryPageDescription,
  getCategoryPageTitle,
} from "@/lib/category-descriptions";
import { getCategorySeoContent } from "@/lib/category-seo-content";
import { SeoContentSection } from "@/components/seo/seo-content-section";
import { parseCategorySort } from "@/lib/category-sort";
import { CategoryJsonLd } from "@/components/seo/structured-data";
import { buildPageMetadata, parsePageNumber } from "@/lib/seo-metadata";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { page: pageParam, sort: sortParam } = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };

  const page = parsePageNumber(pageParam);
  const sort = parseCategorySort(sortParam);
  const title = getCategoryPageTitle(category.name);
  const description = getCategoryPageDescription(category.name, category.description);
  const index = page <= 1 && sort === "popular";

  return buildPageMetadata({
    path: `/c/${slug}`,
    title,
    description,
    index,
  });
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam, sort: sortParam } = await searchParams;
  const page = parsePageNumber(pageParam);
  const sort = parseCategorySort(sortParam);

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [{ games, total, pageSize }, dateRange] = await Promise.all([
    getGamesByCategory(slug, page, sort),
    getCategoryGameDateRange(slug),
  ]);
  const totalPages = Math.ceil(total / pageSize);
  const title = getCategoryPageTitle(category.name);
  const description = getCategoryPageDescription(category.name, category.description);
  const seoContent = getCategorySeoContent(slug, category.name);

  return (
    <>
      <CategoryJsonLd
        name={title}
        description={description}
        slug={slug}
        games={games}
        faqs={seoContent.faqs}
      />
      <div className="w-full px-2 py-6 sm:px-3 sm:py-8">
        <CategoryPageHeader
          slug={slug}
          name={category.name}
          title={title}
          description={description}
          sort={sort}
        />

        <GameGrid games={games} dense emptyMessage="No games in this category yet." />

        <GameListPagination
          page={page}
          totalPages={totalPages}
          path={`/c/${slug}`}
          sort={sort}
        />

        <SeoContentSection
          content={seoContent}
          firstPublished={dateRange.firstPublished}
          latestAdded={dateRange.latestAdded}
        />
      </div>
    </>
  );
}
