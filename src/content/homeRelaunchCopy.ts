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
  /** Gruppen-Überschriften (H2) für konsolidierte Sektionen */
  sectionGroupOffer: string;
  sectionGroupWork: string;
  sectionGroupDelivery: string;
  caseFollowUpCta: string;
  leadMagnetTitle: string;
  leadMagnetDescription: string;
  leadMagnetSubmit: string;
  leadMagnetDownloadHint: string;
  trustComplianceTitle: string;
  trustComplianceLines: string[];
  seoLocalTitle: string;
  seoLocalBody: string;
  headerBookingLabel: string;
  headerContactShortLabel: string;
  form: HomeRelaunchFormLabels;
};

const homeRelaunchByLocale: Record<Locale, HomeRelaunchCopy> = {
  de: {
    badge: 'Senior Web Engineer · Remote-first',
    availabilityPill: 'Verfügbar · Q2 2026',
    title: 'Dein B2B-System läuft — aber hält es auch unter echtem Druck stand?',
    description:
      'Du brauchst kein Tech-Theater, sondern klare Lieferung: Architektur, die wartbar bleibt, QA-Gates vor jedem Release, Übergaben, die dein Team wirklich nutzen kann. Ich baue Websysteme, die funktionieren, wenn es wirklich drauf ankommt — von Scope bis messbarem Ergebnis.',
    primaryCta: 'Jetzt Beratungsgespräch buchen',
    secondaryCta: 'Kontaktformular',
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
    sectionGroupOffer: 'Angebot & Nachweis',
    sectionGroupWork: 'Portfolio & Insights',
    sectionGroupDelivery: 'Ablauf, Stimmen & Qualität',
    caseFollowUpCta: 'Soll ich das auch für dein B2B-System umsetzen?',
    leadMagnetTitle: 'Web Engineering Checkliste für B2B-Launches',
    leadMagnetDescription:
      'Kurz-Checkliste als Datei mit den wichtigsten Gates vor Go-live (Performance, Tracking, Rechtliches, Übergabe). Kostenlos per E-Mail — ein Klick, kein Newsletter-Zwang.',
    leadMagnetSubmit: 'Checkliste anfordern',
    leadMagnetDownloadHint: 'Nach Bestätigung der E-Mail erhältst du den Download-Link.',
    trustComplianceTitle: 'Sicherheit & Compliance',
    trustComplianceLines: [
      'DSGVO-konforme Verarbeitung von Anfragen (Einwilligung im Formular)',
      'Kein Tracking ohne Einwilligung; technische Logs nur wo nötig',
      'OWASP-orientierte Web-App-Praxis, reproduzierbare QA-Gates vor Deploys'
    ],
    seoLocalTitle: 'Remote · Rhein-Neckar · Frankfurt-Europe',
    seoLocalBody:
      'Als Freelance Web Engineer mit Basis Mannheim/Remote unterstütze ich Teams deutschlandweit und in Europa — u. a. für anspruchsvolle B2B-Websysteme, Architektur und Launch-Readiness. Suchbegriffe wie „Freelance Web Engineer Frankfurt“ oder „B2B Website Architekt“ treffen inhaltlich genau den Fokus: belastbare Umsetzung statt Folien.',
    headerBookingLabel: 'Beratungsgespräch buchen',
    headerContactShortLabel: 'Kontakt',
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
    title: 'Your B2B system runs — but will it hold up under real pressure?',
    description:
      'You need delivery, not theater: architecture that stays maintainable, QA gates before every release, handovers your team can actually use. I build web systems that work when it matters — from scope through measurable outcomes.',
    primaryCta: 'Book a consultation call',
    secondaryCta: 'Contact form',
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
    sectionGroupOffer: 'Offer & proof',
    sectionGroupWork: 'Portfolio & insights',
    sectionGroupDelivery: 'Process, voices & quality',
    caseFollowUpCta: 'Want me to implement this for your B2B system too?',
    leadMagnetTitle: 'Web engineering checklist for B2B launches',
    leadMagnetDescription:
      'A short checklist file with the key gates before go-live (performance, tracking, legal basics, handover). Free by email — one click, no newsletter lock-in.',
    leadMagnetSubmit: 'Request checklist',
    leadMagnetDownloadHint: 'After you confirm your email, you will receive the download link.',
    trustComplianceTitle: 'Security & compliance',
    trustComplianceLines: [
      'GDPR-aligned request handling (consent captured in the form)',
      'No tracking without consent; technical logs only where needed',
      'OWASP-oriented delivery practice with repeatable QA gates before deploys'
    ],
    seoLocalTitle: 'Remote · Germany · EU-friendly',
    seoLocalBody:
      'As a freelance web engineer based in Mannheim (remote-first), I support teams across Germany and Europe on demanding B2B web systems, architecture, and launch readiness. If you searched for something like “freelance web engineer Frankfurt” or “B2B website architect”, the focus is the same: durable delivery, not slides.',
    headerBookingLabel: 'Book a call',
    headerContactShortLabel: 'Contact',
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
