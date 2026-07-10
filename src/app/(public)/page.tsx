import type { Metadata } from "next";
import {
  getLatestGames,
  getContinuePlayingGames,
  getTopPicksForYou,
  getFeaturedGamesForHome,
} from "@/lib/games";
import { getHomeCategories } from "@/lib/categories";
import { getHomePageSectionsWithGames } from "@/lib/home-sections";
import { getRecentGameSlugsFromRequest } from "@/lib/user-progress";
import { ContinuePlayingSection } from "@/components/home/continue-playing-section";
import { TopPicksSection } from "@/components/home/top-picks-section";
import { FeaturedGamesSection } from "@/components/home/featured-games-section";
import { LatestSection } from "@/components/home/latest-section";
import { HomePlacementSlot } from "@/components/home/home-placement-slot";
import { HomePageFooterActions } from "@/components/home/home-page-footer-actions";
import { HomeSeoSection } from "@/components/home/home-seo-section";
import { HomeJsonLd } from "@/components/seo/structured-data";
import { absoluteUrl } from "@/lib/structured-data/urls";

/** Canonical only — title/description/OG come from the root layout (locale-aware). */
export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/") },
};

export default async function HomePage() {
  const recentSlugs = await getRecentGameSlugsFromRequest();

  const [continuePlaying, topPicks, homeSections, featuredGames, categories, latest] =
    await Promise.all([
      getContinuePlayingGames(recentSlugs, 14),
      getTopPicksForYou(recentSlugs, 12),
      getHomePageSectionsWithGames(),
      getFeaturedGamesForHome(14),
      getHomeCategories(),
      getLatestGames(),
    ]);

  const slotProps = { sections: homeSections, categories };

  return (
    <>
      <HomeJsonLd featuredGames={featuredGames} />
      <HomePlacementSlot placement="first" {...slotProps} />
      <ContinuePlayingSection games={continuePlaying} />
      <HomePlacementSlot placement="between_continue_top_picks" {...slotProps} />
      <TopPicksSection games={topPicks} />
      <HomePlacementSlot placement="between_top_picks_featured" {...slotProps} />
      <FeaturedGamesSection games={featuredGames} />
      <HomePlacementSlot placement="between_featured_latest" {...slotProps} />
      <LatestSection games={latest} />
      <HomePlacementSlot placement="last" {...slotProps} />
      <HomeSeoSection />
      <HomePageFooterActions />
    </>
  );
}
