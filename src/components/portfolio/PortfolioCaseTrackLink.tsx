'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

import type { Locale } from '@/content/copy';
import { trackEvent } from '@/lib/analytics';

type PortfolioCaseTrackLinkProps = {
  href: string;
  className?: string;
  projectId: string;
  source: string;
  locale: Locale;
  children: ReactNode;
};

export function PortfolioCaseTrackLink({
  href,
  className,
  projectId,
  source,
  locale,
  children
}: PortfolioCaseTrackLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        const path =
          typeof window === 'undefined' ? '' : `${window.location.pathname}${window.location.search}`;
        trackEvent('case_open', { projectId, source, locale, path });
        trackEvent('case_study_open', { projectId, source, locale, path });
      }}
    >
      {children}
    </Link>
  );
}
