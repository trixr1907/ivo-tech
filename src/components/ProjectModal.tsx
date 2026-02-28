import * as Dialog from '@radix-ui/react-dialog';
import dynamic from 'next/dynamic';
import { useId, useRef } from 'react';

import type { Locale } from '@/content/copy';
import { getProjectStatusLabel, type Project } from '@/content/projects';

const Dld3dDemo = dynamic(() => import('@/components/projects/Dld3dDemo').then((m) => m.Dld3dDemo), {
  ssr: false,
  loading: () => <div className="demo-error">Loading 3D demo...</div>
});

const VoicebotDemo = dynamic(() => import('@/components/projects/VoicebotDemo').then((m) => m.VoicebotDemo), {
  ssr: false,
  loading: () => <div className="demo-error">Loading voicebot preview...</div>
});

const SorareDemo = dynamic(() => import('@/components/projects/SorareDemo').then((m) => m.SorareDemo), {
  ssr: false,
  loading: () => <div className="demo-error">Loading data preview...</div>
});

const LabsDemo = dynamic(() => import('@/components/projects/LabsDemo').then((m) => m.LabsDemo), {
  ssr: false,
  loading: () => <div className="demo-error">Loading labs preview...</div>
});

type Props = {
  project: Project | null;
  locale: Locale;
  onClose: () => void;
};

export function ProjectModal({ project, locale, onClose }: Props) {
  const open = !!project;
  const titleId = useId();
  const descriptionId = useId();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeLabel = locale === 'de' ? 'Dialog schliessen' : 'Close dialog';
  const specsLabel = locale === 'de' ? 'Spezifikationen' : 'Specs';
  const actionsLabel = locale === 'de' ? 'Aktionen' : 'Actions';

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        {project ? (
          <Dialog.Content
            className="dialog-content"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              closeButtonRef.current?.focus();
            }}
          >
            <div className="dialog-header">
              <div className="status-badge">{getProjectStatusLabel(project.status, locale)}</div>
              <Dialog.Close ref={closeButtonRef} className="dialog-close" aria-label={closeLabel}>
                x
              </Dialog.Close>
            </div>

            <div className="dialog-grid">
              <div className="dialog-media">
                {project.modal.media === 'dld3d' ? (
                  <Dld3dDemo locale={locale} />
                ) : project.modal.media === 'voicebot' ? (
                  <VoicebotDemo locale={locale} />
                ) : project.modal.media === 'sorare' ? (
                  <SorareDemo locale={locale} />
                ) : (
                  <LabsDemo locale={locale} />
                )}
              </div>

              <div className="dialog-body">
                <Dialog.Title className="dialog-title" id={titleId}>
                  {project.modal.title[locale]}
                </Dialog.Title>
                <p className="dialog-tech">{project.techLine[locale]}</p>
                <Dialog.Description className="dialog-desc" id={descriptionId}>
                  {project.modal.desc[locale]}
                </Dialog.Description>

                <div className="specs-grid" aria-label={specsLabel}>
                  {project.modal.specs[locale].map((s) => (
                    <div key={`${s.label}:${s.value}`} className="spec-item">
                      <div className="spec-label">{s.label}</div>
                      <div className="spec-value">{s.value}</div>
                    </div>
                  ))}
                </div>

                <div className="dialog-actions" aria-label={actionsLabel}>
                  {project.modal.actions[locale].map((a) => (
                    <a
                      key={`${a.label}:${a.href}`}
                      className={`action-btn ${a.variant}`}
                      href={a.href}
                      target={a.external ? '_blank' : undefined}
                      rel={a.external ? 'noopener noreferrer' : undefined}
                    >
                      {a.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Dialog.Content>
        ) : null}
      </Dialog.Portal>
    </Dialog.Root>
  );
}
