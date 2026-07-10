"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Clock, Flame, Home, Mail, Shuffle, Sparkles, Tag } from "lucide-react";
import { CategoryIcon } from "@/components/category/category-icon";
import { useLanguage } from "@/components/layout/language-provider";
import { getMenuPageHref, isMenuPageLinkActive, DEFAULT_SIDEBAR_PAGE_SLUGS, normalizeMenuPageSlug } from "@/lib/menu-page-routes";

export type SidebarCategory = {
  slug: string;
  name: string;
  icon: string | null;
};

export type SidebarMenuPage = {
  slug: string;
  title: string;
  icon: string | null;
};

type Props = {
  categories: SidebarCategory[];
  menuPages: SidebarMenuPage[];
  visible: boolean;
  expanded: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

const mainItems = [
  { type: "link" as const, href: "/", labelKey: "nav.home", icon: Home, match: (p: string) => p === "/" },
  {
    type: "link" as const,
    href: "/continue-playing",
    labelKey: "nav.recentlyPlayed",
    icon: Clock,
    match: (p: string) => p.startsWith("/continue-playing"),
  },
  {
    type: "link" as const,
    href: "/new",
    labelKey: "nav.new",
    icon: Sparkles,
    match: (p: string) => p.startsWith("/new"),
  },
  {
    type: "link" as const,
    href: "/popular",
    labelKey: "nav.popular",
    icon: Flame,
    match: (p: string) => p.startsWith("/popular"),
  },
  { type: "surprise" as const, labelKey: "nav.surprise", icon: Shuffle },
];

const DEFAULT_PAGE_LABEL_KEYS: Record<(typeof DEFAULT_SIDEBAR_PAGE_SLUGS)[number], string> = {
  about: "nav.about",
  "information-for-parents": "nav.infoForParents",
  "terms-of-service": "nav.terms",
  "privacy-policy": "nav.privacy",
  "cookie-statement": "nav.cookieStatement",
  "dmca-notice": "nav.dmca",
  "community-guidelines-policy": "nav.communityGuidelines",
};

function buildFooterMenuPages(
  menuPages: SidebarMenuPage[],
  t: (key: string) => string
): SidebarMenuPage[] {
  const dbPages = menuPages.filter((page) => page.slug !== "contact");
  const dbBySlug = new Map(
    dbPages.map((page) => [normalizeMenuPageSlug(page.slug), page])
  );

  const merged: SidebarMenuPage[] = DEFAULT_SIDEBAR_PAGE_SLUGS.map((slug) => {
    const fromDb = dbBySlug.get(slug);
    if (fromDb) {
      return { ...fromDb, slug };
    }
    return {
      slug,
      title: t(DEFAULT_PAGE_LABEL_KEYS[slug]),
      icon: null,
    };
  });

  for (const page of dbPages) {
    const normalized = normalizeMenuPageSlug(page.slug);
    if (!DEFAULT_SIDEBAR_PAGE_SLUGS.includes(normalized as (typeof DEFAULT_SIDEBAR_PAGE_SLUGS)[number])) {
      merged.push(page);
    }
  }

  return merged;
}

function SidebarExpandLabel({
  expanded,
  children,
  className = "",
}: {
  expanded: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`overflow-hidden whitespace-nowrap transition-all duration-200 ease-out ${
        expanded ? "max-w-[12rem] opacity-100" : "max-w-0 opacity-0"
      } ${className}`}
    >
      {children}
    </span>
  );
}

