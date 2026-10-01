import { JsonLd } from "@/components/seo/json-ld";
import {
  buildCollectionPageSchema,
  buildFaqPageSchema,
  buildGamePageGraph,
  buildGraph,
  buildHomePageGraph,
  SITE_IN_LANGUAGE,
} from "@/lib/structured-data/builders";
import { resolveGameMetaDescription } from "@/lib/seo-metadata";
import {
  isRetroDriftSlug,
  RETRO_DRIFT_DESCRIPTION,
  RETRO_DRIFT_GAMEPLAY_ALT,
  RETRO_DRIFT_GAMEPLAY_IMAGE,
  RETRO_DRIFT_MAIN_ALT,
  RETRO_DRIFT_MAIN_IMAGE,
} from "@/lib/retro-drift-seo";
import {
  CARS_ARENA_DESCRIPTION,
  CARS_ARENA_GAMEPLAY_ALT,
  CARS_ARENA_GAMEPLAY_IMAGE,
  CARS_ARENA_MAIN_ALT,
  CARS_ARENA_MAIN_IMAGE,
  isCarsArenaSlug,
} from "@/lib/cars-arena-seo";
import {
  isMrBulletSlug,
  MR_BULLET_DESCRIPTION,
  MR_BULLET_IMAGE_ALT,
} from "@/lib/mr-bullet-seo";
import { translate } from "@/lib/i18n";
import { SITE_NAME } from "@/lib/site-config";
import { absoluteUrl } from "@/lib/structured-data/urls";
import type { GameCard, GameDetail } from "@/lib/games";
import type { FaqItemInput } from "@/lib/structured-data/types";

type VoteLike = { likes: number; dislikes: number };

export function HomeJsonLd({
  featuredGames = [],
}: {
  featuredGames?: Array<{ slug: string; title: string }>;
} = {}) {
  return (
    <JsonLd
      data={buildHomePageGraph({
        name: translate("en", "meta.siteTitle"),
        description: translate("en", "meta.siteDescription", { siteName: SITE_NAME }),
        inLanguage: SITE_IN_LANGUAGE,
        featuredGames: featuredGames.map((game) => ({
          name: game.title,
          path: `/game/${game.slug}`,
        })),
      })}
    />
  );
}

export function GameJsonLd({
  game,
  votes,
  faqs = [],
}: {
  game: GameDetail;
  votes: VoteLike;
  faqs?: FaqItemInput[];
}) {
  const retroDrift = isRetroDriftSlug(game.slug);
  const carsArena = isCarsArenaSlug(game.slug);
  const mrBullet = isMrBulletSlug(game.slug);
  const customSeo = retroDrift || carsArena || mrBullet;
  const description = retroDrift
    ? RETRO_DRIFT_DESCRIPTION
    : carsArena
      ? CARS_ARENA_DESCRIPTION
      : mrBullet
        ? MR_BULLET_DESCRIPTION
        : resolveGameMetaDescription(game.title, game.metaDescription ?? game.description);

  const primaryCategory = game.categories[0];
  const gamePath = `/game/${game.slug}`;
  const breadcrumbs = [
    { name: "Home", path: "/", itemId: absoluteUrl("/#webpage") },
    ...(primaryCategory
      ? [
          {
            name: primaryCategory.name,
            path: `/c/${primaryCategory.slug}`,
            itemId: absoluteUrl(`/c/${primaryCategory.slug}#collection`),
          },
        ]
      : []),
    {
      name: game.title,
      path: gamePath,
      itemId: absoluteUrl(`${gamePath}#webpage`),
    },
  ];

  return (
    <JsonLd
      data={buildGamePageGraph({
        game: {
          name: game.title,
          description,
          path: gamePath,
          image: retroDrift
            ? RETRO_DRIFT_MAIN_IMAGE
            : carsArena
              ? CARS_ARENA_MAIN_IMAGE
              : game.thumbnail,
          imageAlt: retroDrift
            ? RETRO_DRIFT_MAIN_ALT
            : carsArena
              ? CARS_ARENA_MAIN_ALT
              : mrBullet
                ? MR_BULLET_IMAGE_ALT
                : undefined,
          screenshots: retroDrift
            ? [RETRO_DRIFT_GAMEPLAY_IMAGE]
            : carsArena
              ? [CARS_ARENA_GAMEPLAY_IMAGE]
              : [],
          screenshotAlts: retroDrift
            ? [RETRO_DRIFT_GAMEPLAY_ALT]
            : carsArena
              ? [CARS_ARENA_GAMEPLAY_ALT]
              : undefined,
          omitUnblockedKeyword: retroDrift || carsArena,
          omitAuthor: customSeo,
          omitOffer: customSeo,
          genres: game.categories.map((c) => c.name),
          datePublished: game.releasedAt,
          dateModified: customSeo ? undefined : game.updatedAt,
          aggregateRating: votes,
        },
        breadcrumbs,
        faqs,
      })}
    />
  );
}

export function CategoryJsonLd({
  name,
  description,
  slug,
  games,
  faqs = [],
}: {
  name: string;
  description: string;
  slug: string;
  games: GameCard[];
  faqs?: FaqItemInput[];
}) {
  const path = `/c/${slug}`;
  const nodes = buildCollectionPageSchema({
    name,
    description,
    path,
    items: games.map((game) => ({
      name: game.title,
      path: `/game/${game.slug}`,
      image: game.thumbnail,
    })),
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name, path },
    ],
  });

  if (faqs.length > 0) {
    nodes.push(buildFaqPageSchema(faqs, { path }));
  }

  return <JsonLd data={buildGraph(nodes)} />;
}

/** Tag pages share CollectionPage + ItemList + BreadcrumbList (same shape as categories). */
export function TagJsonLd(props: {
  name: string;
  description: string;
  slug: string;
  games: GameCard[];
}) {
  return <CategoryJsonLd {...props} />;
}

export function CollectionJsonLd({
  name,
  description,
  path,
  games,
  faqs = [],
}: {
  name: string;
  description: string;
  path: string;
  games: GameCard[];
  faqs?: FaqItemInput[];
}) {
  const nodes = buildCollectionPageSchema({
    name,
    description,
    path,
    items: games.map((game) => ({
      name: game.title,
      path: `/game/${game.slug}`,
      image: game.thumbnail,
    })),
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name, path },
    ],
  });

  if (faqs.length > 0) {
    nodes.push(buildFaqPageSchema(faqs, { path }));
  }

  return <JsonLd data={buildGraph(nodes)} />;
}

export function FaqJsonLd({ items }: { items: FaqItemInput[] }) {
  return <JsonLd data={buildGraph([buildFaqPageSchema(items)])} />;
}
