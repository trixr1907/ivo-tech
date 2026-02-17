import type { AppProps } from 'next/app';
import type { NextWebVitalsMetric } from 'next/app';
import Head from 'next/head';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';

import { BackgroundFX } from '@/components/BackgroundFX';
import { env } from '@/env';

import '@/styles/globals.css';
import '@/styles/modal.css';
import '../../packages/dld3d-core/dist/dld3d-core.css';

// Monument Extended can later replace `--font-heading` via next/font/local without touching CSS.
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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${heading.variable} ${body.variable} ${mono.variable}`}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <BackgroundFX />
      <Component {...pageProps} />
      <Analytics />
    </div>
  );
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (env.NEXT_PUBLIC_APP_ENV === 'production') return;
  const rating = 'rating' in metric ? metric.rating : '';

  // Keep non-prod visibility for regressions while staying no-op in production.
  console.info(
    `[WebVitals] ${metric.name}:`,
    metric.value,
    rating ? `(${rating})` : ''
  );
}
