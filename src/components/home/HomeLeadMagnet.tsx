'use client';

import { type FormEvent, useEffect, useRef, useState } from 'react';
import { ArrowRight, Download } from 'lucide-react';

import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { trackEvent } from '@/lib/analytics';
import { normalizeAttributionSource } from '@/lib/attribution';
import { cn } from '@/lib/cn';

type Locale = 'de' | 'en';

type HomeLeadMagnetProps = {
  locale: Locale;
  title: string;
  description: string;
  submitLabel: string;
  hint: string;
  downloadPath: string;
  heroVariantDefault?: string;
};

export function HomeLeadMagnet({
  locale,
  title,
  description,
  submitLabel,
  hint,
  downloadPath,
  heroVariantDefault = 'default'
}: HomeLeadMagnetProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');
  const [attributionSource, setAttributionSource] = useState('home');
  const [heroVariant, setHeroVariant] = useState('default');
  const feedbackId = 'lead-magnet-feedback';
  const gdprRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    setAttributionSource(normalizeAttributionSource(params.get('source'), 'home'));
    const v = normalizeAttributionSource(params.get('exp_hero'), '');
    setHeroVariant(v || normalizeAttributionSource(heroVariantDefault, 'default'));
  }, [heroVariantDefault]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'submitting') return;

    const consentError =
      locale === 'de'
        ? 'Bitte stimme der Verarbeitung zu, damit wir die Checkliste zusenden können.'
        : 'Please consent to processing so we can send the checklist.';

    if (!gdprConsent) {
      setStatus('error');
      setFeedback(consentError);
      requestAnimationFrame(() => gdprRef.current?.focus());
      return;
    }

    const message =
      locale === 'de'
        ? `[Lead Magnet] Bitte die „Web Engineering Checkliste für B2B-Launches“ an die angegebene E-Mail senden. Download: ${downloadPath}`
        : `[Lead Magnet] Please send the “Web engineering checklist for B2B launches” to the email below. Download: ${downloadPath}`;

    const sourcePath =
      typeof window === 'undefined' ? '/' : `${window.location.pathname}${window.location.search}${window.location.hash}`;

    setStatus('submitting');
    setFeedback('');

    trackEvent('lead_magnet_submit', {
      locale,
      source: `${attributionSource}_lead_magnet`,
      attributionSource,
      heroVariant,
      sourcePath
    });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || (locale === 'de' ? 'Checkliste' : 'Checklist'),
          email: email.trim(),
          company: '',
          portfolio_reference: '',
          message,
          intent: 'client',
          intent_detail: 'project',
          timeline_band: '30d',
          project_scope: 'audit',
          gdpr_consent: true,
          locale,
          sourcePath,
          website: '',
          turnstileToken: ''
        })
      });

      const payload = (await response.json()) as { ok: boolean; errorCode?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.errorCode ?? 'request_failed');
      }

      setStatus('success');
      setFeedback(
        locale === 'de'
          ? 'Danke — die Anfrage ist unterwegs. Du kannst die Checkliste auch sofort herunterladen (Link unten).'
          : 'Thank you — your request is on the way. You can also download the checklist right away (link below).'
      );
      trackEvent('lead_magnet_success', { locale, attributionSource, heroVariant, sourcePath });
      setEmail('');
      setName('');
      setGdprConsent(false);
    } catch {
      setStatus('error');
      setFeedback(
        locale === 'de'
          ? 'Senden fehlgeschlagen. Bitte Kontaktformular nutzen oder direkt per Mail.'
          : 'Submission failed. Please use the contact form or email directly.'
      );
    }
  }

  return (
    <div
      className="rounded-2xl border border-violet-500/25 bg-gradient-to-br from-slate-950/80 via-slate-900/70 to-violet-950/20 p-5 shadow-[0_20px_48px_rgba(15,23,42,0.45)] md:p-6"
      aria-labelledby="lead-magnet-title"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xl">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-violet-300/95">B2B · Lead</p>
          <h3 id="lead-magnet-title" className="mt-1 font-display text-lg font-semibold text-white md:text-xl">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
        </div>
        <a
          href={downloadPath}
          download
          className={cn(
            'inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-violet-400/40 bg-violet-500/10 px-4 py-3 text-sm font-semibold text-violet-100 transition hover:border-violet-300/60 hover:bg-violet-500/15'
          )}
          onClick={() =>
            trackEvent('lead_magnet_direct_download', {
              locale,
              path: downloadPath,
              attributionSource,
              heroVariant
            })
          }
        >
          <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
          {locale === 'de' ? '.txt herunterladen' : 'Download .txt'}
        </a>
      </div>

      <form className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]" onSubmit={onSubmit} noValidate>
        <label className="space-y-1.5 text-sm font-medium text-slate-100">
          <span className="text-slate-400">{locale === 'de' ? 'Name (optional)' : 'Name (optional)'}</span>
          <Input
            name="lead-magnet-name"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            maxLength={80}
            className="min-h-12 border-slate-500/85 bg-slate-900/88 text-slate-50"
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-100">
          <span>{locale === 'de' ? 'Business-E-Mail' : 'Business email'}</span>
          <Input
            type="email"
            name="lead-magnet-email"
            required
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            maxLength={160}
            autoComplete="email"
            className="min-h-12 border-slate-500/85 bg-slate-900/88 text-slate-50"
          />
        </label>
        <div className="flex flex-col justify-end gap-2 md:col-span-1">
          <label className="flex items-start gap-2 text-xs text-slate-400">
            <input
              ref={gdprRef}
              type="checkbox"
              checked={gdprConsent}
              onChange={(ev) => setGdprConsent(ev.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-500 bg-slate-900 accent-violet-500"
            />
            <span>
              {locale === 'de'
                ? 'Ich will die Checkliste per E-Mail und stimme der Verarbeitung meiner Daten für den Versand zu.'
                : 'I want the checklist by email and consent to processing for delivery.'}
            </span>
          </label>
          <Button
            type="submit"
            disabled={status === 'submitting'}
            className="min-h-12 w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500 md:w-auto"
          >
            {status === 'submitting' ? (locale === 'de' ? 'Wird gesendet…' : 'Sending…') : submitLabel}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </form>
      <p id={feedbackId} className="mt-3 text-sm text-slate-400" role="status">
        {feedback}
      </p>
      <p className="mt-2 text-xs text-slate-500">{hint}</p>
    </div>
  );
}
