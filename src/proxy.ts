import { NextResponse, type NextRequest } from 'next/server';

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
  requestHeaders.set('x-ivo-locale', locale);

  const response = NextResponse.next({
    request: { headers: requestHeaders }
  });

  response.headers.set('Content-Language', locale);

  return response;
}

export const config = {
  matcher: '/:path*'
};
