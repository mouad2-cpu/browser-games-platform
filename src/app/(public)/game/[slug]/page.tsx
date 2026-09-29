import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { getGameBySlug, getRelatedGames, getPopularGamesPaginated } from "@/lib/games";
import { isStaffRole } from "@/lib/rbac";
import { getGameVoteStats, resolveVoterId } from "@/lib/game-votes.server";
import { SITE_URL } from "@/lib/site-config";
import { getGameSeoContent } from "@/lib/game-seo-content";
import {
  isRetroDriftSlug,
  RETRO_DRIFT_DESCRIPTION,
  RETRO_DRIFT_FAQS,
  RETRO_DRIFT_H1,
  RETRO_DRIFT_TITLE,
} from "@/lib/retro-drift-seo";
import {
  buildPageMetadata,
  resolveGameMetaDescription,
  resolveGameMetaTitle,
} from "@/lib/seo-metadata";
import { GameJsonLd } from "@/components/seo/structured-data";
import { GameClient } from "./game-client";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) return { title: "Game Not Found" };

  if (isRetroDriftSlug(slug)) {
    return buildPageMetadata({
      path: `/game/${slug}`,
      title: RETRO_DRIFT_TITLE,
      description: RETRO_DRIFT_DESCRIPTION,
      ogTitle: RETRO_DRIFT_TITLE,
      absoluteTitle: true,
      exactDescription: true,
      images: game.thumbnail ? [game.thumbnail] : undefined,
    });
  }

  const title = resolveGameMetaTitle(game.title, game.metaTitle);
  const description = resolveGameMetaDescription(
    game.title,
    game.metaDescription ?? game.description
  );

  return buildPageMetadata({
    path: `/game/${slug}`,
    title,
    description,
    ogTitle: title,
    absoluteTitle: true,
    images: game.thumbnail ? [game.thumbnail] : undefined,
  });
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) notFound();

  const [relatedGames, session, voterId] = await Promise.all([
    getRelatedGames(game.id, 20),
    getSession(),
    resolveVoterId(),
  ]);

  const showPlayCount = session ? isStaffRole(session.role) : false;
  const initialVoteStats = await getGameVoteStats(game.id, voterId);

  let playNextGames = relatedGames;
  if (playNextGames.length === 0) {
    const popular = await getPopularGamesPaginated(1, 20);
    playNextGames = popular.games.filter((g) => g.id !== game.id);
  }

  const retroDrift = isRetroDriftSlug(slug);
  const seoContent = retroDrift
    ? null
    : getGameSeoContent({
        title: game.title,
        slug: game.slug,
        description: game.description,
        categories: game.categories,
      });

  return (
    <>
      <GameJsonLd
        game={game}
        votes={{ likes: initialVoteStats.likes, dislikes: initialVoteStats.dislikes }}
        faqs={retroDrift ? RETRO_DRIFT_FAQS : seoContent!.faqs}
      />
      <GameClient
        game={game}
        relatedGames={playNextGames}
        siteUrl={SITE_URL}
        showPlayCount={showPlayCount}
        initialVoteStats={initialVoteStats}
        seoContent={seoContent}
        pageTitle={
          retroDrift ? RETRO_DRIFT_H1 : resolveGameMetaTitle(game.title, game.metaTitle)
        }
      />
    </>
  );
}
