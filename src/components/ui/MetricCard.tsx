import type { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLDivElement> & {
  label: string;
  value: string;
};

export function MetricCard({ label, value, className, ...rest }: Props) {
  return (
    <div {...rest} className={['metric-card', className].filter(Boolean).join(' ')}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
