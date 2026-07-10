import { SITE_NAME } from "@/lib/site-config";
import type { FaqItemInput } from "@/lib/structured-data/types";

/** Shared About + FAQ block used by category pages and collection pages. */
export type SeoContent = {
  aboutTitle: string;
  paragraphs: string[];
  faqs: FaqItemInput[];
};

/** @deprecated Prefer SeoContent — kept for existing category imports. */
export type CategorySeoContent = SeoContent;

type CategoryLabels = {
  title: string;
  name: string;
  lower: string;
};

function labelsFrom(name: string): CategoryLabels {
  const trimmed = name.trim();
  const title = /games$/i.test(trimmed) ? trimmed : `${trimmed} Games`;
  const nameOnly = title.replace(/\s+games$/i, "").trim() || trimmed;
  return {
    title,
    name: nameOnly,
    lower: nameOnly.toLowerCase(),
  };
}

/** Hand-tuned long-form copy for known categories (OzoGames-style SEO blocks). */
const CATEGORY_SEO_BY_SLUG: Record<string, (labels: CategoryLabels) => CategorySeoContent> = {
  action: (l) => ({
    aboutTitle: "About this category",
    paragraphs: [
      `${l.title} deliver pure adrenaline. This category is home to fast-paced titles where quick reactions, sharp reflexes, and brave decisions decide every outcome. Whether you're dodging enemy fire, chaining combos in a fight, or sprinting through a level filled with traps, ${l.lower} games keep you alert from start to finish. They are ideal when you want immediate excitement, simple controls, and intense moments packed into each session.`,
      `A defining feature of ${l.lower} games is constant movement. You rarely stay still for long. Enemies spawn, projectiles fly, platforms collapse, and timers count down, forcing you to react in seconds. Some ${l.lower} games focus on melee combat, letting you slash, punch, or kick through waves of enemies. Others emphasize ranged combat with guns, bows, or magical projectiles. Many mix both styles, giving you multiple ways to defeat your foes and survive each encounter.`,
      `Within this category you will find many subgenres. Side-scrolling beat 'em ups put you on a linear path where you move forward, defeat enemies in close-quarters fights, and reach a boss at the end. Run-and-gun games ask you to jump between platforms while firing at enemies from multiple directions. Arena and wave-based games lock you into a single area where you must survive rounds of increasingly tough opponents. Some ${l.lower} titles also include platforming, puzzle elements, or light RPG systems to add variety and depth.`,
      `${l.title} often prioritize straightforward controls so you can learn the basics quickly. One or two keys may handle jumping and dodging, while other keys perform attacks, reloads, or special abilities. This simplicity lets you focus on timing and decision-making rather than memorizing long button strings.`,
      `Despite their speed, ${l.lower} games can be very replayable. They frequently include multiple difficulty levels, character upgrades, or unlockable weapons that encourage you to revisit levels and try new strategies. Score systems, time records, and combo chains give competitive players a reason to refine routes and push their performance.`,
      `${l.title} also work well for short sessions. You can jump into a level, play for a few minutes, and still feel like you accomplished something. At the same time, longer sessions let you progress through campaigns, unlock new content, and master advanced mechanics.`,
      `Whether you prefer fighting, shooting, platforming, or a bit of everything, the ${l.lower} category on ${SITE_NAME} brings you free online browser games that deliver intense, satisfying gameplay in every round — with no downloads required.`,
    ],
    faqs: [
      {
        question: `Are ${l.lower} games suitable for beginners?`,
        answer: `Yes, many ${l.lower} games start with easy levels and simple controls, making them accessible while still offering depth for experienced players.`,
      },
      {
        question: `Do ${l.lower} games have story modes or just levels?`,
        answer:
          "Some titles are pure arcade experiences, while others include story campaigns with cutscenes, characters, and progression across multiple stages.",
      },
      {
        question: `Can I pause ${l.lower} games during a level?`,
        answer:
          "Many single-player action games allow pausing, but online or competitive modes may not, to keep the gameplay fair for all players.",
      },
      {
        question: `Are ${l.lower} games available in different difficulty levels?`,
        answer:
          "A lot of action games let you choose between easy, normal, and hard or unlock tougher modes as you improve.",
      },
    ],
  }),

  puzzle: (l) => ({
    aboutTitle: "About this category",
    paragraphs: [
      `${l.title} challenge your mind with logic, patterns, and clever problem-solving. This category is perfect when you want a calmer pace that still keeps you thinking. Match tiles, rearrange blocks, connect paths, or crack riddles — every level rewards focus and creativity.`,
      `A great ${l.lower} game teaches through play. Early stages introduce a simple rule, then later levels twist that rule with new obstacles, timers, or limited moves. You learn by experimenting, failing safely, and discovering the elegant solution that suddenly makes everything click.`,
      `Within ${l.title} you will find match-3 adventures, block-stacking classics, physics puzzles, word challenges, and spatial brainteasers. Some titles are short and snackable; others unfold into long campaigns with hundreds of stages and optional hard modes.`,
      `Controls are usually simple — click, drag, or tap — so the challenge stays in the puzzle itself. That makes ${l.lower} games ideal for desktop, tablet, and mobile browsers alike.`,
      `Replayability comes from star ratings, daily challenges, and “can you beat it with fewer moves?” goals. Many players return to earlier levels to improve their score or find a cleaner solution.`,
      `On ${SITE_NAME}, ${l.title} are free to play instantly in your browser. No downloads, no installs — just pick a puzzle and start solving.`,
    ],
    faqs: [
      {
        question: `Are ${l.lower} games good for kids?`,
        answer: `Many ${l.lower} games are family-friendly and help build logic and concentration skills, though difficulty varies by title.`,
      },
      {
        question: `Do I need to download anything to play ${l.lower} games?`,
        answer: `No. All ${l.lower} games on ${SITE_NAME} run in your browser with HTML5 — open a game and play instantly.`,
      },
      {
        question: `Can I play ${l.lower} games on mobile?`,
        answer:
          "Yes. Most titles work on phones and tablets as well as desktop browsers.",
      },
      {
        question: `Are ${l.lower} games timed?`,
        answer:
          "Some levels include timers or move limits, while others let you solve at your own pace.",
      },
    ],
  }),

  racing: (l) => ({
    aboutTitle: "About this category",
    paragraphs: [
      `${l.title} put you behind the wheel for speed, drifts, and finish-line thrills. From arcade kart races to realistic tracks, this category is built for players who love acceleration, tight corners, and beating the clock.`,
      `Expect open roads, circuit laps, traffic dodging, and stunt courses. Some ${l.lower} games focus on pure lap times; others add nitro boosts, power-ups, or career progression with unlockable cars.`,
      `Controls are designed for browsers — keyboard, mouse, or touch — so you can hop into a race in seconds. Short races work for quick breaks, while longer championships keep you coming back for better times and new vehicles.`,
      `Visual feedback matters: clear track markers, rival AI, and satisfying drift physics make every corner feel rewarding. Many titles also include time trials and ghost races so you can compete against your own best run.`,
      `Play free ${l.title} on ${SITE_NAME} with no downloads. Whether you want casual arcade speed or a tougher racing challenge, start a race instantly on desktop, tablet, or mobile.`,
    ],
    faqs: [
      {
        question: `Do ${l.lower} games work without downloading?`,
        answer: `Yes. Every ${l.lower} game here is a free browser game — no install required.`,
      },
      {
        question: `Can I play ${l.lower} games with a keyboard or touch controls?`,
        answer:
          "Most titles support keyboard on desktop and touch controls on mobile. Check each game’s instructions for the exact layout.",
      },
      {
        question: `Are there multiplayer ${l.lower} games?`,
        answer:
          "Some racing titles include local multiplayer or online modes, while others are single-player time trials and career races.",
      },
      {
        question: `Are ${l.lower} games suitable for beginners?`,
        answer:
          "Yes. Many start with forgiving handling and unlock harder tracks as you improve.",
      },
    ],
  }),

  sports: (l) => ({
    aboutTitle: "About this category",
    paragraphs: [
      `${l.title} bring stadium energy to your browser — soccer penalties, basketball shootouts, golf putts, and more. This category is for players who want athletic competition without leaving the page.`,
      `Sessions can be short and punchy: score a goal, sink a three-pointer, or clear a course hole. Other titles expand into tournaments, seasons, and skill upgrades that reward practice.`,
      `Controls stay approachable so you can focus on timing and aim. That makes ${l.lower} games great for quick matches on desktop or mobile during a break.`,
      `Whether you prefer realistic simulations or arcade-style sports fun, ${SITE_NAME} collects free online ${l.lower} games you can play instantly — no downloads, no sign-up required.`,
    ],
    faqs: [
      {
        question: `What kinds of ${l.lower} games can I play?`,
        answer:
          "You’ll find soccer, basketball, golf, and other athletic challenges — from quick arcade matches to longer tournament modes.",
      },
      {
        question: `Do I need an account to play ${l.lower} games?`,
        answer: `No. Play free ${l.lower} games on ${SITE_NAME} right away in your browser.`,
      },
      {
        question: `Can I play ${l.lower} games on a phone?`,
        answer: "Yes. Most sports titles are built for both desktop and mobile browsers.",
      },
      {
        question: `Are ${l.lower} games single-player only?`,
        answer:
          "Many are single-player, and some offer two-player or challenge modes depending on the title.",
      },
    ],
  }),

  arcade: (l) => ({
    aboutTitle: "About this category",
    paragraphs: [
      `${l.title} capture the spirit of classic coin-op fun: simple rules, bright feedback, and “one more try” energy. Jump in, learn in seconds, and chase a higher score.`,
      `This category covers endless runners, shooters, stackers, snake-likes, and retro-inspired hits. Difficulty usually ramps smoothly so beginners can enjoy early runs while experts push for leaderboard-worthy scores.`,
      `${l.title} shine in short sessions. You can play for a minute or settle in for a long high-score grind. Clear visuals and snappy controls make every attempt feel rewarding.`,
      `On ${SITE_NAME}, free ${l.lower} games load instantly in your browser — perfect for unblocked play at home, school, or anywhere you have a connection.`,
    ],
    faqs: [
      {
        question: `Are ${l.lower} games free to play?`,
        answer: `Yes. All ${l.lower} games on ${SITE_NAME} are free online browser games with no download.`,
      },
      {
        question: `What makes a game an arcade game?`,
        answer:
          "Arcade games usually feature simple controls, quick rounds, rising difficulty, and score-based replayability.",
      },
      {
        question: `Can kids play ${l.lower} games?`,
        answer:
          "Many arcade titles are casual and family-friendly, though always check the individual game page for content notes.",
      },
      {
        question: `Do ${l.lower} games save my high score?`,
        answer:
          "Some games store local progress or scores in your browser; others reset each session. It depends on the title.",
      },
    ],
  }),

  strategy: (l) => ({
    aboutTitle: "About this category",
    paragraphs: [
      `${l.title} reward planning, resource management, and smart decisions. Instead of pure reflexes, you win by thinking ahead — building bases, deploying units, or outmaneuvering opponents.`,
      `Expect tower defense, tactics battles, city builders, and turn-based challenges. Early levels teach core systems; later stages demand tighter builds, better timing, and creative counters.`,
      `Many ${l.lower} games support both short skirmishes and longer campaigns. You can experiment with different strategies, unlock upgrades, and refine your approach across multiple runs.`,
      `Play free online ${l.title} on ${SITE_NAME} instantly in your browser. No downloads — just choose a title and start commanding.`,
    ],
    faqs: [
      {
        question: `Are ${l.lower} games hard for beginners?`,
        answer: `Most ${l.lower} games start with tutorials or easy modes, then increase complexity as you learn the systems.`,
      },
      {
        question: `Do ${l.lower} games require a powerful computer?`,
        answer:
          "No. These are HTML5 browser games designed to run smoothly on typical desktops, laptops, and many mobile devices.",
      },
      {
        question: `Are there turn-based and real-time ${l.lower} games?`,
        answer:
          "Yes. You’ll find both turn-based tactics and real-time strategy or tower defense styles in this category.",
      },
      {
        question: `Can I play ${l.lower} games offline?`,
        answer:
          "These titles run online in your browser. Once a game is loaded, some may continue without a constant connection, but an internet connection is needed to open them.",
      },
    ],
  }),
};

