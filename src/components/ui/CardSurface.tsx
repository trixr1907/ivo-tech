import type { HTMLAttributes, ReactNode } from 'react';

type CardTone = 'panel' | 'metal' | 'flat';

type Props = HTMLAttributes<HTMLElement> & {
  as?: 'article' | 'div' | 'aside';
  tone?: CardTone;
  interactive?: boolean;
  trail?: boolean;
  children: ReactNode;
};

function joinClassNames(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(' ');
}

export function CardSurface({
  as = 'article',
  tone = 'panel',
  interactive = false,
  trail = false,
  className,
  children,
  ...rest
}: Props) {
  const Element = as;
  return (
    <Element
      {...rest}
      className={joinClassNames(
        'ui-card',
        tone === 'metal' && 'surface-metal',
        tone === 'flat' && 'ui-section--flat',
        interactive && 'ui-card--interactive card--interactive',
        trail && 'motion-trail',
        className
      )}
    >
      {children}
    </Element>
  );
}
