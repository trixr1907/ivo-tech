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
      de: 'Der Proof-Block zeigt nur verifizierbare Referenzen. Kundenstimmen werden erst nach expliziter Freigabe veroeffentlicht.',
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
      de: 'pending',
      en: 'pending'
    },
    author: 'pending',
    role: 'pending',
    company: 'pending',
    approved: false,
    published: false
  },
  {
    id: 'client-quote-02',
    kind: 'client',
    quote: {
      de: 'pending',
      en: 'pending'
    },
    author: 'pending',
    role: 'pending',
    company: 'pending',
    approved: false,
    published: false
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
