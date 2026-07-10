"use client";

import { Clock, Mail } from "lucide-react";
import { useLanguage } from "@/components/layout/language-provider";
import { LegalPageTitleSync } from "@/components/legal/legal-page-title-sync";
import { CONTACT_EMAIL } from "@/lib/site-config";
import { ContactForm } from "./contact-form";
import { ContactFaq } from "./contact-faq";
import "./contact-page.css";

export function ContactPageContent() {
  const { t } = useLanguage();

  return (
    <div className="contact-page">
      <LegalPageTitleSync titleKey="nav.contactUs" />
      <div className="contact-page-inner">
        <header className="contact-hero">
          <div className="contact-hero__badge">
            <span className="contact-hero__dot" aria-hidden />
            <span>{t("contact.badge")}</span>
          </div>
          <h1 className="contact-title">
            {t("contact.title")} <span>{t("contact.titleAccent")}</span>
          </h1>
        </header>

        <section className="contact-layout">
          <div className="contact-form-card">
            <div className="contact-form-card__accent" aria-hidden />
            <header className="contact-form-card__head">
              <h2>{t("contact.formTitle")}</h2>
              <p>{t("contact.formSubtitle")}</p>
            </header>
            <ContactForm />
          </div>

          <aside className="contact-side">
            <div className="contact-side-card">
              <p className="contact-side-card__eyebrow">{t("contact.contactInfo")}</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="contact-side-link">
                <span className="contact-side-link__icon">
                  <Mail className="size-4" aria-hidden />
                </span>
                {CONTACT_EMAIL}
              </a>
            </div>

            <div className="contact-side-card contact-side-card--secondary">
              <div className="contact-side-inline">
                <span className="contact-side-link__icon">
                  <Clock className="size-4" aria-hidden />
                </span>
                <div>
                  <h3>{t("contact.responseTitle")}</h3>
                  <p>{t("contact.responseText")}</p>
                </div>
              </div>
            </div>

            <div className="contact-side-card">
              <p className="contact-side-card__eyebrow">{t("contact.faqTitle")}</p>
              <ContactFaq />
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
