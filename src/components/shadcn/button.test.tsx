import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from '@/components/shadcn/button';

describe('shadcn Button', () => {
  it('provides SOTA homepage CTA variants without long inline class duplication', () => {
    render(
      <>
        <Button variant="hero">Book scope call</Button>
        <Button variant="onDark">Contact</Button>
        <Button variant="mono">System proof</Button>
      </>
    );

    expect(screen.getByRole('button', { name: 'Book scope call' }).className).toContain('from-sky-500');
    expect(screen.getByRole('button', { name: 'Contact' }).className).toContain('border-slate-600');
    expect(screen.getByRole('button', { name: 'System proof' }).className).toContain('font-mono');
  });
});
