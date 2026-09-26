"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";

type ErrorScreenProps = {
  error: Error & { digest?: string };
  reset: () => void;
  global?: boolean;
};

export function ErrorScreen({ error, reset, global = false }: ErrorScreenProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main
      role="alert"
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "32px 20px",
        background: "#f5f5f0",
        color: "#172522",
        fontFamily: 'Inter, "Aptos", "Segoe UI", Arial, sans-serif',
      }}
    >
      <section style={{ width: "100%", maxWidth: 560 }}>
        <p style={{ fontSize: 11, letterSpacing: ".16em", fontWeight: 700, color: "#68736d" }}>
          THINK ZONE / SYSTEM NOTICE
        </p>
        <h1 style={{ margin: "24px 0 14px", fontSize: "clamp(36px, 7vw, 58px)", lineHeight: 1.04, fontWeight: 500, letterSpacing: "-.06em" }}>
          {global ? "We hit an unexpected error." : "This page ran into a problem."}
        </h1>
        <p style={{ margin: 0, maxWidth: 460, fontSize: 15, lineHeight: 1.7, color: "#65716d" }}>
          Your work is safe. Try loading this page again, or return to Think Zone.
        </p>
        {error.digest ? (
          <p style={{ margin: "14px 0 0", fontSize: 12, color: "#87918b" }}>
            Reference: {error.digest}
          </p>
        ) : null}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 27 }}>
          <button
            onClick={reset}
            style={{ border: 0, background: "#192522", color: "#f5f5f0", padding: "14px 18px", font: "inherit", fontSize: 13, cursor: "pointer" }}
          >
            Try again
          </button>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", border: "1px solid #bec6bd", padding: "14px 18px", fontSize: 13 }}>
            Return home
          </Link>
        </div>
      </section>
    </main>
  );
}
