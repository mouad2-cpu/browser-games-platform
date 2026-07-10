"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLanguage } from "@/components/layout/language-provider";
import { reportGame } from "@/app/actions/report-game";

type Props = {
  gameId: number;
  gameTitle: string;
  open: boolean;
  onClose: () => void;
};

const ISSUE_KEYS = ["wontLoad", "brokenGraphics", "lostProgress", "other"] as const;
const ISSUE_VALUES: Record<(typeof ISSUE_KEYS)[number], string> = {
  wontLoad: "Won't load",
  brokenGraphics: "Broken graphics",
  lostProgress: "Lost progress",
  other: "Other",
};

export function ReportPanel({ gameId, gameTitle, open, onClose }: Props) {
  const { t } = useLanguage();
  const [issueKey, setIssueKey] = useState<(typeof ISSUE_KEYS)[number]>(ISSUE_KEYS[0]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const formData = new FormData();
    formData.set("gameId", String(gameId));
    formData.set("issueType", ISSUE_VALUES[issueKey]);
    formData.set("email", email);
    formData.set("message", message);

    startTransition(async () => {
      const result = await reportGame(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setSuccess(true);
      setTimeout(onClose, 1500);
    });
  }

  return (
    <>
      <div className="panel-backdrop" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        className="panel-drawer panel-drawer-left"
        role="dialog"
        aria-modal="true"
        aria-label={t("game.reportAria")}
        tabIndex={-1}
      >
        <div className="panel-header">
          <h2 className="font-semibold">{t("game.reportTitle")}</h2>
          <button type="button" className="btn-ghost" onClick={onClose} aria-label={t("game.close")}>
            ✕
          </button>
        </div>
        <div className="panel-body">
          <p className="mb-4 text-sm text-[var(--color-muted)]">
            {t("game.reportIntro")}{" "}
            <strong className="text-[var(--color-text)]">{gameTitle}</strong>
          </p>
          {error && (
            <p className="mb-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
          )}
          {success && (
            <p className="mb-3 rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-400">
              {t("game.success")}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="issue-type" className="form-label">
                {t("game.issueType")}
              </label>
              <select
                id="issue-type"
                className="form-input"
                value={issueKey}
                onChange={(e) => setIssueKey(e.target.value as (typeof ISSUE_KEYS)[number])}
              >
                {ISSUE_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {t(`game.issueTypes.${key}`)}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="report-email" className="form-label">
                {t("game.emailOptional")}
              </label>
              <input
                id="report-email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="report-message" className="form-label">
                {t("game.message")}
              </label>
              <textarea
                id="report-message"
                className="form-input min-h-[120px] resize-y"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                minLength={10}
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={pending || message.trim().length < 10}
            >
              {pending ? t("game.submitting") : t("game.submit")}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
