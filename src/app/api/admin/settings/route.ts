import { NextResponse } from "next/server";
import { adminApiAuth } from "@/lib/admin/api-auth";
import { PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const auth = await adminApiAuth(PERMISSIONS.SETTINGS_MANAGE);
  if (auth.error) return auth.error;

  const settings = await prisma.platformSetting.findMany();
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return NextResponse.json({ settings: map });
}

export async function PUT(request: Request) {
  const auth = await adminApiAuth(PERMISSIONS.SETTINGS_MANAGE);
  if (auth.error) return auth.error;

  const { key, value } = await request.json();

  await prisma.platformSetting.upsert({
    where: { key },
    update: { value: JSON.stringify(value) },
    create: { key, value: JSON.stringify(value) },
  });

  await logAudit({
    userId: auth.session!.userId,
    action: "settings.update",
    entityType: "setting",
    entityId: key,
    metadata: { value },
  });

  return NextResponse.json({ ok: true });
}
