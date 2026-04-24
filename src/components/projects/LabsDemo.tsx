import type { Locale } from '@/content/copy';

type Props = {
  locale: Locale;
};

export function LabsDemo({ locale }: Props) {
  const items =
    locale === 'de'
      ? [
          'Botsystem: Tiering, User-Lifecycle, Admin-Workflows',
          'IoT/Edge: ESP32 + Home Assistant Integrationen',
          'Fokus: schnelle Lernzyklen und dokumentierte Runbooks'
        ]
      : [
          'Botsystem: tiering, user lifecycle, admin workflows',
          'IoT/Edge: ESP32 + Home Assistant integrations',
          'Focus: fast learning cycles with documented runbooks'
        ];

  return (
    <div className="labs-stage">
      <div className="labs-badge">LABS</div>
      <h3>{locale === 'de' ? 'Experimenteller Bereich' : 'Experimental area'}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
