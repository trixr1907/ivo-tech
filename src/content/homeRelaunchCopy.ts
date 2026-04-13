import type { Locale } from '@/content/copy';

export type HomeRelaunchHeroMetric = { value: string; label: string };

export type HomeRelaunchFormLabels = {
  formName: string;
  formEmail: string;
  formCompany: string;
  formMessage: string;
  formButton: string;
  submitting: string;
  success: string;
  error: string;
  rateLimited: string;
  verificationRequired: string;
  privacy: string;
  schedulerCta: string;
  schedulerHint: string;
};

export type HomeRelaunchCopy = {
  badge: string;
  availabilityPill: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  tertiaryCta: string;
  trustInline: string;
  heroPills: string[];
  heroSnapshotLabel: string;
  heroSnapshotStatus: string;
  heroMetrics: HomeRelaunchHeroMetric[];
  heroSnapshotFoot: [string, string];
  sectionProofEyebrow: string;
  sectionProjectsEyebrow: string;
  sectionInsightsEyebrow: string;
  sectionContactEyebrow: string;
  proofTitle: string;
  proofDescription: string;
  proofPoints: string[];
  featuredProjectsTitle: string;
  featuredProjectsDescription: string;
  midPageCtaText: string;
  midPageCtaLink: string;
  insightsTitle: string;
  insightsDescription: string;
  insightsCta: string;
  contactTitle: string;
  contactDescription: string;
  locationText: string;
  navLabel: string;
  form: HomeRelaunchFormLabels;
};

