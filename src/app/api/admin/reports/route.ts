import { NextResponse } from "next/server";
import { adminApiAuth } from "@/lib/admin/api-auth";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const auth = await adminApiAuth(PERMISSIONS.REPORTS_MANAGE);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const status = searchParams.get("status");

  const reports = await prisma.gameReport.findMany({
    where: {
      ...(type ? { reportType: type as never } : {}),
      ...(status ? { status: status as "OPEN" | "CLOSED" } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      game: { select: { title: true, slug: true } },
    },
  });

  return NextResponse.json({ reports });
}
