"use client";

import { useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar
        currentPath={pathname}
        role={role}
        username={username}
        mobileOpen={menuOpen}
        onNavigate={() => setMenuOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 lg:hidden">
          <button
            type="button"
            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
            onClick={() => setMenuOpen(true)}
            aria-label="Open admin navigation"
          >
            Menu
          </button>
          <span className="text-sm font-semibold">Control Center</span>
        </header>
        <main className="min-w-0 flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
