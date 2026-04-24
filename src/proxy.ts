import { NextResponse, type NextRequest } from 'next/server';

const cspReportUri =
  process.env.CSP_REPORT_URI?.trim() ??
  process.env.NEXT_PUBLIC_CSP_REPORT_URI?.trim() ??
  '/api/security/csp-report';

function getApexHost() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return 'ivo-tech.com';

  try {
    const host = new URL(configured).host.toLowerCase();
    return host.replace(/^www\./, '');
  } catch {
    return 'ivo-tech.com';
  }
}

function getLocaleFromPath(pathname: string) {
  if (pathname === '/en' || pathname.startsWith('/en/')) return 'en';
  return 'de';
}

function createNonce() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
  return btoa(binary);
}

function isPizzaPath(pathname: string) {
  return pathname === '/pizza' || pathname.startsWith('/pizza/') || pathname === '/en/pizza' || pathname.startsWith('/en/pizza/');
}

function buildNonceCsp({
  nonce,
  allowPizzaThirdParty,
  reportOnly
}: {
  nonce: string;
  allowPizzaThirdParty: boolean;
  reportOnly: boolean;
}) {
  const styleSources = ["'self'", 'https://challenges.cloudflare.com'];
  const styleElemSources = ["'self'", 'https://challenges.cloudflare.com'];
  const frameSources = ["'self'", 'https://challenges.cloudflare.com'];

  if (allowPizzaThirdParty) {
    styleSources.push('https://fonts.googleapis.com');
    styleElemSources.push('https://fonts.googleapis.com');
    frameSources.push('https://www.google.com');
  }

  const directives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://challenges.cloudflare.com 'strict-dynamic'${reportOnly ? " 'report-sample'" : ''}`,
    "script-src-attr 'none'",
    `style-src ${styleSources.join(' ')}${reportOnly ? " 'report-sample'" : ''}`,
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
  if (reportOnly) {
    directives.push(`report-uri ${cspReportUri}`);
  }

  return directives.join('; ');
}

export function proxy(request: NextRequest) {
  const headerHost = request.headers.get('host')?.toLowerCase();
  const urlHost = request.nextUrl.host.toLowerCase();
  const host = (headerHost ?? urlHost).split(':')[0];
  if (!host) return NextResponse.next();

  const apexHost = getApexHost();
  const wwwHost = `www.${apexHost}`;

  if (host === wwwHost) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.host = apexHost;
    redirectUrl.protocol = 'https';

    return NextResponse.redirect(redirectUrl, 308);
  }

  const requestHeaders = new Headers(request.headers);
  const locale = getLocaleFromPath(request.nextUrl.pathname);
  const nonce = createNonce();
  const allowPizzaThirdParty = isPizzaPath(request.nextUrl.pathname);

  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('x-ivo-locale', locale);

  const response = NextResponse.next({
    request: { headers: requestHeaders }
  });

  response.headers.set('Content-Language', locale);
  response.headers.set(
    'Content-Security-Policy',
    buildNonceCsp({
      nonce,
      allowPizzaThirdParty,
      reportOnly: false
    })
  );
  response.headers.set(
    'Content-Security-Policy-Report-Only',
    buildNonceCsp({
      nonce,
      allowPizzaThirdParty,
      reportOnly: true
    })
  );

  return response;
}

export const config = {
  matcher: '/:path*'
};
