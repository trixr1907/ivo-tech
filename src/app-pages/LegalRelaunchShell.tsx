import type { ReactNode } from 'react';

import { RelaunchMarketingShell } from '@/components/layout/RelaunchMarketingShell';
import { RelaunchPageMain } from '@/components/layout/RelaunchPageMain';
import type { Locale } from '@/content/copy';
import { localizePath } from '@/lib/localeRouting';
import { getContactPath, getPrimaryNavLinks } from '@/lib/navigation';
import { RELAUNCH_SECTION } from '@/lib/relaunchMarketingStyles';

type LegalRelaunchShellProps = {
  locale: Locale;
  shellClassName: string;
  children: ReactNode;
};

export function LegalRelaunchShell({ locale, shellClassName, children }: LegalRelaunchShellProps) {
  const navLinks = getPrimaryNavLinks(locale);
  const homeHref = localizePath('/', locale);
  const contactPath = getContactPath(locale, 'legal-header');
  const cta = locale === 'de' ? 'Erstgespräch' : 'Intro call';

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
      <RelaunchPageMain variant="legal">
        <div className={RELAUNCH_SECTION}>{children}</div>
      </RelaunchPageMain>
    </RelaunchMarketingShell>
  );
}
