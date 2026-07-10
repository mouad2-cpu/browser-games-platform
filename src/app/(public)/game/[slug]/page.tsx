import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { getGameBySlug, getRelatedGames, getPopularGamesPaginated } from "@/lib/games";
import { descriptionToMetaDescription } from "@/lib/meta-description";
import { isStaffRole } from "@/lib/rbac";
import { getGameVoteStats, resolveVoterId } from "@/lib/game-votes.server";
import { SITE_URL } from "@/lib/site-config";
import { getGameSeoContent } from "@/lib/game-seo-content";
import { buildPageMetadata } from "@/lib/seo-metadata";
import { GameJsonLd } from "@/components/seo/structured-data";
import { GameClient } from "./game-client";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) return { title: "Game Not Found" };

  const title = game.metaTitle ?? `${game.title} - Play Online`;
  const description =
    game.metaDescription ??
    (game.description
      ? descriptionToMetaDescription(game.description)
      : `Play ${game.title} free online on ZenFun Games — instant HTML5 browser play, no download.`);

  return buildPageMetadata({
    path: `/game/${slug}`,
    title,
    description,
    ogTitle: game.metaTitle ?? game.title,
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

  const seoContent = getGameSeoContent({
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
        faqs={seoContent.faqs}
      />
      <GameClient
        game={game}
        relatedGames={playNextGames}
        siteUrl={SITE_URL}
        showPlayCount={showPlayCount}
        initialVoteStats={initialVoteStats}
        seoContent={seoContent}
      />
    </>
  );
}
