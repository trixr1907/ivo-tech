'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { Locale } from '@/content/copy';
import type { HeroVariantId } from '@/lib/heroExperiment';
import { trackEvent } from '@/lib/analytics';

/** Section `id`s in scroll order — keep in sync with `railItems` hrefs. */
export const HOME_SECTION_IDS = [
  'home-hero',
  'home-services',
  'home-proof',
  'home-projects',
  'home-insights',
  'home-journey',
  'home-process',
  'faq',
  'contact',
  'site-footer'
] as const;

export type HomeSectionId = (typeof HOME_SECTION_IDS)[number];

type RailItem = {
  href: string;
  id: (typeof HOME_SECTION_IDS)[number];
  /** Voller Name für Screenreader und breitere Rail (siehe CSS-Breakpoint). */
  label: string;
  /** Optional kürzer ab lg (1024px) bis unter 2xl — vermeidet Umbruch im Rail-Streifen. */
  labelCompact?: string;
};

function railItems(locale: Locale): readonly RailItem[] {
  const de = locale === 'de';
  return [
    { href: '#home-hero', id: 'home-hero', label: 'Start' },
    {
      href: '#home-services',
      id: 'home-services',
      label: de ? 'Leistungen' : 'Services',
      labelCompact: de ? 'Leis.' : 'Svc.'
    },
    { href: '#home-proof', id: 'home-proof', label: 'Proof' },
    {
      href: '#home-projects',
      id: 'home-projects',
      label: de ? 'Projekte' : 'Projects',
      labelCompact: de ? 'Proj.' : 'Work'
    },
    { href: '#home-insights', id: 'home-insights', label: 'Insights' },
    { href: '#home-journey', id: 'home-journey', label: 'Journey' },
    {
      href: '#home-process',
      id: 'home-process',
      label: de ? 'Prozess' : 'Process',
      labelCompact: de ? 'Ablauf' : 'Flow'
    },
    { href: '#faq', id: 'faq', label: 'FAQ' },
    {
      href: '#contact',
      id: 'contact',
      label: de ? 'Kontakt' : 'Contact',
      labelCompact: de ? 'Mail' : undefined
    },
    {
      href: '#site-footer',
      id: 'site-footer',
      label: de ? 'Rechtliches' : 'Legal',
      labelCompact: de ? 'Recht' : undefined
    }
  ];
}

/** Pixel from viewport top: sticky header (~64px) + margin — section whose top passed this line wins (last match). */
const ACTIVATION_OFFSET_PX = 96;

function pickActiveSectionId(): HomeSectionId {
  let active: HomeSectionId = HOME_SECTION_IDS[0];
  for (const id of HOME_SECTION_IDS) {
    if (id === 'site-footer') continue;
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= ACTIVATION_OFFSET_PX) {
      active = id;
    }
  }

  const footer = document.getElementById('site-footer');
  if (footer) {
    const fr = footer.getBoundingClientRect();
    const inView = fr.bottom > ACTIVATION_OFFSET_PX && fr.top < window.innerHeight - 24;
    const footerDominant = fr.top < window.innerHeight * 0.55;
    if (inView && footerDominant) {
      return 'site-footer';
    }
  }

  return active;
}

type HomeSectionRailProps = {
  locale: Locale;
  heroVariant?: HeroVariantId;
};

export function HomeSectionRail({ locale, heroVariant = 'default' }: HomeSectionRailProps) {
  const [activeId, setActiveId] = useState<HomeSectionId>(HOME_SECTION_IDS[0]);
  const rafRef = useRef<number | null>(null);

  const scheduleSync = useCallback(() => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const next = pickActiveSectionId();
      setActiveId((prev) => (prev === next ? prev : next));
    });
  }, []);

  useEffect(() => {
    scheduleSync();

    const elements = HOME_SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );

    const observer = new IntersectionObserver(
      () => {
        scheduleSync();
      },
      {
        root: null,
        rootMargin: '-80px 0px -40% 0px',
        threshold: [0, 0.05, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 1]
      }
    );

    elements.forEach((el) => observer.observe(el));

    window.addEventListener('scroll', scheduleSync, { passive: true });
    window.addEventListener('resize', scheduleSync);

    const onHash = () => {
      const raw = window.location.hash.replace(/^#/, '');
      if (raw && (HOME_SECTION_IDS as readonly string[]).includes(raw)) {
        setActiveId(raw as HomeSectionId);
      }
    };
    window.addEventListener('hashchange', onHash);

    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      observer.disconnect();
      window.removeEventListener('scroll', scheduleSync);
      window.removeEventListener('resize', scheduleSync);
      window.removeEventListener('hashchange', onHash);
    };
  }, [scheduleSync]);

  const items = railItems(locale);

  return (
    <aside
      className="home-relaunch-section-rail"
      aria-label={locale === 'de' ? 'Abschnittsnavigation' : 'In-page section navigation'}
    >
      <nav className="home-relaunch-section-rail-inner">
        {items.map((item) => {
          const isActive = activeId === item.id;
          const compact = item.labelCompact;
          const useDual = Boolean(compact && compact !== item.label);
          return (
            <a
              key={item.href}
              href={item.href}
              className={isActive ? 'home-relaunch-section-rail-link--active' : undefined}
              aria-current={isActive ? 'location' : undefined}
              aria-label={useDual ? item.label : undefined}
              onClick={() =>
                trackEvent('nav_section_click', {
                  source: 'home_section_rail',
                  locale,
                  sectionId: item.id,
                  variant: heroVariant
                })
              }
            >
              <span className="home-relaunch-section-rail-dot" aria-hidden="true" />
              {useDual ? (
                <span className="home-relaunch-section-rail-label" aria-hidden="true">
                  <span className="home-relaunch-section-rail-label-wide">{item.label}</span>
                  <span className="home-relaunch-section-rail-label-compact">{compact}</span>
                </span>
              ) : (
                item.label
              )}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
