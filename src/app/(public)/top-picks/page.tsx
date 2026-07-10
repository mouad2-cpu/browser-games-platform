import type { Metadata } from "next";
import { getTopPicksPaginated } from "@/lib/games";
import { getCatalogGameDateRange } from "@/lib/categories";
import { getRecentGameSlugsFromRequest } from "@/lib/user-progress";
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

const meta = LIST_PAGE_META["top-picks"];

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { page: pageParam } = await searchParams;
  return buildCollectionPageMetadata({
    ...meta,
    page: parsePageNumber(pageParam),
    forceNoIndex: true,
  });
}

export default async function TopPicksPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = parsePageNumber(pageParam);
  const recentSlugs = await getRecentGameSlugsFromRequest();

  const [{ games, total, pageSize }, dateRange] = await Promise.all([
    getTopPicksPaginated(recentSlugs, page),
    getCatalogGameDateRange(),
  ]);
  const totalPages = Math.ceil(total / pageSize);
  const seoContent = getPageSeoContent("top-picks", "Top Picks");

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
        pageKey="topPicks"
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
