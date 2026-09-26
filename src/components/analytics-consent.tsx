"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type posthogType from "posthog-js";

type Consent = "accepted" | "rejected" | "unknown";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const CONSENT_KEY = "think-zone-analytics-consent";
const CONSENT_EVENT = "think-zone-analytics-consent-change";
let volatileConsent: Consent = "unknown";

function subscribeToConsent(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CONSENT_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CONSENT_EVENT, onChange);
  };
}

function getConsentSnapshot(): Consent {
  try {
    const saved = window.localStorage.getItem(CONSENT_KEY);
    if (saved === "accepted" || saved === "rejected") return saved;
    return volatileConsent;
  } catch {
    return volatileConsent;
  }
}

export function AnalyticsConsent({
  posthogKey,
  posthogHost,
  googleAnalyticsId,
}: {
  posthogKey: string;
  posthogHost: string;
  googleAnalyticsId: string;
}) {
  const pathname = usePathname();
  const consent = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, () => "unknown");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const posthogRef = useRef<typeof posthogType | null>(null);
  const previousPath = useRef(pathname);
  const isConfigured = Boolean(posthogKey || googleAnalyticsId);

  useEffect(() => {
    if (consent !== "accepted") {
      posthogRef.current?.opt_out_capturing();
      posthogRef.current = null;
      if (window.gtag) window.gtag("consent", "update", { analytics_storage: "denied" });
      return;
    }

    let cancelled = false;
    if (posthogKey) {
      import("posthog-js").then(({ default: posthog }) => {
        if (cancelled) return;
        posthog.init(posthogKey, {
          api_host: posthogHost || "https://us.i.posthog.com",
          autocapture: false,
          capture_pageview: false,
          capture_pageleave: false,
          disable_session_recording: true,
          person_profiles: "never",
          respect_dnt: true,
        });
        posthog.opt_in_capturing();
        posthogRef.current = posthog;
        posthog.capture("$pageview", { $current_url: window.location.href });
      }).catch(() => {
        console.error("PostHog could not be initialized.");
      });
    }

    if (googleAnalyticsId) {
      window.dataLayer = window.dataLayer ?? [];
      window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
      window.gtag("consent", "update", { analytics_storage: "granted" });
      window.gtag("js", new Date());
      window.gtag("config", googleAnalyticsId, { send_page_view: true });
    }

    return () => { cancelled = true; };
  }, [consent, googleAnalyticsId, posthogHost, posthogKey]);

  useEffect(() => {
    if (consent === "accepted" && previousPath.current !== pathname) {
      posthogRef.current?.capture("$pageview", { $current_url: window.location.href });
      // GA4 handles SPA history changes through its enhanced measurement setting.
    }
    previousPath.current = pathname;
  }, [consent, pathname]);

  function saveConsent(next: Exclude<Consent, "unknown">) {
    setSettingsOpen(false);
    volatileConsent = next;
    try {
      window.localStorage.setItem(CONSENT_KEY, next);
    } catch {
      // The current choice still applies for this page view.
    }
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }

  if (!isConfigured) return null;

  return (
    <>
      {consent === "accepted" && googleAnalyticsId && (
        <Script
          id="think-zone-google-analytics"
          src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleAnalyticsId)}`}
          strategy="lazyOnload"
        />
      )}
      {consent === "unknown" || settingsOpen ? (
        <aside className="analytics-consent" aria-label="Analytics preferences">
          <div><strong>Optional analytics</strong><p>{consent === "accepted" ? "Analytics are currently allowed. You can turn them off here." : consent === "rejected" ? "Analytics are currently off. You can allow them here." : "Analytics help us understand how the site is used. They stay off unless you allow them."}</p></div>
          <div className="analytics-consent-actions">
            <button type="button" onClick={() => saveConsent("rejected")}>Reject optional</button>
            <button type="button" onClick={() => saveConsent("accepted")}>Allow analytics</button>
          </div>
        </aside>
      ) : (
        <button className="analytics-settings" type="button" onClick={() => setSettingsOpen(true)}>Privacy settings</button>
      )}
    </>
  );
}
