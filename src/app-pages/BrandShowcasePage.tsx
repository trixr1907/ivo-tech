import Image from 'next/image';
import Link from 'next/link';

import { LanguageToggle } from '@/components/LanguageToggle';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { Button } from '@/components/ui/Button';
import { SectionFrame } from '@/components/ui/SectionFrame';
import type { Locale } from '@/content/copy';
import { localizePath } from '@/lib/localeRouting';

type Props = {
  locale: Locale;
};

const ASSET_LINKS = [
  { label: 'Logo Manifest', href: '/assets/logo/manifest.json' },
  { label: 'Logo PNG', href: '/assets/logo.png' },
  { label: 'Logo AVIF', href: '/assets/logo.avif' },
  { label: 'Logo Mark PNG', href: '/assets/logo-mark.png' },
  { label: 'Logo Mark AVIF', href: '/assets/logo-mark.avif' },
  { label: 'Mark Detailed (Dark)', href: '/assets/logo/ivo-logo__mark-detailed__static__dark__v1.0.0.svg' },
  { label: 'Mark Core (Dark)', href: '/assets/logo/ivo-logo__mark-core__static__dark__v1.0.0.svg' },
  { label: 'Mark Core Premium (Dark)', href: '/assets/logo/ivo-logo__mark-core__premium__dark__v1.1.0.svg' },
  { label: 'Mark Micro (Dark)', href: '/assets/logo/ivo-logo__mark-micro__static__dark__v1.0.0.svg' },
  { label: 'Wordmark (Light)', href: '/assets/logo/ivo-logo__wordmark__static__light__v1.0.0.svg' },
  { label: 'Wordmark Premium (Dark)', href: '/assets/logo/ivo-logo__wordmark__premium__dark__v1.1.0.svg' },
  { label: 'Lockup Horizontal (Dark)', href: '/assets/logo/ivo-logo__lockup-horizontal__static__dark__v1.0.0.svg' },
  { label: 'Lockup Horizontal Premium (Dark)', href: '/assets/logo/ivo-logo__lockup-horizontal__premium__dark__v1.1.0.svg' },
  { label: 'Lockup Stacked (Mono)', href: '/assets/logo/ivo-logo__lockup-stacked__static__mono__v1.0.0.svg' },
  { label: 'Favicon ICO', href: '/favicon.ico' },
  { label: 'Logo Sting MP4', href: '/assets/video/logo-sting.mp4' },
  { label: 'Logo Sting WebM', href: '/assets/video/logo-sting.webm' },
  { label: 'Logo Sting Poster', href: '/assets/video/logo-sting-poster.avif' }
] as const;

const MOTION_SYSTEM = [
  '120ms micro, 220ms base, 420ms expressive, 650ms reveal.',
  'Easing standard: cubic-bezier(0.22, 1, 0.36, 1).',
  'Easing technical in/out: cubic-bezier(0.4, 0, 0.2, 1).',
  'Tier 1 UI standard, Tier 2 hero, Tier 3 campaign only.',
  'prefers-reduced-motion falls back to opacity-only reveal.'
] as const;

