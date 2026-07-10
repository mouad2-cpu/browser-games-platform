import { NextResponse } from "next/server";
import { adminApiAuth } from "@/lib/admin/api-auth";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const auth = await adminApiAuth(PERMISSIONS.MODERATION_MANAGE);
  if (auth.error) return auth.error;

  const [flags, pendingUploads] = await Promise.all([
    prisma.moderationFlag.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.gameUpload.count({ where: { status: "PENDING" } }),
  ]);

  return NextResponse.json({ flags, pendingUploads });
}

export async function PATCH(request: Request) {
  const auth = await adminApiAuth(PERMISSIONS.MODERATION_MANAGE);
  if (auth.error) return auth.error;

  const { flagId, status } = await request.json();

  const flag = await prisma.moderationFlag.update({
    where: { id: flagId },
    data: { status, resolvedAt: new Date() },
  });

  await logAudit({
    userId: auth.session!.userId,
    action: `moderation.${status.toLowerCase()}`,
    entityType: flag.entityType,
    entityId: flag.entityId,
  });

  return NextResponse.json({ flag });
}
