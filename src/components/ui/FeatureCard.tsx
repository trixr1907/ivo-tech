import type { HTMLAttributes, ReactNode } from 'react';

type Props = HTMLAttributes<HTMLElement> & {
  title: string;
  description: string;
  icon?: ReactNode;
};

export function FeatureCard({ title, description, icon, className, ...rest }: Props) {
  return (
    <article {...rest} className={['feature-card', className].filter(Boolean).join(' ')}>
      <div className="feature-card-head">
        {icon ? <span className="feature-card-icon">{icon}</span> : null}
        <h3>{title}</h3>
      </div>
      <p>{description}</p>
    </article>
  );
}
