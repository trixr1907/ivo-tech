import { useId, useRef, useState, type FormEvent } from 'react';
import Script from 'next/script';

import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { InlineFeedback } from '@/components/ui/InlineFeedback';
import { Input, RadioGroup, Select, Textarea } from '@/components/ui/FieldControls';
import { Toast } from '@/components/ui/Toast';
import type { Locale } from '@/content/copy';
import { trackEvent } from '@/lib/analytics';

type ContactIntent = 'hiring' | 'client';
type ContactIntentDetail = 'hiring' | 'project' | 'collab';
type TimelineBand = 'asap' | '30d' | '90d+';
type ProjectScope = 'audit' | 'build' | 'optimize' | 'unknown';

type ContactFormText = {
  intentLegend: string;
  intentOptions: Record<ContactIntent, string>;
  advancedToggleLabel: string;
  advancedHint: string;
  intentDetailLabel: string;
  intentDetailOptions: Record<ContactIntentDetail, string>;
  timelineLabel: string;
  timelineOptions: Record<TimelineBand, string>;
  projectScopeLabel: string;
  projectScopeOptions: Record<ProjectScope, string>;
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
  trackingSource?: string;
};

type FormState = {
  intent: ContactIntent;
  intentDetail: ContactIntentDetail;
  timelineBand: TimelineBand;
  projectScope: ProjectScope;
  name: string;
  email: string;
  company: string;
  message: string;
  website: string;
};

type FieldValidationErrors = Partial<Record<'name' | 'email' | 'company' | 'message', string>>;

const initialFormState: FormState = {
  intent: 'hiring',
  intentDetail: 'hiring',
  timelineBand: '30d',
  projectScope: 'unknown',
  name: '',
  email: '',
  company: '',
  message: '',
  website: ''
};

