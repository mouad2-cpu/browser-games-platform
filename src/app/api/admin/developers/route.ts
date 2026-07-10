import { NextResponse } from "next/server";
import { adminApiAuth } from "@/lib/admin/api-auth";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";

export async function GET() {
  const auth = await adminApiAuth(PERMISSIONS.DEVELOPERS_MANAGE);
  if (auth.error) return auth.error;

  const developers = await prisma.developer.findMany({
    include: {
      user: { select: { username: true, email: true } },
      _count: { select: { uploads: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ developers });
}
