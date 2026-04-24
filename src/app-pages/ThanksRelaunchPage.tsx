import Link from 'next/link';

import { RelaunchMarketingShell } from '@/components/layout/RelaunchMarketingShell';
import { RelaunchPageHero } from '@/components/layout/RelaunchPageHero';
import { RelaunchPageMain } from '@/components/layout/RelaunchPageMain';
import { Button } from '@/components/shadcn/button';
import { ThankYouTracker } from '@/components/thank-you/ThankYouTracker';
import type { Locale } from '@/content/copy';
import { localizePath } from '@/lib/localeRouting';
import { getContactPath, getPrimaryNavLinks } from '@/lib/navigation';
import { RELAUNCH_SECTION } from '@/lib/relaunchMarketingStyles';

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
  const headerCta = locale === 'de' ? 'Erstgespräch' : 'Intro call';

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
      <RelaunchPageMain variant="reading">
        <section className={RELAUNCH_SECTION} aria-labelledby="thanks-title">
          <RelaunchPageHero
            className="!mb-0"
            eyebrow={copy.eyebrow}
            title={copy.title}
            titleId="thanks-title"
            titleClassName="!max-w-[22ch] !text-[clamp(2rem,5vw,3rem)] !leading-[1.15]"
          />
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
            {copy.introBefore}{' '}
            <a className="font-medium text-sky-300 transition hover:text-sky-200" href="mailto:contact@ivo-tech.com" data-thanks-cta="email">
              contact@ivo-tech.com
            </a>
            {copy.introAfter}
          </p>
          <ol className="mt-6 space-y-3 relaunch-card">
            {copy.steps.map((line, idx) => (
              <li key={line} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-sky-500/30 bg-sky-500/8 font-mono text-[0.65rem] font-bold text-sky-300" aria-hidden="true">
                  {idx + 1}
                </span>
                {line.replace(/^\d+\.\s*/, '')}
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-col flex-wrap gap-3 sm:flex-row">
            <Button asChild variant="hero" size="lg">
              <Link href={primaryCta.href} data-thanks-cta="primary">
                {primaryCta.label}
              </Link>
            </Button>
            <Button asChild variant="onDark" size="lg">
              <Link href={homeHref} data-thanks-cta="secondary">
                {copy.homeLabel}
              </Link>
            </Button>
            <Button asChild variant="onDark" size="lg" className="hover:border-sky-500/40 hover:text-sky-300">
              <a href={schedulerHref} target="_blank" rel="noopener noreferrer" data-thanks-cta="scheduler">
                {copy.schedulerLabel}
              </a>
            </Button>
          </div>
        </section>
      </RelaunchPageMain>
    </RelaunchMarketingShell>
  );
}
