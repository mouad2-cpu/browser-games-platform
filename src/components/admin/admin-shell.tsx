"use client";

import { usePathname } from "next/navigation";
import type { Role } from "@prisma/client";
import { AdminSidebar } from "./sidebar";

type Props = {
  children: React.ReactNode;
  role: Role;
  username: string;
};

export function AdminShell({ children, role, username }: Props) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar currentPath={pathname} role={role} username={username} />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
