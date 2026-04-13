import Link from 'next/link';

import { RelaunchMarketingShell } from '@/components/layout/RelaunchMarketingShell';
import { ServicePremiumBlocks } from '@/components/services/ServicePremiumBlocks';
import { ServiceDetailTracker } from '@/components/services/ServiceDetailTracker';
import { Button } from '@/components/shadcn/button';
import type { Locale } from '@/content/copy';
import type { ServiceDetailSlug } from '@/content/services';
import { localizePath } from '@/lib/localeRouting';
import { RELAUNCH_CARD_HOVER, RELAUNCH_SECTION } from '@/lib/relaunchMarketingStyles';
import { getContactPath, getPrimaryNavLinks } from '@/lib/navigation';
import { SITE_URL } from '@/lib/site';

type LocalizedServiceContent = {
  navLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  outcomesTitle: string;
  outcomes: string[];
  deliverablesTitle: string;
  deliverables: string[];
  fitTitle: string;
  fit: string[];
  faqTitle: string;
  faq: Array<{ question: string; answer: string }>;
  linksTitle: string;
  links: Array<{ label: string; href: string; kind: 'case' | 'insight' | 'playbook' }>;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaTertiary: string;
};

type ServiceDetailPageProps = {
  locale: Locale;
  slug: ServiceDetailSlug;
  content: LocalizedServiceContent;
};

function getServiceDetailPath(locale: Locale, slug: ServiceDetailSlug) {
  return locale === 'de' ? `/leistungen/${slug}` : `/en/services/${slug}`;
}

