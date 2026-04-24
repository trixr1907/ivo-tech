export type LogoTone = 'dark' | 'light' | 'mono';
export type LogoStyle = 'static' | 'premium';
export type LogoVariant =
  | 'lockup-horizontal'
  | 'lockup-stacked'
  | 'wordmark'
  | 'mark-core'
  | 'mark-detailed'
  | 'mark-micro';

type AssetMatrix = Record<LogoVariant, Record<LogoStyle, Partial<Record<LogoTone, string>>>>;

const VERSION = '1.0.0';
const PREMIUM_VERSION = '1.1.0';
const LOGO_BASE = '/assets/logo';

const assets: AssetMatrix = {
  'lockup-horizontal': {
    static: {
      dark: `${LOGO_BASE}/ivo-logo__lockup-horizontal__static__dark__v${VERSION}.svg`,
      light: `${LOGO_BASE}/ivo-logo__lockup-horizontal__static__light__v${VERSION}.svg`,
      mono: `${LOGO_BASE}/ivo-logo__lockup-horizontal__static__mono__v${VERSION}.svg`
    },
    premium: {
      dark: `${LOGO_BASE}/ivo-logo__lockup-horizontal__premium__dark__v${PREMIUM_VERSION}.svg`,
      light: `${LOGO_BASE}/ivo-logo__lockup-horizontal__premium__light__v${PREMIUM_VERSION}.svg`
    }
  },
  'lockup-stacked': {
    static: {
      dark: `${LOGO_BASE}/ivo-logo__lockup-stacked__static__dark__v${VERSION}.svg`,
      light: `${LOGO_BASE}/ivo-logo__lockup-stacked__static__light__v${VERSION}.svg`,
      mono: `${LOGO_BASE}/ivo-logo__lockup-stacked__static__mono__v${VERSION}.svg`
    },
    premium: {}
  },
  wordmark: {
    static: {
      dark: `${LOGO_BASE}/ivo-logo__wordmark__static__dark__v${VERSION}.svg`,
      light: `${LOGO_BASE}/ivo-logo__wordmark__static__light__v${VERSION}.svg`,
      mono: `${LOGO_BASE}/ivo-logo__wordmark__static__mono__v${VERSION}.svg`
    },
    premium: {
      dark: `${LOGO_BASE}/ivo-logo__wordmark__premium__dark__v${PREMIUM_VERSION}.svg`,
      light: `${LOGO_BASE}/ivo-logo__wordmark__premium__light__v${PREMIUM_VERSION}.svg`
    }
  },
  'mark-core': {
    static: {
      dark: `${LOGO_BASE}/ivo-logo__mark-core__static__dark__v${VERSION}.svg`,
      light: `${LOGO_BASE}/ivo-logo__mark-core__static__light__v${VERSION}.svg`,
      mono: `${LOGO_BASE}/ivo-logo__mark-core__static__mono__v${VERSION}.svg`
    },
    premium: {
      dark: `${LOGO_BASE}/ivo-logo__mark-core__premium__dark__v${PREMIUM_VERSION}.svg`,
      light: `${LOGO_BASE}/ivo-logo__mark-core__premium__light__v${PREMIUM_VERSION}.svg`
    }
  },
  'mark-detailed': {
    static: {
      dark: `${LOGO_BASE}/ivo-logo__mark-detailed__static__dark__v${VERSION}.svg`,
      light: `${LOGO_BASE}/ivo-logo__mark-detailed__static__light__v${VERSION}.svg`,
      mono: `${LOGO_BASE}/ivo-logo__mark-detailed__static__mono__v${VERSION}.svg`
    },
    premium: {}
  },
  'mark-micro': {
    static: {
      dark: `${LOGO_BASE}/ivo-logo__mark-micro__static__dark__v${VERSION}.svg`,
      light: `${LOGO_BASE}/ivo-logo__mark-micro__static__light__v${VERSION}.svg`,
      mono: `${LOGO_BASE}/ivo-logo__mark-micro__static__mono__v${VERSION}.svg`
    },
    premium: {}
  }
};

const FALLBACK_TONE: Record<LogoTone, LogoTone> = {
  dark: 'dark',
  light: 'light',
  mono: 'mono'
};

export function resolveLogoAssetPath(variant: LogoVariant, tone: LogoTone, style: LogoStyle): string {
  const exact = assets[variant][style][tone];
  if (exact) return exact;

  const defaultTone = FALLBACK_TONE[tone];
  const styleFallback = assets[variant].static[defaultTone];
  if (styleFallback) return styleFallback;

  return assets['mark-core'].static.dark!;
}

export function getLogoAssetMatrix() {
  return assets;
}
