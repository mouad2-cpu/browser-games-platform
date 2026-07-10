import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  hasPermission,
  isStaffRole,
  requirePermission,
  type Permission,
} from "@/lib/rbac";

export async function adminApiAuth(permission?: Permission) {
  const session = await getSession();
  if (!session || !isStaffRole(session.role)) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (permission && !hasPermission(session.role, permission)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session };
}

export async function requireAdminSession(permission?: Permission) {
  const session = await getSession();
  if (permission) {
    requirePermission(session, permission);
  } else if (!session || !isStaffRole(session.role)) {
    throw new Error("Unauthorized");
  }
  return session!;
}
