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

function overviewFromDescription(title: string, description: string | null, genreLower: string): string[] {
  if (description?.trim()) {
    const plain = descriptionToMetaDescription(description, 520);
    if (plain) {
      return [
        plain,
        `${title} is a free online ${genreLower} game you can play instantly in your browser on ${SITE_NAME}. No download or installation is required — just open the game and start playing on desktop, tablet, or mobile.`,
      ];
    }
  }

  return [
    `${title} is a free online ${genreLower} game where you jump straight into the action in your web browser. The core loop is easy to learn and rewarding to master, whether you want a quick session or a longer playthrough.`,
    `Play ${title} on ${SITE_NAME} with no downloads, no installs, and no sign-up. It runs as an HTML5 browser game on desktop, tablet, and mobile, so you can start playing in seconds.`,
  ];
}

function howToSteps(title: string, genreSlug: string): string[] {
  switch (genreSlug) {
    case "puzzle":
      return [
        `Open ${title} and read the first level’s goal — match, arrange, or clear the board according to the rules shown on screen.`,
        "Use your mouse, keyboard, or touch controls to make moves. Experiment early; most puzzles teach through play.",
        "Clear each stage to unlock the next. Watch for move limits, timers, or special tiles that change the strategy.",
        "Replay earlier levels to improve your score or finish with fewer moves once you understand the patterns.",
      ];
    case "racing":
      return [
        `Start ${title} and choose your vehicle or race mode if the game offers options.`,
        "Use keyboard arrows/WASD or on-screen controls to steer, accelerate, and brake around the track.",
        "Stay on course, avoid obstacles or rivals, and cross the finish line as fast as you can.",
        "Unlock new tracks or cars by winning races and improving your best times.",
      ];
    case "sports":
      return [
        `Launch ${title} and pick a match, challenge, or practice mode if available.`,
        "Use the on-screen prompts for shooting, passing, swinging, or aiming — timing is usually the key skill.",
        "Score points, win rounds, or complete objectives to progress through the game.",
        "Retry tough moments and refine your timing to beat your previous best performance.",
      ];
    case "strategy":
      return [
        `Begin ${title} and learn the basic resources, units, or build options in the first mission.`,
        "Plan ahead: gather resources, place defenses or units, and react to enemy waves or opposing moves.",
        "Complete objectives to unlock upgrades, new units, or harder stages.",
        "Try alternate strategies on replay — many strategy games reward experimentation.",
      ];
    case "arcade":
      return [
        `Press play in ${title} and learn the simple control scheme shown at the start.`,
        "Survive as long as you can, collect points, and react to rising difficulty.",
        "Use power-ups or special moves when they appear to extend your run.",
        "Chase a higher score each attempt — arcade games are built for quick restarts.",
      ];
    default:
      return [
        `Click play to load ${title} and follow any on-screen tutorial or control hints.`,
        "Use your keyboard, mouse, or touch controls to move, attack, or interact with the game world.",
        "Complete levels, defeat enemies, or beat objectives to progress and unlock new challenges.",
        "Retry after a fail, improve your timing, and push for a better score or clearer run.",
      ];
  }
}

function tipsForGenre(title: string, genreSlug: string): { proTip: string; commonMistake: string } {
  switch (genreSlug) {
    case "puzzle":
      return {
        proTip: `In ${title}, look a few moves ahead before committing. Clearing space early and saving special pieces for crowded boards usually beats rushing the first obvious match.`,
        commonMistake:
          "A common mistake is burning special boosts too early. Save them for levels with tight move limits or awkward layouts where a single smart clear saves the run.",
      };
    case "racing":
      return {
        proTip: `In ${title}, brake before sharp corners and accelerate out of the turn. Smooth lines beat raw speed — especially on later tracks.`,
        commonMistake:
          "New players often hold accelerate through every bend and slam into walls. Ease off early, keep control, then boost on the straights.",
      };
    case "strategy":
      return {
        proTip: `In ${title}, invest early in a reliable economy or core defense, then expand. A stable base makes mid-game spikes much easier to handle.`,
        commonMistake:
          "Spreading upgrades across everything at once leaves you weak everywhere. Specialize first, then branch out once your core plan is working.",
      };
    default:
      return {
        proTip: `In ${title}, master one or two core moves before chasing advanced tricks. Consistent basics clear more content than flashy but unreliable plays.`,
        commonMistake:
          "A common pitfall is ignoring on-screen cues and rushing. Watch enemy tells, timers, and UI prompts — they usually telegraph the next challenge.",
      };
  }
}

