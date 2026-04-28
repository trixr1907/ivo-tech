'use client';

import type { Locale } from '@/content/copy';

type Props = {
  locale: Locale;
};

const LOGOS = [
  'deinlieblingsdruck.de (Live-Referenz)',
  'GitHub Public Build-Historie',
  'E-Commerce Manufacturing',
  'B2B Services',
  'Industrial Tech',
  'Product Teams',
  'Maker Labs',
  'Operations'
] as const;

export function HomeClientLogosMarquee({ locale }: Props) {
  const heading = locale === 'de' ? 'Kunden & Kollaboration' : 'Clients & collaboration';
  const subline =
    locale === 'de'
      ? 'Anonymisierte Partner-Kontexte aus realen Delivery-Projekten.'
      : 'Anonymized partner contexts from real delivery projects.';

  const items = [...LOGOS, ...LOGOS];

  return (
    <section className="home-logo-marquee mt-2" aria-labelledby="home-logo-marquee-heading">
      <p className="home-logo-marquee-as-seen" aria-hidden="true">
        <span className="home-logo-marquee-as-seen-slash">/</span>
        {locale === 'de' ? 'Sichtbarkeit' : 'Visibility'}
        <span className="home-logo-marquee-as-seen-slash">/</span>
      </p>
      <div className="home-logo-marquee-head">
        <p id="home-logo-marquee-heading" className="home-eyebrow">
          {heading}
        </p>
        <p className="home-logo-marquee-subline">{subline}</p>
      </div>
      <div className="home-logo-marquee-viewport" aria-label={heading}>
        <ul className="home-logo-marquee-track">
          {items.map((label, index) => (
            <li key={`${label}-${index}`} className="home-logo-pill">
              <span className="home-logo-pill-dot" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