export function ServiceDetailPage({ locale, slug, content }: ServiceDetailPageProps) {
  const navLinks = getPrimaryNavLinks(locale);
  const path = getServiceDetailPath(locale, slug);
  const canonical = `${SITE_URL}${path}`;
  const contactPath = getContactPath(locale, `service-detail-${slug}-scope`);
  const caseLink = content.links.find((link) => link.kind === 'case');
  const secondaryHref = caseLink ? `${localizePath(caseLink.href, locale)}?source=service-detail-${slug}-case` : localizePath('/case-studies', locale);
  const linkKindLabel: Record<'case' | 'insight' | 'playbook', string> =
    locale === 'de'
      ? { case: 'Fallstudie', insight: 'Insight', playbook: 'Playbook' }
      : { case: 'Case study', insight: 'Insight', playbook: 'Playbook' };
  const linkKindDescription: Record<'case' | 'insight' | 'playbook', string> =
    locale === 'de'
      ? {
          case: 'Reale Umsetzung und Ergebnisdaten ansehen.',
          insight: 'Technischen Hintergrund und Entscheidungslogik vertiefen.',
          playbook: 'Wiederverwendbare Umsetzungsmuster direkt uebernehmen.'
        }
      : {
          case: 'Review real implementation details and outcome signals.',
          insight: 'Deepen the technical rationale and decision logic.',
          playbook: 'Reuse implementation patterns directly.'
        };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${canonical}#service`,
        name: content.title,
        description: content.description,
        provider: {
          '@type': 'Organization',
          name: 'ivo-tech',
          url: SITE_URL
        },
        areaServed: 'Remote',
        inLanguage: locale
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: content.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer
          }
        }))
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: locale === 'de' ? 'Startseite' : 'Home',
            item: `${SITE_URL}${localizePath('/', locale)}`
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: locale === 'de' ? 'Leistungen' : 'Services',
            item: `${SITE_URL}${locale === 'de' ? '/leistungen' : '/en/services'}`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: content.navLabel,
            item: canonical
          }
        ]
      }
    ]
  };

  const headerCtaShort = locale === 'de' ? 'Scope-Call' : 'Scope call';
  const homeHref = localizePath('/', locale);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RelaunchMarketingShell
        locale={locale}
        shellClassName="service-detail-page"
        homeHref={homeHref}
        navLinks={navLinks}
        desktopCtaHref={contactPath}
        desktopCtaLabel={headerCtaShort}
        mobileNavCtaLabel={headerCtaShort}
        desktopContactTrackingSource={`service-detail-header-${slug}`}
        mobileNavPrimaryTrackingSource={`service-detail-mobile-nav-${slug}`}
      >
        <ServiceDetailTracker locale={locale} slug={slug} />
        <main id="main-content" className="mx-auto w-full max-w-[1200px] flex-1 px-4 pb-10 pt-8 sm:px-6 md:pb-12 md:pt-10">
          <section className={`${RELAUNCH_SECTION} service-detail-hero-section`} aria-labelledby="service-detail-title">
            <p className="home-eyebrow">{content.eyebrow}</p>
            <h1
              id="service-detail-title"
              className="mt-1 font-display font-bold tracking-tight text-white"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', lineHeight: 1.15 }}
            >
              {content.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400 md:text-lg">{content.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-[0_0_24px_rgba(14,165,233,0.28)] hover:from-sky-400 hover:to-blue-400"
              >
                <Link href={contactPath} data-service-detail-cta="hero-primary">
                  {content.ctaPrimary}
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-slate-700 bg-transparent text-slate-200 hover:border-slate-500 hover:bg-slate-800/60">
                <Link href={secondaryHref} data-service-detail-cta="hero-secondary-case">
                  {content.ctaSecondary}
                </Link>
              </Button>
            </div>
          </section>

          <section className={`${RELAUNCH_SECTION} mt-8 service-detail-outcomes-section`} aria-labelledby="service-detail-outcomes">
            <h2 id="service-detail-outcomes" className="home-section-h2" style={{ fontSize: "1.5rem" }}>
              {content.outcomesTitle}
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {content.outcomes.map((outcome) => (
                <article key={outcome} className="relaunch-card flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 text-sky-400/70 text-sm" aria-hidden="true">→</span>
                  <p className="text-sm leading-relaxed text-slate-300">{outcome}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={`${RELAUNCH_SECTION} mt-8 service-detail-deliverables-section`} aria-labelledby="service-detail-deliverables">
            <div className="grid gap-8 md:grid-cols-2">
              <article>
                <h2 id="service-detail-deliverables" className="font-display text-lg font-semibold text-slate-100">
                  {content.deliverablesTitle}
                </h2>
                <ul className="mt-3 space-y-2.5">
                  {content.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-300"><span className="mt-0.5 shrink-0 text-sky-400/70 text-xs" aria-hidden="true">→</span>{item}</li>
                  ))}
                </ul>
              </article>
              <article>
                <h2 className="font-display text-lg font-semibold text-slate-100">{content.fitTitle}</h2>
                <ul className="mt-3 space-y-2.5">
                  {content.fit.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-300"><span className="mt-0.5 shrink-0 text-sky-400/70 text-xs" aria-hidden="true">→</span>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          </section>

          <section
            className={`${RELAUNCH_SECTION} mt-8 service-detail-comparator-section`}
            aria-labelledby="service-detail-comparator"
          >
            <ServicePremiumBlocks locale={locale} slug={slug} />
          </section>

          <section className={`${RELAUNCH_SECTION} mt-8 service-detail-links-section`} aria-labelledby="service-detail-links">
            <h2 id="service-detail-links" className="home-section-h2" style={{ fontSize: "1.5rem" }}>
              {content.linksTitle}
            </h2>
            <p className="mt-2 text-sm text-slate-300 md:text-base">
              {locale === 'de'
                ? 'Jede Service-Seite verlinkt gezielt auf Case, Insight und Playbook fuer klare Vertiefungspfade.'
                : 'Each service page links intentionally to one case, insight, and playbook for clear deep-dive paths.'}
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {content.links.map((link) => {
                const href = `${localizePath(link.href, locale)}?source=service-detail-${slug}-${link.kind}`;
                return (
                  <Link
                    key={link.href}
                    href={href}
                    className={RELAUNCH_CARD_HOVER}
                    data-service-detail-cta={`related-${link.kind}`}
                  >
                    <span className="home-eyebrow">
                      {linkKindLabel[link.kind]}
                    </span>
                    <h3 className="mt-2 font-display text-base font-semibold text-slate-100">{link.label}</h3>
                    <p className="mt-2 text-sm text-slate-300">{linkKindDescription[link.kind]}</p>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className={`${RELAUNCH_SECTION} mt-8 service-detail-faq-section`} aria-labelledby="service-detail-faq">
            <h2 id="service-detail-faq" className="home-section-h2" style={{ fontSize: "1.5rem" }}>
              {content.faqTitle}
            </h2>
            <div className="home-relaunch-faq mt-6">
              {content.faq.map((item) => (
                <details key={item.question} name="service-faq">
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </main>
      </RelaunchMarketingShell>
    </>
  );
}
