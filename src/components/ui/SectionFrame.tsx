import type { HTMLAttributes, ReactNode } from 'react';
import type { SectionPadding, SectionTone, SurfaceStyle, ThemeVariant } from '@/types/design-system';

type SectionDensity = SectionPadding;

type Props = HTMLAttributes<HTMLElement> & {
  as?: 'section' | 'div' | 'header' | 'article';
  tone?: SectionTone;
  surfaceStyle?: SurfaceStyle;
  density?: SectionDensity;
  sectionTheme?: ThemeVariant;
  emphasis?: 'default' | 'expressive';
  children: ReactNode;
};

function joinClassNames(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(' ');
}

export function SectionFrame({
  as = 'section',
  tone = 'panel',
  surfaceStyle,
  density = 'default',
  sectionTheme,
  emphasis = 'default',
  className,
  children,
  ...rest
}: Props) {
  const Element = as;
  return (
    <Element
      {...rest}
      data-theme={sectionTheme}
      className={joinClassNames(
        'section',
        'ui-section',
        (surfaceStyle === 'metal' || tone === 'metal') && 'surface-metal',
        surfaceStyle === 'glass' && 'surface-glass',
        tone === 'flat' && 'ui-section--flat',
        density === 'compact' && 'ui-section--compact',
        density === 'spacious' && 'ui-section--spacious',
        emphasis === 'expressive' && 'ui-section--emphasis-expressive',
        className
      )}
    >
      {children}
    </Element>
  );
}
