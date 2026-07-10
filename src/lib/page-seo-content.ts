import { SITE_NAME } from "@/lib/site-config";
import type { SeoContent } from "@/lib/category-seo-content";

/**
 * Collection / list page SEO — same shape as category SEO:
 * { aboutTitle, paragraphs, faqs }
 *
 * Keys match public route slugs (like category slugs).
 */
export type PageSeoSlug =
  | "new"
  | "popular"
  | "top-picks"
  | "all-games"
  | "continue-playing";

/** Map legacy camelCase page keys → route slugs. */
const PAGE_KEY_TO_SLUG: Record<string, PageSeoSlug> = {
  new: "new",
  popular: "popular",
  topPicks: "top-picks",
  allGames: "all-games",
  continuePlaying: "continue-playing",
  "top-picks": "top-picks",
  "all-games": "all-games",
  "continue-playing": "continue-playing",
};

type PageLabels = {
  title: string;
  name: string;
  lower: string;
};

function labelsFrom(name: string): PageLabels {
  const trimmed = name.trim();
  const title = /games$/i.test(trimmed) ? trimmed : trimmed;
  return {
    title,
    name: trimmed,
    lower: trimmed.toLowerCase(),
  };
}

const PAGE_SEO_BY_SLUG: Record<string, (labels: PageLabels) => SeoContent> = {
  popular: (l) => ({
    aboutTitle: "About this page",
    paragraphs: [
      `${l.title} on ${SITE_NAME} highlight the free online browser games players open most often. This page is sorted by play count so you can quickly find proven favorites — from fast action and arcade hits to puzzles, racing, sports, and strategy titles.`,
      `Whether you want unblocked games for a short break or a longer session of free online games, ${l.title} is the best place to start. Every title runs instantly in your browser with HTML5 — no downloads, no installs, and no sign-up required.`,
      `Browse the grid above to jump into trending games on desktop, tablet, or mobile. New plays keep this list fresh, so check back often to discover what the community is enjoying right now.`,
    ],
    faqs: [
      {
        question: `How are ${l.title} ranked?`,
        answer: `${l.title} on ${SITE_NAME} are ordered by play count so the most-played free browser games appear first.`,
      },
      {
        question: `Do I need to download ${l.title}?`,
        answer: "No. All games are free HTML5 browser games — open a title and play instantly.",
      },
      {
        question: `Can I play ${l.title} on mobile?`,
        answer: "Yes. Most popular titles work on mobile and tablet browsers as well as desktop.",
      },
      {
        question: `Are ${l.title} unblocked?`,
        answer: `Many ${l.title} on ${SITE_NAME} are designed to play in a normal browser tab, which helps on networks where downloads or installs are restricted.`,
      },
    ],
  }),

  new: (l) => ({
    aboutTitle: "About this page",
    paragraphs: [
      `${l.title} on ${SITE_NAME} showcase the latest free online browser games added to the catalog. Use this page to discover fresh HTML5 titles as soon as they go live — including action, puzzle, racing, sports, arcade, and strategy releases.`,
      `Every new game is ready to play instantly with no download. Whether you are looking for unblocked games, quick arcade sessions, or longer browser adventures, the ${l.title} list keeps your library up to date.`,
      `Check back regularly: we add new free online games often so there is always something new to try on desktop, tablet, or mobile.`,
    ],
    faqs: [
      {
        question: `How often are ${l.title} added?`,
        answer: `${SITE_NAME} adds new free browser games regularly. This page always shows the most recently published titles first.`,
      },
      {
        question: `Are ${l.title} free to play?`,
        answer: `Yes. ${l.title} are free online HTML5 games with no download required.`,
      },
      {
        question: `Can I play ${l.title} at school or work?`,
        answer:
          "Many new browser games work in a standard browser tab. Availability depends on your network filters.",
      },
      {
        question: `Do ${l.title} work on phones?`,
        answer: "Most new titles support desktop and mobile browsers.",
      },
    ],
  }),

  "top-picks": (l) => ({
    aboutTitle: "About this page",
    paragraphs: [
      `${l.title} on ${SITE_NAME} bring together recommended free online games chosen to help you find something great fast. This mix blends popular browser games with strong featured titles so you can skip endless scrolling and start playing sooner.`,
      `Use ${l.title} when you want a curated shortlist of unblocked-friendly HTML5 games across genres — action, puzzle, racing, sports, arcade, and more — all playable instantly with no downloads.`,
      `Explore the picks above, open a game, and enjoy free browser gaming on desktop, tablet, or mobile.`,
    ],
    faqs: [
      {
        question: `What are ${l.title}?`,
        answer: `${l.title} are recommended free online games on ${SITE_NAME}, combining popular and featured titles to help you choose quickly.`,
      },
      {
        question: `Do ${l.title} require an account?`,
        answer: `No. You can play ${l.title} instantly in your browser without signing up.`,
      },
      {
        question: `Are ${l.title} updated over time?`,
        answer: "Yes. Recommendations evolve as new games are added and player interest changes.",
      },
      {
        question: `Can I play ${l.title} on mobile?`,
        answer: "Yes. Most recommended games work on mobile and desktop browsers.",
      },
    ],
  }),

  "all-games": (l) => ({
    aboutTitle: "About this page",
    paragraphs: [
      `${l.title} is the full free online games catalog on ${SITE_NAME}. Browse every published HTML5 browser game in one place — from popular hits and new releases to niche favorites across action, puzzle, racing, sports, arcade, strategy, and more.`,
      `This page is ideal when you want to explore the complete library of unblocked-friendly browser games with no downloads. Pick any title from the grid and start playing instantly on desktop, tablet, or mobile.`,
      `Use pagination to move through the catalog, or jump to Popular Games and New Games when you want a shorter, focused list.`,
    ],
    faqs: [
      {
        question: `What is included in ${l.title}?`,
        answer: `${l.title} lists every free published browser game currently available on ${SITE_NAME}.`,
      },
      {
        question: "Do I need to install anything?",
        answer: "No. All Games are HTML5 browser games — play online with no download.",
      },
      {
        question: "How do I find a specific game?",
        answer: "Use the site search, browse categories, or scan All Games page by page.",
      },
      {
        question: `Are ${l.title} free?`,
        answer: `Yes. The ${SITE_NAME} catalog is built around free online games you can play in your browser.`,
      },
    ],
  }),

  "continue-playing": (l) => ({
    aboutTitle: "About this page",
    paragraphs: [
      `${l.title} helps you jump back into free online games you recently opened on ${SITE_NAME}. It is a personal shortcut list based on your recent activity in this browser, so you can resume favorites without searching again.`,
      `If the list is empty, play any browser game once and it can appear here for quick return visits. All titles remain free HTML5 games with no downloads required.`,
    ],
    faqs: [
      {
        question: `Why is ${l.title} empty?`,
        answer: "Play a game first. Recently opened games in this browser can then show up here.",
      },
      {
        question: `Does ${l.title} sync across devices?`,
        answer:
          "It is based on recent activity in your current browser. Switching devices or clearing site data may reset the list.",
      },
      {
        question: "Are these games free?",
        answer: `Yes. ${l.title} only includes free online browser games from ${SITE_NAME}.`,
      },
    ],
  }),
};

