"use client";

import Image from "next/image";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site-config";
import { useLanguage } from "./language-provider";
import "./site-footer.css";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const { t } = useLanguage();

  const exploreLinks = [
    { href: "/", label: t("footer.exploreGames") },
    { href: "/about", label: t("footer.exploreAbout") },
    { href: "/contact", label: t("footer.exploreContact") },
    { href: "/information-for-parents", label: t("footer.exploreParents") },
  ] as const;

  const legalLinks = [
    { href: "/terms-of-service", label: t("footer.legalTerms") },
    { href: "/privacy-policy", label: t("footer.legalPrivacy") },
    { href: "/cookie-statement", label: t("footer.legalCookies") },
    { href: "/dmca-notice", label: t("footer.legalDmca") },
    { href: "/community-guidelines-policy", label: t("footer.legalCommunity") },
  ] as const;

  return (
    <footer className="site-footer">
      <div className="site-footer-accent-line" aria-hidden />
      <div className="site-footer-glow site-footer-glow--a" aria-hidden />
      <div className="site-footer-glow site-footer-glow--b" aria-hidden />
      <div className="site-footer-main">
        <div className="site-footer-brand">
          <Link href="/" className="site-footer-logo" aria-label={t("shell.homeAria")}>
            <Image
              src="/zenfun-brand.png"
              alt={SITE_NAME}
              width={220}
              height={96}
              unoptimized
              className="h-[88px] w-auto object-contain sm:h-[96px]"
            />
          </Link>
          <p className="site-footer-tagline">{t("footer.tagline")}</p>
        </div>

        <div>
          <h2 className="site-footer-column-title">{t("footer.explore")}</h2>
          <ul className="site-footer-links">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="site-footer-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="site-footer-column-title">{t("footer.legal")}</h2>
          <ul className="site-footer-links">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="site-footer-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="site-footer-bottom">
        <div className="site-footer-bottom-inner">
          <p className="site-footer-copy">
            © {year} {SITE_NAME}. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
