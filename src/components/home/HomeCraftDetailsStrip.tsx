import { HomeDetailsMicroPanel } from '@/components/home/HomeDetailsMicroPanel';
import type { Locale } from '@/content/copy';
import { getHomeDetailsStripCopy } from '@/content/homeRelaunchFocusDetails';
import { getHomeReferralCardCopy } from '@/content/homeRelaunchPerformance';
import { cn } from '@/lib/cn';

type HomeCraftDetailsStripProps = {
  locale: Locale;
};

export function HomeCraftDetailsStrip({ locale }: HomeCraftDetailsStripProps) {
  const t = getHomeDetailsStripCopy(locale);
  const refCard = getHomeReferralCardCopy(locale);

  return (
    <div className="home-craft-details">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-amber-200/85">{t.eyebrow}</p>
      <h2 id="home-craft-heading" className="home-section-h2-primary mt-2">
        {t.title}
      </h2>
      <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-400">{t.lead}</p>

      <div className="home-craft-bento" role="list">
        <div className="home-craft-bento__stack" role="listitem">
          <div className="home-craft-card home-craft-card--micro">
            <HomeDetailsMicroPanel locale={locale} />
          </div>
          <div className="home-craft-card home-craft-card--referral">
            <span className="home-craft-tag">{refCard.tag}</span>
            <h3 className="home-craft-card-title">{refCard.title}</h3>
            <p className="home-craft-card-body">{refCard.body}</p>
          </div>
        </div>

        {t.items.map((item, i) => (
          <div
            key={item.title}
            className={cn('home-craft-card', i === 4 && 'home-craft-card--span-full')}
            data-craft-i={i}
            role="listitem"
          >
            <span className="home-craft-tag">{item.tag}</span>
            <h3 className="home-craft-card-title">{item.title}</h3>
            <p className="home-craft-card-body">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