export function BrandShowcasePage({ locale }: Props) {
  const isDe = locale === 'de';

  const copy = isDe
    ? {
        title: 'Brand Showcase',
        lead: 'Praezise-Neon Logo-System mit Mark Detailed/Core/Micro, Theme-Varianten und produktionsnahen Motion-Interfaces.',
        system: 'Logo-System',
        motion: 'Motion',
        downloads: 'Downloads',
        quality: 'Qualitaet',
        home: 'Startseite',
        contact: 'Kontakt',
        cta: 'Asset Paket',
        summaryTitle: 'System-Zusammenfassung',
        summaryText:
          'Das System basiert auf klaren Rollen: Detailed fuer Hero, Core fuer Header/Cards, Micro fuer Favicon und enge UI-Flaechen.',
        qualityTitle: 'Abnahmepunkte',
        qualityPoints: [
          'Lesbarkeit bei 16, 24, 32, 48, 64, 96, 128 Pixeln',
          'Dark/Light Kontrast fuer Mark und Wordmark',
          'Deterministische Dateinamen + Manifest + Hashes',
          'Motion-Fallback ohne Lottie-Runtime-Abhaengigkeit'
        ]
      }
    : {
        title: 'Brand Showcase',
        lead: 'Precision-neon logo system with detailed/core/micro marks, theme variants, and production-grade motion interfaces.',
        system: 'Logo system',
        motion: 'Motion',
        downloads: 'Downloads',
        quality: 'Quality',
        home: 'Home',
        contact: 'Contact',
        cta: 'Asset package',
        summaryTitle: 'System summary',
        summaryText:
          'The system uses clear roles: detailed for hero, core for headers/cards, and micro for favicon and tight UI surfaces.',
        qualityTitle: 'Acceptance points',
        qualityPoints: [
          'Readability at 16, 24, 32, 48, 64, 96, 128 pixels',
          'Dark/light contrast for mark and wordmark',
          'Deterministic file names + manifest + hashes',
          'Motion fallback without Lottie runtime dependency'
        ]
      };

  return (
    <div className="theme-ref103632" data-theme="dark">
      {/* Contract reference: <BrandLockup variant="header" motionTier="tier2" /> */}
      <SiteHeader
        ariaLabel={isDe ? 'Hauptnavigation' : 'Primary'}
        className="home-v2-header"
        logoPreset="ref103632"
        logoTier="tier2"
        logoVisualPreset="premium"
        logoEdgeGlow="medium"
        nav={
          <>
            <a href="#system">{copy.system}</a>
            <a href="#motion">{copy.motion}</a>
            <a href="#downloads">{copy.downloads}</a>
            <a href="#quality">{copy.quality}</a>
            <Link href={localizePath('/', locale)}>{copy.home}</Link>
            <Link href={localizePath('/#contact', locale)}>{copy.contact}</Link>
          </>
        }
        rightSlot={
          <>
            <LanguageToggle />
            <Button href="#downloads" className="cta" variant="metal">
              {copy.cta}
            </Button>
          </>
        }
      />

      <main id="main-content" className="brand-showcase-main home-v2-main">
        <SectionFrame className="hero brand-showcase-hero" aria-labelledby="brand-showcase-title" tone="metal" sectionTheme="primary">
          <div className="hero-copy">
            <p className="eyebrow">ivo-tech brand system</p>
            <h1 id="brand-showcase-title">{copy.title}</h1>
            <p className="lead">{copy.lead}</p>
          </div>
        </SectionFrame>

        <SectionFrame id="system" className="section brand-showcase-section" aria-labelledby="brand-system-title" tone="panel">
          <div className="section-head">
            <h2 id="brand-system-title">{copy.system}</h2>
          </div>
          <div className="brand-review-grid">
            <article className="brand-review-card">
              <h3>Lockup Horizontal</h3>
              <div className="brand-preview-surface brand-preview-surface--dark">
                <Image
                  src="/assets/logo/ivo-logo__lockup-horizontal__static__dark__v1.0.0.svg"
                  alt="ivo-tech wordmark"
                  width={1600}
                  height={620}
                  className="brand-preview-wordmark"
                />
              </div>
            </article>
            <article className="brand-review-card">
              <h3>Mark Detailed</h3>
              <div className="brand-preview-surface brand-preview-surface--dark">
                <Image
                  src="/assets/logo/ivo-logo__mark-detailed__static__dark__v1.0.0.svg"
                  alt="ivo-tech submark"
                  width={512}
                  height={512}
                  className="brand-preview-submark"
                />
              </div>
            </article>
            <article className="brand-review-card">
              <h3>Mark Core</h3>
              <div className="brand-preview-surface brand-preview-surface--dark">
                <Image
                  src="/assets/logo/ivo-logo__mark-core__static__dark__v1.0.0.svg"
                  alt="ivo-tech core mark"
                  width={512}
                  height={512}
                  className="brand-preview-submark"
                />
              </div>
            </article>
            <article className="brand-review-card">
              <h3>Mark Micro</h3>
              <div className="brand-preview-surface brand-preview-surface--light">
                <Image
                  src="/assets/logo/ivo-logo__mark-micro__static__light__v1.0.0.svg"
                  alt="ivo-tech micro mark"
                  width={512}
                  height={512}
                  className="brand-preview-submark"
                />
              </div>
            </article>
          </div>
          <article className="brand-review-card" data-theme="secondary">
            <h3>{copy.summaryTitle}</h3>
            <p>{copy.summaryText}</p>
          </article>
        </SectionFrame>

        <SectionFrame id="motion" className="section brand-showcase-section" aria-labelledby="brand-motion-title" tone="metal" sectionTheme="primary">
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
          <article className="brand-review-card">
            <h3>Motion System</h3>
            <ul className="brand-quality-list">
              {MOTION_SYSTEM.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </SectionFrame>

        <SectionFrame id="downloads" className="section brand-showcase-section" aria-labelledby="brand-download-title" tone="panel" sectionTheme="secondary">
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
        </SectionFrame>

        <SectionFrame id="quality" className="section brand-showcase-section" aria-labelledby="brand-quality-title" tone="panel">
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
        </SectionFrame>
      </main>
    </div>
  );
}
