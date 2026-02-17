import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

export function LanguageToggle() {
  const router = useRouter();
  const [hash, setHash] = useState('');

  useEffect(() => {
    const update = () => setHash(window.location.hash || '');
    update();
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  const href = useMemo(() => {
    const h = hash.startsWith('#') ? hash.slice(1) : hash;
    return {
      pathname: router.pathname,
      query: router.query,
      ...(h ? { hash: h } : {})
    };
  }, [hash, router.pathname, router.query]);

  const isEn = router.locale === 'en';

  return (
    <div className="locale-toggle" aria-label="Language">
      <Link href={href} locale="de" aria-current={!isEn ? 'page' : undefined}>
        DE
      </Link>
      <Link href={href} locale="en" aria-current={isEn ? 'page' : undefined}>
        EN
      </Link>
    </div>
  );
}

