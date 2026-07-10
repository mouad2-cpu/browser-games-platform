import { JsonLd } from "@/components/seo/json-ld";
import {
  buildCollectionPageSchema,
  buildFaqPageSchema,
  buildGamePageGraph,
  buildGraph,
  buildHomePageGraph,
  SITE_IN_LANGUAGE,
} from "@/lib/structured-data/builders";
import { descriptionToMetaDescription } from "@/lib/meta-description";
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
  const description =
    game.metaDescription ??
    (game.description ? descriptionToMetaDescription(game.description) : null);

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
          image: game.thumbnail,
          // Screenshots: not in DB yet — builder omits ImageObjects when empty.
          screenshots: [],
          genres: game.categories.map((c) => c.name),
          datePublished: game.releasedAt,
          dateModified: game.updatedAt,
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
