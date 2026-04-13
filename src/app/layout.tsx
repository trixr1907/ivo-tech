import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { headers } from 'next/headers';
import type { ReactNode } from 'react';

import { AppRuntime } from '@/components/AppRuntime';
import { LOCALE_REQUEST_HEADER } from '@/lib/localeRequestHeader';

import '@/styles/globals.css';
import '@/styles/modal.css';
import '../../packages/dld3d-core/dist/dld3d-core.css';

const fontHeading = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-heading'
});

const fontSans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans'
});

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-mono'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ivo-tech.com'),
  title: 'ivo-tech',
  description: 'Authority-first web engineering portfolio',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/assets/logo/ivo-logo__mark-micro__static__dark__v1.0.0.svg', type: 'image/svg+xml' },
      { url: '/assets/logo-mark.png', type: 'image/png' }
    ],
    apple: [{ url: '/assets/logo-mark.png' }]
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#040509',
  colorScheme: 'dark light'
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const h = await headers();
  const locale = h.get(LOCALE_REQUEST_HEADER) ?? 'de';
  const htmlLang = locale === 'en' ? 'en' : 'de';
  const skipLabel = locale === 'en' ? 'Skip to main content' : 'Zum Hauptinhalt springen';

  return (
    <html lang={htmlLang} className={`${fontHeading.variable} ${fontSans.variable} ${fontMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://cal.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://github.com" />
      </head>
      <body className="font-sans antialiased" data-theme="dark">
        <a className="skip-link" href="#main-content">
          {skipLabel}
        </a>
        <AppRuntime />
        {children}
      </body>
    </html>
  );
}
