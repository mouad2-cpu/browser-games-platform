/**
 * Upsert GameSnacks batches 1–8 as PUBLISHED.
 * - Same SEO as batch25 (metaTitle / description / metaDescription)
 * - Never create a duplicate if slug/alias/title already exists
 * - If existing has CrazyGames (or other) embed, replace with GameSnacks iframe
 * - New + matched games are set to published
 *
 * Run: npx tsx prisma/seed-gs-batches-published.ts
 * Optional: GS_BATCH=3 to seed only one batch file gamesnacks-batch-03 (not used; uses combined JSON)
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "fs";
import path from "path";
import { PrismaClient, GameStatus } from "@prisma/client";
import { descriptionToMetaDescription } from "../src/lib/meta-description";
import { SITE_NAME } from "../src/lib/site-config";

const prisma = new PrismaClient();

const GENRE_LABEL: Record<string, string> = {
  action: "action",
  puzzle: "puzzle",
  racing: "racing",
  sports: "sports",
  arcade: "arcade",
  strategy: "strategy",
};

type BatchGame = {
  id: string;
  title: string;
  slug: string;
  embed: string;
  thumbnail?: string | null;
  coverFile?: string;
  categories: string[];
  aliasSlugs?: string[];
};

type BatchFile = { games: BatchGame[]; count?: number };

function normTitle(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function seoDescription(title: string, genre: string): string {
  return [
    `**Play ${title} free online** on ${SITE_NAME}. Jump into this free HTML5 ${genre} browser game instantly — no download, no install, and no sign-up required.`,
    `${title} runs in your browser on desktop, Chromebook, tablet, and mobile. Open the game page, hit play, and start in seconds.`,
    `## How to play ${title}`,
    `- Click play to load ${title} and follow any on-screen tutorial or control hints.`,
    `- Use your keyboard, mouse, or touch controls to move, aim, or interact with the game.`,
    `- Complete levels, beat objectives, or chase a higher score to progress.`,
    `- Retry after a fail, improve your timing, and push for a cleaner run.`,
    `## Why play ${title} on ${SITE_NAME}`,
    `- Free to play in your browser with no download`,
    `- Works on desktop, tablet, and mobile`,
    `- Instant load — great for quick sessions`,
    `- Easy to find when you search **${title} unblocked** or **play ${title} free online**`,
    `Search for **${title} unblocked**, **${title} free online**, or **play ${title}** and jump straight into the action on ${SITE_NAME}.`,
  ].join("\n\n");
}

function isCrazyGamesEmbed(embedPath: string | null | undefined): boolean {
  if (!embedPath) return false;
  return /crazygames\.com/i.test(embedPath);
}

async function findExisting(game: BatchGame) {
  const aliases = Array.from(
    new Set([...(game.aliasSlugs ?? []), game.slug].filter(Boolean))
  );

  const bySlugHits = [];
  for (const slug of aliases) {
    const row = await prisma.game.findUnique({ where: { slug } });
    if (row) bySlugHits.push(row);
  }

  const all = await prisma.game.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      embedPath: true,
      status: true,
      releasedAt: true,
      addedAt: true,
    },
  });
  const want = normTitle(game.title);
  const titleHits = all.filter((g) => normTitle(g.title) === want);

  const hits = [...bySlugHits, ...titleHits].filter(
    (g, i, arr) => arr.findIndex((x) => x.id === g.id) === i
  );
  if (!hits.length) return null;

  hits.sort((a, b) => {
    const ac = isCrazyGamesEmbed(a.embedPath) ? 0 : 1;
    const bc = isCrazyGamesEmbed(b.embedPath) ? 0 : 1;
    if (ac !== bc) return ac - bc;
    const ap = a.status === GameStatus.published ? 0 : 1;
    const bp = b.status === GameStatus.published ? 0 : 1;
    return ap - bp;
  });
  return hits[0];
}

async function main() {
  const filePath = path.join(__dirname, "gamesnacks-batches-1-8-seed.json");
  const data = JSON.parse(readFileSync(filePath, "utf8")) as BatchFile;

  const coversSrc = path.join(process.cwd(), "public", "game-covers");
  const thumbsDir = path.join(process.cwd(), "public", "uploads", "thumbnails");
  mkdirSync(thumbsDir, { recursive: true });

  const categoryMap = Object.fromEntries(
    (await prisma.category.findMany()).map((c) => [c.slug, c.id])
  );

  let created = 0;
  let updated = 0;
  let replacedCrazy = 0;
  let skipped = 0;
  let published = 0;

  for (const game of data.games) {
    const catSlugs = game.categories?.length ? game.categories : ["arcade"];
    const primarySlug = catSlugs[0];
    const primaryCategoryId = categoryMap[primarySlug];
    if (!primaryCategoryId) {
      console.warn(`Skip ${game.slug}: missing category ${primarySlug}`);
      skipped += 1;
      continue;
    }

    const coverName = game.coverFile || `${game.slug}.png`;
    const coverPath = path.join(coversSrc, coverName);
    if (existsSync(coverPath)) {
      copyFileSync(coverPath, path.join(thumbsDir, coverName));
    } else {
      console.warn(`WARN missing cover: ${coverName}`);
    }

    const genre = GENRE_LABEL[primarySlug] ?? "browser";
    const description = seoDescription(game.title, genre);
    const metaTitle = `${game.title} - Play Free Online`;
    const metaDescription = descriptionToMetaDescription(description);
    const thumbnail = `/uploads/thumbnails/${coverName}`;

    const existing = await findExisting(game);
    const now = new Date();

    if (existing) {
      const wasCrazy = isCrazyGamesEmbed(existing.embedPath);
      await prisma.game.update({
        where: { id: existing.id },
        data: {
          title: game.title,
          description,
          metaTitle,
          metaDescription,
          thumbnail,
          embedPath: game.embed,
          primaryCategoryId,
          status: GameStatus.published,
          releasedAt: existing.releasedAt ?? now,
          addedAt: existing.addedAt ?? now,
        },
      });

      await prisma.gameCategory.deleteMany({ where: { gameId: existing.id } });
      for (const slug of catSlugs) {
        const categoryId = categoryMap[slug];
        if (!categoryId) continue;
        await prisma.gameCategory.create({
          data: { gameId: existing.id, categoryId },
        });
      }

      updated += 1;
      published += 1;
      if (wasCrazy) {
        replacedCrazy += 1;
        console.log(`REPLACE CrazyGames → GS published: ${existing.slug} (${game.title})`);
      } else {
        console.log(`UPDATE published: ${existing.slug} ← ${game.slug} (${game.title})`);
      }
      continue;
    }

    const saved = await prisma.game.create({
      data: {
        title: game.title,
        slug: game.slug,
        description,
        metaTitle,
        metaDescription,
        thumbnail,
        embedPath: game.embed,
        featured: false,
        status: GameStatus.published,
        primaryCategoryId,
        addedAt: now,
        releasedAt: now,
      },
    });

    for (const slug of catSlugs) {
      const categoryId = categoryMap[slug];
      if (!categoryId) continue;
      await prisma.gameCategory.create({
        data: { gameId: saved.id, categoryId },
      });
    }

    created += 1;
    published += 1;
    console.log(`CREATE published: ${game.slug}`);
  }

  console.log(
    JSON.stringify({ created, updated, replacedCrazy, skipped, published, total: data.games.length }, null, 2)
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
