'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/content/copy';

const ContactForm = dynamic(() => import('@/components/ContactForm').then((m) => m.ContactForm), {
  ssr: false,
  loading: () => <div className="contact-form-card" aria-busy="true" />
});

type ContactFormCopy = (typeof import('@/content/copy').copy)[Locale]['contact_form'];

type Props = {
  locale: Locale;
  text: ContactFormCopy;
  trackingSource: string;
};

export function HomeContactFormClient({ locale, text, trackingSource }: Props) {
  const [shouldMountContactForm, setShouldMountContactForm] = useState(false);
  const contactSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (shouldMountContactForm) return;

    const sectionEl = contactSectionRef.current;
    if (!sectionEl || typeof IntersectionObserver === 'undefined') {
      const timeoutId = window.setTimeout(() => setShouldMountContactForm(true), 0);
      return () => window.clearTimeout(timeoutId);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setShouldMountContactForm(true);
        observer.disconnect();
      },
      { rootMargin: '420px 0px' }
    );

    observer.observe(sectionEl);
    return () => observer.disconnect();
  }, [shouldMountContactForm]);

  return (
    <div ref={contactSectionRef} className="contact-form-shell">
      {shouldMountContactForm ? <ContactForm locale={locale} text={text} trackingSource={trackingSource} /> : <div className="contact-form-card" aria-busy="true" />}
    </div>
  );
}
