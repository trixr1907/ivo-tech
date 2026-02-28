import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Accordion } from '@/components/ui/Accordion';

describe('Accordion', () => {
  it('toggles panels and keeps a single item open by default', async () => {
    const user = userEvent.setup();
    render(
      <Accordion
        items={[
          { id: 'a', title: 'First', content: <p>First content</p> },
          { id: 'b', title: 'Second', content: <p>Second content</p> }
        ]}
      />
    );

    const first = screen.getByRole('button', { name: 'First' });
    const second = screen.getByRole('button', { name: 'Second' });

    expect(first.getAttribute('aria-expanded')).toBe('false');
    expect(second.getAttribute('aria-expanded')).toBe('false');

    await user.click(first);
    expect(first.getAttribute('aria-expanded')).toBe('true');

    await user.click(second);
    expect(first.getAttribute('aria-expanded')).toBe('false');
    expect(second.getAttribute('aria-expanded')).toBe('true');
  });
});
