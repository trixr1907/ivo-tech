import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card';

describe('shadcn Card', () => {
  it('supports elevated marketing surfaces for v0-style dark cards', () => {
    const { container } = render(
      <Card surface="marketing" interactive>
        <CardHeader>
          <CardTitle>Proof Card</CardTitle>
          <CardDescription>Production-ready surface</CardDescription>
        </CardHeader>
      </Card>
    );

    expect(screen.getByText('Production-ready surface')).toBeTruthy();
    const card = container.firstElementChild;
    expect(card).not.toBeNull();
    expect(card?.className).toContain('bg-slate-900/55');
    expect(card?.className).toContain('shadow-[0_0_0_1px_rgba(148,163,184,0.12)');
    expect(card?.className).toContain('hover:-translate-y-0.5');
    expect(card?.hasAttribute('interactive')).toBe(false);
  });

  it('supports spotlight surfaces for hero-grade proof cards', () => {
    const { container } = render(
      <Card surface="spotlight" interactive>
        <CardHeader>
          <CardTitle>Flagship Case</CardTitle>
        </CardHeader>
      </Card>
    );

    const card = container.firstElementChild;
    expect(card?.className).toContain('bg-[radial-gradient(circle_at_top_left');
    expect(card?.className).toContain('ring-sky-300/20');
    expect(card?.className).toContain('hover:shadow-[0_0_0_1px_rgba(125,211,252,0.34)');
  });
});