const homeRelaunchByLocale: Record<Locale, HomeRelaunchCopy> = {
  de: {
    badge: 'Senior Web Engineer · Remote-first',
    availabilityPill: 'Verfügbar · Q2 2026',
    title: 'Technical Delivery ohne Blindflug — Websysteme, die stabil laufen und klar konvertieren.',
    description:
      'Du brauchst kein Versprechen, sondern einen Engineer, der liefert: klare Architektur, QA-Gates vor jedem Release, dokumentierte Übergabe. Ich baue conversion-kritische B2B-Websysteme — von Scope über Build bis zu messbarem Ergebnis.',
    primaryCta: 'Scope-Call starten',
    secondaryCta: 'Interview / Hiring',
    tertiaryCta: 'Live-Case ansehen',
    trustInline: 'Verfügbar · Remote-first · Mannheim',
    heroPills: ['Live-Cases mit nachvollziehbarem Proof', 'QA-Gates vor jedem Release', 'Antwort < 24h werktags'],
    heroSnapshotLabel: 'Delivery Snapshot',
    heroSnapshotStatus: 'live',
    heroMetrics: [
      { value: '3', label: 'Live-Systeme im Betrieb' },
      { value: '95+', label: 'Lighthouse-Score (Ziel)' },
      { value: '< 24h', label: 'Antwortzeit werktags' }
    ],
    heroSnapshotFoot: ['✓ QA-Gates vor jedem Release', '✦ Dokumentierte Übergabe ans Team'],
    sectionProofEyebrow: 'Nachweis',
    sectionProjectsEyebrow: 'Portfolio',
    sectionInsightsEyebrow: 'Engineering',
    sectionContactEyebrow: 'Kontakt',
    proofTitle: 'Beweis — keine Marketingversprechen',
    proofDescription:
      'Drei Live-Cases mit verifiziertem Output: 3D-Konfigurator im WooCommerce-Produktivbetrieb, Voicebot-Orchestrator in privater Beta und ein Data-Product für NBA-Analytics. Jeder Case mit Trade-off-Dokumentation.',
    proofPoints: [
      '3D-Konfigurator: Upload → WebGL-Preview → WooCommerce-Checkout im Live-Betrieb',
      'Reproduzierbare QA-Gates und dokumentierte Team-Übergaben',
      'Architekturentscheidungen mit nachvollziehbaren Trade-offs'
    ],
    featuredProjectsTitle: 'Ausgewählte Projekte',
    featuredProjectsDescription: 'Reale Builds aus Professional- und Maker-Track — mit technischem Kontext und Betriebsstatus.',
    midPageCtaText: 'Aktuell verfügbar für neue Projekte und Hiring-Gespräche. Antwort werktags innerhalb von 24h.',
    midPageCtaLink: 'Direkt einsteigen',
    insightsTitle: 'Engineering Insights',
    insightsDescription: 'Praxisnahe Deep Dives zu Architektur-, Performance- und Delivery-Entscheidungen.',
    insightsCta: 'Alle Insights',
    contactTitle: 'Direkt einsteigen — kein Sales-Prozess',
    contactDescription:
      '2–3 Sätze zu Ziel, Engpass und Zeitrahmen reichen für einen konkreten Start. Für Hiring: kurzer Kontext zur Rolle. Für Projekte: Stack und Scope.',
    locationText: 'Mannheim · Remote-first',
    navLabel: 'Hauptnavigation',
    form: {
      formName: 'Name',
      formEmail: 'Business-E-Mail',
      formCompany: 'Firma (optional)',
      formMessage: 'Ziel, Engpass und Zeitrahmen in 2–3 Sätzen',
      formButton: 'Anfrage senden',
      submitting: 'Wird gesendet...',
      success: 'Danke — Deine Anfrage ist eingegangen. Ich melde mich werktags innerhalb von 24h.',
      error: 'Senden fehlgeschlagen. Bitte erneut versuchen oder direkt per Mail.',
      rateLimited: 'Zu viele Anfragen in kurzer Zeit. Bitte kurz warten und erneut versuchen.',
      verificationRequired: 'Bitte Sicherheitsprüfung abschließen und erneut senden.',
      privacy: 'Mit dem Absenden stimmst du der Verarbeitung deiner Anfrage zur Kontaktaufnahme zu.',
      schedulerCta: '15-Min Intro-Call buchen',
      schedulerHint: 'Direkt Termin — kein Vorgespräch nötig'
    }
  },
  en: {
    badge: 'Senior Web Engineer · Remote-first',
    availabilityPill: 'Available · Q2 2026',
    title: 'Technical delivery without guesswork — web systems that run reliably and convert clearly.',
    description:
      'You need delivery, not promises: clean architecture, QA gates before every release, documented team handover. I build conversion-critical B2B web systems — from scope through build to measurable outcome.',
    primaryCta: 'Start a scope call',
    secondaryCta: 'Interview / Hiring',
    tertiaryCta: 'View live case',
    trustInline: 'Available · Remote-first · Mannheim',
    heroPills: ['Live cases with verifiable proof', 'QA gates before every release', 'Response < 24h on business days'],
    heroSnapshotLabel: 'Delivery snapshot',
    heroSnapshotStatus: 'live',
    heroMetrics: [
      { value: '3', label: 'Live systems in production' },
      { value: '95+', label: 'Lighthouse score (target)' },
      { value: '< 24h', label: 'Response time (business days)' }
    ],
    heroSnapshotFoot: ['✓ QA gates before every release', '✦ Documented team handover'],
    sectionProofEyebrow: 'Evidence',
    sectionProjectsEyebrow: 'Portfolio',
    sectionInsightsEyebrow: 'Engineering',
    sectionContactEyebrow: 'Contact',
    proofTitle: 'Evidence — not marketing copy',
    proofDescription:
      'Three live cases with verified output: 3D configurator in WooCommerce production, voicebot orchestrator in private beta, and a data product for NBA analytics. Each case with trade-off documentation.',
    proofPoints: [
      '3D configurator: upload → WebGL preview → WooCommerce checkout in live production',
      'Repeatable QA gates and documented team handovers',
      'Architecture decisions with explicit, revisitable trade-offs'
    ],
    featuredProjectsTitle: 'Featured projects',
    featuredProjectsDescription: 'Real builds from professional and maker tracks — with technical context and production status.',
    midPageCtaText: 'Currently available for new projects and hiring conversations. Response within 24h on business days.',
    midPageCtaLink: 'Get in touch',
    insightsTitle: 'Engineering insights',
    insightsDescription: 'Practical deep dives on architecture, performance, and delivery decisions.',
    insightsCta: 'All insights',
    contactTitle: 'Start directly — no sales process',
    contactDescription:
      '2–3 sentences about goal, bottleneck, and timeline are enough to get started. For hiring: short role context. For projects: stack and scope.',
    locationText: 'Mannheim · Remote-first',
    navLabel: 'Primary navigation',
    form: {
      formName: 'Name',
      formEmail: 'Business email',
      formCompany: 'Company (optional)',
      formMessage: 'Goal, bottleneck, and timeline in 2–3 sentences',
      formButton: 'Send request',
      submitting: 'Sending...',
      success: 'Thank you — your request is received. I will respond on the next business day.',
      error: 'Submission failed. Please retry or reach out directly by email.',
      rateLimited: 'Too many requests in a short time. Please wait and try again.',
      verificationRequired: 'Please complete the security check and resubmit.',
      privacy: 'By submitting, you agree that your request data is processed for contact purposes.',
      schedulerCta: 'Book 15-min intro call',
      schedulerHint: 'Direct calendar booking — no pre-call needed'
    }
  }
};

export function getHomeRelaunchCopy(locale: Locale): HomeRelaunchCopy {
  return homeRelaunchByLocale[locale];
}
