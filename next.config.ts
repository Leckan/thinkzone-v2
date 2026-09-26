import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSentryConfig(nextConfig, {
  org: "think-zone-llc",
  project: "thinkzone-v2",
  sourcemaps: { disable: true },
  release: { create: false, finalize: false },
  telemetry: false,
});
