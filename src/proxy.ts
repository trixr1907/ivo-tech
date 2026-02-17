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

export function proxy(request: NextRequest) {
  const headerHost = request.headers.get('host')?.toLowerCase();
  const urlHost = request.nextUrl.host.toLowerCase();
  const host = (headerHost ?? urlHost).split(':')[0];
  if (!host) return NextResponse.next();

  const apexHost = getApexHost();
  const wwwHost = `www.${apexHost}`;

  if (host !== wwwHost) return NextResponse.next();

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.host = apexHost;
  redirectUrl.protocol = 'https';

  return NextResponse.redirect(redirectUrl, 308);
}

export const config = {
  matcher: '/:path*'
};
