import type { Metadata } from "next";
import { ContactPageContent } from "@/components/contact/contact-page-content";
import { FaqJsonLd } from "@/components/seo/structured-data";
import { getContactFaqItems } from "@/lib/structured-data/faq";
import { buildPageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = buildPageMetadata({
  path: "/contact",
  title: "Contact Us",
  description:
    "Get in touch with ZenFun Games — report issues, suggest games, ask questions, or partner with us.",
});

export default async function ContactPage() {
  const faqItems = await getContactFaqItems();

  return (
    <>
      <FaqJsonLd items={faqItems} />
      <ContactPageContent />
    </>
  );
}
