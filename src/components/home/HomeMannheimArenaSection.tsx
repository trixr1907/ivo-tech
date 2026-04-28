'use client';

import type { Locale } from '@/content/copy';
import { getHomeMannheimArenaCopy } from '@/content/homeMannheimArena';
import dynamic from 'next/dynamic';

const StadiumMesh = dynamic(
  () => import('@/components/home/HomeMannheimStadiumMesh').then((m) => m.HomeMannheimStadiumMesh),
  {
    ssr: false,
    loading: () => (
      <div
        className="min-h-[28rem] w-full animate-pulse rounded-2xl border border-slate-800/80 bg-slate-900/50"
        aria-hidden="true"
      />
    )
  }
);

type HomeMannheimArenaSectionProps = {
  locale: Locale;
};

export function HomeMannheimArenaSection({ locale }: HomeMannheimArenaSectionProps) {
  const t = getHomeMannheimArenaCopy(locale);

  return (
    <div>
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-sky-300/90">{t.eyebrow}</p>
      <h2 id="mannheim-arena-heading" className="home-section-h2-primary mt-2 text-balance">
        {t.title}
      </h2>
      <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-400">{t.lead}</p>
      <div className="mt-8">
        <StadiumMesh reducedMessage={t.reducedNote} />
      </div>
      <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-500">{t.foot}</p>
    </div>
  );
}
