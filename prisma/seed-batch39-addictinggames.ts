/**
 * Upsert 39 AddictingGames HTML5 games.
 * - Never create a duplicate if slug/alias/title already exists
 * - If existing game has a CrazyGames embed, replace with AG iframe
 * - New games are created as draft; published games stay published
 * - SEO: same metaTitle / description / metaDescription strategy as batch25
 *
 * Run: npx tsx prisma/seed-batch39-addictinggames.ts
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
  title: string;
  slug: string;
  embed: string;
  categories: string[];
  aliasSlugs?: string[];
};

type BatchFile = { games: BatchGame[] };

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
    select: { id: true, slug: true, title: true, embedPath: true, status: true },
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
  const filePath = path.join(__dirname, "batch39-addictinggames.json");
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

  for (const game of data.games) {
    const catSlugs = game.categories?.length ? game.categories : ["arcade"];
    const primarySlug = catSlugs[0];
    const primaryCategoryId = categoryMap[primarySlug];
    if (!primaryCategoryId) {
      console.warn(`Skip ${game.slug}: missing category ${primarySlug}`);
      skipped += 1;
      continue;
    }

    const coverName = `${game.slug}.png`;
    const coverPath = path.join(coversSrc, coverName);
    if (existsSync(coverPath)) {
      copyFileSync(coverPath, path.join(thumbsDir, coverName));
    }

    const genre = GENRE_LABEL[primarySlug] ?? "browser";
    const description = seoDescription(game.title, genre);
    const metaTitle = `${game.title} Unblocked ⚡ Play Free`;
    const metaDescription = descriptionToMetaDescription(description);
    const thumbnail = `/uploads/thumbnails/${game.slug}.png`;

    const existing = await findExisting(game);

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
      if (wasCrazy) {
        replacedCrazy += 1;
        console.log(`REPLACE CrazyGames → AG: ${existing.slug} (${game.title})`);
      } else {
        console.log(`UPDATE existing: ${existing.slug} ← ${game.slug} (${game.title})`);
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
        status: GameStatus.draft,
        primaryCategoryId,
        addedAt: new Date(),
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
    console.log(`CREATE draft: ${game.slug}`);
  }

  console.log(
    JSON.stringify({ created, updated, replacedCrazy, skipped }, null, 2)
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
