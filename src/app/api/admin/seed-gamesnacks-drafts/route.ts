import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission, PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { GameStatus } from "@prisma/client";
import { readFileSync } from "fs";
import path from "path";
import { descriptionToMetaDescription } from "@/lib/meta-description";
import { SITE_NAME } from "@/lib/site-config";

export const runtime = "nodejs";

const GENRE_LABEL: Record<string, string> = {
  action: "action",
  puzzle: "puzzle",
  racing: "racing",
  sports: "sports",
  arcade: "arcade",
  strategy: "strategy",
};

type DraftGame = {
  title: string;
  slug: string;
  embed: string;
  thumbnail?: string | null;
  categories: string[];
};

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

export async function POST() {
  const session = await getSession();
  if (!session || !hasPermission(session.role, PERMISSIONS.GAMES_EDIT)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const filePath = path.join(process.cwd(), "prisma", "gamesnacks-drafts.json");
    const data = JSON.parse(readFileSync(filePath, "utf8")) as { games: DraftGame[] };

    const categoryMap = Object.fromEntries(
      (await prisma.category.findMany()).map((c) => [c.slug, c.id])
    );

    let created = 0;
    let updated = 0;

    for (const game of data.games) {
      const catSlugs = game.categories?.length ? game.categories : [];
      const primarySlug = catSlugs[0];
      const primaryCategoryId = primarySlug ? categoryMap[primarySlug] : undefined;
      if (!primaryCategoryId) continue;

      const genre = GENRE_LABEL[primarySlug] ?? "browser";
      const description = seoDescription(game.title, genre);
      const metaTitle = `${game.title} - Play Free Online`;
      const metaDescription = descriptionToMetaDescription(description);
      const thumbnail = game.thumbnail?.startsWith("/")
        ? game.thumbnail
        : `/game-covers/${game.slug}.png`;

      const existing = await prisma.game.findUnique({ where: { slug: game.slug } });

      const saved = await prisma.game.upsert({
        where: { slug: game.slug },
        update: {
          title: game.title,
          description,
          metaTitle,
          metaDescription,
          thumbnail,
          embedPath: game.embed,
          primaryCategoryId,
          ...(existing?.status === GameStatus.published
            ? {}
            : { status: GameStatus.draft }),
        },
        create: {
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

      if (existing) updated += 1;
      else created += 1;

      await prisma.gameCategory.deleteMany({ where: { gameId: saved.id } });
      for (const slug of catSlugs) {
        const categoryId = categoryMap[slug];
        if (!categoryId) continue;
        await prisma.gameCategory.create({
          data: { gameId: saved.id, categoryId },
        });
      }
    }

    return NextResponse.json({
      ok: true,
      created,
      updated,
      total: data.games.length,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
