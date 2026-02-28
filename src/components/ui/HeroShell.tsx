import type { HTMLAttributes, ReactNode } from 'react';

type Props = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

function joinClassNames(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(' ');
}

export function HeroShell({ className, children, ...rest }: Props) {
  return (
    <section {...rest} className={joinClassNames('hero-shell', className)}>
      {children}
    </section>
  );
}
