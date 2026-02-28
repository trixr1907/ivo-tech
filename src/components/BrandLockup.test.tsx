import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BrandLockup } from '@/components/BrandLockup';

vi.mock('@/lib/logoMotion', () => ({
  attachLogoHover: vi.fn(() => () => undefined),
  playLogoReveal: vi.fn(() => Promise.resolve())
}));

describe('BrandLockup', () => {
  it('supports premium visual preset and edge glow API', () => {
    render(<BrandLockup variant="header" systemPreset="ref103632" visualPreset="premium" edgeGlow="medium" />);

    const lockup = screen.getByRole('img', { name: 'ivo-tech' });
    expect(lockup.classList.contains('brand-lockup--visual-premium')).toBe(true);
    expect(lockup.classList.contains('brand-lockup--edge-medium')).toBe(true);
    expect(lockup.getAttribute('data-logo-visual')).toBe('premium');
    expect(lockup.getAttribute('data-logo-edge')).toBe('medium');
  });
});
