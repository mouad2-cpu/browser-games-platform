import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "./db";
import { getSession } from "./auth";
import { VOTER_COOKIE, type GameVoteStats, type UserVote } from "./game-votes-shared";

export { VOTER_COOKIE, VOTER_COOKIE_MAX_AGE } from "./game-votes-shared";

type DbVote = "LIKE" | "DISLIKE";

function toUserVote(vote: DbVote | null | undefined): UserVote {
  if (vote === "LIKE") return "like";
  if (vote === "DISLIKE") return "dislike";
  return null;
}

async function countVotes(gameId: number, vote: DbVote): Promise<number> {
  const rows = await prisma.$queryRaw<[{ count: bigint }]>`
    SELECT COUNT(*) AS count
    FROM GameVote
    WHERE gameId = ${gameId} AND vote = ${vote}
  `;
  return Number(rows[0]?.count ?? 0);
}

async function findUserVote(gameId: number, voterId: string): Promise<DbVote | null> {
  const rows = await prisma.$queryRaw<[{ vote: DbVote }]>`
    SELECT vote
    FROM GameVote
    WHERE gameId = ${gameId} AND voterId = ${voterId}
    LIMIT 1
  `;
  return rows[0]?.vote ?? null;
}

export async function resolveVoterId(): Promise<string | null> {
  const session = await getSession();
  if (session) return `user:${session.userId}`;

  const cookieStore = await cookies();
  const anonId = cookieStore.get(VOTER_COOKIE)?.value?.trim();
  if (anonId) return `anon:${anonId}`;

  return null;
}

export async function getGameVoteStats(
  gameId: number,
  voterId: string | null
): Promise<GameVoteStats> {
  const [likes, dislikes, userRecord] = await Promise.all([
    countVotes(gameId, "LIKE"),
    countVotes(gameId, "DISLIKE"),
    voterId ? findUserVote(gameId, voterId) : Promise.resolve(null),
  ]);

  return {
    likes,
    dislikes,
    userVote: toUserVote(userRecord),
  };
}

export async function setGameVote(
  gameId: number,
  voterId: string,
  vote: "like" | "dislike"
): Promise<GameVoteStats> {
  const voteType: DbVote = vote === "like" ? "LIKE" : "DISLIKE";
  const existing = await findUserVote(gameId, voterId);

  if (existing === voteType) {
    await prisma.$executeRaw`
      DELETE FROM GameVote
      WHERE gameId = ${gameId} AND voterId = ${voterId}
    `;
  } else if (existing) {
    await prisma.$executeRaw`
      UPDATE GameVote
      SET vote = ${voteType}, updatedAt = CURRENT_TIMESTAMP(3)
      WHERE gameId = ${gameId} AND voterId = ${voterId}
    `;
  } else {
    const id = randomUUID();
    await prisma.$executeRaw`
      INSERT INTO GameVote (id, gameId, vote, voterId, createdAt, updatedAt)
      VALUES (${id}, ${gameId}, ${voteType}, ${voterId}, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
    `;
  }

  return getGameVoteStats(gameId, voterId);
}
