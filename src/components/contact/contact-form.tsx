"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/components/layout/language-provider";
import { submitContactForm } from "@/app/actions/contact";

const TOPIC_KEYS = ["general", "bug", "suggestion", "partnership", "other"] as const;
const TOPIC_VALUES: Record<(typeof TOPIC_KEYS)[number], string> = {
  general: "General inquiry",
  bug: "Bug report",
  suggestion: "Game suggestion",
  partnership: "Partnership",
  other: "Other",
};

const MESSAGE_MAX = 2000;

export function ContactForm() {
  const { t } = useLanguage();
  const [topic, setTopic] = useState<(typeof TOPIC_KEYS)[number]>(TOPIC_KEYS[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const formData = new FormData();
    formData.set("issueType", TOPIC_VALUES[topic]);
    formData.set("name", name);
    formData.set("email", email);
    formData.set("subject", subject);
    formData.set("message", message);

    startTransition(async () => {
      try {
        const result = await submitContactForm(formData);
        if (result.error) {
          setError(result.error);
          return;
        }
        setSuccess(true);
        setTopic(TOPIC_KEYS[0]);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } catch {
        setError(t("contact.form.error"));
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      {error && <p className="contact-message contact-message--error">{error}</p>}
      {success && (
        <p className="contact-message contact-message--success">{t("contact.form.success")}</p>
      )}

      <div className="contact-form-row contact-form-row--two">
        <div className="contact-form-group">
          <label htmlFor="contact-name">{t("contact.form.name")}</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("contact.form.namePlaceholder")}
            required
            className="contact-input"
          />
        </div>

        <div className="contact-form-group">
          <label htmlFor="contact-email">{t("contact.form.email")}</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("contact.form.emailPlaceholder")}
            required
            className="contact-input"
          />
        </div>
      </div>

      <div className="contact-form-group">
        <label htmlFor="contact-topic">{t("contact.form.topic")}</label>
        <select
          id="contact-topic"
          name="issueType"
          value={topic}
          onChange={(e) => setTopic(e.target.value as (typeof TOPIC_KEYS)[number])}
          required
          className="contact-input"
        >
          {TOPIC_KEYS.map((key) => (
            <option key={key} value={key}>
              {t(`contact.topics.${key}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="contact-form-group">
        <label htmlFor="contact-subject">{t("contact.form.subject")}</label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder={t("contact.form.subjectPlaceholder")}
          className="contact-input"
        />
      </div>

      <div className="contact-form-group">
        <label htmlFor="contact-message">{t("contact.form.message")}</label>
        <textarea
          id="contact-message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, MESSAGE_MAX))}
          placeholder={t("contact.form.messagePlaceholder")}
          required
          minLength={10}
          maxLength={MESSAGE_MAX}
          rows={6}
          className="contact-input contact-textarea"
        />
        <p className="contact-counter">
          {message.length} / {MESSAGE_MAX}
        </p>
      </div>

      <button type="submit" disabled={pending} className="contact-submit">
        {pending ? (
          <>
            <span className="contact-spinner" aria-hidden />
            {t("contact.form.sending")}
          </>
        ) : (
          t("contact.form.send")
        )}
      </button>
    </form>
  );
}
