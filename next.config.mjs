import path from 'node:path';
import { fileURLToPath } from 'node:url';
import createBundleAnalyzer from '@next/bundle-analyzer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const withBundleAnalyzer = createBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });
const cspReportUri = process.env.NEXT_PUBLIC_CSP_REPORT_URI ?? '';
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? 'https://ivo-tech.com';
let apexHost = 'ivo-tech.com';

try {
  apexHost = new URL(configuredSiteUrl).host.replace(/^www\./, '');
} catch {
  apexHost = 'ivo-tech.com';
}

const wwwHost = `www.${apexHost}`;
const cspReportOnly = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https:",
  "connect-src 'self' https:",
  "media-src 'self' data: https:",
  "frame-src 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self' mailto:",
  "object-src 'none'",
  'upgrade-insecure-requests',
  ...(cspReportUri ? [`report-uri ${cspReportUri}`] : [])
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Prevent Turbopack from inferring the wrong workspace root when multiple lockfiles exist.
  turbopack: {
    root: __dirname
  },

  images: {
    // Default is [75]. We also use 85/90 for some local project thumbnails.
    qualities: [75, 85, 90],
    formats: ['image/avif', 'image/webp']
  },

  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: wwwHost }],
        destination: `https://${apexHost}/:path*`,
        permanent: true
      }
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-DNS-Prefetch-Control', value: 'off' },
          { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Allows same-origin iframes (needed for /pizza/ inside the modal).
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
          { key: 'Origin-Agent-Cluster', value: '?1' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
          },
          { key: 'Content-Security-Policy-Report-Only', value: cspReportOnly }
        ]
      },
      {
        source: '/pizza/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, follow' }]
      },
      {
        source: '/en/pizza/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, follow' }]
      },
      {
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
      },
      {
        source: '/assets/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
      },
      {
        source: '/pizza/img/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
      },
      {
        source: '/vendor/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
      },
      {
        source: '/js/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
      }
    ];
  }
};

export default withBundleAnalyzer(nextConfig);
