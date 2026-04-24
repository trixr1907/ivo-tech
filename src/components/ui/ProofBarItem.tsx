import type { AnchorHTMLAttributes } from 'react';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  label: string;
  value: string;
};

export function ProofBarItem({ label, value, className, ...rest }: Props) {
  return (
    <a {...rest} className={['proof-bar-item', className].filter(Boolean).join(' ')}>
      <span>{label}</span>
      <strong>{value}</strong>
    </a>
  );
}
