import type { MouseEvent } from 'react';

import type { Locale } from '@/content/copy';
import type { ProjectId } from '@/content/projects';
import { buildProjectHref } from '@/features/home/projectState';

type Props = {
  locale: Locale;
  onOpenProject: (id: ProjectId) => void;
};

type QuickAction = {
  id: ProjectId;
  label: Record<Locale, string>;
  detail: Record<Locale, string>;
};

const ACTIONS: QuickAction[] = [
  {
    id: 'configurator_3d',
    label: { de: '3D Hero Case', en: '3D hero case' },
    detail: { de: 'Live | WordPress | WooCommerce', en: 'Live | WordPress | WooCommerce' }
  },
  {
    id: 'voicebot',
    label: { de: 'Voicebot', en: 'Voicebot' },
    detail: { de: 'Private Beta | Sprach-Workflows', en: 'Private beta | voice workflows' }
  },
  {
    id: 'sorare',
    label: { de: 'Sorare Edge', en: 'Sorare edge' },
    detail: { de: 'Data Product | Simulation', en: 'Data product | simulation' }
  },
  {
    id: 'iot_lab',
    label: { de: 'Labs', en: 'Labs' },
    detail: { de: 'ESP32 | Home Assistant | Edge', en: 'ESP32 | Home Assistant | edge' }
  }
];

export function HeroCommands({ locale, onOpenProject }: Props) {
  const onQuickActionClick = (e: MouseEvent<HTMLAnchorElement>, id: ProjectId) => {
    if (e.defaultPrevented) return;
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onOpenProject(id);
  };

  return (
    <div className="hero-commands" aria-label={locale === 'de' ? 'Schnellzugriff' : 'Quick actions'}>
      {ACTIONS.map((a) => (
        <a
          key={a.id}
          className="hero-cmd"
          href={buildProjectHref(a.id)}
          onClick={(e) => onQuickActionClick(e, a.id)}
          aria-haspopup="dialog"
        >
          <span className="hero-cmd-label">{a.label[locale]}</span>
          <span className="hero-cmd-detail">{a.detail[locale]}</span>
        </a>
      ))}
    </div>
  );
}
