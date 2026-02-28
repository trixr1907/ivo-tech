export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'metal' | 'flat' | 'proof' | 'signal' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type GlowLevel = 'off' | 'soft' | 'medium';
export type FeedbackTone = 'info' | 'success' | 'warning' | 'error';

export type ButtonProps = {
  variant: ButtonVariant;
  size: ButtonSize;
  icon?: string;
  loading?: boolean;
  glowLevel?: GlowLevel;
};

export type SectionTone = 'panel' | 'metal' | 'flat';
export type SectionPadding = 'compact' | 'default' | 'spacious';
export type SurfaceStyle = 'panel' | 'metal' | 'glass';

export type SectionProps = {
  tone: SectionTone;
  padding: SectionPadding;
  theme?: 'dark' | 'primary' | 'secondary' | 'fusion';
  surfaceStyle?: SurfaceStyle;
};

export type CardTone = 'panel' | 'metal' | 'flat';
export type CardDensity = 'compact' | 'default' | 'comfortable';

export type CardProps = {
  interactive: boolean;
  density: CardDensity;
  tone: CardTone;
};

export type IconStyle = 'outline' | 'duotone' | 'metallic';

export type IconProps = {
  name: string;
  size: number;
  style: IconStyle;
};

export type ThemeVariant = 'dark' | 'primary' | 'secondary' | 'fusion';
export type ElevationTier = 'e0' | 'e1' | 'e2' | 'e3' | 'e4';
export type MotionTier = 'micro' | 'section' | 'hero';

export type LogoVariant = 'lockup-horizontal' | 'lockup-stacked' | 'wordmark' | 'mark-core' | 'mark-detailed' | 'mark-micro';
export type LogoTone = 'dark' | 'light' | 'mono';
export type LogoStyle = 'static' | 'premium';
