import type { Metadata } from "next";
import { getContinuePlayingGames } from "@/lib/games";
import { getRecentGameSlugsFromRequest } from "@/lib/user-progress";
import { getPageSeoContent } from "@/lib/page-seo-content";
import { ContinuePlayingPageView } from "@/components/pages/continue-playing-page-view";
import { LIST_PAGE_META, buildPageMetadata } from "@/lib/seo-metadata";

const meta = LIST_PAGE_META["continue-playing"];

export const metadata: Metadata = buildPageMetadata({
  ...meta,
  index: false,
});

export default async function ContinuePlayingPage() {
  const recentSlugs = await getRecentGameSlugsFromRequest();
  const games = await getContinuePlayingGames(recentSlugs);
  const seoContent = getPageSeoContent("continue-playing", "Continue Playing");

  return (
    <ContinuePlayingPageView
      games={games}
      total={games.length}
      seoContent={seoContent}
    />
  );
}
