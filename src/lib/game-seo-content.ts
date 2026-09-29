import { SITE_NAME } from "@/lib/site-config";
import { descriptionToMetaDescription } from "@/lib/meta-description";
import type { FaqItemInput } from "@/lib/structured-data/types";

export type GameSeoSpec = {
  label: string;
  value: string;
};

export type GameSeoContent = {
  overviewTitle: string;
  overview: string[];
  specs: GameSeoSpec[];
  howToTitle: string;
  howToSteps: string[];
  tipsTitle: string;
  proTip: string;
  commonMistake: string;
  unblockedTitle: string;
  unblocked: string;
  /** Contextual links to the category cluster and list pages. */
  links: { href: string; label: string }[];
  faqs: FaqItemInput[];
};

type GameSeoInput = {
  title: string;
  slug: string;
  description: string | null;
  categories: { slug: string; name: string }[];
};

function primaryGenre(categories: { slug: string; name: string }[]): {
  name: string;
  lower: string;
  slug: string;
} {
  const primary = categories[0];
  if (!primary) {
    return { name: "browser", lower: "browser", slug: "games" };
  }
  const name = primary.name.replace(/\s+games$/i, "").trim() || primary.name;
  return { name, lower: name.toLowerCase(), slug: primary.slug };
}

function isGeneratedDescription(title: string, description: string | null): boolean {
  if (!description?.trim()) return true;
  return (
    description.includes(`**Play ${title} free online**`) ||
    description.includes(`Play ${title} free online on ${SITE_NAME}.`)
  );
}

function overviewFromDescription(title: string, description: string | null, genreLower: string): string[] {
  const playLine = `${title} is free to play in your browser on ${SITE_NAME}. It is an HTML5 ${genreLower} game — no download and no account. Press play on this page to start on desktop, tablet, or mobile.`;

  if (!isGeneratedDescription(title, description)) {
    const plain = descriptionToMetaDescription(description ?? "", 420);
    if (plain) return [plain, playLine];
  }

  return [playLine];
}

function howToSteps(title: string, genreSlug: string): string[] {
  const open = `Open ${title} on this page and press play. Nothing needs to be installed.`;
  const controls =
    "Follow the controls shown inside the game. Desktop builds usually use a keyboard or mouse; phones and tablets usually use touch.";

  switch (genreSlug) {
    case "puzzle":
      return [
        open,
        controls,
        "Read the goal on the first board, then make moves until the level clears.",
        "Replay a level if you want a cleaner solution or a better score.",
      ];
    case "racing":
      return [
        open,
        controls,
        "Steer through the course and finish the race. Later tracks are usually stricter about corners.",
        "Retry a run to improve your time.",
      ];
    case "sports":
      return [
        open,
        controls,
        "Use the prompts in the game for the main action, such as a shot, pass, or swing.",
        "Retry a round to improve your timing.",
      ];
    case "strategy":
      return [
        open,
        controls,
        "Learn the first objective, then spend resources or place units in the order the level asks for.",
        "Replay a mission if the first plan falls short.",
      ];
    case "arcade":
      return [
        open,
        controls,
        "Stay alive and score for as long as the round lasts. Difficulty usually rises as you continue.",
        "Start again after a run ends and try to beat that score.",
      ];
    default:
      return [
        open,
        controls,
        "Follow the on-screen goal, whether that is a score, a level, or a timer.",
        "Restart when a run ends and try to beat your last result.",
      ];
  }
}

function tipsForGenre(genreSlug: string): { proTip: string; commonMistake: string } {
  switch (genreSlug) {
    case "puzzle":
      return {
        proTip:
          "In most puzzle games, looking one or two moves ahead beats taking the first match you see.",
        commonMistake:
          "Using a limited boost on an easy board often leaves nothing for a tighter level later.",
      };
    case "racing":
      return {
        proTip: "In most racing games, easing off before a sharp corner keeps you faster overall than holding accelerate.",
        commonMistake: "Holding full speed through every bend usually ends in a wall.",
      };
    case "strategy":
      return {
        proTip: "A stable early setup — economy or defense — usually handles later waves better than spreading upgrades immediately.",
        commonMistake: "Upgrading everything at once often leaves the base weak when the first spike hits.",
      };
    default:
      return {
        proTip: "Learn the one or two controls the game shows first. Those usually matter more than extra moves.",
        commonMistake: "Skipping the on-screen prompts is the usual reason an early run ends.",
      };
  }
}

/**
 * On-page game copy from the title, category, and description.
 * Only states facts we actually know: free, HTML5, browser, category.
 */
export function getGameSeoContent(input: GameSeoInput): GameSeoContent {
  const genre = primaryGenre(input.categories);
  const overview = overviewFromDescription(input.title, input.description, genre.lower);
  const tips = tipsForGenre(genre.slug);

  return {
    overviewTitle: "About this game",
    overview,
    specs: [
      { label: "Price", value: "Free" },
      { label: "Technology", value: "HTML5" },
      { label: "Where it runs", value: "Web browser" },
      { label: "Devices", value: "Desktop, tablet, and mobile" },
      { label: "Category", value: genre.name },
    ],
    howToTitle: `How to play ${input.title}`,
    howToSteps: howToSteps(input.title, genre.slug),
    tipsTitle: "Tips",
    proTip: tips.proTip,
    commonMistake: tips.commonMistake,
    unblockedTitle: `Play ${input.title} unblocked`,
    unblocked: `${input.title} loads in the browser on ${SITE_NAME}, so there is nothing to install. Many school and work networks allow that. If a filter still blocks the page, that is set by the network, not by the game.`,
    links: [
      ...(genre.slug && genre.slug !== "games"
        ? [{ href: `/c/${genre.slug}`, label: `free ${genre.lower} games` }]
        : []),
      { href: "/popular", label: "popular unblocked games" },
      { href: "/new", label: "new unblocked games" },
    ],
    faqs: buildGameSpecificFaqs(input.title, genre, input.description),
  };
}

function buildGameSpecificFaqs(
  title: string,
  genre: { name: string; lower: string; slug: string },
  description: string | null
): FaqItemInput[] {
  const faqs: FaqItemInput[] = [
    {
      question: `Is ${title} free?`,
      answer: `Yes. ${title} is free on ${SITE_NAME}. Open this page and press play. There is no download and no account.`,
    },
    {
      question: `Can I play ${title} unblocked?`,
      answer: `${title} runs in a browser tab, which is why people search for it as an unblocked game. Whether a school or work network allows the page depends on that network’s filter.`,
    },
    {
      question: `What kind of game is ${title}?`,
      answer: `${title} is in the ${genre.name} category on ${SITE_NAME}. You can browse more ${genre.lower} games from that category.`,
    },
    {
      question: `Does ${title} work on mobile?`,
      answer: `${title} is an HTML5 browser game, so it can run on a phone or tablet as well as a computer. Use the controls the game shows on that device.`,
    },
  ];

  if (description?.trim() && !isGeneratedDescription(title, description)) {
    faqs.unshift({
      question: `What is ${title} about?`,
      answer: descriptionToMetaDescription(description, 220),
    });
  }

  return faqs;
}
