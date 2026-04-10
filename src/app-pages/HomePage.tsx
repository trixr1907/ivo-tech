import { HomePageRedesign } from '@/components/home/HomePageRedesign';

type FeaturedInsightTeaser = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  readMinutes: number;
};

type Locale = keyof typeof import('@/content/copy').copy;
type HomeCopy = (typeof import('@/content/copy').copy)[Locale];

type Props = {
  locale: Locale;
  copyText: HomeCopy;
  featuredInsights: FeaturedInsightTeaser[];
};

export function HomePage({ locale, featuredInsights }: Props) {
  return <HomePageRedesign locale={locale} featuredInsights={featuredInsights} />;
}
