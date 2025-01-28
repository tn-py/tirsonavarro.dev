// @ts-check

const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables based on NODE_ENV
const envPath = `.env.${process.env.NODE_ENV || 'development'}`;
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.warn(`Environment file "${envPath}" not found.`);
}

const isProduction = process.env.NODE_ENV === 'production';
const outputDir = process.env.BRANCH === 'dev' ? 'dev' : '.next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: outputDir,
  compiler: {
    reactRemoveProperties: isProduction,
    removeConsole: isProduction,
    styledComponents: {
      displayName: !isProduction,
      minify: isProduction,
      pure: true,
    },
  },
  devIndicators: {
    buildActivityPosition: 'top-right',
  },
  experimental: {
    legacyBrowsers: false,
    swcFileReading: true,
    appDir: true,
  },
  optimizeFonts: true,
  productionBrowserSourceMaps: isProduction,
  swcMinify: !isProduction,
  images: {
    domains: ['raw.githubusercontent.com'],
  },
};

module.exports = nextConfig;

// Injected content via Sentry wizard below
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  module.exports,
  {
    org: 'aiis',
    project: 'javascript-nextjs',
    silent: !process.env.CI,
    widenClientFileUpload: true,
    reactComponentAnnotation: {
      enabled: true,
    },
    tunnelRoute: '/monitoring',
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
  }
);
