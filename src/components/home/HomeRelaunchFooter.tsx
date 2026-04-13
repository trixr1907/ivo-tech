import Link from 'next/link';

import type { Locale } from '@/content/copy';
import { localizePath } from '@/lib/localeRouting';
import { getPrimaryNavLinks } from '@/lib/navigation';
import { CONTACT_EMAIL, GITHUB_URL } from '@/lib/site';

type HomeRelaunchFooterProps = {
  locale: Locale;
};

export function HomeRelaunchFooter({ locale }: HomeRelaunchFooterProps) {
  const homeHref = locale === 'de' ? '/' : '/en';
  const navLinks = getPrimaryNavLinks(locale);
  const caseStudiesHref = localizePath('/case-studies', locale);
  const impressumHref = locale === 'de' ? '/impressum' : '/en/legal';
  const datenschutzHref = locale === 'de' ? '/datenschutz' : '/en/privacy';
  const tagline =
    locale === 'de'
      ? 'Web Engineering mit klarer Delivery — Mannheim, Remote-first.'
      : 'Web engineering with clear delivery — Mannheim, remote-first.';
  const navAria = locale === 'de' ? 'Footer-Navigation' : 'Footer navigation';
  const contactHeading = locale === 'de' ? 'Direkt' : 'Direct';
  const rights = locale === 'de' ? 'Alle Rechte vorbehalten.' : 'All rights reserved.';

  return (
    <footer
      id="site-footer"
      className="relative mt-16 pb-28 pt-14 md:pb-12"
      role="contentinfo"
    >
      {/* Gradient divider at the top */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(56,189,248,0.25) 30%, rgba(99,102,241,0.2) 70%, transparent 100%)'
        }}
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,0.85fr)] md:gap-10">
          <div>
            <Link
              href={homeHref}
              className="group inline-flex items-center gap-2.5 text-slate-100 transition-opacity hover:opacity-80"
            >
              <img
                src="/assets/logo/ivo-logo__mark-core__premium__dark__v1.1.0.svg"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="font-display text-base font-bold tracking-tight">ivo-tech</span>
            </Link>
            <p className="mt-3.5 max-w-[22rem] text-sm leading-relaxed text-slate-500">{tagline}</p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/70 bg-slate-900/50 px-3.5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-sky-400/40 hover:text-sky-300"
              >
                {CONTACT_EMAIL}
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/70 bg-slate-900/50 px-3.5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-sky-400/40 hover:text-sky-300"
              >
                GitHub
              </a>
            </div>
          </div>

          <nav aria-label={navAria} className="flex flex-col gap-3">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-slate-600">
              {locale === 'de' ? 'Seiten' : 'Pages'}
            </p>
            <div className="flex flex-col gap-2 text-sm text-slate-500">
              {navLinks.slice(0, 6).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit transition hover:text-slate-200"
                >
                  {link.label}
                </Link>
              ))}
              <Link href={caseStudiesHref} className="w-fit transition hover:text-slate-200">
                {locale === 'de' ? 'Case Studies' : 'Case studies'}
              </Link>
            </div>
          </nav>

          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-slate-600">{contactHeading}</p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link href="#contact" className="w-fit text-sky-400 transition hover:text-sky-300">
                {locale === 'de' ? 'Kontaktformular' : 'Contact form'}
              </Link>
              <Link href={impressumHref} className="w-fit text-slate-500 transition hover:text-slate-200">
                {locale === 'de' ? 'Impressum' : 'Legal notice'}
              </Link>
              <Link href={datenschutzHref} className="w-fit text-slate-500 transition hover:text-slate-200">
                {locale === 'de' ? 'Datenschutz' : 'Privacy'}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-slate-800/50 pt-6 text-[0.72rem] text-slate-600 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} ivo-tech · {rights}</p>
          <p className="font-mono tracking-wide text-slate-700">Mannheim · Remote-first</p>
        </div>
      </div>
    </footer>
  );
}
