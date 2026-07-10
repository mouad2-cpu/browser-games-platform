import type { Metadata } from "next";
import { getLatestGamesPaginated } from "@/lib/games";
import { getCatalogGameDateRange } from "@/lib/categories";
import { GameListPageView } from "@/components/pages/game-list-page-view";
import { CollectionJsonLd } from "@/components/seo/structured-data";
import { getPageSeoContent } from "@/lib/page-seo-content";
import {
  LIST_PAGE_META,
  buildCollectionPageMetadata,
  parsePageNumber,
} from "@/lib/seo-metadata";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

const meta = LIST_PAGE_META.new;

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { page: pageParam } = await searchParams;
  return buildCollectionPageMetadata({
    ...meta,
    page: parsePageNumber(pageParam),
  });
}

export default async function NewGamesPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = parsePageNumber(pageParam);

  const [{ games, total, pageSize }, dateRange] = await Promise.all([
    getLatestGamesPaginated(page),
    getCatalogGameDateRange(),
  ]);
  const totalPages = Math.ceil(total / pageSize);
  const seoContent = getPageSeoContent("new", "New Games");

  return (
    <>
      <CollectionJsonLd
        name={meta.title}
        description={meta.description}
        path={meta.path}
        games={games}
        faqs={seoContent.faqs}
      />
      <GameListPageView
        pageKey="new"
        games={games}
        total={total}
        page={page}
        totalPages={totalPages}
        seoContent={seoContent}
        dateRange={dateRange}
      />
    </>
  );
}
