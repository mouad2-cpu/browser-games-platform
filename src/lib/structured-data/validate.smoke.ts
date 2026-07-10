/**
 * Smoke-test structured data builders + validation.
 * Run: npx tsx src/lib/structured-data/validate.smoke.ts
 */
import {
  buildAggregateRatingSchema,
  buildCollectionPageSchema,
  buildFaqPageSchema,
  buildGamePageGraph,
  buildHomePageGraph,
  SITE_IDS,
  MIN_AGGREGATE_RATING_VOTES,
} from "./builders";
import { absoluteUrl } from "./urls";
import { validateJsonLd } from "./validate";

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

function findByType(graph: ReturnType<typeof buildHomePageGraph>["@graph"], type: string) {
  return graph.find((n) =>
    Array.isArray(n["@type"]) ? n["@type"].includes(type) : n["@type"] === type
  );
}

const home = buildHomePageGraph({
  name: "Play Free Browser Games Online",
  description: "ZenFun Games features free online browser games.",
  featuredGames: [
    { name: "Game A", path: "/game/a" },
    { name: "Game B", path: "/game/b" },
    { name: "Game A", path: "/game/a" },
  ],
});

const homeValidation = validateJsonLd(home);
assert(homeValidation.valid, `homepage graph should be valid: ${JSON.stringify(homeValidation.issues)}`);

const website = findByType(home["@graph"], "WebSite");
assert(website, "homepage should include WebSite");
assert(website?.inLanguage === "en", "WebSite inLanguage should be English-only");
assert(website?.publisher && typeof website.publisher === "object", "WebSite publisher set");
assert(website?.potentialAction, "WebSite SearchAction set");
assert(
  JSON.stringify(website?.potentialAction).includes("/search?s={search_term_string}"),
  "SearchAction must use real /search?s= route"
);

assert(findByType(home["@graph"], "Organization"), "homepage should include Organization");

const webpage = findByType(home["@graph"], "WebPage");
assert(webpage, "homepage should keep WebPage (not CollectionPage)");
assert(
  JSON.stringify(webpage?.breadcrumb) === JSON.stringify({ "@id": SITE_IDS.breadcrumb }),
  "WebPage breadcrumb references BreadcrumbList"
);
assert(
  JSON.stringify(webpage?.mainEntity) === JSON.stringify({ "@id": SITE_IDS.featuredList }),
  "WebPage mainEntity references featured ItemList"
);
assert(
  !("primaryImageOfPage" in (webpage ?? {})),
  "WebPage must not set primaryImageOfPage (no homepage representative image; logo is not a substitute)"
);

const org = findByType(home["@graph"], "Organization");
assert(
  JSON.stringify(org?.logo) === JSON.stringify({ "@id": SITE_IDS.logo }) &&
    JSON.stringify(org?.image) === JSON.stringify({ "@id": SITE_IDS.logo }),
  "Organization logo and image both point at the same ImageObject"
);
assert(!("sameAs" in (org ?? {})), "Organization must not invent empty sameAs social profiles");
assert(!("email" in (org ?? {})), "Organization must not include email");

const logo = findByType(home["@graph"], "ImageObject");
assert(logo, "homepage should include ImageObject");
assert(logo?.representativeOfPage === false, "logo ImageObject is not representativeOfPage");

const breadcrumb = findByType(home["@graph"], "BreadcrumbList");
assert(breadcrumb?.["@id"] === SITE_IDS.breadcrumb, "BreadcrumbList has stable @id");
assert(
  Array.isArray(breadcrumb?.itemListElement) && breadcrumb.itemListElement.length === 1,
  "Homepage breadcrumb is Home only"
);
const crumb = breadcrumb?.itemListElement?.[0] as Record<string, unknown> | undefined;
assert(crumb?.["@type"] === "ListItem", "breadcrumb ListItem typed");
assert(crumb?.position === 1, "breadcrumb position starts at 1");
assert(typeof crumb?.item === "string", "breadcrumb item is the page URL");
assert(typeof crumb?.name === "string", "breadcrumb name present");

const itemList = findByType(home["@graph"], "ItemList");
assert(itemList?.["@id"] === SITE_IDS.featuredList, "featured ItemList present");
assert(itemList?.name === "Featured Free Online Games", "featured ItemList renamed");
assert(itemList?.numberOfItems === 2, "featured ItemList dedupes duplicate games");
assert(
  Array.isArray(itemList?.itemListElement) &&
    itemList.itemListElement.every((entry) => {
      if (typeof entry !== "object" || entry === null) return false;
      const row = entry as Record<string, unknown>;
      const item = row.item;
      if (typeof item !== "object" || item === null) return false;
      const entity = item as Record<string, unknown>;
      return (
        row["@type"] === "ListItem" &&
        typeof row.position === "number" &&
        entity["@type"] === "VideoGame" &&
        typeof entity["@id"] === "string" &&
        String(entity["@id"]).endsWith("#game") &&
        typeof entity.name === "string" &&
        !("url" in row) &&
        !("name" in row)
      );
    }),
  "ListItem uses position + item{@id,@type,name} without duplicating name/url on the ListItem"
);

assert(!findByType(home["@graph"], "CollectionPage"), "homepage should not use CollectionPage");

