import type { Locale } from '@/content/copy';
import { getHomeChapterLabels, HOME_CHAPTER_TOTAL } from '@/content/homeRelaunchChapters';
import { cn } from '@/lib/cn';

type HomeSectionRailProps = {
  locale: Locale;
  /** 1-basiierter Kapitel-Index (1 … HOME_CHAPTER_TOTAL) */
  chapter: number;
  className?: string;
};

function pad2(n: number) {
  return String(Math.max(1, Math.min(HOME_CHAPTER_TOTAL, n))).padStart(2, '0');
}

export function HomeSectionRail({ locale, chapter, className }: HomeSectionRailProps) {
  const labels = getHomeChapterLabels(locale);
  const idx = Math.min(Math.max(1, chapter), HOME_CHAPTER_TOTAL) - 1;
  const label = labels[idx] ?? '';

  return (
    <div className={cn('home-chapter-rail', className)}>
      <span className="home-chapter-rail-idx" aria-hidden="true">
        [ {pad2(chapter)} / {pad2(HOME_CHAPTER_TOTAL)} ]
      </span>
      <span className="home-chapter-rail-bracket" aria-hidden="true">
        /
      </span>
      <span className="home-chapter-rail-name" aria-hidden="true">
        [ {label} ]
      </span>
    </div>
  );
}