function buildGenericCategorySeo(labels: CategoryLabels): CategorySeoContent {
  return {
    aboutTitle: "About this category",
    paragraphs: [
      `${labels.title} on ${SITE_NAME} collect free online browser games you can play instantly — no downloads, no installs, and no sign-up required. Browse this category when you want ${labels.lower} gameplay that loads fast on desktop, tablet, or mobile.`,
      `Every title in ${labels.title} is built for the web with modern HTML5 technology. That means smooth controls, quick restarts, and the freedom to jump in for a short session or a longer playthrough whenever you like.`,
      `Whether you are discovering new releases or returning to popular favorites, this category is updated regularly so there is always something fresh to try. Pick a game from the grid above and start playing in seconds.`,
      `Looking for unblocked games and free online games in the ${labels.lower} genre? ${SITE_NAME} keeps the experience simple: open your browser, choose a game, and play.`,
    ],
    faqs: [
      {
        question: `What are ${labels.title}?`,
        answer: `${labels.title} are free browser games focused on ${labels.lower} gameplay. You can play them online instantly on ${SITE_NAME}.`,
      },
      {
        question: `Do I need to download ${labels.lower} games?`,
        answer: "No. All games run in your web browser with no download or installation.",
      },
      {
        question: `Can I play ${labels.lower} games on mobile?`,
        answer: "Yes. Most titles work on mobile and tablet browsers as well as desktop.",
      },
      {
        question: `Are ${labels.title} free?`,
        answer: `Yes. ${labels.title} on ${SITE_NAME} are free to play online.`,
      },
    ],
  };
}

/**
 * Long-form About + FAQ copy for a category page.
 * Uses curated content when available; otherwise a solid generic template.
 */
export function getCategorySeoContent(slug: string, name: string): CategorySeoContent {
  const labels = labelsFrom(name);
  const builder = CATEGORY_SEO_BY_SLUG[slug];
  return builder ? builder(labels) : buildGenericCategorySeo(labels);
}
