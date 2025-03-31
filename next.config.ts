import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
  async rewrites() {
    return [
      {
        source: '/monitoring',
        destination: 'https://sentry.io',
      },
      {
        source: '/monitoring-tunnel',
        destination: '/api/sentry-tunnel',
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/monitoring',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS'
          }
        ]
      }
    ]
  }
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