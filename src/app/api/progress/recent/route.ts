import { NextResponse } from "next/server";
import { GameStatus } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { recordUserGameProgress } from "@/lib/user-progress";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const gameId =
    typeof body === "object" &&
    body !== null &&
    "gameId" in body &&
    typeof body.gameId === "number"
      ? body.gameId
      : parseInt(String((body as { gameId?: unknown })?.gameId), 10);

  if (!gameId) {
    return NextResponse.json({ error: "Invalid game id" }, { status: 400 });
  }

  const progressData =
    typeof body === "object" &&
    body !== null &&
    "progressData" in body &&
    typeof body.progressData === "string"
      ? body.progressData
      : undefined;

  const game = await prisma.game.findFirst({
    where: { id: gameId, status: GameStatus.published },
    select: { id: true },
  });

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  await recordUserGameProgress(session.userId, gameId, progressData);
  return NextResponse.json({ ok: true });
}
