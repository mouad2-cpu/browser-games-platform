"use client";

import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";
import { useEffect, useState } from "react";
import {
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_CONSENT_KEY,
} from "@/lib/analytics/constants";
import { GA_MEASUREMENT_ID } from "@/lib/site-config";

/** Loads GA4 only after the visitor has granted analytics consent. */
export function GoogleAnalytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    try {
      setAllowed(
        window.localStorage.getItem(ANALYTICS_CONSENT_KEY) === "accepted"
      );
    } catch {
      setAllowed(false);
    }

    function onConsent(event: Event) {
      setAllowed(
        (event as CustomEvent<"accepted" | "declined">).detail === "accepted"
      );
    }
    window.addEventListener(ANALYTICS_CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, onConsent);
  }, []);

  if (!GA_MEASUREMENT_ID || !allowed) return null;
  return <NextGoogleAnalytics gaId={GA_MEASUREMENT_ID} />;
}
