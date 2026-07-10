"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/components/layout/language-provider";
import { CONTACT_EMAIL } from "@/lib/site-config";

const FAQ_KEYS = ["q1", "q2", "q3", "q4", "q5"] as const;

export function ContactFaq() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="contact-faq">
      {FAQ_KEYS.map((key, index) => {
        const isOpen = openIndex === index;
        const question = t(`contact.faq.${key}`);
        const answerKey = key.replace("q", "a") as "a1" | "a2" | "a3" | "a4" | "a5";
        const answer =
          key === "q5"
            ? t(`contact.faq.${answerKey}`, { email: CONTACT_EMAIL })
            : t(`contact.faq.${answerKey}`);

        return (
          <div key={key} className={`contact-faq-item${isOpen ? " is-open" : ""}`}>
            <button
              type="button"
              className="contact-faq-button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
            >
              <span>{question}</span>
              <ChevronDown className="contact-faq-chevron size-4" aria-hidden />
            </button>
            <div className="contact-faq-panel">
              <p>{answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
