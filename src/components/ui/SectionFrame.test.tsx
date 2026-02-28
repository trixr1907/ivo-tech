import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SectionFrame } from '@/components/ui/SectionFrame';

describe('SectionFrame', () => {
  it('applies glass surface and spacious density classes', () => {
    render(
      <SectionFrame
        data-testid="section"
        tone="metal"
        surfaceStyle="glass"
        density="spacious"
        sectionTheme="fusion"
      >
        Content
      </SectionFrame>
    );

    const section = screen.getByTestId('section');
    expect(section.classList.contains('ui-section')).toBe(true);
    expect(section.classList.contains('surface-metal')).toBe(true);
    expect(section.classList.contains('surface-glass')).toBe(true);
    expect(section.classList.contains('ui-section--spacious')).toBe(true);
    expect(section.getAttribute('data-theme')).toBe('fusion');
  });
});
