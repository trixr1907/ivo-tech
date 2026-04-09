import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import type { ReactNode } from 'react';

import { AppRuntime } from '@/components/AppRuntime';

import '@/styles/globals.css';
import '@/styles/modal.css';
import '../../packages/dld3d-core/dist/dld3d-core.css';

const heading = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-heading'
});

const body = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body'
});

const mono = JetBrains_Mono({
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body className={`${heading.variable} ${body.variable} ${mono.variable}`} data-theme="dark">
        <a className="skip-link" href="#main-content">
          Zum Hauptinhalt springen
        </a>
        <AppRuntime />
        {children}
      </body>
    </html>
  );
}
