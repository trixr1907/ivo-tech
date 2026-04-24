import type { ReactNode } from 'react';

import { BrandLockup } from '@/components/BrandLockup';
import type { LogoMotionTheme, LogoMotionTier } from '@/lib/logoMotion';

type Props = {
  nav: ReactNode;
  rightSlot?: ReactNode;
  className?: string;
  ariaLabel: string;
  condensed?: boolean;
  theme?: 'dark' | 'primary' | 'secondary' | 'fusion';
  logoTheme?: LogoMotionTheme;
  logoTier?: LogoMotionTier;
  logoPreset?: 'ref103632';
  logoVisualPreset?: 'default' | 'premium';
  logoEdgeGlow?: 'off' | 'soft' | 'medium';
  visualMode?: 'default' | 'portfolio';
};

function joinClassNames(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(' ');
}

export function SiteHeader({
  nav,
  rightSlot,
  className,
  ariaLabel,
  condensed = false,
  theme = 'dark',
  logoTheme = 'dark',
  logoTier = 'tier1',
  logoPreset = 'ref103632',
  logoVisualPreset = 'premium',
  logoEdgeGlow = 'soft',
  visualMode = 'default'
}: Props) {
  return (
    <header
      className={joinClassNames('site-header', 'ui-header-shell', visualMode === 'portfolio' && 'site-header--portfolio', className, condensed && 'is-scrolled')}
      data-theme={theme}
    >
      <div className="site-header-inner">
        <BrandLockup
          variant="header"
          theme={logoTheme}
          motionTier={logoTier}
          systemPreset={logoPreset}
          visualPreset={logoVisualPreset}
          edgeGlow={logoEdgeGlow}
        />
        <nav className="nav" aria-label={ariaLabel}>
          {nav}
        </nav>
        <div className="header-right">{rightSlot}</div>
      </div>
    </header>
  );
}
