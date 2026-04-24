import type { HTMLAttributes, ReactNode } from 'react';

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

function joinClassNames(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(' ');
}

export function CTACluster({ className, children, ...rest }: Props) {
  return (
    <div {...rest} className={joinClassNames('cta-cluster', className)}>
      {children}
    </div>
  );
}
