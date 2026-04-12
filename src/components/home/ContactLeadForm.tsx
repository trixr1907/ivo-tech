'use client';

import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Textarea } from '@/components/shadcn/textarea';
import { trackEvent } from '@/lib/analytics';
import { normalizeAttributionSource } from '@/lib/attribution';
import { cn } from '@/lib/cn';
import { getSchedulerHref } from '@/lib/scheduler';

type Locale = 'de' | 'en';

type ContactLeadFormLabels = {
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

type ContactLeadFormProps = {
  locale: Locale;
  heroVariantDefault?: string;
  labels: ContactLeadFormLabels;
  compact?: boolean;
  /** Dunkles Glaspanel für Relaunch-Shell (Startseite). */
  surface?: 'default' | 'relaunchDark';
};

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export function ContactLeadForm({
  locale,
  heroVariantDefault = 'default',
  labels,
  compact = false,
  surface = 'default'
}: ContactLeadFormProps) {
  const isDarkShell = surface === 'relaunchDark';
  const router = useRouter();
  const [intent, setIntent] = useState<'client' | 'hiring'>('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [portfolioReference, setPortfolioReference] = useState('');
  const [message, setMessage] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [status, setStatus] = useState<SubmitState>('idle');
  const [feedback, setFeedback] = useState('');
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const hasTurnstile = Boolean(turnstileSiteKey);
  const feedbackId = 'lead-feedback';
  const isSubmitting = status === 'submitting';
  const [attributionSource, setAttributionSource] = useState('home');
  const [heroVariant, setHeroVariant] = useState('default');
  const [schedulerHref, setSchedulerHref] = useState(() =>
    getSchedulerHref({ locale, source: 'home', placement: 'contact-form', heroVariant: 'default' })
  );
  const [didTrackFormStart, setDidTrackFormStart] = useState(false);
  const [gdprConsentInvalid, setGdprConsentInvalid] = useState(false);
  const [turnstileFieldInvalid, setTurnstileFieldInvalid] = useState(false);
  const gdprCheckboxRef = useRef<HTMLInputElement>(null);
  const turnstileAnchorRef = useRef<HTMLDivElement>(null);
  const isHiringIntent = intent === 'hiring';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const source = normalizeAttributionSource(params.get('source'), 'home');
    const queryVariant = normalizeAttributionSource(params.get('exp_hero'), '');
    const variant = queryVariant || normalizeAttributionSource(heroVariantDefault, 'default');
    setAttributionSource(source);
    setHeroVariant(variant);
    setSchedulerHref(getSchedulerHref({ locale, source, placement: 'contact-form', heroVariant: variant }));
  }, [heroVariantDefault, locale]);

  useEffect(() => {
    if (intent === 'hiring' && company) {
      setCompany('');
    }
  }, [company, intent]);

  function handleFormStart() {
    if (didTrackFormStart) return;
    const sourcePath = typeof window === 'undefined' ? '/' : `${window.location.pathname}${window.location.search}${window.location.hash}`;
    trackEvent('contact_form_start', {
      source: `${attributionSource}_cta`,
      locale,
      sourcePath,
      attributionSource,
      heroVariant,
      intent
    });
    setDidTrackFormStart(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const sourcePath = typeof window === 'undefined' ? '/' : `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const turnstileToken = hasTurnstile
      ? form.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]')?.value?.trim() ?? ''
      : '';
    const consentErrorText =
      locale === 'de'
        ? 'Bitte stimme der Verarbeitung deiner Anfrage zu, damit wir antworten koennen.'
        : 'Please consent to processing your request so we can respond.';

    if (!gdprConsent) {
      setGdprConsentInvalid(true);
      setTurnstileFieldInvalid(false);
      setStatus('error');
      setFeedback(consentErrorText);
      requestAnimationFrame(() => gdprCheckboxRef.current?.focus());
      trackEvent('contact_form_error', {
        source: `${attributionSource}_cta`,
        locale,
        sourcePath,
        attributionSource,
        heroVariant,
        errorCode: 'gdpr_consent_missing',
        intent
      });
      return;
    }

    if (hasTurnstile && !turnstileToken) {
      setTurnstileFieldInvalid(true);
      setGdprConsentInvalid(false);
      setStatus('error');
      setFeedback(labels.verificationRequired);
      requestAnimationFrame(() => {
        const host = turnstileAnchorRef.current;
        if (!host) return;
        host.focus();
        const iframe = host.querySelector<HTMLIFrameElement>('iframe');
        iframe?.focus();
      });
      trackEvent('contact_form_error', {
        source: `${attributionSource}_cta`,
        locale,
        sourcePath,
        attributionSource,
        heroVariant,
        intent,
        errorCode: 'verification_missing'
      });
      return;
    }

    setStatus('submitting');
    setFeedback('');
    setGdprConsentInvalid(false);
    setTurnstileFieldInvalid(false);

    trackEvent('contact_form_submit', {
      source: `${attributionSource}_cta`,
      locale,
      sourcePath,
      attributionSource,
      heroVariant,
      intent
    });
    trackEvent('contact_submit', {
      source: `${attributionSource}_cta`,
      locale,
      sourcePath,
      attributionSource,
      heroVariant,
      intent
    });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company,
          portfolio_reference: portfolioReference,
          message,
          intent,
          intent_detail: intent === 'hiring' ? 'hiring' : 'project',
          timeline_band: '30d',
          project_scope: 'build',
          gdpr_consent: gdprConsent,
          website: '',
          locale,
          sourcePath,
          turnstileToken
        })
      });

      const payload = (await response.json()) as { ok: boolean; errorCode?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.errorCode ?? 'request_failed');
      }

      setStatus('success');
      setFeedback(labels.success);
      setName('');
      setEmail('');
      setCompany('');
      setPortfolioReference('');
      setMessage('');
      setGdprConsent(false);
      form.reset();
      trackEvent('contact_form_submit_success', {
        source: `${attributionSource}_cta`,
        locale,
        sourcePath,
        attributionSource,
        heroVariant,
        intent
      });
      trackEvent('cta_contact_click', {
        source: `${attributionSource}_contact_success`,
        locale,
        sourcePath,
        attributionSource,
        heroVariant,
        intent
      });
      const destinationBase = locale === 'de' ? '/thanks' : '/en/thanks';
      const destination = `${destinationBase}?source=${encodeURIComponent(attributionSource)}&exp_hero=${encodeURIComponent(heroVariant)}`;
      router.push(destination);
    } catch (error) {
      const errorCode = error instanceof Error ? error.message : 'request_failed';
      const nextFeedback =
        errorCode === 'rate_limited'
          ? labels.rateLimited
          : errorCode === 'verification_failed'
            ? labels.verificationRequired
            : labels.error;

      setGdprConsentInvalid(false);
      setTurnstileFieldInvalid(false);
      setStatus('error');
      setFeedback(nextFeedback);
      trackEvent('contact_form_error', {
        source: `${attributionSource}_cta`,
        locale,
        sourcePath,
        attributionSource,
        heroVariant,
        errorCode,
        intent
      });
    }
  }

  function handleSchedulerClick() {
    const sourcePath = typeof window === 'undefined' ? '/' : `${window.location.pathname}${window.location.search}${window.location.hash}`;
    trackEvent('scheduler_cta_click', {
      source: `${attributionSource}_contact_scheduler`,
      locale,
      sourcePath,
      attributionSource,
      heroVariant,
      href: schedulerHref,
      placement: 'contact-form'
    });
    trackEvent('scheduler_click', {
      source: `${attributionSource}_contact_scheduler`,
      locale,
      sourcePath,
      attributionSource,
      heroVariant,
      href: schedulerHref,
      placement: 'contact-form'
    });
  }

  const showErrorAnnouncement = status === 'error' && Boolean(feedback);
  const gdprDescribedBy = gdprConsentInvalid && feedback ? feedbackId : undefined;

  return (
    <>
      {hasTurnstile ? (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
      ) : null}
      {/*
        noValidate: GDPR/Turnstile werden vor dem Request geprüft; sichtbare Fehlermeldung + Fokus statt natives Submit-Blocking.
        Pflichtfelder laufen weiter über form.reportValidity() im Submit-Handler.
      */}
      <form
        className={cn(
          'relative grid gap-4 rounded-2xl p-4 md:grid-cols-2 md:p-5',
          isDarkShell
            ? 'border border-slate-600/90 bg-slate-950/62 shadow-[0_24px_56px_rgba(0,0,0,0.45)] ring-1 ring-slate-600/45 backdrop-blur-md'
            : 'border border-brand-200/70 bg-[linear-gradient(160deg,rgba(255,255,255,0.95),rgba(233,245,255,0.9))] shadow-[0_20px_38px_rgba(27,100,196,0.12)]',
          compact ? 'mt-2' : 'mt-8'
        )}
        onSubmit={handleSubmit}
        onFocusCapture={handleFormStart}
        noValidate
      >
        <label
          className={cn('space-y-2 text-sm font-medium', isDarkShell ? 'text-slate-100' : 'text-ink-700')}
        >
          <span>{locale === 'de' ? 'Intent' : 'Intent'}</span>
          <select
            name="intent"
            value={intent}
            onChange={(event) => setIntent(event.target.value as 'client' | 'hiring')}
            className={cn(
              'flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              isDarkShell
                ? 'border-slate-500/85 bg-slate-900/90 text-slate-50 ring-offset-slate-950 focus-visible:ring-sky-500/60 focus-visible:ring-offset-slate-950'
                : 'border-input bg-background text-ink-900 ring-offset-background focus-visible:ring-ring'
            )}
            aria-describedby={feedback ? feedbackId : undefined}
          >
            <option value="client">{locale === 'de' ? 'Projekt / Zusammenarbeit' : 'Project / collaboration'}</option>
            <option value="hiring">{locale === 'de' ? 'Hiring / Rolle' : 'Hiring / role'}</option>
          </select>
        </label>
        <label
          className={cn('space-y-2 text-sm font-medium', isDarkShell ? 'text-slate-100' : 'text-ink-700')}
        >
          <span>{labels.formName}</span>
          <Input
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-describedby={feedback ? feedbackId : undefined}
            className={
              isDarkShell
                ? 'border-slate-500/85 bg-slate-900/88 text-slate-50 shadow-none placeholder:text-slate-400 focus-visible:border-sky-400 focus-visible:ring-sky-500/50 focus-visible:shadow-[0_0_0_3px_rgba(14,165,233,0.22)]'
                : undefined
            }
          />
        </label>
        <label
          className={cn('space-y-2 text-sm font-medium', isDarkShell ? 'text-slate-100' : 'text-ink-700')}
        >
          <span>{labels.formEmail}</span>
          <Input
            type="email"
            name="email"
            autoComplete="email"
            required
            maxLength={160}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-describedby={feedback ? feedbackId : undefined}
            className={
              isDarkShell
                ? 'border-slate-500/85 bg-slate-900/88 text-slate-50 shadow-none placeholder:text-slate-400 focus-visible:border-sky-400 focus-visible:ring-sky-500/50 focus-visible:shadow-[0_0_0_3px_rgba(14,165,233,0.22)]'
                : undefined
            }
          />
        </label>
        {!isHiringIntent ? (
          <label
            className={cn('space-y-2 text-sm font-medium', isDarkShell ? 'text-slate-100' : 'text-ink-700')}
          >
            <span>{labels.formCompany}</span>
            <Input
              name="company"
              autoComplete="organization"
              maxLength={120}
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              aria-describedby={feedback ? feedbackId : undefined}
              className={
                isDarkShell
                  ? 'border-slate-500/85 bg-slate-900/88 text-slate-50 shadow-none placeholder:text-slate-400 focus-visible:border-sky-400 focus-visible:ring-sky-500/50 focus-visible:shadow-[0_0_0_3px_rgba(14,165,233,0.22)]'
                  : undefined
              }
            />
          </label>
        ) : null}
        <label
          className={cn('space-y-2 text-sm font-medium', isDarkShell ? 'text-slate-100' : 'text-ink-700')}
        >
          <span>
            {isHiringIntent
              ? locale === 'de'
                ? 'LinkedIn/CV Link (optional)'
                : 'LinkedIn/CV link (optional)'
              : locale === 'de'
                ? 'Portfolio/Hobby Referenz (optional)'
                : 'Portfolio/hobby reference (optional)'}
          </span>
          <Input
            name="portfolio-reference"
            maxLength={280}
            value={portfolioReference}
            onChange={(event) => setPortfolioReference(event.target.value)}
            aria-describedby={feedback ? feedbackId : undefined}
            className={
              isDarkShell
                ? 'border-slate-500/85 bg-slate-900/88 text-slate-50 shadow-none placeholder:text-slate-400 focus-visible:border-sky-400 focus-visible:ring-sky-500/50 focus-visible:shadow-[0_0_0_3px_rgba(14,165,233,0.22)]'
                : undefined
            }
          />
        </label>
        <label
          className={cn(
            'space-y-2 text-sm font-medium md:col-span-2',
            isDarkShell ? 'text-slate-100' : 'text-ink-700'
          )}
        >
          <span>{isHiringIntent ? (locale === 'de' ? 'Rolle, Team und Kontext' : 'Role, team, and context') : locale === 'de' ? 'Kontext' : 'Context'}</span>
          <Textarea
            name="message"
            required
            minLength={10}
            maxLength={2000}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            aria-describedby={feedback ? feedbackId : undefined}
            className={
              isDarkShell
                ? 'border-slate-500/85 bg-slate-900/88 text-slate-50 shadow-none placeholder:text-slate-400 focus-visible:border-sky-400 focus-visible:ring-sky-500/50 focus-visible:shadow-[0_0_0_3px_rgba(14,165,233,0.22)]'
                : undefined
            }
          />
        </label>
        <div className="hidden">
          <label htmlFor="lead-website" className="sr-only">
            Website
          </label>
          <input id="lead-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        {hasTurnstile ? (
          <div className="md:col-span-2">
            <div
              ref={turnstileAnchorRef}
              tabIndex={-1}
              className={cn(
                'min-h-[72px] rounded-md outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 focus-visible:ring-offset-2',
                isDarkShell ? 'focus-visible:ring-offset-slate-950' : 'focus-visible:ring-offset-background'
              )}
              aria-invalid={turnstileFieldInvalid}
              aria-describedby={turnstileFieldInvalid && feedback ? feedbackId : undefined}
            >
              <div
                className="cf-turnstile"
                data-sitekey={turnstileSiteKey}
                data-theme={isDarkShell ? 'dark' : 'light'}
                data-size="flexible"
              />
            </div>
          </div>
        ) : null}
        <div className="md:col-span-2">
          <label className={cn('mb-3 inline-flex items-start gap-2 text-xs', isDarkShell ? 'text-slate-300' : 'text-ink-600')}>
            <input
              ref={gdprCheckboxRef}
              id="lead-gdpr-consent"
              type="checkbox"
              name="gdpr-consent"
              checked={gdprConsent}
              onChange={(event) => {
                setGdprConsent(event.target.checked);
                if (event.target.checked) setGdprConsentInvalid(false);
              }}
              required
              aria-invalid={gdprConsentInvalid}
              aria-describedby={gdprDescribedBy}
              className={cn(
                'mt-0.5 h-4 w-4 rounded',
                isDarkShell ? 'border-slate-500 bg-slate-900 accent-sky-500' : 'border-slate-300'
              )}
            />
            <span>{labels.privacy}</span>
          </label>
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className={cn(
              'group motion-cta-lift bg-[linear-gradient(135deg,#113782_0%,#1f5dd3_58%,#2e80ff_100%)] shadow-[0_14px_30px_rgba(30,94,211,0.28)] hover:bg-[linear-gradient(135deg,#0d2c69_0%,#1a4eb9_58%,#296ee3_100%)]',
              isDarkShell && 'focus-visible:ring-offset-slate-950'
            )}
          >
            <span>{isSubmitting ? labels.submitting : labels.formButton}</span>
            <ArrowRight className="motion-arrow-nudge ml-2 h-4 w-4 transition-transform duration-200" aria-hidden="true" />
          </Button>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <a
              href={schedulerHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'group motion-cta-lift inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition duration-200 hover:-translate-y-0.5',
                isDarkShell
                  ? 'border-sky-500/45 bg-slate-900/70 text-sky-200 hover:border-sky-400/70 hover:bg-slate-800/85 hover:shadow-[0_10px_24px_rgba(14,165,233,0.18)]'
                  : 'border-cyan-300 bg-[linear-gradient(180deg,#ffffff_0%,#e8f8ff_100%)] text-cyan-900 hover:border-cyan-400 hover:shadow-[0_10px_20px_rgba(20,146,196,0.2)]'
              )}
              onClick={handleSchedulerClick}
              data-contact-cta="scheduler"
            >
              {labels.schedulerCta}
              <ArrowRight className="motion-arrow-nudge ml-1.5 h-3.5 w-3.5 transition-transform duration-200" aria-hidden="true" />
            </a>
            <span className={cn('text-xs', isDarkShell ? 'text-slate-400' : 'text-ink-500')}>{labels.schedulerHint}</span>
          </div>
          <p
            id={feedbackId}
            className={cn('mt-3 text-sm', isDarkShell ? 'text-slate-200' : 'text-ink-600')}
            role={showErrorAnnouncement ? 'alert' : 'status'}
            aria-live={showErrorAnnouncement ? 'assertive' : 'polite'}
          >
            {feedback}
          </p>
        </div>
      </form>
    </>
  );
}
