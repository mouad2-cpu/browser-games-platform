import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { getGameBySlug, getRelatedGames, getPopularGamesPaginated, type GameDetail } from "@/lib/games";
import { isStaffRole } from "@/lib/rbac";
import { getGameVoteStats, resolveVoterId } from "@/lib/game-votes.server";
import { SITE_URL } from "@/lib/site-config";
import { getGameSeoContent } from "@/lib/game-seo-content";
import {
  isRetroDriftSlug,
  RETRO_DRIFT_DESCRIPTION,
  RETRO_DRIFT_FAQS,
  RETRO_DRIFT_GAMEPLAY_ALT,
  RETRO_DRIFT_GAMEPLAY_IMAGE,
  RETRO_DRIFT_H1,
  RETRO_DRIFT_TITLE,
} from "@/lib/retro-drift-seo";
import {
  CARS_ARENA_DESCRIPTION,
  CARS_ARENA_FAQS,
  CARS_ARENA_GAMEPLAY_ALT,
  CARS_ARENA_GAMEPLAY_IMAGE,
  CARS_ARENA_H1,
  CARS_ARENA_TITLE,
  isCarsArenaSlug,
} from "@/lib/cars-arena-seo";
import {
  isMrBulletSlug,
  MR_BULLET_DESCRIPTION,
  MR_BULLET_FAQS,
  MR_BULLET_H1,
  MR_BULLET_IMAGE,
  MR_BULLET_IMAGE_ALT,
  MR_BULLET_IMAGE_HEIGHT,
  MR_BULLET_IMAGE_WIDTH,
  MR_BULLET_TITLE,
} from "@/lib/mr-bullet-seo";
import {
  buildPageMetadata,
  resolveGameMetaDescription,
  resolveGameMetaTitle,
} from "@/lib/seo-metadata";
import { GameJsonLd } from "@/components/seo/structured-data";
import { GameClient } from "./game-client";

function scrubUnblockedCopy(game: GameDetail): GameDetail {
  const drop = (value: string | null) => (value && /unblocked/i.test(value) ? null : value);
  return {
    ...game,
    description: drop(game.description),
    metaDescription: drop(game.metaDescription),
    metaTitle: drop(game.metaTitle),
  };
}

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
      images: [RETRO_DRIFT_GAMEPLAY_IMAGE],
      imageAlt: RETRO_DRIFT_GAMEPLAY_ALT,
      imageWidth: 1024,
      imageHeight: 480,
    });
  }

  if (isCarsArenaSlug(slug)) {
    return buildPageMetadata({
      path: `/game/${slug}`,
      title: CARS_ARENA_TITLE,
      description: CARS_ARENA_DESCRIPTION,
      ogTitle: CARS_ARENA_TITLE,
      absoluteTitle: true,
      exactDescription: true,
      images: [CARS_ARENA_GAMEPLAY_IMAGE],
      imageAlt: CARS_ARENA_GAMEPLAY_ALT,
      imageWidth: 1024,
      imageHeight: 475,
    });
  }

  if (isMrBulletSlug(slug)) {
    return buildPageMetadata({
      path: `/game/${slug}`,
      title: MR_BULLET_TITLE,
      description: MR_BULLET_DESCRIPTION,
      ogTitle: MR_BULLET_TITLE,
      absoluteTitle: true,
      exactDescription: true,
      images: [game.thumbnail || MR_BULLET_IMAGE],
      imageAlt: MR_BULLET_IMAGE_ALT,
      imageWidth: MR_BULLET_IMAGE_WIDTH,
      imageHeight: MR_BULLET_IMAGE_HEIGHT,
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
  const carsArena = isCarsArenaSlug(slug);
  const mrBullet = isMrBulletSlug(slug);
  const customSeo = retroDrift || carsArena || mrBullet;
  const seoContent = customSeo
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
        faqs={
          retroDrift
            ? RETRO_DRIFT_FAQS
            : carsArena
              ? CARS_ARENA_FAQS
              : mrBullet
                ? MR_BULLET_FAQS
                : seoContent!.faqs
        }
      />
      <GameClient
        game={customSeo ? scrubUnblockedCopy(game) : game}
        relatedGames={playNextGames}
        siteUrl={SITE_URL}
        showPlayCount={showPlayCount}
        initialVoteStats={initialVoteStats}
        seoContent={seoContent}
        pageTitle={
          retroDrift
            ? RETRO_DRIFT_H1
            : carsArena
              ? CARS_ARENA_H1
              : mrBullet
                ? MR_BULLET_H1
                : resolveGameMetaTitle(game.title, game.metaTitle)
        }
      />
    </>
  );
}
