import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { isStaffRole } from "@/lib/rbac";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/?auth=login");
  if (!isStaffRole(session.role)) redirect("/");

  return (
    <AdminShell role={session.role} username={session.username}>
      {children}
    </AdminShell>
  );
}
