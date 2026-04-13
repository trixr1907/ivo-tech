import Image from 'next/image';

import type { Locale } from '@/content/copy';

type Props = {
  locale: Locale;
};

export function AndroidDemo({ locale }: Props) {
  const items =
    locale === 'de'
      ? ['WebView-Journeys für Aktivierung', 'Local-first State (Prototype)', 'Klare UI für schnelle Flows']
      : ['WebView journeys for activation', 'Local-first state (prototype)', 'Clear UI for fast flows'];

  return (
    <div className="android-stage">
      <div className="android-device" aria-hidden="true">
        <div className="android-screen">
          <Image
            src="/assets/thumb_autocoupon_android.png"
            alt=""
            fill
            sizes="(max-width: 900px) 92vw, 740px"
            quality={90}
            className="android-screen-image"
            priority={false}
          />
        </div>
      </div>

      <div className="android-meta" aria-label="Android demo details">
        <div className="android-badge">ANDROID · WEBVIEW</div>
        <ul className="android-list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
