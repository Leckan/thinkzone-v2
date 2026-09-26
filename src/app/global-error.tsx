"use client";

import { ErrorScreen } from "@/components/error-screen";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <ErrorScreen error={error} reset={reset} global />
      </body>
    </html>
  );
}
