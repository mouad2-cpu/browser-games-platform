"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "@/lib/auth";
import { AuthButton } from "./auth-button";
import { SideNav, type SidebarCategory, type SidebarMenuPage } from "./side-nav";
import { SidebarToggleIcon } from "./sidebar-toggle-icon";
import { SiteFooter } from "./site-footer";
import { useLanguage } from "./language-provider";
import { isSidebarHiddenPath } from "@/lib/menu-page-routes";

type Props = {
  session: Session | null;
  categories: SidebarCategory[];
  menuPages: SidebarMenuPage[];
  children: React.ReactNode;
};

function AuthButtonFallback() {
  return <div className="h-9 w-20 animate-pulse rounded-lg bg-[var(--color-surface)]" />;
}

export function PublicShell({ session, categories, menuPages, children }: Props) {
  const pathname = usePathname();
  const hideSidebar = isSidebarHiddenPath(pathname);
  const [menuVisible, setMenuVisible] = useState(true);
  const [menuExpanded, setMenuExpanded] = useState(false);
  const { t } = useLanguage();

  const isHomePage = pathname === "/";
  const sidebarSpacerClass = !hideSidebar && menuVisible ? "w-[68px]" : "w-0";

  return (
    <>
      <header
        className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-surface)]"
        style={{ height: "var(--header-h)" }}
      >
        <div className="flex h-full w-full items-center gap-2 px-3 sm:gap-4 sm:px-4">
          {!hideSidebar && (
            <button
              type="button"
              onClick={() => setMenuVisible((v) => !v)}
              className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white transition duration-200 hover:scale-105 hover:bg-[var(--color-surface-hover)] active:scale-95"
              aria-label={menuVisible ? t("shell.hideMenu") : t("shell.showMenu")}
              aria-expanded={menuVisible}
              title={menuVisible ? t("shell.hideMenu") : t("shell.showMenu")}
            >
              <SidebarToggleIcon
                menuVisible={menuVisible}
                className="transition-transform duration-200 group-hover:scale-110"
              />
            </button>
          )}

          <Link href="/" className="shrink-0" aria-label={t("shell.homeAria")}>
            <Image
              src="/zenfun-brand.png"
              alt="ZenFun Games"
              width={220}
              height={96}
              priority
              unoptimized
              className="h-[88px] w-auto object-contain sm:h-[96px]"
            />
          </Link>

          <form action="/search" method="GET" className="mx-auto hidden max-w-md flex-1 md:block">
            <input
              type="search"
              name="s"
              placeholder={t("shell.searchPlaceholder")}
              className="form-input w-full"
              aria-label={t("shell.searchAria")}
            />
          </form>

          <Suspense fallback={<AuthButtonFallback />}>
            <AuthButton session={session} />
          </Suspense>
        </div>
      </header>

      <div className="flex flex-1">
        {!hideSidebar && (
          <>
            <div
              aria-hidden
              className={`shrink-0 transition-[width] duration-200 ease-out ${sidebarSpacerClass}`}
            />
            <SideNav
              categories={categories}
              menuPages={menuPages}
              visible={menuVisible}
              expanded={menuExpanded}
              onMouseEnter={() => setMenuExpanded(true)}
              onMouseLeave={() => setMenuExpanded(false)}
            />
          </>
        )}
        <div className="flex min-w-0 flex-1 flex-col bg-[var(--color-page-bg)]">
          <main className="min-w-0 flex-1">{children}</main>
          {!isHomePage && <SiteFooter />}
        </div>
      </div>
    </>
  );
}
