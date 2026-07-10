import { NextResponse } from "next/server";
import { adminApiAuth } from "@/lib/admin/api-auth";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { GameStatus } from "@prisma/client";

export async function GET(request: Request) {
  const auth = await adminApiAuth(PERMISSIONS.UPLOADS_APPROVE);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? "PENDING";

  const uploads = await prisma.gameUpload.findMany({
    where: { status: status as "PENDING" | "APPROVED" | "REJECTED" },
    orderBy: { createdAt: "desc" },
    include: {
      developer: {
        include: { user: { select: { username: true, email: true } } },
      },
    },
  });

  return NextResponse.json({ uploads });
}

export async function PATCH(request: Request) {
  const auth = await adminApiAuth(PERMISSIONS.UPLOADS_APPROVE);
  if (auth.error) return auth.error;

  const { uploadId, action, rejectReason } = await request.json();

  const upload = await prisma.gameUpload.findUnique({ where: { id: uploadId } });
  if (!upload) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (action === "approve") {
    const slug = upload.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-");

    const now = new Date();
    const game = await prisma.$transaction(async (tx) => {
      const created = await tx.game.create({
        data: {
          title: upload.title,
          slug: `${slug}-${Date.now()}`,
          description: upload.description,
          thumbnail: upload.thumbnail,
          embedPath: upload.embedPath,
          status: GameStatus.published,
          addedAt: now,
          releasedAt: now,
        },
      });
      await tx.gameUpload.update({
        where: { id: uploadId },
        data: { status: "APPROVED", reviewedAt: now },
      });
      return created;
    });

    await logAudit({
      userId: auth.session!.userId,
      action: "upload.approve",
      entityType: "game_upload",
      entityId: uploadId,
      metadata: { gameId: game.id },
    });

    return NextResponse.json({ ok: true, game });
  }

  if (action === "reject") {
    await prisma.gameUpload.update({
      where: { id: uploadId },
      data: {
        status: "REJECTED",
        rejectReason: rejectReason ?? "Does not meet guidelines",
        reviewedAt: new Date(),
      },
    });

    await logAudit({
      userId: auth.session!.userId,
      action: "upload.reject",
      entityType: "game_upload",
      entityId: uploadId,
      metadata: { rejectReason },
    });

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
