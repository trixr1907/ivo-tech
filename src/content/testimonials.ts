type Locale = 'de' | 'en';

export type TestimonialKind = 'client' | 'editorial';

type Testimonial = {
  id: string;
  kind: TestimonialKind;
  quote: Record<Locale, string>;
  author: string;
  role: string;
  company: string;
  sourceUrl?: string;
  approved: boolean;
  published: boolean;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'editorial-proof-note',
    kind: 'editorial',
    quote: {
      de: 'Der Proof-Block zeigt nur verifizierbare Referenzen. Kundenstimmen werden erst nach expliziter Freigabe veröffentlicht.',
      en: 'The proof block only shows verifiable references. Client testimonials are published only after explicit approval.'
    },
    author: 'ivo-tech',
    role: 'Editorial trust note',
    company: 'Operational policy',
    approved: true,
    published: true
  },
  {
    id: 'client-quote-01',
    kind: 'client',
    quote: {
      de: 'Der neue Konfigurator hat unser Angebot von manuellen Rückfragen auf einen geführten Upload-zu-Preis-Prozess gebracht. Das Team kann schneller und konsistenter reagieren.',
      en: 'The new configurator shifted our quoting flow from manual follow-up loops to a guided upload-to-price process. The team can respond faster and more consistently.'
    },
    author: 'Anonymisiert',
    role: 'Operations Lead',
    company: 'E-Commerce Manufacturing Partner',
    sourceUrl: '/case-studies/configurator-live',
    approved: true,
    published: true
  },
  {
    id: 'client-quote-02',
    kind: 'client',
    quote: {
      de: 'Der Relaunch hat uns nicht nur ein neues Design gegeben, sondern eine klare Entscheidungsstruktur für Hiring und Projektanfragen. Das macht Gespräche deutlich effizienter.',
      en: 'The relaunch gave us more than a new design. It established a clear decision structure for hiring and project inquiries, which makes conversations substantially more efficient.'
    },
    author: 'Anonymisiert',
    role: 'Commercial Director',
    company: 'B2B Services Company',
    sourceUrl: '/case-studies/portfolio-authority-relaunch',
    approved: true,
    published: true
  }
];

export type HomepageTestimonial = {
  id: string;
  kind: TestimonialKind;
  quote: string;
  attribution: string;
  sourceUrl?: string;
};

function formatAttribution(item: Testimonial) {
  return `${item.author} · ${item.role} · ${item.company}`;
}

function isPublished(item: Testimonial) {
  return item.published && item.approved;
}

export function getPublishedTestimonials(kind?: TestimonialKind) {
  return TESTIMONIALS.filter((item) => isPublished(item) && (!kind || item.kind === kind));
}

export function getPrimaryHomepageTestimonial(locale: Locale): HomepageTestimonial {
  const publishedClients = getPublishedTestimonials('client');
  const source =
    publishedClients[0] ??
    getPublishedTestimonials('editorial')[0] ??
    TESTIMONIALS[0];

  return {
    id: source.id,
    kind: source.kind,
    quote: source.quote[locale],
    attribution: formatAttribution(source),
    sourceUrl: source.sourceUrl
  };
}
