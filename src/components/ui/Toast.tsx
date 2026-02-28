import { useEffect } from 'react';

import { cn } from '@/lib/cn';

type ToastTone = 'success' | 'warning' | 'error' | 'info';

type Props = {
  message: string;
  tone?: ToastTone;
  open: boolean;
  onClose: () => void;
  durationMs?: number;
};

export function Toast({ message, tone = 'info', open, onClose, durationMs = 2800 }: Props) {
  useEffect(() => {
    if (!open) return;
    const timeoutId = window.setTimeout(onClose, durationMs);
    return () => window.clearTimeout(timeoutId);
  }, [durationMs, onClose, open]);

  if (!open) return null;

  return (
    <div className="ui-toast-viewport" role="alert" aria-live="polite">
      <div className={cn('ui-toast', `ui-toast--${tone}`)}>
        <span>{message}</span>
        <button type="button" className="ui-toast-close" onClick={onClose} aria-label="Close notification">
          ×
        </button>
      </div>
    </div>
  );
}
