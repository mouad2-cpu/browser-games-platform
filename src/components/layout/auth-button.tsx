"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Session } from "@/lib/auth";
import { isStaffRole } from "@/lib/rbac";
import { AuthPanel } from "./auth-panel";
import { useLanguage } from "./language-provider";

type Props = {
  session: Session | null;
};

export function AuthButton({ session }: Props) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState<"login" | "register">("login");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  useEffect(() => {
    const auth = searchParams.get("auth");
    if (auth === "login" || auth === "register") {
      setDefaultTab(auth);
      setPanelOpen(true);
      const url = new URL(window.location.href);
      url.searchParams.delete("auth");
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [searchParams, router]);

  const handleSuccess = useCallback(
    (role: string) => {
      setPanelOpen(false);
      router.refresh();
      if (isStaffRole(role as import("@prisma/client").Role)) {
        router.replace("/admin/dashboard");
      }
    },
    [router]
  );

  const handleLogout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.refresh();
      router.replace("/");
    } catch {
      /* ignore */
    }
  }, [router]);

  if (session) {
    const href = isStaffRole(session.role) ? "/admin/dashboard" : "/";
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <Link href={href} className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-accent)] text-sm font-bold text-white">
            {session.username[0].toUpperCase()}
          </span>
          <span className="hidden text-sm text-[var(--color-muted)] sm:inline">
            {session.username}
          </span>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="btn-secondary shrink-0 text-sm"
        >
          {t("auth.signOut")}
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setDefaultTab("login");
          setPanelOpen(true);
        }}
        className="btn-primary text-sm"
        aria-label={t("auth.signIn")}
      >
        {t("auth.signIn")}
      </button>
      {panelOpen && (
        <AuthPanel
          defaultTab={defaultTab}
          onClose={() => setPanelOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
