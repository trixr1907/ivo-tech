import Link from 'next/link';

import { LanguageToggle } from '@/components/LanguageToggle';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { ServicePremiumBlocks } from '@/components/services/ServicePremiumBlocks';
import { ServiceDetailTracker } from '@/components/services/ServiceDetailTracker';
import { SectionFrame } from '@/components/ui/SectionFrame';
import type { Locale } from '@/content/copy';
import type { ServiceDetailSlug } from '@/content/services';
import { localizePath } from '@/lib/localeRouting';
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
  const playbookLink = content.links.find((link) => link.kind === 'playbook');
  const secondaryHref = caseLink ? `${localizePath(caseLink.href, locale)}?source=service-detail-${slug}-case` : localizePath('/case-studies', locale);
  const tertiaryHref = playbookLink
    ? `${localizePath(playbookLink.href, locale)}?source=service-detail-${slug}-playbook`
    : localizePath('/playbooks', locale);
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ServiceDetailTracker locale={locale} slug={slug} />
      <div className="theme-ref103632 service-detail-page" data-theme="dark">
        <SiteHeader
          ariaLabel={locale === 'de' ? 'Hauptnavigation' : 'Primary navigation'}
          className="home-v2-header"
          logoPreset="ref103632"
          logoVisualPreset="premium"
          logoEdgeGlow="medium"
          nav={
            <>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </>
          }
          rightSlot={
            <>
              <LanguageToggle />
              <Link className="cta ui-btn ui-btn--metal btn-md motion-edge-sweep" href={contactPath} data-service-detail-cta="header-primary">
                {locale === 'de' ? 'Scope-Call' : 'Scope call'}
              </Link>
            </>
          }
        />

        <main id="main-content" className="home-v2-main service-detail-main">
          <SectionFrame
            className="section service-detail-hero-section"
            aria-labelledby="service-detail-title"
            tone="metal"
            sectionTheme="primary"
          >
            <p className="eyebrow">{content.eyebrow}</p>
            <h1 id="service-detail-title" className="insights-title text-ink-900">
              {content.title}
            </h1>
            <p className="text-ink-700">{content.description}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link className="cta ui-btn ui-btn--metal btn-md motion-edge-sweep" href={contactPath} data-service-detail-cta="hero-primary">
                {content.ctaPrimary}
              </Link>
              <Link className="cta ui-btn ui-btn--ghost btn-md motion-edge-sweep" href={secondaryHref} data-service-detail-cta="hero-secondary-case">
                {content.ctaSecondary}
              </Link>
              <Link className="cta ui-btn ui-btn--ghost btn-md motion-edge-sweep" href={tertiaryHref} data-service-detail-cta="hero-tertiary-playbook">
                {content.ctaTertiary}
              </Link>
            </div>
          </SectionFrame>

          <SectionFrame
            className="section service-detail-outcomes-section"
            aria-labelledby="service-detail-outcomes"
            tone="panel"
            sectionTheme="secondary"
          >
            <div className="section-head">
              <h2 id="service-detail-outcomes" className="text-ink-900">
                {content.outcomesTitle}
              </h2>
            </div>
            <div className="insights-grid insights-grid-page service-detail-outcomes-grid">
              {content.outcomes.map((outcome) => (
                <article key={outcome} className="insight-card text-ink-700">
                  <p className="text-ink-700">{outcome}</p>
                </article>
              ))}
            </div>
          </SectionFrame>

          <SectionFrame className="section service-detail-deliverables-section" aria-labelledby="service-detail-deliverables" tone="panel">
            <div className="grid gap-6 md:grid-cols-2">
              <article>
                <h2 id="service-detail-deliverables" className="text-ink-900">
                  {content.deliverablesTitle}
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink-700">
                  {content.deliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article>
                <h2 className="text-ink-900">{content.fitTitle}</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink-700">
                  {content.fit.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          </SectionFrame>

          <SectionFrame
            className="section service-detail-comparator-section"
            aria-labelledby="service-detail-comparator"
            tone="panel"
            sectionTheme="secondary"
          >
            <ServicePremiumBlocks locale={locale} slug={slug} />
          </SectionFrame>

          <SectionFrame className="section service-detail-links-section" aria-labelledby="service-detail-links" tone="panel">
            <div className="section-head">
              <h2 id="service-detail-links" className="text-ink-900">
                {content.linksTitle}
              </h2>
              <p className="text-ink-700">
                {locale === 'de'
                  ? 'Jede Service-Seite verlinkt gezielt auf Case, Insight und Playbook fuer klare Vertiefungspfade.'
                  : 'Each service page links intentionally to one case, insight, and playbook for clear deep-dive paths.'}
              </p>
            </div>
            <div className="insights-grid insights-grid-page service-detail-links-grid">
              {content.links.map((link) => {
                const href = `${localizePath(link.href, locale)}?source=service-detail-${slug}-${link.kind}`;
                return (
                  <Link key={link.href} href={href} className="insight-card text-ink-700" data-service-detail-cta={`related-${link.kind}`}>
                    <span className="insight-meta">{linkKindLabel[link.kind]}</span>
                    <h3 className="text-ink-900">{link.label}</h3>
                    <p className="text-ink-700">{linkKindDescription[link.kind]}</p>
                  </Link>
                );
              })}
            </div>
          </SectionFrame>

          <SectionFrame className="section service-detail-faq-section" aria-labelledby="service-detail-faq" tone="panel">
            <div className="section-head">
              <h2 id="service-detail-faq" className="text-ink-900">
                {content.faqTitle}
              </h2>
            </div>
            <div className="space-y-3">
              {content.faq.map((item) => (
                <details key={item.question} className="rounded-xl border border-slate-200 bg-white/95 p-4">
                  <summary className="cursor-pointer font-semibold text-ink-900">{item.question}</summary>
                  <p className="mt-2 text-sm text-ink-700">{item.answer}</p>
                </details>
              ))}
            </div>
          </SectionFrame>
        </main>
      </div>
    </>
  );
}
