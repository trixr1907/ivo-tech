import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LanguageToggle } from '@/components/LanguageToggle';

vi.mock('next/navigation', () => ({
  usePathname: () => '/en/configurator'
}));

describe('LanguageToggle', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/en/configurator?view=compact#contact');
  });

  it('renders hreflang links and active state', async () => {
    render(<LanguageToggle />);

    const germanLink = screen.getByRole('link', { name: 'Sprache auf Deutsch wechseln' });
    const englishLink = screen.getByRole('link', { name: 'English (current language)' });

    await waitFor(() => {
      expect(germanLink.getAttribute('href')).toBe('/configurator?view=compact#contact');
      expect(englishLink.getAttribute('href')).toBe('/en/configurator?view=compact#contact');
    });

    expect(germanLink.getAttribute('hreflang')).toBe('de');
    expect(englishLink.getAttribute('hreflang')).toBe('en');
    expect(englishLink.getAttribute('aria-current')).toBe('page');
  });
});
