import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Icon } from '@/components/ui/Icon';

describe('Icon', () => {
  it('supports metallic icon style variant', () => {
    const { container } = render(<Icon name="frontend" styleVariant="metallic" />);
    const svg = container.querySelector('svg');

    expect(svg).not.toBeNull();
    expect(svg?.classList.contains('brand-icon')).toBe(true);
    expect(svg?.classList.contains('brand-icon--metallic')).toBe(true);
  });
});
