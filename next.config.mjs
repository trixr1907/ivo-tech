import path from 'node:path';
import { fileURLToPath } from 'node:url';
import createBundleAnalyzer from '@next/bundle-analyzer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const withBundleAnalyzer = createBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? 'https://ivo-tech.com';
let apexHost = 'ivo-tech.com';

try {
  apexHost = new URL(configuredSiteUrl).host.replace(/^www\./, '');
} catch {
  apexHost = 'ivo-tech.com';
}

const wwwHost = `www.${apexHost}`;
const allowedDevOrigins = Array.from(
  new Set(
    [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://0.0.0.0:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3001',
      'http://0.0.0.0:3001'
    ].concat(
      (process.env.NEXT_ALLOWED_DEV_ORIGINS ?? '')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    )
  )
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins,

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
      },
      {
        source: '/services',
        destination: '/leistungen',
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
          }
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