export function ContactForm({ locale, text, trackingSource = 'contact_form' }: Props) {
  const fieldIdPrefix = useId();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [fieldErrors, setFieldErrors] = useState<FieldValidationErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');
  const [isToastOpen, setIsToastOpen] = useState(false);
  const didTrackStart = useRef(false);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const hasTurnstile = Boolean(turnstileSiteKey);
  const isSubmitting = status === 'submitting';
  const validationOrder = [ 'name', 'email', 'company', 'message' ] as const;

  const getField = (formElement: HTMLFormElement, name: (typeof validationOrder)[number]) => {
    const field = formElement.elements.namedItem(name);
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
      return field;
    }
    return null;
  };

  const collectFieldErrors = (formElement: HTMLFormElement) => {
    const nextErrors: FieldValidationErrors = {};
    for (const name of validationOrder) {
      const field = getField(formElement, name);
      if (!field || field.checkValidity()) continue;
      nextErrors[name] = field.validationMessage || 'Invalid value';
    }
    return nextErrors;
  };

  const onFieldChange = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    if (!didTrackStart.current) {
      didTrackStart.current = true;
      const sourcePath =
        typeof window === 'undefined'
          ? '/'
          : `${window.location.pathname}${window.location.search}${window.location.hash}`;
      trackEvent('contact_form_start', { source: trackingSource, locale, sourcePath });
    }

    setForm((prev) => ({ ...prev, [field]: value }));
    if (field in fieldErrors) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof FieldValidationErrors];
        return next;
      });
    }
    if (status === 'error') {
      setStatus('idle');
      setFeedback('');
    }
  };

  const resetForm = () => {
    setForm(initialFormState);
    setFieldErrors({});
    setStatus('idle');
    setFeedback('');
    setIsToastOpen(false);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const formElement = event.currentTarget;
    formRef.current = formElement;
    const nextFieldErrors = collectFieldErrors(formElement);
    const hasClientValidationErrors = Object.keys(nextFieldErrors).length > 0;
    if (hasClientValidationErrors) {
      setStatus('error');
      setFieldErrors(nextFieldErrors);
      setFeedback(text.error);
      setIsToastOpen(true);

      for (const name of validationOrder) {
        if (!nextFieldErrors[name]) continue;
        getField(formElement, name)?.focus();
        break;
      }

      trackEvent('contact_form_error', {
        intent: form.intent,
        locale,
        source: trackingSource,
        sourcePath:
          typeof window === 'undefined'
            ? '/'
            : `${window.location.pathname}${window.location.search}${window.location.hash}`,
        errorCode: 'validation_invalid'
      });
      return;
    }

    setStatus('submitting');
    setFeedback('');
    setFieldErrors({});

    const turnstileToken = hasTurnstile
      ? formElement.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]')?.value?.trim() ?? ''
      : undefined;

    if (hasTurnstile && !turnstileToken) {
      setStatus('error');
      setFeedback(text.verificationRequired);
      setIsToastOpen(true);
      trackEvent('contact_form_error', {
        intent: form.intent,
        locale,
        source: trackingSource,
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

    trackEvent('contact_form_submit', { intent: form.intent, source: trackingSource, locale, sourcePath });
    trackEvent('contact_quality_submit', {
      intent: form.intent,
      intentDetail: form.intentDetail,
      timelineBand: form.timelineBand,
      projectScope: form.projectScope,
      source: trackingSource,
      locale,
      sourcePath
    });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          intent: form.intent,
          intent_detail: form.intentDetail,
          timeline_band: form.timelineBand,
          project_scope: form.projectScope,
          name: form.name,
          email: form.email,
          company: form.company,
          message: form.message,
          website: form.website,
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
      setIsToastOpen(true);
      trackEvent('contact_form_success', { intent: form.intent, source: trackingSource, locale, sourcePath });
      trackEvent('contact_form_submit_success', { intent: form.intent, source: trackingSource, locale, sourcePath });
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
      setIsToastOpen(true);
      trackEvent('contact_form_error', { intent: form.intent, source: trackingSource, locale, sourcePath, errorCode });
    }
  };

  const nameFieldId = `${fieldIdPrefix}-name`;
  const emailFieldId = `${fieldIdPrefix}-email`;
  const companyFieldId = `${fieldIdPrefix}-company`;
  const messageFieldId = `${fieldIdPrefix}-message`;

  return (
    <div className="contact-form-card">
      {hasTurnstile ? (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      ) : null}

      <form ref={formRef} className="contact-form" onSubmit={onSubmit} noValidate>
        <RadioGroup
          legend={text.intentLegend}
          name="intent"
          value={form.intent}
          onChange={(value) => onFieldChange('intent', value as ContactIntent)}
          options={[
            { value: 'hiring', label: text.intentOptions.hiring },
            { value: 'client', label: text.intentOptions.client }
          ]}
          className="intent-switch"
        />

        <div className="contact-fields">
          <Input
            label={text.nameLabel}
            id={nameFieldId}
            autoComplete="name"
            name="name"
            required
            maxLength={80}
            minLength={2}
            value={form.name}
            onChange={(e) => onFieldChange('name', e.target.value)}
            aria-invalid={fieldErrors.name ? true : undefined}
            aria-describedby={fieldErrors.name ? `${nameFieldId}-error` : undefined}
            error={fieldErrors.name}
          />

          <Input
            label={text.emailLabel}
            id={emailFieldId}
            autoComplete="email"
            name="email"
            type="email"
            required
            maxLength={160}
            value={form.email}
            onChange={(e) => onFieldChange('email', e.target.value)}
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? `${emailFieldId}-error` : undefined}
            error={fieldErrors.email}
          />

          <Textarea
            label={text.messageLabel}
            id={messageFieldId}
            name="message"
            rows={5}
            required
            minLength={10}
            maxLength={2000}
            value={form.message}
            onChange={(e) => onFieldChange('message', e.target.value)}
            aria-invalid={fieldErrors.message ? true : undefined}
            aria-describedby={fieldErrors.message ? `${messageFieldId}-error` : undefined}
            error={fieldErrors.message}
          />

          <Accordion
            className="contact-advanced"
            items={[
              {
                id: `${fieldIdPrefix}-advanced`,
                title: text.advancedToggleLabel,
                content: (
                  <>
                    <p className="contact-advanced-hint">{text.advancedHint}</p>

                    <Input
                      label={text.companyLabel}
                      id={companyFieldId}
                      autoComplete="organization"
                      name="company"
                      maxLength={120}
                      value={form.company}
                      onChange={(e) => onFieldChange('company', e.target.value)}
                      aria-invalid={fieldErrors.company ? true : undefined}
                      aria-describedby={fieldErrors.company ? `${companyFieldId}-error` : undefined}
                      error={fieldErrors.company}
                    />

                    <Select
                      label={text.intentDetailLabel}
                      name="intent_detail"
                      value={form.intentDetail}
                      onChange={(e) => onFieldChange('intentDetail', e.target.value as ContactIntentDetail)}
                      options={[
                        { value: 'hiring', label: text.intentDetailOptions.hiring },
                        { value: 'project', label: text.intentDetailOptions.project },
                        { value: 'collab', label: text.intentDetailOptions.collab }
                      ]}
                    />

                    <Select
                      label={text.timelineLabel}
                      name="timeline_band"
                      value={form.timelineBand}
                      onChange={(e) => onFieldChange('timelineBand', e.target.value as TimelineBand)}
                      options={[
                        { value: 'asap', label: text.timelineOptions.asap },
                        { value: '30d', label: text.timelineOptions['30d'] },
                        { value: '90d+', label: text.timelineOptions['90d+'] }
                      ]}
                    />

                    <Select
                      label={text.projectScopeLabel}
                      name="project_scope"
                      value={form.projectScope}
                      onChange={(e) => onFieldChange('projectScope', e.target.value as ProjectScope)}
                      options={[
                        { value: 'audit', label: text.projectScopeOptions.audit },
                        { value: 'build', label: text.projectScopeOptions.build },
                        { value: 'optimize', label: text.projectScopeOptions.optimize },
                        { value: 'unknown', label: text.projectScopeOptions.unknown }
                      ]}
                    />
                  </>
                )
              }
            ]}
          />

          <Input
            label={text.honeypotLabel}
            className="hp-field"
            aria-hidden="true"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => onFieldChange('website', e.target.value)}
          />
        </div>

        <p className="form-note">{text.privacy}</p>

        {hasTurnstile ? (
          <div className="turnstile-wrap">
            <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-theme="dark" data-language={locale} />
          </div>
        ) : null}

        <div className="contact-submit-row">
          <Button className="primary" type="submit" disabled={isSubmitting} variant="primary">
            {isSubmitting ? text.submitting : text.submit}
          </Button>
          {status === 'success' ? (
            <Button className="ghost" type="button" onClick={resetForm} variant="ghost">
              {text.reset}
            </Button>
          ) : null}
        </div>

        {feedback ? (
          <InlineFeedback className="form-feedback" tone={status === 'success' ? 'success' : 'error'} role="status" aria-live="polite">
            {feedback}
          </InlineFeedback>
        ) : null}
      </form>

      <Toast
        open={isToastOpen && Boolean(feedback) && (status === 'success' || status === 'error')}
        tone={status === 'success' ? 'success' : 'error'}
        message={feedback}
        onClose={() => setIsToastOpen(false)}
      />
    </div>
  );
}
