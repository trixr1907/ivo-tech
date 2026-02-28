'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export function LanguageToggle() {
  const pathname = usePathname() ?? '/';
  const [hash, setHash] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const update = () => {
      setHash(window.location.hash || '');
      setSearch(window.location.search || '');
    };

    update();
    window.addEventListener('hashchange', update);
    window.addEventListener('popstate', update);

    return () => {
      window.removeEventListener('hashchange', update);
      window.removeEventListener('popstate', update);
    };
  }, []);

  const { isEn, deHref, enHref } = useMemo(() => {
    const h = hash.startsWith('#') ? hash : hash ? `#${hash}` : '';
    const suffix = `${search}${h}`;

    const barePath = pathname === '/en' ? '/' : pathname.startsWith('/en/') ? pathname.slice(3) || '/' : pathname;
    const normalizedBarePath = barePath || '/';
    const dePath = normalizedBarePath;
    const enPath = normalizedBarePath === '/' ? '/en' : `/en${normalizedBarePath}`;

    return {
      isEn: pathname === '/en' || pathname.startsWith('/en/'),
      deHref: `${dePath}${suffix}`,
      enHref: `${enPath}${suffix}`
    };
  }, [hash, pathname, search]);

  const labels = isEn
    ? {
        nav: 'Language selector',
        de: 'Sprache auf Deutsch wechseln',
        en: 'English (current language)'
      }
    : {
        nav: 'Sprachauswahl',
        de: 'Deutsch (aktuelle Sprache)',
        en: 'Switch language to English'
      };

  return (
    <nav className="locale-toggle" aria-label={labels.nav}>
      <Link href={deHref} aria-current={!isEn ? 'page' : undefined} aria-label={labels.de} hrefLang="de" lang="de">
        DE
      </Link>
      <Link href={enHref} aria-current={isEn ? 'page' : undefined} aria-label={labels.en} hrefLang="en" lang="en">
        EN
      </Link>
    </nav>
  );
}
