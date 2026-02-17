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

  return (
    <div className="locale-toggle" aria-label="Language">
      <Link href={deHref} aria-current={!isEn ? 'page' : undefined}>
        DE
      </Link>
      <Link href={enHref} aria-current={isEn ? 'page' : undefined}>
        EN
      </Link>
    </div>
  );
}
