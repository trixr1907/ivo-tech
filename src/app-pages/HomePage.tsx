import { HomePageRelaunch2026 } from '@/components/home/HomePageRelaunch2026';

type FeaturedInsightTeaser = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  readMinutes: number;
};

type Locale = keyof typeof import('@/content/copy').copy;
type Props = {
  locale: Locale;
  featuredInsights: FeaturedInsightTeaser[];
};

export function HomePage({ locale, featuredInsights }: Props) {
  return <HomePageRelaunch2026 locale={locale} featuredInsights={featuredInsights} />;
}
