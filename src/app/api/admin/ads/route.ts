import { NextResponse } from "next/server";
import { adminApiAuth } from "@/lib/admin/api-auth";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";

export async function GET() {
  const auth = await adminApiAuth(PERMISSIONS.ADS_MANAGE);
  if (auth.error) return auth.error;

  const [slots, campaigns] = await Promise.all([
    prisma.adSlot.findMany({ include: { _count: { select: { campaigns: true } } } }),
    prisma.adCampaign.findMany({
      include: { slot: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({ slots, campaigns });
}

export async function POST(request: Request) {
  const auth = await adminApiAuth(PERMISSIONS.ADS_MANAGE);
  if (auth.error) return auth.error;

  const body = await request.json();

  if (body.type === "slot") {
    const slot = await prisma.adSlot.create({ data: body.data });
    return NextResponse.json({ slot });
  }

  if (body.type === "campaign") {
    const campaign = await prisma.adCampaign.create({ data: body.data });
    return NextResponse.json({ campaign });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