const PAGE_DEFAULT_NAMES: Record<PageSeoSlug, string> = {
  new: "New Games",
  popular: "Popular Games",
  "top-picks": "Top Picks",
  "all-games": "All Games",
  "continue-playing": "Continue Playing",
};

function buildGenericPageSeo(labels: PageLabels): SeoContent {
  return {
    aboutTitle: "About this page",
    paragraphs: [
      `${labels.title} on ${SITE_NAME} collects free online browser games you can play instantly — no downloads, no installs, and no sign-up required.`,
      `Every title runs in your browser with modern HTML5 technology on desktop, tablet, or mobile. Browse the grid above and start playing in seconds.`,
    ],
    faqs: [
      {
        question: `What is the ${labels.title} page?`,
        answer: `This page lists free online games on ${SITE_NAME} related to ${labels.lower}.`,
      },
      {
        question: "Do I need to download these games?",
        answer: "No. All games are free HTML5 browser games.",
      },
      {
        question: "Can I play on mobile?",
        answer: "Yes. Most titles work on mobile and tablet browsers as well as desktop.",
      },
    ],
  };
}

/**
 * Long-form About + FAQ copy for collection pages.
 * Same data structure and API shape as getCategorySeoContent(slug, name).
 */
export function getPageSeoContent(slugOrKey: string, name?: string): SeoContent {
  const slug = PAGE_KEY_TO_SLUG[slugOrKey] ?? (slugOrKey as PageSeoSlug);
  const displayName = name?.trim() || PAGE_DEFAULT_NAMES[slug] || slugOrKey;
  const labels = labelsFrom(displayName);
  const builder = PAGE_SEO_BY_SLUG[slug];
  return builder ? builder(labels) : buildGenericPageSeo(labels);
}

/** @deprecated Use route slug strings with getPageSeoContent. */
export type PageSeoKey = "new" | "popular" | "topPicks" | "allGames" | "continuePlaying";
