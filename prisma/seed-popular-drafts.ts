/**
 * Insert popular games as DRAFT (not published) with SEO fields.
 * Run: npx tsx prisma/seed-popular-drafts.ts
 */
import { copyFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import { PrismaClient, GameStatus } from "@prisma/client";
import { descriptionToMetaDescription } from "../src/lib/meta-description";
import { SITE_NAME } from "../src/lib/site-config";

const prisma = new PrismaClient();

const ASSETS_DIR = path.join(
  process.env.USERPROFILE ?? "",
  ".cursor",
  "projects",
  "c-Users-mohamed-browser-games-platform",
  "assets"
);
const THUMB_DIR = path.join(process.cwd(), "public", "game-covers");

type DraftGame = {
  slug: string;
  title: string;
  coverFile: string;
  thumbFile: string;
  embedPath: string;
  categories: string[];
  primaryCategory: string;
  description: string;
};

function seoDescription(title: string, genre: string, pitch: string, howTo: string[], features: string[]): string {
  return [
    `**Play ${title} free online** on ${SITE_NAME}. ${pitch}`,
    `${title} is a free HTML5 ${genre} game you can play instantly in your browser — no download, no install, and no sign-up required. It works on desktop, Chromebook, tablet, and mobile.`,
    `## How to play ${title}`,
    ...howTo.map((step) => `- ${step}`),
    `## Why play ${title} on ${SITE_NAME}`,
    ...features.map((f) => `- ${f}`),
    `Search for **${title} unblocked**, **${title} free online**, or **play ${title}** and jump straight into the action on ${SITE_NAME}.`,
  ].join("\n\n");
}

function metaTitleFor(title: string): string {
  return `${title} - Play Free Online`;
}

const games: DraftGame[] = [
  {
    slug: "slope-run",
    title: "Slope Run",
    coverFile: "cover-slope-run.png",
    thumbFile: "slope-run.png",
    embedPath:
      "https://html5.gamedistribution.com/b82efa0f9d7648beb126d62c0fb9363d/?gd_sdk_referrer_url=https://www.zenfungames.com/game/slope-run",
    categories: ["action", "arcade"],
    primaryCategory: "action",
    description: seoDescription(
      "Slope Run",
      "action",
      "Guide a glowing ball down an endless neon slope, dodge red obstacles, and chase a new high score in this fast reflex runner.",
      [
        "Use the left and right arrow keys (or A/D) to steer the ball.",
        "Stay on the track and avoid red blocks as speed increases.",
        "Survive as long as you can to beat your best distance.",
      ],
      [
        "Instant browser play with no download",
        "Simple controls and addictive high-score loop",
        "Great unblocked action game for quick sessions",
      ]
    ),
  },
  {
    slug: "crazy-tunnel",
    title: "Crazy Tunnel",
    coverFile: "cover-crazy-tunnel.png",
    thumbFile: "crazy-tunnel.png",
    embedPath:
      "https://html5.gamedistribution.com/dd2ab5adad664c508d3fa032bd19e8c8/?gd_sdk_referrer_url=https://www.zenfungames.com/game/crazy-tunnel",
    categories: ["action", "arcade"],
    primaryCategory: "action",
    description: seoDescription(
      "Crazy Tunnel",
      "action",
      "Race through a colorful geometric tunnel at rising speed and see how far you can go before you crash.",
      [
        "Move your mouse or use touch to steer inside the tunnel.",
        "Pass through open rings and avoid hitting the walls.",
        "Speed ramps up — stay focused to set a longer run.",
      ],
      [
        "Fast Tunnel Rush-style gameplay",
        "Free online HTML5 play in your browser",
        "Perfect short-session unblocked action game",
      ]
    ),
  },
  {
    slug: "geometry-dash",
    title: "Geometry Dash",
    coverFile: "cover-geometry-dash.png",
    thumbFile: "geometry-dash.png",
    embedPath:
      "https://html5.gamedistribution.com/8b65f47d53a6406c8bc767cd1a16a2ec/?gd_sdk_referrer_url=https://www.zenfungames.com/game/geometry-dash",
    categories: ["arcade", "action"],
    primaryCategory: "arcade",
    description: seoDescription(
      "Geometry Dash",
      "arcade",
      "Jump, fly, and time every move to the beat in this rhythm platformer challenge packed with spikes and precision obstacles.",
      [
        "Click, tap, or press space/up to jump.",
        "Time jumps with the music and avoid spikes and hazards.",
        "Practice tough sections until you clear the full level.",
      ],
      [
        "Rhythm-based platforming fun",
        "Play free online with no download",
        "Addictive skill challenge for high scores",
      ]
    ),
  },
  {
    slug: "helix-jump",
    title: "Helix Jump",
    coverFile: "cover-helix-jump.png",
    thumbFile: "helix-jump.png",
    embedPath:
      "https://html5.gamedistribution.com/acb6678608a44d428072ca93d8a0d86c/?gd_sdk_referrer_url=https://www.zenfungames.com/game/helix-jump",
    categories: ["arcade"],
    primaryCategory: "arcade",
    description: seoDescription(
      "Helix Jump",
      "arcade",
      "Bounce a ball down a colorful helix tower, avoid red platforms, and fall as far as you can.",
      [
        "Drag or swipe left and right to rotate the tower.",
        "Drop the ball through gaps and skip dangerous red tiles.",
        "Chain fast falls for higher scores.",
      ],
      [
        "One-touch casual arcade gameplay",
        "Free browser game — no install needed",
        "Bright, addictive endless runs",
      ]
    ),
  },
  {
    slug: "stickman-hook",
    title: "Stickman Hook",
    coverFile: "cover-stickman-hook.png",
    thumbFile: "stickman-hook.png",
    embedPath:
      "https://html5.gamedistribution.com/c3b949ea22c5478e8f2942fb2a3f1127/?gd_sdk_referrer_url=https://www.zenfungames.com/game/stickman-hook",
    categories: ["arcade", "action"],
    primaryCategory: "arcade",
    description: seoDescription(
      "Stickman Hook",
      "arcade",
      "Swing like a stickman acrobat — hook, release, and fly through levels without falling.",
      [
        "Click or tap to shoot your hook and swing.",
        "Release at the right moment to fly toward the next platform.",
        "Reach the finish line without crashing.",
      ],
      [
        "Physics-based swinging fun",
        "Easy to learn, hard to master",
        "Free online unblocked arcade game",
      ]
    ),
  },
  {
    slug: "rail-runner",
    title: "Rail Runner",
    coverFile: "cover-rail-runner.png",
    thumbFile: "rail-runner.png",
    embedPath:
      "https://html5.gamedistribution.com/559dae07921c4f629fe308dc9d996041/?gd_sdk_referrer_url=https://www.zenfungames.com/game/rail-runner",
    categories: ["arcade", "action"],
    primaryCategory: "arcade",
    description: seoDescription(
      "Rail Runner",
      "arcade",
      "Run along the railway, dodge obstacles, collect coins, and push your endless-runner high score.",
      [
        "Swipe or use keys to change lanes, jump, and slide.",
        "Avoid trains and barriers while collecting coins.",
        "Spend coins on upgrades to extend your best runs.",
      ],
      [
        "Subway-style endless runner action",
        "Instant free play in your browser",
        "Upgrades and replayable high-score chase",
      ]
    ),
  },
  {
    slug: "moto-x3m",
    title: "Moto X3M",
    coverFile: "cover-moto-x3m.png",
    thumbFile: "moto-x3m.png",
    embedPath: "https://play.famobi.com/moto-x3m",
    categories: ["racing", "action"],
    primaryCategory: "racing",
    description: seoDescription(
      "Moto X3M",
      "racing",
      "Ride a dirt bike through wild stunt tracks, nail flips, and beat the clock on every level.",
      [
        "Use arrow keys to accelerate, brake, and balance in the air.",
        "Hit ramps for stunts and land cleanly to save time.",
        "Finish under the target time to earn stars and unlock bikes.",
      ],
      [
        "Classic HTML5 moto stunt racing",
        "Free online play — no download",
        "Challenging levels with unlockable bikes",
      ]
    ),
  },
  {
    slug: "drift-boss",
    title: "Drift Boss",
    coverFile: "cover-drift-boss.png",
    thumbFile: "drift-boss.png",
    embedPath:
      "https://html5.gamedistribution.com/0a8b51e5eaee42e7b4db83ca00afc92e/?gd_sdk_referrer_url=https://www.zenfungames.com/game/drift-boss",
    categories: ["racing", "arcade"],
    primaryCategory: "racing",
    description: seoDescription(
      "Drift Boss",
      "racing",
      "Master one-button drifting on a zigzag floating road and see how far you can go without falling.",
      [
        "Hold to drift one way and release to turn the other.",
        "Time each corner so you stay on the narrow track.",
        "Collect coins and unlock new cars as you improve.",
      ],
      [
        "Simple one-button controls",
        "Addictive endless drift gameplay",
        "Free unblocked racing game in your browser",
      ]
    ),
  },
  {
    slug: "basketball-stars-2026",
    title: "Basketball Stars 2026",
    coverFile: "cover-basketball-stars.png",
    thumbFile: "basketball-stars-2026.png",
    embedPath:
      "https://html5.gamedistribution.com/516d6908fbc848bdb89e65a58a43a7dc/?gd_sdk_referrer_url=https://www.zenfungames.com/game/basketball-stars-2026",
    categories: ["sports"],
    primaryCategory: "sports",
    description: seoDescription(
      "Basketball Stars 2026",
      "sports",
      "Dunk, shoot, steal, and block in fast 1v1 basketball matches packed with special moves.",
      [
        "Move with WASD or arrow keys and follow on-screen shoot/steal controls.",
        "Fill the supershot bar for a guaranteed highlight dunk.",
        "Win tournament games to climb the ranks.",
      ],
      [
        "Exciting 1v1 basketball arcade action",
        "Play free online with friends or solo",
        "No download HTML5 sports game",
      ]
    ),
  },
  {
    slug: "football-legends",
    title: "Football Legends",
    coverFile: "cover-football-legends.png",
    thumbFile: "football-legends.png",
    embedPath:
      "https://html5.gamedistribution.com/13eabea86f7c4cd993a156258420e9ec/?gd_sdk_referrer_url=https://www.zenfungames.com/game/football-legends",
    categories: ["sports"],
    primaryCategory: "sports",
    description: seoDescription(
      "Football Legends",
      "sports",
      "Play arcade soccer with special abilities, quick matches, and tournament mode.",
      [
        "Move with A/D or arrows, jump, slide, and shoot on cue.",
        "Use your supershot to surprise the opponent.",
        "Score more goals before time runs out to win.",
      ],
      [
        "Fast arcade football matches",
        "Free online sports game — no install",
        "Solo or local multiplayer fun",
      ]
    ),
  },
  {
    slug: "fireboy-and-watergirl",
    title: "Fireboy and Watergirl",
    coverFile: "cover-fireboy-watergirl.png",
    thumbFile: "fireboy-and-watergirl.png",
    embedPath:
      "https://html5.gamedistribution.com/a55c9cc9c21e4fc683c8c6857f3d0c75/?gd_sdk_referrer_url=https://www.zenfungames.com/game/fireboy-and-watergirl",
    categories: ["puzzle", "arcade"],
    primaryCategory: "puzzle",
    description: seoDescription(
      "Fireboy and Watergirl",
      "puzzle",
      "Team up as Fireboy and Watergirl to solve temple puzzles, collect gems, and reach both exits safely.",
      [
        "Control Fireboy with arrow keys and Watergirl with WASD.",
        "Keep Fireboy out of water and Watergirl out of fire.",
        "Use levers, platforms, and teamwork to clear each temple level.",
      ],
      [
        "Classic co-op puzzle adventure",
        "Play alone or with a friend",
        "Free online browser puzzle game",
      ]
    ),
  },
  {
    slug: "2048",
    title: "2048",
    coverFile: "cover-2048.png",
    thumbFile: "2048.png",
    embedPath: "https://play.famobi.com/2048",
    categories: ["puzzle"],
    primaryCategory: "puzzle",
    description: seoDescription(
      "2048",
      "puzzle",
      "Slide numbered tiles, merge matching values, and reach the legendary 2048 tile.",
      [
        "Use arrow keys or swipe to slide all tiles in one direction.",
        "When two tiles with the same number touch, they merge into one.",
        "Keep merging until you create the 2048 tile — then go even higher.",
      ],
      [
        "The classic number-merge puzzle",
        "Free online play with no download",
        "Quick brain-training sessions anytime",
      ]
    ),
  },
];

function ensureThumbnail(game: DraftGame): string {
  mkdirSync(THUMB_DIR, { recursive: true });
  const dest = path.join(THUMB_DIR, game.thumbFile);
  const src = path.join(ASSETS_DIR, game.coverFile);
  if (!existsSync(dest) && existsSync(src)) {
    copyFileSync(src, dest);
    console.log(`Copied thumbnail: ${game.thumbFile}`);
  } else if (!existsSync(dest)) {
    console.warn(`Missing cover for ${game.slug}: ${src}`);
  }
  return `/game-covers/${game.thumbFile}`;
}

async function main() {
  console.log("Seeding popular games as DRAFT (not published)...");

  const categories = await prisma.category.findMany();
  const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  for (const needed of ["action", "arcade", "racing", "sports", "puzzle", "strategy"]) {
    if (!categoryMap[needed]) {
      throw new Error(`Missing category: ${needed}. Run npm run db:seed first.`);
    }
  }

  let created = 0;
  let updated = 0;

  for (const game of games) {
    const thumbnail = ensureThumbnail(game);
    const categoryIds = game.categories.map((slug) => categoryMap[slug]).filter(Boolean);
    const primaryCategoryId = categoryMap[game.primaryCategory];
    const metaTitle = metaTitleFor(game.title);
    const metaDescription = descriptionToMetaDescription(game.description, 160);

    const existing = await prisma.game.findUnique({ where: { slug: game.slug } });

    if (existing) {
      await prisma.game.update({
        where: { id: existing.id },
        data: {
          title: game.title,
          description: game.description,
          metaTitle,
          metaDescription,
          thumbnail,
          embedPath: game.embedPath,
          featured: false,
          status: GameStatus.draft,
          releasedAt: null,
          primaryCategoryId,
          addedAt: existing.addedAt ?? new Date(),
          categories: {
            deleteMany: {},
            create: categoryIds.map((categoryId) => ({ categoryId })),
          },
        },
      });
      updated += 1;
      console.log(`Updated draft: ${game.slug}`);
    } else {
      await prisma.game.create({
        data: {
          title: game.title,
          slug: game.slug,
          description: game.description,
          metaTitle,
          metaDescription,
          thumbnail,
          embedPath: game.embedPath,
          featured: false,
          status: GameStatus.draft,
          releasedAt: null,
          primaryCategoryId,
          addedAt: new Date(),
          categories: {
            create: categoryIds.map((categoryId) => ({ categoryId })),
          },
        },
      });
      created += 1;
      console.log(`Created draft: ${game.slug}`);
    }
  }

  console.log(`Done. Created ${created}, updated ${updated}. All status=draft (not published).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
