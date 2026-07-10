"use client";

import { useState } from "react";
import { useLanguage } from "./language-provider";

type Props = {
  onSuccess: (role: string) => void;
};

export function RegisterForm({ onSuccess }: Props) {
  const { t } = useLanguage();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const csrfRes = await fetch("/api/auth/csrf");
      const { token } = await csrfRes.json();

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": token,
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t("auth.registerFailed"));
        return;
      }

      onSuccess(data.role ?? "USER");
    } catch {
      setError(t("auth.genericError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="mb-4 text-lg font-semibold">{t("auth.createAccount")}</h2>
      {error && (
        <p className="mb-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
      )}
      <div className="form-field">
        <label htmlFor="reg-username" className="form-label">
          {t("auth.username")}
        </label>
        <input
          id="reg-username"
          type="text"
          className="form-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
        />
      </div>
      <div className="form-field">
        <label htmlFor="reg-email" className="form-label">
          {t("auth.email")}
        </label>
        <input
          id="reg-email"
          type="email"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>
      <div className="form-field">
        <label htmlFor="reg-password" className="form-label">
          {t("auth.passwordMin")}
        </label>
        <input
          id="reg-password"
          type="password"
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? t("auth.creatingAccount") : t("auth.register")}
      </button>
    </form>
  );
}
