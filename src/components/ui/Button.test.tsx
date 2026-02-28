import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders anchor variant with premium classes', () => {
    render(
      <Button href="#contact" variant="metal" className="cta">
        CTA
      </Button>
    );

    const link = screen.getByRole('link', { name: 'CTA' });
    expect(link.classList.contains('ui-btn')).toBe(true);
    expect(link.classList.contains('ui-btn--metal')).toBe(true);
    expect(link.classList.contains('cta')).toBe(true);
  });

  it('renders button variant with default primary classes', () => {
    render(
      <Button type="button" variant="primary">
        Submit
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button.classList.contains('ui-btn')).toBe(true);
    expect(button.classList.contains('ui-btn--primary')).toBe(true);
    expect(button.classList.contains('primary')).toBe(true);
  });

  it('renders proof variant class for case-study-first CTAs', () => {
    render(
      <Button href="/configurator" variant="proof">
        Case Study
      </Button>
    );

    const link = screen.getByRole('link', { name: 'Case Study' });
    expect(link.classList.contains('ui-btn--proof')).toBe(true);
  });

  it('renders signal variant with glow class', () => {
    render(
      <Button href="#contact" variant="signal" glowLevel="medium">
        Contact
      </Button>
    );

    const link = screen.getByRole('link', { name: 'Contact' });
    expect(link.classList.contains('ui-btn--signal')).toBe(true);
    expect(link.classList.contains('ui-btn--glow-medium')).toBe(true);
  });

  it('supports destructive variant class', () => {
    render(
      <Button href="#delete" variant="destructive">
        Delete
      </Button>
    );

    const link = screen.getByRole('link', { name: 'Delete' });
    expect(link.classList.contains('ui-btn--destructive')).toBe(true);
  });
});
