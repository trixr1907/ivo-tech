import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { HeroCommands } from '@/components/HeroCommands';

describe('HeroCommands', () => {
  it('opens selected project on primary click', async () => {
    const onOpenProject = vi.fn();
    const user = userEvent.setup();

    render(<HeroCommands locale="de" onOpenProject={onOpenProject} />);

    await user.click(screen.getByRole('link', { name: /3D Hero Case/i }));

    expect(onOpenProject).toHaveBeenCalledWith('configurator_3d');
  });

  it('does not intercept modified clicks', async () => {
    const onOpenProject = vi.fn();

    render(<HeroCommands locale="en" onOpenProject={onOpenProject} />);

    const link = screen.getByRole('link', { name: /Voicebot/i });
    link.addEventListener('click', (event) => event.preventDefault());
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, metaKey: true }));

    expect(onOpenProject).not.toHaveBeenCalled();
  });
});
