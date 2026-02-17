import type { Locale } from '@/content/copy';

type Props = {
  locale: Locale;
};

export function PizzaDemo({ locale }: Props) {
  return (
    <div className="pizza-stage">
      <div className="pizza-iframe-wrapper">
        <div className="pizza-iframe-header">
          <span className="pizza-live-badge">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <circle cx="6" cy="6" r="6" />
            </svg>
            LIVE TEMPLATE DEMO
          </span>
          <a className="pizza-open-new" href="/pizza/" target="_blank" rel="noopener noreferrer">
            {locale === 'de' ? 'Vollbild oeffnen' : 'Open fullscreen'} ↗
          </a>
        </div>
        <iframe
          className="pizza-iframe"
          src="/pizza/"
          sandbox="allow-scripts allow-same-origin allow-forms"
          loading="lazy"
          title="Ivo's Pizza Homepage Template Demo"
        />
      </div>
    </div>
  );
}
