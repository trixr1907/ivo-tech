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
      className="mt-16 border-t border-slate-800/80 bg-slate-950/40 pb-28 pt-12 backdrop-blur-sm md:pb-12"
      role="contentinfo"
    >
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,0.9fr)] md:gap-8">
          <div>
            <Link href={homeHref} className="inline-flex items-center gap-2.5 text-slate-100">
              <img
                src="/assets/logo/ivo-logo__mark-core__premium__dark__v1.1.0.svg"
                alt=""
                width={36}
                height={36}
                className="h-9 w-9"
              />
              <span className="font-display text-lg font-semibold">ivo-tech</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">{tagline}</p>
          </div>

          <nav aria-label={navAria} className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-400/90">
              {locale === 'de' ? 'Seiten' : 'Pages'}
            </p>
            <div className="flex flex-col gap-2 text-sm text-slate-300">
              {navLinks.slice(0, 6).map((link) => (
                <Link key={link.href} href={link.href} className="transition hover:text-sky-300">
                  {link.label}
                </Link>
              ))}
              <Link href={caseStudiesHref} className="transition hover:text-sky-300">
                {locale === 'de' ? 'Case Studies' : 'Case studies'}
              </Link>
              <Link href={impressumHref} className="transition hover:text-sky-300">
                {locale === 'de' ? 'Impressum' : 'Legal notice'}
              </Link>
              <Link href={datenschutzHref} className="transition hover:text-sky-300">
                {locale === 'de' ? 'Datenschutz' : 'Privacy'}
              </Link>
            </div>
          </nav>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-400/90">{contactHeading}</p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-slate-200 transition hover:text-sky-300">
                {CONTACT_EMAIL}
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-200 transition hover:text-sky-300"
              >
                GitHub
              </a>
              <Link href="#contact" className="text-sky-300 transition hover:text-sky-200">
                {locale === 'de' ? 'Kontaktformular' : 'Contact form'}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-800/70 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} ivo-tech · {rights}
          </p>
          <p className="text-slate-600">Mannheim · Remote-first</p>
        </div>
      </div>
    </footer>
  );
}
