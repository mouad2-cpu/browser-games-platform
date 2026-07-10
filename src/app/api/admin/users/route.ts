import { NextResponse } from "next/server";
import { adminApiAuth } from "@/lib/admin/api-auth";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const auth = await adminApiAuth(PERMISSIONS.USERS_BAN);
  if (auth.error) return auth.error;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      isBanned: true,
      lastActiveAt: true,
      createdAt: true,
      _count: { select: { playEvents: true } },
    },
  });

  return NextResponse.json({ users });
}

export async function PATCH(request: Request) {
  const auth = await adminApiAuth(PERMISSIONS.USERS_BAN);
  if (auth.error) return auth.error;

  const { userId, isBanned, bannedReason } = await request.json();

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      isBanned,
      bannedAt: isBanned ? new Date() : null,
      bannedReason: isBanned ? bannedReason : null,
    },
  });

  await logAudit({
    userId: auth.session!.userId,
    action: isBanned ? "user.ban" : "user.unban",
    entityType: "user",
    entityId: userId,
    metadata: { bannedReason },
  });

  return NextResponse.json({ user });
}
