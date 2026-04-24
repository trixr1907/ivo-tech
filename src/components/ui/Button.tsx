import type { ButtonSize, ButtonVariant, GlowLevel } from '@/types/design-system';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type SharedProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  glowLevel?: GlowLevel;
  className?: string;
  edgeSweep?: boolean;
};

type ButtonAsAnchorProps = SharedProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    as?: 'a';
  };

type ButtonAsButtonProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button';
    href?: never;
  };

export type ButtonProps = ButtonAsAnchorProps | ButtonAsButtonProps;

function joinClassNames(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(' ');
}

function getSizeClass(size: ButtonSize) {
  if (size === 'sm') return 'btn-sm';
  if (size === 'lg') return 'btn-lg';
  return 'btn-md';
}

/**
 * @deprecated Für neue UI shadcn-`Button` (`@/components/shadcn/button`) nutzen — gleiche Tokens/Varianten (`hero`, `onDark`, …).
 * Diese Implementierung bleibt für bestehende `.ui-btn`-Styles und Tests.
 */
export function Button(props: ButtonProps) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    glowLevel = 'soft',
    className,
    edgeSweep = true,
    as = props.href ? 'a' : 'button',
    ...rest
  } = props;

  const classes = joinClassNames(
    'ui-btn',
    `ui-btn--${variant}`,
    getSizeClass(size),
    variant === 'signal' && glowLevel !== 'off' && `ui-btn--glow-${glowLevel}`,
    edgeSweep && 'motion-edge-sweep',
    className,
    variant
  );

  if (as === 'a' && 'href' in props) {
    const anchorProps = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a {...anchorProps} className={classes}>
        {children}
      </a>
    );
  }

  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button {...buttonProps} className={classes}>
      {children}
    </button>
  );
}
