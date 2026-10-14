import Link from "next/link";
import type { Role } from "@prisma/client";
import { getNavForRole } from "@/lib/rbac";

type Props = {
  currentPath: string;
  role: Role;
  username: string;
  mobileOpen: boolean;
  onNavigate: () => void;
};

export function AdminSidebar({
  currentPath,
  role,
  username,
  mobileOpen,
  onNavigate,
}: Props) {
  const nav = getNavForRole(role);

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          aria-label="Close admin navigation"
          onClick={onNavigate}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-transform lg:static lg:z-auto lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
      <div className="border-b border-[var(--color-border)] p-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="text-sm font-bold text-[var(--color-accent)]"
        >
          BrowserGames
        </Link>
        <p className="mt-1 text-xs text-[var(--color-muted)]">Control Center</p>
        <p className="mt-2 truncate text-xs text-[var(--color-text)]">
          {username}{" "}
          <span className="text-[var(--color-muted)]">({role.replace("_", " ")})</span>
        </p>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {nav.map((item) => {
            const active = item.href === "/admin/dashboard"
              ? currentPath === "/admin/dashboard" || currentPath === "/admin"
              : currentPath.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={`block rounded-lg px-3 py-2 text-sm transition ${
                    active
                      ? "bg-[var(--color-accent)] text-white"
                      : "text-[var(--color-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                  }`}
                >
                  {item.label}
                </Link>
                {item.children && item.children.length > 0 && (
                  <ul className="ml-3 mt-1 space-y-0.5 border-l border-[var(--color-border)] pl-2">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={onNavigate}
                          className={`block rounded px-2 py-1 text-xs transition ${
                            currentPath === child.href
                              ? "text-[var(--color-accent)]"
                              : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                          }`}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-[var(--color-border)] p-3">
        <Link
          href="/"
          onClick={onNavigate}
          className="block rounded-lg px-3 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]"
        >
          ← Back to site
        </Link>
      </div>
      </aside>
    </>
  );
}
