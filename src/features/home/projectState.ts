import type { ParsedUrlQuery, ParsedUrlQueryInput } from 'node:querystring';

import type { ProjectId } from '@/content/projects';

const FEATURED_HASH = 'featured';

export function parseProjectParam(value: string | string[] | undefined): string | null {
  if (typeof value === 'string' && value.length > 0) return value;
  return null;
}

export function buildProjectHref(projectId: ProjectId, hash: string = FEATURED_HASH): string {
  return `?project=${projectId}#${hash}`;
}

export function createOpenProjectRoute(pathname: string, query: ParsedUrlQuery, projectId: ProjectId, hash = FEATURED_HASH) {
  return {
    pathname,
    query: { ...query, project: projectId } as ParsedUrlQueryInput,
    hash
  };
}

export function createCloseProjectRoute(pathname: string, query: ParsedUrlQuery, hash = FEATURED_HASH) {
  const nextQuery = { ...query };
  delete nextQuery.project;

  return {
    pathname,
    query: nextQuery as ParsedUrlQueryInput,
    hash
  };
}
