"use server";

import { revalidatePath } from "next/cache";
import { ReportStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { requirePermission, PERMISSIONS } from "@/lib/rbac";

async function requireAdmin() {
  const session = await getSession();
  return requirePermission(session, PERMISSIONS.REPORTS_MANAGE);
}

export async function closeReport(reportId: string) {
  await requireAdmin();
  await prisma.gameReport.update({
    where: { id: reportId },
    data: { status: ReportStatus.CLOSED },
  });
  revalidatePath("/admin/reports");
}

export async function deleteReport(reportId: string) {
  await requireAdmin();
  await prisma.gameReport.delete({ where: { id: reportId } });
  revalidatePath("/admin/reports");
}

export async function closeReportAction(formData: FormData) {
  const reportId = formData.get("reportId") as string;
  if (reportId) await closeReport(reportId);
}

export async function deleteReportAction(formData: FormData) {
  const reportId = formData.get("reportId") as string;
  if (reportId) await deleteReport(reportId);
}

export async function logoutAdmin() {
  const { clearSession } = await import("@/lib/auth");
  await clearSession();
}
