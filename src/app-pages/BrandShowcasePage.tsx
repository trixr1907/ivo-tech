import Image from 'next/image';
import Link from 'next/link';

import { BrandLockup } from '@/components/BrandLockup';
import { LanguageToggle } from '@/components/LanguageToggle';
import type { Locale } from '@/content/copy';
import { localizePath } from '@/lib/localeRouting';

type Props = {
  locale: Locale;
};

const ASSET_LINKS = [
  { label: 'Logo PNG', href: '/assets/logo.png' },
  { label: 'Logo WebP', href: '/assets/logo.webp' },
  { label: 'Logo AVIF', href: '/assets/logo.avif' },
  { label: 'Logo Mark PNG', href: '/assets/logo-mark.png' },
  { label: 'Logo Mark WebP', href: '/assets/logo-mark.webp' },
  { label: 'Logo Mark AVIF', href: '/assets/logo-mark.avif' },
  { label: 'Favicon ICO', href: '/favicon.ico' },
  { label: 'Logo Sting MP4', href: '/assets/video/logo-sting.mp4' },
  { label: 'Logo Sting WebM', href: '/assets/video/logo-sting.webm' },
  { label: 'Logo Sting Poster', href: '/assets/video/logo-sting-poster.avif' }
] as const;

export function BrandShowcasePage({ locale }: Props) {
  const isDe = locale === 'de';

  const copy = isDe
    ? {
        title: 'Brand Showcase',
        lead: 'Das finale ivo-tech Logo-System fuer Wordmark, Submark, Motion und produktionsreife Web-Assets.',
        system: 'Logo-System',
        motion: 'Motion',
        downloads: 'Downloads',
        quality: 'Qualitaet',
        home: 'Startseite',
        contact: 'Kontakt',
        cta: 'Asset Paket',
        summaryTitle: 'System-Zusammenfassung',
        summaryText:
          'Wordmark-first in Neon-Cyan, aggressive-futuristische Formensprache, plus kompakte Submark fuer Header, Favicons und Avatare.',
        qualityTitle: 'Abnahmepunkte',
        qualityPoints: [
          'Lesbarkeit bei 16, 24 und 32 Pixeln',
          'Kontrast auf Dark und Light Surface',
          'Konsistente Auslieferung fuer PNG, WebP und AVIF',
          'Motion-Sting mit 3-5 Sekunden Laufzeit'
        ]
      }
    : {
        title: 'Brand Showcase',
        lead: 'The final ivo-tech logo system for wordmark, submark, motion, and production-ready web assets.',
        system: 'Logo system',
        motion: 'Motion',
        downloads: 'Downloads',
        quality: 'Quality',
        home: 'Home',
        contact: 'Contact',
        cta: 'Asset package',
        summaryTitle: 'System summary',
        summaryText:
          'Wordmark-first in neon cyan, aggressive futuristic geometry, plus compact submark for headers, favicons, and avatars.',
        qualityTitle: 'Acceptance points',
        qualityPoints: [
          'Readability at 16, 24, and 32 pixels',
          'Contrast on dark and light surfaces',
          'Consistent delivery for PNG, WebP, and AVIF',
          'Motion sting with 3-5 second duration'
        ]
      };

  return (
    <>
      <header className="site-header">
        <BrandLockup variant="header" />
        <nav className="nav" aria-label={isDe ? 'Hauptnavigation' : 'Primary'}>
          <a href="#system">{copy.system}</a>
          <a href="#motion">{copy.motion}</a>
          <a href="#downloads">{copy.downloads}</a>
          <a href="#quality">{copy.quality}</a>
          <Link href={localizePath('/', locale)}>{copy.home}</Link>
          <Link href={localizePath('/#contact', locale)}>{copy.contact}</Link>
        </nav>
        <div className="header-right">
          <LanguageToggle />
          <a className="cta" href="#downloads">
            {copy.cta}
          </a>
        </div>
      </header>

      <main id="main" className="brand-showcase-main">
        <section className="hero brand-showcase-hero" aria-labelledby="brand-showcase-title">
          <div className="hero-copy">
            <p className="eyebrow">ivo-tech brand</p>
            <h1 id="brand-showcase-title">{copy.title}</h1>
            <p className="lead">{copy.lead}</p>
          </div>
        </section>

        <section id="system" className="section brand-showcase-section" aria-labelledby="brand-system-title">
          <div className="section-head">
            <h2 id="brand-system-title">{copy.system}</h2>
          </div>
          <article className="brand-review-card">
            <div className="brand-preview-surface brand-preview-surface--dark">
              <Image src="/assets/logo.png" alt="ivo-tech wordmark" width={880} height={338} className="brand-preview-wordmark" />
            </div>
            <div className="brand-preview-surface brand-preview-surface--light">
              <Image src="/assets/logo-mark.png" alt="ivo-tech submark" width={420} height={420} className="brand-preview-submark" />
            </div>
          </article>
          <article className="brand-review-card">
            <h3>{copy.summaryTitle}</h3>
            <p>{copy.summaryText}</p>
          </article>
        </section>

        <section id="motion" className="section brand-showcase-section" aria-labelledby="brand-motion-title">
          <div className="section-head">
            <h2 id="brand-motion-title">{copy.motion}</h2>
          </div>
          <article className="brand-review-card">
            <video className="brand-preview-video" controls preload="metadata" poster="/assets/video/logo-sting-poster.avif">
              <source src="/assets/video/logo-sting.webm" type="video/webm" />
              <source src="/assets/video/logo-sting.mp4" type="video/mp4" />
              <track src="/assets/video/logo-sting-captions.vtt" kind="captions" srcLang={isDe ? 'de' : 'en'} label={isDe ? 'Deutsch' : 'English'} default />
            </video>
          </article>
        </section>

        <section id="downloads" className="section brand-showcase-section" aria-labelledby="brand-download-title">
          <div className="section-head">
            <h2 id="brand-download-title">{copy.downloads}</h2>
          </div>
          <div className="brand-download-grid">
            {ASSET_LINKS.map((asset) => (
              <a key={asset.href} className="brand-download-link" href={asset.href} target="_blank" rel="noopener noreferrer">
                <span>{asset.label}</span>
                <code>{asset.href}</code>
              </a>
            ))}
          </div>
        </section>

        <section id="quality" className="section brand-showcase-section" aria-labelledby="brand-quality-title">
          <div className="section-head">
            <h2 id="brand-quality-title">{copy.qualityTitle}</h2>
          </div>
          <article className="brand-review-card">
            <ul className="brand-quality-list">
              {copy.qualityPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        </section>
      </main>
    </>
  );
}
