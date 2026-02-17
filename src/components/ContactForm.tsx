import { useState, type FormEvent } from 'react';
import Script from 'next/script';

import type { Locale } from '@/content/copy';
import { trackEvent } from '@/lib/analytics';

type ContactIntent = 'hiring' | 'client';

type ContactFormText = {
  intentLegend: string;
  intentOptions: Record<ContactIntent, string>;
  nameLabel: string;
  emailLabel: string;
  companyLabel: string;
  messageLabel: string;
  submit: string;
  submitting: string;
  success: string;
  reset: string;
  error: string;
  rateLimited: string;
  verificationRequired: string;
  privacy: string;
  honeypotLabel: string;
};

type Props = {
  locale: Locale;
  text: ContactFormText;
};

type FormState = {
  intent: ContactIntent;
  name: string;
  email: string;
  company: string;
  message: string;
  website: string;
};

const initialFormState: FormState = {
  intent: 'hiring',
  name: '',
  email: '',
  company: '',
  message: '',
  website: ''
};

export function ContactForm({ locale, text }: Props) {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const hasTurnstile = Boolean(turnstileSiteKey);

  const isSubmitting = status === 'submitting';

  const onFieldChange = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status === 'error') {
      setStatus('idle');
      setFeedback('');
    }
  };

  const resetForm = () => {
    setForm(initialFormState);
    setStatus('idle');
    setFeedback('');
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setStatus('submitting');
    setFeedback('');

    const turnstileToken = hasTurnstile
      ? event.currentTarget.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]')?.value?.trim() ?? ''
      : undefined;

    if (hasTurnstile && !turnstileToken) {
      setStatus('error');
      setFeedback(text.verificationRequired);
      trackEvent('contact_form_error', {
        intent: form.intent,
        locale,
        sourcePath:
          typeof window === 'undefined'
            ? '/'
            : `${window.location.pathname}${window.location.search}${window.location.hash}`,
        errorCode: 'verification_missing'
      });
      return;
    }

    const sourcePath =
      typeof window === 'undefined'
        ? '/'
        : `${window.location.pathname}${window.location.search}${window.location.hash}`;

    trackEvent('contact_form_submit', { intent: form.intent, locale, sourcePath });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...form,
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
      setFeedback(text.success);
      trackEvent('contact_form_success', { intent: form.intent, locale, sourcePath });
      setForm(initialFormState);
    } catch (error) {
      const errorCode = error instanceof Error ? error.message : 'request_failed';
      const message =
        errorCode === 'rate_limited'
          ? text.rateLimited
          : errorCode === 'verification_failed'
            ? text.verificationRequired
            : text.error;

      setStatus('error');
      setFeedback(message);
      trackEvent('contact_form_error', { intent: form.intent, locale, sourcePath, errorCode });
    }
  };

  return (
    <div className="contact-form-card">
      {hasTurnstile ? (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      ) : null}

      <form className="contact-form" onSubmit={onSubmit}>
        <fieldset className="intent-switch">
          <legend>{text.intentLegend}</legend>
          <div className="intent-grid">
            {(['hiring', 'client'] as ContactIntent[]).map((intent) => {
              const selected = form.intent === intent;
              return (
                <label key={intent} className={`intent-pill ${selected ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="intent"
                    value={intent}
                    checked={selected}
                    onChange={(e) => onFieldChange('intent', e.target.value as ContactIntent)}
                  />
                  <span>{text.intentOptions[intent]}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="contact-fields">
          <label className="field">
            <span>{text.nameLabel}</span>
            <input
              autoComplete="name"
              name="name"
              required
              maxLength={80}
              minLength={2}
              value={form.name}
              onChange={(e) => onFieldChange('name', e.target.value)}
            />
          </label>

          <label className="field">
            <span>{text.emailLabel}</span>
            <input
              autoComplete="email"
              name="email"
              type="email"
              required
              maxLength={160}
              value={form.email}
              onChange={(e) => onFieldChange('email', e.target.value)}
            />
          </label>

          <label className="field">
            <span>{text.companyLabel}</span>
            <input
              autoComplete="organization"
              name="company"
              maxLength={120}
              value={form.company}
              onChange={(e) => onFieldChange('company', e.target.value)}
            />
          </label>

          <label className="field">
            <span>{text.messageLabel}</span>
            <textarea
              name="message"
              rows={5}
              required
              minLength={10}
              maxLength={2000}
              value={form.message}
              onChange={(e) => onFieldChange('message', e.target.value)}
            />
          </label>

          <label className="field hp-field" aria-hidden="true">
            <span>{text.honeypotLabel}</span>
            <input
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => onFieldChange('website', e.target.value)}
            />
          </label>
        </div>

        <p className="form-note">{text.privacy}</p>

        {hasTurnstile ? (
          <div className="turnstile-wrap">
            <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-theme="dark" data-language={locale} />
          </div>
        ) : null}

        <div className="contact-submit-row">
          <button className="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? text.submitting : text.submit}
          </button>
          {status === 'success' ? (
            <button className="ghost" type="button" onClick={resetForm}>
              {text.reset}
            </button>
          ) : null}
        </div>

        {feedback ? (
          <p className={`form-feedback ${status}`} role="status">
            {feedback}
          </p>
        ) : null}
      </form>
    </div>
  );
}
