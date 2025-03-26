import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  trailingSlash: true,
};

const sentryOptions = {
  org: "7azydevz",
  project: "vcs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  // Remove tunnelRoute and monitoring options
};

export default withSentryConfig(nextConfig, sentryOptions);