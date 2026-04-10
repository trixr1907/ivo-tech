'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { Locale } from '@/content/copy';
import { getProjectById, type ProjectId } from '@/content/projects';
import { trackEvent } from '@/lib/analytics';

const ProjectModal = dynamic(() => import('@/components/ProjectModal').then((m) => m.ProjectModal), {
  ssr: false
});

type TrackEvent = {
  event: string;
  payload?: Record<string, unknown>;
};

type Props = {
  locale: Locale;
  defaultPath: string;
};

function getPath() {
  return `${window.location.pathname}${window.location.search}`;
}

function parseTrackEvents(value: string | null) {
  if (!value) return null;
  try {
    return JSON.parse(value) as TrackEvent[];
  } catch {
    return null;
  }
}

function parseTrackPayload(value: string | null) {
  if (!value) return null;
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function HomePageRuntime({ locale, defaultPath }: Props) {
  const [projectParam, setProjectParam] = useState<string | null>(null);
  const didTrackScrollDepth50 = useRef(false);
  const didTrackScrollDepth90 = useRef(false);
  const closeProject = useCallback(() => {
    const nextParams = new URLSearchParams(window.location.search);
    nextParams.delete('project');
    const nextQuery = nextParams.toString();
    const nextUrl = `${window.location.pathname || defaultPath}${nextQuery ? `?${nextQuery}` : ''}#featured`;
    window.history.replaceState({}, '', nextUrl);
    setProjectParam(null);
  }, [defaultPath]);

  const openProject = useCallback(
    (id: ProjectId, source = 'unknown') => {
      trackEvent('case_open', { projectId: id, source, locale, path: getPath() });
      trackEvent('case_study_open', { projectId: id, source, locale, path: getPath() });

      const nextParams = new URLSearchParams(window.location.search);
      nextParams.set('project', id);
      const nextQuery = nextParams.toString();
      const nextUrl = `${window.location.pathname || defaultPath}${nextQuery ? `?${nextQuery}` : ''}#featured`;
      window.history.pushState({ project: id }, '', nextUrl);
      setProjectParam(id);
    },
    [defaultPath, locale]
  );

  useEffect(() => {
    const syncLocation = () => {
      const nextSearch = window.location.search.startsWith('?') ? window.location.search.slice(1) : '';
      const nextProject = new URLSearchParams(nextSearch).get('project');
      setProjectParam(nextProject);
    };

    syncLocation();
    window.addEventListener('popstate', syncLocation);
    return () => window.removeEventListener('popstate', syncLocation);
  }, [defaultPath]);

  useEffect(() => {
    let started = false;
    let cleanup: (() => void) | undefined;

    const start = () => {
      if (started) return;
      started = true;

      const header = document.querySelector<HTMLElement>('.home-v2-header');
      const onScroll = () => {
        const condensed = window.scrollY > 14;
        if (header) header.classList.toggle('is-scrolled', condensed);
      };

      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      cleanup = () => window.removeEventListener('scroll', onScroll);
    };

    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number }).requestIdleCallback;
    const cancelRic = (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
    const id = ric ? ric(start, { timeout: 1200 }) : window.setTimeout(start, 400);

    return () => {
      if (ric && cancelRic) {
        cancelRic(id);
      } else if (!ric) {
        window.clearTimeout(id);
      }
      cleanup?.();
    };
  }, []);

  useEffect(() => {
    let started = false;
    let cleanup: (() => void) | undefined;

    const start = () => {
      if (started) return;
      started = true;

      didTrackScrollDepth50.current = false;
      didTrackScrollDepth90.current = false;

      const onScrollDepth = () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll <= 0) return;

        const progress = window.scrollY / maxScroll;

        if (!didTrackScrollDepth50.current && progress >= 0.5) {
          didTrackScrollDepth50.current = true;
          trackEvent('homepage_scroll_depth', {
            depth: 50,
            locale,
            path: getPath(),
            source: 'home_scroll_depth'
          });
        }

        if (!didTrackScrollDepth90.current && progress >= 0.9) {
          didTrackScrollDepth90.current = true;
          trackEvent('homepage_scroll_depth', {
            depth: 90,
            locale,
            path: getPath(),
            source: 'home_scroll_depth'
          });
        }
      };

      onScrollDepth();
      window.addEventListener('scroll', onScrollDepth, { passive: true });
      cleanup = () => window.removeEventListener('scroll', onScrollDepth);
    };

    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number }).requestIdleCallback;
    const cancelRic = (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
    const id = ric ? ric(start, { timeout: 1600 }) : window.setTimeout(start, 700);

    return () => {
      if (ric && cancelRic) {
        cancelRic(id);
      } else if (!ric) {
        window.clearTimeout(id);
      }
      cleanup?.();
    };
  }, [locale]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const projectEl = target.closest<HTMLElement>('[data-project-id]');
      if (projectEl) {
        if (event.defaultPrevented) return;
        if (event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        const id = projectEl.getAttribute('data-project-id') as ProjectId | null;
        if (!id) return;
        event.preventDefault();
        const source = projectEl.getAttribute('data-project-source') ?? 'project_card';
        openProject(id, source);
        return;
      }

      const trackEl = target.closest<HTMLElement>('[data-track-event],[data-track-events]');
      if (!trackEl) return;

      const multiEvents = parseTrackEvents(trackEl.getAttribute('data-track-events'));
      if (multiEvents && multiEvents.length) {
        multiEvents.forEach((entry) => {
          trackEvent(entry.event, { ...entry.payload, locale, path: getPath() });
        });
        return;
      }

      const eventName = trackEl.getAttribute('data-track-event');
      if (!eventName) return;
      const payload = parseTrackPayload(trackEl.getAttribute('data-track-payload')) ?? {};
      trackEvent(eventName, { ...payload, locale, path: getPath() });
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [defaultPath, locale, openProject]);

  const activeProject = getProjectById(projectParam);

  return activeProject ? <ProjectModal project={activeProject} locale={locale} onClose={closeProject} /> : null;
}