/**
 * OzoGames-style Game Overview / How to Play / Tips / Unblocked / FAQ copy
 * generated from title, genre, and description (no extra DB fields required).
 */
export function getGameSeoContent(input: GameSeoInput): GameSeoContent {
  const genre = primaryGenre(input.categories);
  const overview = overviewFromDescription(input.title, input.description, genre.lower);
  const tips = tipsForGenre(input.title, genre.slug);

  return {
    overviewTitle: "Game Overview",
    overview,
    specs: [
      { label: "Game Engine", value: "HTML5" },
      { label: "Input Mode", value: "Keyboard + Mouse / Touch" },
      { label: "Save Type", value: "Browser local storage" },
      { label: "Players", value: "Single-player" },
      { label: "Platform", value: "Web browser (desktop, mobile, tablet)" },
      { label: "Category", value: genre.name },
    ],
    howToTitle: `How to Play ${input.title}`,
    howToSteps: howToSteps(input.title, genre.slug),
    tipsTitle: `${input.title} Tips and Strategy`,
    proTip: tips.proTip,
    commonMistake: tips.commonMistake,
    unblockedTitle: `Play ${input.title} Unblocked`,
    unblocked: `You can play ${input.title} directly in your web browser with no download required. This free ${genre.lower} game runs as an HTML5 title on ${SITE_NAME}, so you can enjoy it on many school or work networks without installing software or using a VPN. Open the game page, hit play, and start instantly on desktop, tablet, or mobile.`,
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
      question: `Is ${title} free to play online?`,
      answer: `Yes. ${title} is a free ${genre.lower} browser game on ${SITE_NAME}. Open the game page and play instantly with no download or sign-up.`,
    },
    {
      question: `Can you play ${title} unblocked at school or work?`,
      answer: `${title} runs as an HTML5 game in a normal browser tab on ${SITE_NAME}, so many players can access it on restricted networks without installing software. Network filters still vary by location.`,
    },
    {
      question: `What genre is ${title}?`,
      answer: `${title} is listed as a ${genre.name} game. You can browse more ${genre.lower} titles in the ${genre.name} category on ${SITE_NAME}.`,
    },
  ];

  if (genre.slug === "puzzle") {
    faqs.push({
      question: `How do you win in ${title}?`,
      answer: `In ${title}, progress by solving boards or clearing objectives. Watch move limits and special tiles, then replay stages to improve your score.`,
    });
  } else if (genre.slug === "racing") {
    faqs.push({
      question: `How do you control ${title}?`,
      answer: `Use keyboard or on-screen controls to steer, accelerate, and brake in ${title}. Smooth cornering usually beats holding full speed through every turn.`,
    });
  } else if (genre.slug === "strategy") {
    faqs.push({
      question: `What should you upgrade first in ${title}?`,
      answer: `Early in ${title}, strengthen your core economy or defenses before spreading upgrades. A stable base makes later waves and missions much easier.`,
    });
  } else {
    faqs.push({
      question: `How do you control ${title}?`,
      answer: `Most players use a keyboard and mouse on desktop, or touch controls on mobile, to play ${title}. Check the in-game prompts for the exact layout.`,
    });
  }

  if (description?.trim()) {
    faqs.push({
      question: `What is ${title} about?`,
      answer: descriptionToMetaDescription(description, 220),
    });
  } else {
    faqs.push({
      question: `Does ${title} save progress?`,
      answer: `Many browser builds of ${title} store progress in local storage. Clearing site data or switching browsers may reset your save.`,
    });
  }

  return faqs;
}
