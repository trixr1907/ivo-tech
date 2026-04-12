import type { ReactNode } from 'react';

import { RelaunchMarketingShell } from '@/components/layout/RelaunchMarketingShell';
import type { Locale } from '@/content/copy';
import { localizePath } from '@/lib/localeRouting';
import { RELAUNCH_SECTION } from '@/lib/relaunchMarketingStyles';
import { getContactPath, getPrimaryNavLinks } from '@/lib/navigation';

type LegalRelaunchShellProps = {
  locale: Locale;
  shellClassName: string;
  children: ReactNode;
};

export function LegalRelaunchShell({ locale, shellClassName, children }: LegalRelaunchShellProps) {
  const navLinks = getPrimaryNavLinks(locale);
  const homeHref = localizePath('/', locale);
  const contactPath = getContactPath(locale, 'legal-header');
  const cta = locale === 'de' ? 'Erstgespraech' : 'Intro call';

  return (
    <RelaunchMarketingShell
      locale={locale}
      shellClassName={shellClassName}
      homeHref={homeHref}
      navLinks={navLinks}
      desktopCtaHref={contactPath}
      desktopCtaLabel={cta}
      mobileNavCtaLabel={cta}
      desktopContactTrackingSource={`${shellClassName}-header`}
      mobileNavPrimaryTrackingSource={`${shellClassName}-mobile-nav`}
    >
      <main id="main-content" className="mx-auto w-full max-w-4xl flex-1 px-4 pb-12 pt-10 sm:px-6 md:pt-12">
        <div className={RELAUNCH_SECTION}>{children}</div>
      </main>
    </RelaunchMarketingShell>
  );
}
