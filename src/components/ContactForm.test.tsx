import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ContactForm } from '@/components/ContactForm';
import { copy } from '@/content/copy';

vi.mock('@/lib/analytics', () => ({
  trackEvent: vi.fn()
}));

describe('ContactForm accessibility', () => {
  it('marks invalid fields and moves focus to the first invalid field', async () => {
    const user = userEvent.setup();
    render(<ContactForm locale="de" text={copy.de.contact_form} />);

    await user.click(screen.getByRole('button', { name: copy.de.contact_form.submit }));

    const nameInput = screen.getByRole('textbox', { name: /^name/i });
    const emailInput = screen.getByRole('textbox', { name: /^e-mail/i });
    const messageInput = screen.getByRole('textbox', { name: /^kontext/i });

    expect(nameInput.getAttribute('aria-invalid')).toBe('true');
    expect(emailInput.getAttribute('aria-invalid')).toBe('true');
    expect(messageInput.getAttribute('aria-invalid')).toBe('true');
    expect(document.activeElement).toBe(nameInput);
    expect(screen.getByRole('status').getAttribute('aria-live')).toBe('polite');
  });

  it('keeps advanced fields collapsed until opened', async () => {
    const user = userEvent.setup();
    render(<ContactForm locale="de" text={copy.de.contact_form} />);

    const trigger = screen.getByRole('button', { name: copy.de.contact_form.advancedToggleLabel });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    await user.click(trigger);

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByLabelText(copy.de.contact_form.projectScopeLabel)).not.toBeNull();
    expect(screen.getByLabelText(copy.de.contact_form.timelineLabel)).not.toBeNull();
  });
});
