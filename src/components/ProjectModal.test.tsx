import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ProjectModal } from '@/components/ProjectModal';
import { getProjectById } from '@/content/projects';

vi.mock('next/dynamic', () => ({
  default: (_loader: unknown, options?: { loading?: () => unknown }) => {
    return function DynamicComponentMock() {
      if (options?.loading) return options.loading();
      return <div data-testid="dynamic-component-fallback" />;
    };
  }
}));

describe('ProjectModal', () => {
  it('renders title/description and focuses close button on open', async () => {
    const project = getProjectById('configurator_3d');
    if (!project) throw new Error('Expected fixture project configurator_3d to exist.');

    render(<ProjectModal project={project} locale="de" onClose={vi.fn()} />);

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByRole('heading', { name: project.modal.title.de })).toBeTruthy();
    expect(screen.getByText(project.modal.desc.de)).toBeTruthy();

    const closeButton = screen.getByRole('button', { name: 'Dialog schliessen' });
    await waitFor(() => {
      expect(document.activeElement).toBe(closeButton);
    });
  });
});
