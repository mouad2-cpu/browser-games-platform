import { NextResponse } from "next/server";
import { GameStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { recordPlay } from "@/lib/games";
import { getSession } from "@/lib/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

type Params = { params: Promise<{ gameId: string }> };

export async function POST(request: Request, { params }: Params) {
  const limit = rateLimit(
    `play:${getClientIp(request)}`,
    60,
    5 * 60_000
  );
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many play events" }, { status: 429 });
  }

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
  await recordPlay(gameId, { userId: session?.userId });
  return NextResponse.json({ ok: true });
}
