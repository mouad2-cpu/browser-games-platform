"use client";

import { useEffect, useRef, useState } from "react";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { useLanguage } from "./language-provider";

type Props = {
  defaultTab: "login" | "register";
  onClose: () => void;
  onSuccess: (role: string) => void;
};

export function AuthPanel({ defaultTab, onClose, onSuccess }: Props) {
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const panelRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
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
  }, [onClose]);

  return (
    <>
      <div className="panel-backdrop" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        className="panel-drawer panel-drawer-right"
        role="dialog"
        aria-modal="true"
        aria-label={t("auth.authentication")}
        tabIndex={-1}
      >
        <div className="panel-header">
          <div className="flex gap-1">
            <button
              type="button"
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                tab === "login"
                  ? "bg-[var(--color-accent)] text-white"
                  : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
              }`}
              onClick={() => setTab("login")}
            >
              {t("auth.signIn")}
            </button>
            <button
              type="button"
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                tab === "register"
                  ? "bg-[var(--color-accent)] text-white"
                  : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
              }`}
              onClick={() => setTab("register")}
            >
              {t("auth.register")}
            </button>
          </div>
          <button type="button" className="btn-ghost" onClick={onClose} aria-label={t("auth.close")}>
            ✕
          </button>
        </div>
        <div className="panel-body">
          {tab === "login" ? (
            <LoginForm onSuccess={onSuccess} />
          ) : (
            <RegisterForm onSuccess={onSuccess} />
          )}
        </div>
      </div>
    </>
  );
}
