"use client";

import {
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_CONSENT_KEY,
} from "@/lib/analytics/constants";

export function AnalyticsConsentSettings({ locale }: { locale: string }) {
  function reopenConsent() {
    try {
      window.localStorage.removeItem(ANALYTICS_CONSENT_KEY);
    } catch {
      // The banner can still reopen for this page.
    }
    window.dispatchEvent(
      new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: null })
    );
  }

  return (
    <button type="button" className="btn-secondary" onClick={reopenConsent}>
      {locale === "es"
        ? "Cambiar preferencias de análisis"
        : "Change analytics preferences"}
    </button>
  );
}
