import { NextResponse } from "next/server";
import { GameStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { recordPlay } from "@/lib/games";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ gameId: string }> };

export async function POST(request: Request, { params }: Params) {
  const { gameId: gameIdParam } = await params;
  const gameId = parseInt(gameIdParam, 10);
  if (!gameId) {
    return NextResponse.json({ error: "Invalid game id" }, { status: 400 });
  }

  const game = await prisma.game.findFirst({
    where: { id: gameId, status: GameStatus.published, embedPath: { not: null } },
  });

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  const session = await getSession();
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined;

  await recordPlay(gameId, { userId: session?.userId, ip });
  return NextResponse.json({ ok: true });
}
