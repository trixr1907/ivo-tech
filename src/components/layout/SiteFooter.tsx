import type { ReactNode } from 'react';

import { BrandLockup } from '@/components/BrandLockup';

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

type Props = {
  leftText: string;
  navLabel: string;
  navLinks: FooterLink[];
  contactLinks: FooterLink[];
  rightText: string;
  cta: ReactNode;
  theme?: 'dark' | 'primary' | 'secondary' | 'fusion';
};

export function SiteFooter({ leftText, navLabel, navLinks, contactLinks, rightText, cta, theme = 'dark' }: Props) {
  return (
    <footer className="site-footer ui-footer-shell" data-theme={theme}>
      <div className="site-footer-inner">
        <div className="footer-col footer-brand">
          <BrandLockup variant="compact" className="footer-lockup" systemPreset="ref103632" visualPreset="premium" edgeGlow="soft" />
          <p>{leftText}</p>
        </div>

        <nav className="footer-col footer-nav" aria-label={navLabel}>
          {navLinks.map((link) =>
            link.external ? (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            ) : (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            )
          )}
        </nav>

        <div className="footer-col footer-contact">
          {cta}
          {contactLinks.map((link) =>
            link.external ? (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            ) : (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            )
          )}
          <span>{rightText}</span>
        </div>
      </div>
    </footer>
  );
}
