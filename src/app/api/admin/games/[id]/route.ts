import { NextResponse } from "next/server";
import { adminApiAuth } from "@/lib/admin/api-auth";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { GameStatus } from "@prisma/client";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const auth = await adminApiAuth(PERMISSIONS.GAMES_EDIT);
  if (auth.error) return auth.error;

  const id = parseInt((await params).id, 10);
  const game = await prisma.game.findUnique({
    where: { id },
    include: {
      categories: { include: { category: true } },
      primaryCategory: true,
      reports: { where: { status: "OPEN" }, take: 10 },
      _count: { select: { playEvents: true, reports: true } },
    },
  });

  if (!game) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ game });
}

export async function PATCH(request: Request, { params }: Params) {
  const auth = await adminApiAuth(PERMISSIONS.GAMES_EDIT);
  if (auth.error) return auth.error;

  const id = parseInt((await params).id, 10);
  const body = await request.json();

  const game = await prisma.game.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.embedPath !== undefined && { embedPath: body.embedPath }),
      ...(body.status !== undefined && { status: body.status as GameStatus }),
      ...(body.featured !== undefined && { featured: body.featured }),
    },
  });

  await logAudit({
    userId: auth.session!.userId,
    action: "game.update",
    entityType: "game",
    entityId: String(id),
    metadata: body,
  });

  return NextResponse.json({ game });
}

export async function DELETE(_req: Request, { params }: Params) {
  const auth = await adminApiAuth(PERMISSIONS.GAMES_DELETE);
  if (auth.error) return auth.error;

  const id = parseInt((await params).id, 10);
  await prisma.game.delete({ where: { id } });

  await logAudit({
    userId: auth.session!.userId,
    action: "game.delete",
    entityType: "game",
    entityId: String(id),
  });

  return NextResponse.json({ ok: true });
}
