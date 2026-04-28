'use client';

import type { Locale } from '@/content/copy';
import { getHomeCryptoStripCopy } from '@/content/homeRelaunchPerformance';
import type { CryptoQuotesResponse } from '@/types/cryptoQuotes';
import { useEffect, useRef, useState } from 'react';

type HomeCryptoLiveStripProps = {
  locale: Locale;
};

function formatPrice(value: number, vs: 'usd' | 'eur', loc: Locale) {
  const currency = vs.toUpperCase() as 'EUR' | 'USD';
  const intlLoc = loc === 'de' ? 'de-DE' : 'en-US';
  return new Intl.NumberFormat(intlLoc, {
    style: 'currency',
    currency,
    maximumFractionDigits: value >= 1000 ? 0 : 2,
    minimumFractionDigits: 0
  }).format(value);
}

function formatChange(pct: number | null, loc: Locale) {
  if (pct == null || !Number.isFinite(pct)) return '—';
  const intlLoc = loc === 'de' ? 'de-DE' : 'en-US';
  const s = new Intl.NumberFormat(intlLoc, { maximumFractionDigits: 2, signDisplay: 'exceptZero' }).format(pct);
  return `${s}%`;
}

function formatTime(iso: string, loc: Locale) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(loc === 'de' ? 'de-DE' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    }).format(d);
  } catch {
    return '';
  }
}

export function HomeCryptoLiveStrip({ locale }: HomeCryptoLiveStripProps) {
  const t = getHomeCryptoStripCopy(locale);
  const vs = locale === 'de' ? 'eur' : 'usd';
  const [data, setData] = useState<CryptoQuotesResponse | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const hasDataRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const ac = new AbortController();
    hasDataRef.current = false;

    const load = async (isInitial: boolean) => {
      if (isInitial) {
        setLoading(true);
        setError(false);
      }
      try {
        const r = await fetch(`/api/crypto/quotes?vs=${vs}`, { signal: ac.signal, cache: 'no-store' });
        if (!r.ok) throw new Error('bad');
        const json = (await r.json()) as CryptoQuotesResponse;
        if (!cancelled) {
          setData(json);
          hasDataRef.current = true;
          setError(false);
        }
      } catch (e) {
        if ((e as Error).name === 'AbortError') return;
        if (!cancelled) {
          if (isInitial || !hasDataRef.current) {
            setError(true);
            if (isInitial) setData(null);
          }
        }
      } finally {
        if (!cancelled && isInitial) setLoading(false);
      }
    };

    void load(true);
    const id = window.setInterval(() => void load(false), 90_000);
    return () => {
      cancelled = true;
      ac.abort();
      window.clearInterval(id);
    };
  }, [vs]);

  return (
    <div className="home-crypto-strip">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-fuchsia-200/90">{t.cryptoBlockTitle}</p>
      <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-500">{t.cryptoBlockSub}</p>

      {loading && !data ? (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2" aria-busy="true" aria-label={t.loading}>
          <div className="home-crypto-skeleton" />
          <div className="home-crypto-skeleton" />
        </div>
      ) : null}

      {error && !data && !loading ? (
        <p className="mt-6 text-sm text-amber-200/90" role="status">
          {t.error}
        </p>
      ) : null}

      {data?.items?.length ? (
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2" role="list">
          {data.items.map((item) => {
            const name = locale === 'de' ? item.nameDe : item.nameEn;
            const ch = item.change24hPct;
            const up = ch != null && ch > 0;
            const down = ch != null && ch < 0;
            return (
              <li
                key={item.id}
                className="home-crypto-tile"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.14em] text-slate-500">
                      {item.symbol}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-200">{name}</p>
                  </div>
                  {ch != null ? (
                    <span
                      className={
                        up
                          ? 'home-crypto-chip home-crypto-chip--up'
                          : down
                            ? 'home-crypto-chip home-crypto-chip--down'
                            : 'home-crypto-chip home-crypto-chip--flat'
                      }
                    >
                      {t.change24h} {formatChange(ch, locale)}
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 font-mono text-2xl font-bold tabular-nums text-white md:text-3xl">
                  {formatPrice(item.price, data.vs, locale)}
                </p>
                <p className="mt-1 text-[0.65rem] text-slate-500" suppressHydrationWarning>
                  {t.updated} {formatTime(data.fetchedAt, locale)}
                </p>
              </li>
            );
          })}
        </ul>
      ) : null}

      <p className="mt-3 text-center text-[0.65rem] text-slate-500">
        {t.source}
      </p>
    </div>
  );
}
