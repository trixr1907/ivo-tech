'use client';

import { useMemo, useState, type KeyboardEvent, type ReactNode } from 'react';

import { cn } from '@/lib/cn';

type Item = {
  id: string;
  title: string;
  content: ReactNode;
};

type Props = {
  items: Item[];
  allowMultiple?: boolean;
  defaultOpenIds?: string[];
  className?: string;
};

function nextIndex(current: number, max: number, direction: 1 | -1) {
  if (direction === 1) return current >= max ? 0 : current + 1;
  return current <= 0 ? max : current - 1;
}

export function Accordion({ items, allowMultiple = false, defaultOpenIds = [], className }: Props) {
  const initial = useMemo(() => new Set(defaultOpenIds), [defaultOpenIds]);
  const [openIds, setOpenIds] = useState<Set<string>>(initial);

  const onToggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      const isOpen = next.has(id);

      if (isOpen) {
        next.delete(id);
        return next;
      }

      if (!allowMultiple) next.clear();
      next.add(id);
      return next;
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const key = event.key;
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) return;

    const buttons = Array.from(
      event.currentTarget.closest('.ui-accordion')?.querySelectorAll<HTMLButtonElement>('.ui-accordion-trigger') ?? []
    );
    if (!buttons.length) return;

    event.preventDefault();

    if (key === 'Home') {
      buttons[0]?.focus();
      return;
    }

    if (key === 'End') {
      buttons[buttons.length - 1]?.focus();
      return;
    }

    const target = key === 'ArrowDown' ? nextIndex(index, buttons.length - 1, 1) : nextIndex(index, buttons.length - 1, -1);
    buttons[target]?.focus();
  };

  return (
    <div className={cn('ui-accordion', className)}>
      {items.map((item, index) => {
        const open = openIds.has(item.id);
        const triggerId = `accordion-trigger-${item.id}`;
        const panelId = `accordion-panel-${item.id}`;

        return (
          <section key={item.id} className={cn('ui-accordion-item', open && 'is-open')}>
            <h3>
              <button
                id={triggerId}
                type="button"
                className="ui-accordion-trigger"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => onToggle(item.id)}
                onKeyDown={(event) => onKeyDown(event, index)}
              >
                <span>{item.title}</span>
                <span aria-hidden="true" className="ui-accordion-icon">
                  {open ? '−' : '+'}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className="ui-accordion-panel"
              hidden={!open}
            >
              {item.content}
            </div>
          </section>
        );
      })}
    </div>
  );
}
