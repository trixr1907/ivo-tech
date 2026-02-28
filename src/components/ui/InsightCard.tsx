import Link from 'next/link';
import type { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLElement> & {
  category: string;
  readMinutes: number;
  title: string;
  summary: string;
  href: string;
  linkLabel: string;
  onLinkClick?: () => void;
};

export function InsightCard({ category, readMinutes, title, summary, href, linkLabel, onLinkClick, className, ...rest }: Props) {
  return (
    <article {...rest} className={['insight-card', className].filter(Boolean).join(' ')}>
      <span className="insight-meta">
        {category} | {readMinutes} min
      </span>
      <h3>{title}</h3>
      <p>{summary}</p>
      <Link className="insight-link" href={href} onClick={onLinkClick}>
        {linkLabel}
      </Link>
    </article>
  );
}
