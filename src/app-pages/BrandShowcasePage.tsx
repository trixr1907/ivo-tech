import Image from 'next/image';

import { RelaunchMarketingShell } from '@/components/layout/RelaunchMarketingShell';
import type { Locale } from '@/content/copy';
import { localizePath } from '@/lib/localeRouting';
import { RELAUNCH_SECTION } from '@/lib/relaunchMarketingStyles';

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
  const homeHref = localizePath('/', locale);

  const copy = isDe
    ? {
        title: 'Brand Showcase',
        lead: 'Präzise-Neon Logo-System mit Mark Detailed/Core/Micro, Theme-Varianten und produktionsnahen Motion-Interfaces.',
        system: 'Logo-System',
        motion: 'Motion',
        downloads: 'Downloads',
        quality: 'Qualität',
        home: 'Startseite',
        contact: 'Kontakt',
        cta: 'Asset Paket',
        summaryTitle: 'System-Zusammenfassung',
        summaryText:
          'Das System basiert auf klaren Rollen: Detailed für Hero, Core für Header/Cards, Micro für Favicon und enge UI-Flächen.',
        qualityTitle: 'Abnahmepunkte',
        qualityPoints: [
          'Lesbarkeit bei 16, 24, 32, 48, 64, 96, 128 Pixeln',
          'Dark/Light Kontrast für Mark und Wordmark',
          'Deterministische Dateinamen + Manifest + Hashes',
          'Motion-Fallback ohne Lottie-Runtime-Abhängigkeit'
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

  const brandNav = [
    { href: '#system', label: copy.system },
    { href: '#motion', label: copy.motion },
    { href: '#downloads', label: copy.downloads },
    { href: '#quality', label: copy.quality },
    { href: homeHref, label: copy.home },
    { href: localizePath('/#contact', locale), label: copy.contact }
  ];

  return (
    <RelaunchMarketingShell
      locale={locale}
      shellClassName="brand-showcase-page"
      homeHref={homeHref}
      navLinks={brandNav}
      desktopCtaHref="#downloads"
      desktopCtaLabel={copy.cta}
      mobileNavCtaLabel={copy.cta}
      mobileNavCtaHref="#downloads"
      desktopContactTrackingSource="brand-header-downloads"
      mobileNavPrimaryTrackingSource="brand-mobile-nav-downloads"
    >
      <main
        id="main-content"
        className="brand-showcase-main mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-4 pb-12 pt-6 sm:px-6 md:pt-8"
      >
        <section className={`${RELAUNCH_SECTION} brand-showcase-hero mb-8`} aria-labelledby="brand-showcase-title">
          <div className="hero-copy">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-400/90">ivo-tech brand system</p>
            <h1 id="brand-showcase-title" className="mt-2 font-display text-3xl font-semibold text-slate-50 md:text-4xl">
              {copy.title}
            </h1>
            <p className="lead mt-4 text-base text-slate-300 md:text-lg">{copy.lead}</p>
          </div>
        </section>

        <section id="system" className={`${RELAUNCH_SECTION} brand-showcase-section mb-8`} aria-labelledby="brand-system-title">
          <div className="section-head">
            <h2 id="brand-system-title" className="font-display text-xl font-semibold text-slate-100">
              {copy.system}
            </h2>
          </div>
          <div className="brand-review-grid mt-6">
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
          <article className="brand-review-card mt-6" data-theme="secondary">
            <h3>{copy.summaryTitle}</h3>
            <p>{copy.summaryText}</p>
          </article>
          <div className="mt-8 border-t border-slate-800/80 pt-8">
            <h3 className="font-display text-lg font-semibold text-slate-100">
              {isDe ? 'Export-Paket (Handoff)' : 'Export pack (handoff)'}
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              {isDe
                ? 'Zusätzliche Vektor-Exports aus dem Design-Handoff — unter public/assets/logo/handoff/ versioniert.'
                : 'Additional vector exports from the design handoff — versioned under public/assets/logo/handoff/.'}
            </p>
            <div className="brand-review-grid mt-6">
              <article className="brand-review-card">
                <h3>{isDe ? 'Lockup (Handoff)' : 'Lockup (handoff)'}</h3>
                <div className="brand-preview-surface brand-preview-surface--dark">
                  <Image
                    src="/assets/logo/handoff/ivo-tech_lockup_horizontal.svg"
                    alt=""
                    width={800}
                    height={310}
                    className="brand-preview-wordmark"
                  />
                </div>
              </article>
              <article className="brand-review-card">
                <h3>{isDe ? 'Wordmark' : 'Wordmark'}</h3>
                <div className="brand-preview-surface brand-preview-surface--dark">
                  <Image
                    src="/assets/logo/handoff/ivo-tech_wordmark.svg"
                    alt=""
                    width={640}
                    height={200}
                    className="brand-preview-wordmark"
                  />
                </div>
              </article>
              <article className="brand-review-card">
                <h3>{isDe ? 'Mark' : 'Mark'}</h3>
                <div className="brand-preview-surface brand-preview-surface--dark">
                  <Image
                    src="/assets/logo/handoff/ivo-tech_mark.svg"
                    alt=""
                    width={256}
                    height={256}
                    className="brand-preview-submark"
                  />
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="motion" className={`${RELAUNCH_SECTION} brand-showcase-section mb-8`} aria-labelledby="brand-motion-title">
          <div className="section-head">
            <h2 id="brand-motion-title" className="font-display text-xl font-semibold text-slate-100">
              {copy.motion}
            </h2>
          </div>
          <article className="brand-review-card mt-6">
            <video className="brand-preview-video" controls preload="metadata" poster="/assets/video/logo-sting-poster.avif">
              <source src="/assets/video/logo-sting.webm" type="video/webm" />
              <source src="/assets/video/logo-sting.mp4" type="video/mp4" />
              <track src="/assets/video/logo-sting-captions.vtt" kind="captions" srcLang={isDe ? 'de' : 'en'} label={isDe ? 'Deutsch' : 'English'} default />
            </video>
          </article>
          <article className="brand-review-card mt-6">
            <h3>{isDe ? 'Ambient-Energie (WebM-Loop)' : 'Ambient energy (WebM loop)'}</h3>
            <p className="mb-3 text-sm text-slate-400">
              {isDe
                ? 'Leichter Hintergrundloop — identisch mit dem optionalen Hero-Snapshot-Ambient auf der Startseite (ohne Autoplay hier: manuell starten).'
                : 'Light background loop — same asset as optional hero snapshot ambient on the homepage (no autoplay here: use controls).'}
            </p>
            <video className="brand-preview-video max-h-[220px]" controls muted loop playsInline preload="metadata">
              <source src="/assets/motion/energy-trail-loop.webm" type="video/webm" />
            </video>
          </article>
          <article className="brand-review-card mt-6">
            <h3>Motion System</h3>
            <ul className="brand-quality-list">
              {MOTION_SYSTEM.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section id="downloads" className={`${RELAUNCH_SECTION} brand-showcase-section mb-8`} aria-labelledby="brand-download-title">
          <div className="section-head">
            <h2 id="brand-download-title" className="font-display text-xl font-semibold text-slate-100">
              {copy.downloads}
            </h2>
          </div>
          <div className="brand-download-grid mt-6">
            {ASSET_LINKS.map((asset) => (
              <a key={asset.href} className="brand-download-link" href={asset.href} target="_blank" rel="noopener noreferrer">
                <span>{asset.label}</span>
                <code>{asset.href}</code>
              </a>
            ))}
          </div>
        </section>

        <section id="quality" className={`${RELAUNCH_SECTION} brand-showcase-section`} aria-labelledby="brand-quality-title">
          <div className="section-head">
            <h2 id="brand-quality-title" className="font-display text-xl font-semibold text-slate-100">
              {copy.qualityTitle}
            </h2>
          </div>
          <article className="brand-review-card mt-6">
            <ul className="brand-quality-list">
              {copy.qualityPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        </section>
      </main>
    </RelaunchMarketingShell>
  );
}