const game = buildGamePageGraph({
  game: {
    name: "Test Game",
    description: "A fun browser game.",
    path: "/game/test-game",
    image: "/uploads/test.png",
    imageWidth: 512,
    imageHeight: 512,
    screenshots: [],
    genres: ["Strategy"],
    datePublished: "2026-01-01",
    dateModified: "2026-06-01",
    aggregateRating: { likes: 8, dislikes: 2 },
  },
  breadcrumbs: [
    { name: "Home", path: "/" },
    { name: "Strategy", path: "/c/strategy" },
    { name: "Test Game", path: "/game/test-game" },
  ],
  faqs: [{ question: "Is Test Game free?", answer: "Yes." }],
});
const gameValidation = validateJsonLd(game);
assert(
  gameValidation.valid,
  `game graph should be valid: ${JSON.stringify(gameValidation.issues)}`
);

const videoGame = findByType(game["@graph"], "VideoGame");
assert(videoGame, "game graph should include VideoGame");
assert(videoGame?.inLanguage === "en", "VideoGame should declare inLanguage");
assert(
  typeof videoGame?.keywords === "string" &&
    String(videoGame.keywords).includes("Test Game") &&
    String(videoGame.keywords).includes("Browser Game"),
  "VideoGame should include short relevant keywords"
);
assert(videoGame?.aggregateRating, "game with enough votes should include AggregateRating");
assert(
  JSON.stringify(videoGame?.publisher) === JSON.stringify({ "@id": SITE_IDS.organization }) &&
    JSON.stringify(videoGame?.author) === JSON.stringify({ "@id": SITE_IDS.organization }),
  "author/publisher must reference homepage Organization @id"
);
assert(!findByType(game["@graph"], "Organization"), "game page must not duplicate Organization");

const gameWebPage = findByType(game["@graph"], "WebPage");
assert(gameWebPage, "game page should include WebPage");
assert(
  JSON.stringify(gameWebPage?.mainEntity) ===
    JSON.stringify({ "@id": absoluteUrl("/game/test-game#game") }),
  "WebPage.mainEntity points to VideoGame"
);
assert(
  JSON.stringify(gameWebPage?.about) === JSON.stringify({ "@id": SITE_IDS.organization }),
  "WebPage.about points to Organization"
);
assert(
  JSON.stringify(gameWebPage?.isPartOf) === JSON.stringify({ "@id": SITE_IDS.website }),
  "WebPage.isPartOf points to WebSite"
);

const gameImage = game["@graph"].find(
  (n) => n["@type"] === "ImageObject" && n["@id"] === absoluteUrl("/game/test-game#image")
);
assert(gameImage, "thumbnail ImageObject has stable @id");
assert(gameImage?.width === 512 && gameImage?.height === 512, "ImageObject includes dimensions");
assert(
  JSON.stringify(videoGame?.image) === JSON.stringify({ "@id": absoluteUrl("/game/test-game#image") }),
  "VideoGame.image references ImageObject @id"
);
assert(!("screenshot" in (videoGame ?? {})), "no screenshot objects when game has none");

const gameBreadcrumb = findByType(game["@graph"], "BreadcrumbList");
const crumbItems = gameBreadcrumb?.itemListElement as Array<Record<string, unknown>>;
assert(
  JSON.stringify(crumbItems?.[0]?.item) === JSON.stringify({ "@id": SITE_IDS.webpage }),
  "breadcrumb Home references homepage WebPage"
);
assert(
  JSON.stringify(crumbItems?.[1]?.item) ===
    JSON.stringify({ "@id": absoluteUrl("/c/strategy#collection") }),
  "breadcrumb category references CollectionPage"
);
assert(
  JSON.stringify(crumbItems?.[2]?.item) ===
    JSON.stringify({ "@id": absoluteUrl("/game/test-game#webpage") }),
  "breadcrumb game references game WebPage"
);

assert(findByType(game["@graph"], "FAQPage"), "game page keeps FAQPage");

assert(
  buildAggregateRatingSchema({ likes: 1, dislikes: 0 }) === null,
  `AggregateRating should require at least ${MIN_AGGREGATE_RATING_VOTES} votes`
);

const gameWithShots = buildGamePageGraph({
  game: {
    name: "Shot Game",
    description: null,
    path: "/game/shot-game",
    screenshots: ["/uploads/s1.png", "/uploads/s2.jpg"],
  },
  breadcrumbs: [{ name: "Home", path: "/" }, { name: "Shot Game", path: "/game/shot-game" }],
});
const shotGame = findByType(gameWithShots["@graph"], "VideoGame");
assert(
  Array.isArray(shotGame?.screenshot) && shotGame.screenshot.length === 2,
  "screenshots emit ImageObject refs when present"
);
assert(
  gameWithShots["@graph"].filter((n) => n["@type"] === "ImageObject").length === 2,
  "only screenshot ImageObjects when no thumbnail"
);

const collection = buildCollectionPageSchema({
  name: "Strategy Games",
  description: "Play free strategy games.",
  path: "/c/strategy",
  items: [{ name: "Test Game", path: "/game/test-game", image: "/uploads/test.png" }],
  breadcrumbs: [
    { name: "Home", path: "/" },
    { name: "Strategy Games", path: "/c/strategy" },
  ],
});
assert(
  validateJsonLd({ "@context": "https://schema.org", "@graph": collection }).valid,
  "collection should be valid"
);

const faq = buildFaqPageSchema([{ question: "Can I play on mobile?", answer: "Yes." }]);
assert(validateJsonLd(faq).valid, "FAQPage should be valid");

console.log("structured-data smoke tests passed");
