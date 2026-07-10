import { NextResponse } from "next/server";
import { adminApiAuth } from "@/lib/admin/api-auth";
import { getDashboardStats } from "@/lib/admin/dashboard";

export async function GET() {
  const auth = await adminApiAuth();
  if (auth.error) return auth.error;

  const stats = await getDashboardStats();
  return NextResponse.json(stats);
}
