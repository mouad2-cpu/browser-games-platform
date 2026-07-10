import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { GameStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import {
  getGameVoteStats,
  resolveVoterId,
  setGameVote,
  VOTER_COOKIE,
  VOTER_COOKIE_MAX_AGE,
} from "@/lib/game-votes.server";

type Params = { params: Promise<{ gameId: string }> };

async function getPublishedGame(gameId: number) {
  return prisma.game.findFirst({
    where: { id: gameId, status: GameStatus.published, embedPath: { not: null } },
    select: { id: true },
  });
}

export async function GET(_request: Request, { params }: Params) {
  const { gameId: gameIdParam } = await params;
  const gameId = parseInt(gameIdParam, 10);
  if (!gameId) {
    return NextResponse.json({ error: "Invalid game id" }, { status: 400 });
  }

  const game = await getPublishedGame(gameId);
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  const voterId = await resolveVoterId();
  const stats = await getGameVoteStats(gameId, voterId);
  return NextResponse.json(stats);
}

export async function POST(request: Request, { params }: Params) {
  const { gameId: gameIdParam } = await params;
  const gameId = parseInt(gameIdParam, 10);
  if (!gameId) {
    return NextResponse.json({ error: "Invalid game id" }, { status: 400 });
  }

  const game = await getPublishedGame(gameId);
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  let body: { vote?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.vote !== "like" && body.vote !== "dislike") {
    return NextResponse.json({ error: "Vote must be like or dislike" }, { status: 400 });
  }

  const session = await getSession();
  let voterId = await resolveVoterId();
  const responseInit: { headers?: HeadersInit } = {};

  if (!voterId) {
    const anonId = randomUUID();
    voterId = `anon:${anonId}`;
    responseInit.headers = {
      "Set-Cookie": `${VOTER_COOKIE}=${anonId}; Path=/; Max-Age=${VOTER_COOKIE_MAX_AGE}; SameSite=Lax`,
    };
  } else if (session) {
    voterId = `user:${session.userId}`;
  }

  const stats = await setGameVote(gameId, voterId, body.vote);
  return NextResponse.json(stats, responseInit);
}
