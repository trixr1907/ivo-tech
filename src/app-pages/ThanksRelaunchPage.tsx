import Link from 'next/link';

import { RelaunchMarketingShell } from '@/components/layout/RelaunchMarketingShell';
import { ThankYouTracker } from '@/components/thank-you/ThankYouTracker';
import { Button } from '@/components/shadcn/button';
import type { Locale } from '@/content/copy';
import { localizePath } from '@/lib/localeRouting';
import { RELAUNCH_SECTION } from '@/lib/relaunchMarketingStyles';
import { getContactPath, getPrimaryNavLinks } from '@/lib/navigation';

type ThanksRelaunchPageProps = {
  locale: Locale;
  source: string;
  heroVariant: string;
  primaryCta: { href: string; label: string };
  schedulerHref: string;
};

export function ThanksRelaunchPage({ locale, source, heroVariant, primaryCta, schedulerHref }: ThanksRelaunchPageProps) {
  const navLinks = getPrimaryNavLinks(locale);
  const homeHref = localizePath('/', locale);
  const contactPath = getContactPath(locale, 'thanks-header');
  const headerCta = locale === 'de' ? 'Erstgespraech' : 'Intro call';

  const copy =
    locale === 'de'
      ? {
          eyebrow: 'Danke',
          title: 'Anfrage erfolgreich gesendet.',
          introBefore: 'Wir melden uns in der Regel innerhalb eines Werktags mit einem konkreten nächsten Schritt. Falls dein Thema dringend ist, schreib bitte direkt an',
          introAfter: '.',
          steps: [
            '1. Wir prüfen Ziel, Scope und technische Ausgangslage.',
            '2. Du erhältst einen klaren Vorschlag für den nächsten sinnvollen Schritt.',
            '3. Optional planen wir direkt einen kurzen Kickoff-Termin.'
          ],
          homeLabel: 'Zur Startseite',
          schedulerLabel: 'Direkt Termin buchen'
        }
      : {
          eyebrow: 'Thanks',
          title: 'Request submitted successfully.',
          introBefore: 'We usually reply within one business day with a concrete next step. If your topic is urgent, email us directly at',
          introAfter: '.',
          steps: [
            '1. We review your goal, scope, and current technical setup.',
            '2. You get a concrete recommendation for the next best step.',
            '3. If useful, we schedule a short kickoff call right away.'
          ],
          homeLabel: 'Back to homepage',
          schedulerLabel: 'Book a call now'
        };

  return (
    <RelaunchMarketingShell
      locale={locale}
      shellClassName="thanks-page"
      homeHref={homeHref}
      navLinks={navLinks}
      desktopCtaHref={contactPath}
      desktopCtaLabel={headerCta}
      mobileNavCtaLabel={headerCta}
      desktopContactTrackingSource="thanks-header"
      mobileNavPrimaryTrackingSource="thanks-mobile-nav"
    >
      <ThankYouTracker locale={locale} source={source} heroVariant={heroVariant} />
      <main id="main-content" className="mx-auto w-full max-w-[960px] flex-1 px-4 pb-12 pt-10 sm:px-6 md:pt-12">
        <section className={RELAUNCH_SECTION}>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-400/90">{copy.eyebrow}</p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-slate-100 sm:text-4xl">{copy.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
            {copy.introBefore}{' '}
            <a className="font-medium text-sky-400 hover:text-sky-300" href="mailto:contact@ivo-tech.com" data-thanks-cta="email">
              contact@ivo-tech.com
            </a>
            {copy.introAfter}
          </p>
          <ol className="mt-6 space-y-2 rounded-2xl border border-slate-700/80 bg-slate-950/40 p-4 text-sm text-slate-300">
            {copy.steps.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
          <div className="mt-8 flex flex-col flex-wrap gap-3 sm:flex-row">
            <Button asChild className="bg-sky-500 text-slate-950 hover:bg-sky-400">
              <Link href={primaryCta.href} data-thanks-cta="primary">
                {primaryCta.label}
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-600 bg-transparent text-slate-100 hover:bg-slate-800/60">
              <Link href={homeHref} data-thanks-cta="secondary">
                {copy.homeLabel}
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-600 bg-transparent text-slate-100 hover:bg-slate-800/60">
              <a href={schedulerHref} target="_blank" rel="noopener noreferrer" data-thanks-cta="scheduler">
                {copy.schedulerLabel}
              </a>
            </Button>
          </div>
        </section>
      </main>
    </RelaunchMarketingShell>
  );
}
