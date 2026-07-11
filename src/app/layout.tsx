import type { Metadata } from "next";
import { cookies } from "next/headers";
import { nunito } from "@/lib/fonts";
import { LanguageProvider } from "@/components/layout/language-provider";
import { LocaleDocumentTitle } from "@/components/layout/locale-document-title";
import { translate } from "@/lib/i18n";
import { isLocaleCode, type LocaleCode } from "@/lib/locale";
import { SITE_LOGO, SITE_NAME, SITE_URL } from "@/lib/site-config";
import { absoluteUrl } from "@/lib/structured-data/urls";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("zenfun-locale")?.value;
  const locale: LocaleCode =
    cookieLocale && isLocaleCode(cookieLocale) ? cookieLocale : "en";

  const title = translate(locale, "meta.siteTitle");
  const description = translate(locale, "meta.siteDescription", { siteName: SITE_NAME });
  const homeUrl = absoluteUrl("/");
  const socialImage = {
    url: SITE_LOGO.path,
    width: SITE_LOGO.width,
    height: SITE_LOGO.height,
    alt: SITE_LOGO.alt,
  };

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: translate(locale, "meta.siteTitleTemplate"),
    },
    description,
    icons: {
      icon: [
        { url: "/favicon.png", sizes: "32x32", type: "image/png" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
      shortcut: "/favicon.png",
    },
    openGraph: {
      title,
      description,
      url: homeUrl,
      siteName: SITE_NAME,
      type: "website",
      images: [socialImage],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [socialImage.url],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("zenfun-locale")?.value;
  const initialLocale: LocaleCode =
    cookieLocale && isLocaleCode(cookieLocale) ? cookieLocale : "en";

  return (
    <html lang={initialLocale}>
      <body className={`${nunito.className} antialiased`}>
        <LanguageProvider initialLocale={initialLocale}>
          <LocaleDocumentTitle />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