export function SideNav({
  categories,
  menuPages,
  visible,
  expanded,
  onMouseEnter,
  onMouseLeave,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [surpriseLoading, setSurpriseLoading] = useState(false);

  const contactPage = menuPages.find((page) => page.slug === "contact");
  const footerMenuPages = buildFooterMenuPages(menuPages, t);
  const contactHref = contactPage ? getMenuPageHref(contactPage.slug) : "/contact";
  const contactLabel = contactPage?.title ?? t("nav.contactUs");

  async function handleSurprise() {
    setSurpriseLoading(true);
    try {
      const res = await fetch("/api/games/random");
      const data = await res.json();
      if (data.slug) {
        router.push(`/game/${data.slug}`);
      }
    } finally {
      setSurpriseLoading(false);
    }
  }

  function isCategoryActive(slug: string) {
    return pathname === `/c/${slug}` || pathname.startsWith(`/c/${slug}?`);
  }

  const contactActive =
    pathname === contactHref || pathname.startsWith(`${contactHref}?`);

  const sidebarWidth = !visible ? "w-0" : expanded ? "w-52" : "w-[68px]";

  return (
    <aside
      onMouseEnter={visible ? onMouseEnter : undefined}
      onMouseLeave={visible ? onMouseLeave : undefined}
      aria-hidden={!visible}
      inert={!visible ? true : undefined}
      className={`fixed left-0 top-[var(--header-h)] z-20 flex h-[calc(100vh-var(--header-h))] flex-col overflow-hidden border-r bg-[var(--color-surface)] shadow-[4px_0_24px_rgba(0,0,0,0.18)] transition-[width] duration-200 ease-out ${sidebarWidth} ${
        visible ? "border-[var(--color-border)]" : "pointer-events-none border-transparent shadow-none"
      } ${expanded && visible ? "z-30" : ""}`}
    >
      <nav className="hide-scrollbar min-w-[68px] flex-1 overflow-y-auto py-3">
        <ul className="space-y-1 px-2">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const active = item.type === "link" ? item.match(pathname) : false;

            if (item.type === "surprise") {
              return (
                <li key="surprise">
                  <button
                    type="button"
                    onClick={handleSurprise}
                    disabled={surpriseLoading || !visible}
                    tabIndex={visible ? undefined : -1}
                    title={t(item.labelKey)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition disabled:opacity-50 ${
                      expanded ? "justify-start" : "justify-center"
                    } text-[var(--color-nav-icon)] hover:bg-[var(--color-surface-hover)]`}
                  >
                    <Icon className="size-5 shrink-0" strokeWidth={2} />
                    <SidebarExpandLabel expanded={expanded}>
                      {surpriseLoading ? t("common.loading") : t(item.labelKey)}
                    </SidebarExpandLabel>
                  </button>
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={t(item.labelKey)}
                  tabIndex={visible ? undefined : -1}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                    expanded ? "justify-start" : "justify-center"
                  } ${
                    active
                      ? "bg-[var(--color-accent)]/20 text-white"
                      : "text-[var(--color-nav-icon)] hover:bg-[var(--color-surface-hover)]"
                  }`}
                >
                  <Icon className="size-5 shrink-0" strokeWidth={2} />
                  <SidebarExpandLabel expanded={expanded} className="truncate">
                    {t(item.labelKey)}
                  </SidebarExpandLabel>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mx-3 my-3 border-t border-[var(--color-border)]" />

        <ul className="space-y-1 px-2">
          {categories.map((cat) => {
            const active = isCategoryActive(cat.slug);
            return (
              <li key={cat.slug}>
                <Link
                  href={`/c/${cat.slug}`}
                  title={cat.name}
                  tabIndex={visible ? undefined : -1}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                    expanded ? "justify-start" : "justify-center"
                  } ${
                    active
                      ? "bg-[var(--color-accent)]/20 text-white"
                      : "text-[var(--color-nav-icon)] hover:bg-[var(--color-surface-hover)]"
                  }`}
                >
                  <CategoryIcon
                    icon={cat.icon}
                    name={cat.name}
                    slug={cat.slug}
                    size="sm"
                    className="shrink-0"
                  />
                  <SidebarExpandLabel expanded={expanded} className="truncate">
                    {cat.name}
                  </SidebarExpandLabel>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mx-3 my-3 border-t border-[var(--color-border)]" />

        <div className="px-2 pb-3">
          <div
            className={`mb-2 flex items-center gap-3 px-3 py-1 transition-all duration-200 ease-out ${
              expanded ? "justify-start" : "justify-center"
            }`}
          >
            <Tag className="size-5 shrink-0 text-[var(--color-nav-icon)]" strokeWidth={2} />
          <SidebarExpandLabel expanded={expanded} className="text-sm font-bold text-white">
            {t("nav.pages")}
          </SidebarExpandLabel>
          </div>

          <Link
            href={contactHref}
            title={contactLabel}
            tabIndex={visible ? undefined : -1}
            className={`mb-2 flex items-center gap-3 py-2.5 text-sm font-bold transition-all duration-200 ease-out ${
              expanded ? "w-full justify-center rounded-full px-3" : "justify-center rounded-xl px-3"
            } ${
              expanded
                ? contactActive
                  ? "bg-[var(--color-accent-hover)] text-white"
                  : "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]"
                : contactActive
                  ? "bg-[var(--color-accent)]/20 text-white"
                  : "text-[var(--color-nav-icon)] hover:bg-[var(--color-surface-hover)]"
            }`}
          >
            <Mail className="size-5 shrink-0" strokeWidth={2} />
            <SidebarExpandLabel expanded={expanded}>{contactLabel}</SidebarExpandLabel>
          </Link>

          <ul
            className={`hide-scrollbar space-y-0.5 transition-all duration-200 ease-out ${
              expanded ? "max-h-44 overflow-y-auto opacity-100" : "max-h-0 overflow-hidden opacity-0"
            }`}
          >
            {footerMenuPages.map((page) => {
              const active = isMenuPageLinkActive(pathname, page.slug);
              const href = getMenuPageHref(page.slug);
              return (
                <li key={page.slug}>
                  <Link
                    href={href}
                    tabIndex={visible && expanded ? undefined : -1}
                    className={`block rounded-md px-3 py-1.5 text-sm transition ${
                      active
                        ? "font-semibold text-white"
                        : "text-[var(--color-nav-icon)] hover:text-white"
                    }`}
                  >
                    {page.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
