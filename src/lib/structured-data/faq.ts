import { cookies } from "next/headers";
import { CONTACT_EMAIL } from "@/lib/site-config";
import { translate } from "@/lib/i18n";
import { isLocaleCode, type LocaleCode } from "@/lib/locale";
import type { FaqItemInput } from "@/lib/structured-data/types";

const FAQ_KEYS = ["1", "2", "3", "4", "5"] as const;

export async function getContactFaqItems(): Promise<FaqItemInput[]> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("zenfun-locale")?.value;
  const locale: LocaleCode =
    cookieLocale && isLocaleCode(cookieLocale) ? cookieLocale : "en";

  return FAQ_KEYS.map((n) => {
    const question = translate(locale, `contact.faq.q${n}`);
    const answer =
      n === "5"
        ? translate(locale, `contact.faq.a${n}`, { email: CONTACT_EMAIL })
        : translate(locale, `contact.faq.a${n}`);
    return { question, answer };
  });
}
