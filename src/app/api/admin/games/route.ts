import { NextResponse } from "next/server";
import { adminApiAuth } from "@/lib/admin/api-auth";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { GameStatus } from "@prisma/client";

export async function GET(request: Request) {
  const auth = await adminApiAuth(PERMISSIONS.GAMES_EDIT);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const games = await prisma.game.findMany({
    where: {
      ...(status ? { status: status as GameStatus } : {}),
    },
    orderBy: { updatedAt: "desc" },
    include: {
      categories: { include: { category: { select: { name: true, slug: true } } } },
      primaryCategory: true,
    },
  });

  return NextResponse.json({ games });
}
