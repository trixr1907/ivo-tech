import type { Locale } from '@/content/copy';

const TECH_ITEMS = [
  'Next.js 16 (App Router)',
  'React 19',
  'TypeScript',
  'Tailwind v4',
  'Framer Motion',
  'Three.js',
  'Vercel',
  'Node.js',
  'Zod',
  'MDX',
] as const;

type HomeTechStackBarProps = {
  locale: Locale;
};

export function HomeTechStackBar({ locale }: HomeTechStackBarProps) {
  const label = locale === 'de' ? 'Stack' : 'Stack';

  return (
    <div className="home-tech-bar" aria-label={locale === 'de' ? 'Verwendete Technologien' : 'Technologies used'}>
      <span className="home-tech-bar-label" aria-hidden="true">
        {label}
      </span>
      <div className="home-tech-bar-sep" aria-hidden="true" />
      <ul className="home-tech-bar-items" role="list">
        {TECH_ITEMS.map((tech, i) => (
          <li key={tech} role="listitem" className="contents">
            <span className="home-tech-bar-item">{tech}</span>
            {i < TECH_ITEMS.length - 1 && (
              <span className="home-tech-bar-sep" aria-hidden="true" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
