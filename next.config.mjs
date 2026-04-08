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
function buildCsp({ allowPizzaThirdParty = false } = {}) {
  const styleSources = ["'self'", 'https://challenges.cloudflare.com'];
  const styleElemSources = ["'self'", 'https://challenges.cloudflare.com'];
  const frameSources = ["'self'", 'https://challenges.cloudflare.com'];

  if (allowPizzaThirdParty) {
    // /pizza embeds Google Fonts and Google Maps iframe.
    styleSources.push('https://fonts.googleapis.com');
    styleElemSources.push('https://fonts.googleapis.com');
    frameSources.push('https://www.google.com');
  }

  const scriptSrc = "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com";

  const styleSrc = `style-src ${styleSources.join(' ')}`;

  const directives = [
    "default-src 'self'",
    scriptSrc,
    "script-src-attr 'none'",
    styleSrc,
    `style-src-elem ${styleElemSources.join(' ')}`,
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https:",
    "connect-src 'self' https:",
    "media-src 'self' data: https:",
    `frame-src ${frameSources.join(' ')}`,
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self' mailto:",
    "object-src 'none'"
  ];

  return directives.join('; ');
}

const cspEnforce = buildCsp();
const cspPizzaEnforce = buildCsp({ allowPizzaThirdParty: true });

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
      },
      {
        source: '/services',
        destination: '/#services',
        permanent: true
      },
      {
        source: '/en/services',
        destination: '/en#services',
        permanent: true
      },
      {
        source: '/projects',
        destination: '/#featured',
        permanent: true
      },
      {
        source: '/en/projects',
        destination: '/en#featured',
        permanent: true
      },
      {
        source: '/contact',
        destination: '/#contact',
        permanent: true
      },
      {
        source: '/en/contact',
        destination: '/en#contact',
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
          { key: 'Content-Security-Policy', value: cspEnforce }
        ]
      },
      {
        source: '/pizza/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, follow' },
          { key: 'Content-Security-Policy', value: cspPizzaEnforce }
        ]
      },
      {
        source: '/en/pizza/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, follow' },
          { key: 'Content-Security-Policy', value: cspPizzaEnforce }
        ]
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
