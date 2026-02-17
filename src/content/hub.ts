import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import { z } from 'zod';

export type HubLocale = 'de' | 'en';
export type HubKind = 'insights' | 'playbooks' | 'case-studies';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const baseFrontmatterSchema = z.object({
  slug: z.string().trim().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  locale: z.enum(['de', 'en']),
  title: z.string().trim().min(5).max(180),
  description: z.string().trim().min(10).max(240),
  summary: z.string().trim().min(10).max(240),
  category: z.string().trim().min(2).max(80),
  readMinutes: z.number().int().min(1).max(60),
  publishedAt: dateSchema,
  updatedAt: dateSchema,
  schemaType: z.enum(['Article', 'HowTo']),
  internalLinks: z
    .array(z.string().trim().min(1))
    .min(3)
    .refine((links) => links.some((link) => link.includes('#contact')), 'internalLinks must contain contact path')
    .refine(
      (links) =>
        links.some((link) => link.includes('/insights/')) ||
        links.some((link) => link.includes('/playbooks/')) ||
        links.some((link) => link.includes('/case-studies/')),
      'internalLinks must contain at least one hub link'
    ),
  draft: z.boolean().default(false)
});

const frontmatterSchemas: Record<HubKind, z.ZodTypeAny> = {
  insights: baseFrontmatterSchema.extend({
    schemaType: z.literal('Article')
  }),
  playbooks: baseFrontmatterSchema.extend({
    schemaType: z.literal('HowTo')
  }),
  'case-studies': baseFrontmatterSchema.extend({
    schemaType: z.literal('Article')
  })
};

export type HubFrontmatter = z.infer<typeof baseFrontmatterSchema>;

export type HubEntry = HubFrontmatter & {
  kind: HubKind;
  body: string;
};

function getDirectory(kind: HubKind, locale: HubLocale) {
  return path.join(CONTENT_ROOT, kind, locale);
}

function listMdxFiles(kind: HubKind, locale: HubLocale) {
  const directory = getDirectory(kind, locale);
  if (!fs.existsSync(directory)) return [];

  return fs
    .readdirSync(directory)
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => path.join(directory, name));
}

function parseMdxFile(kind: HubKind, filePath: string): HubEntry {
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  const frontmatter = frontmatterSchemas[kind].parse(parsed.data) as HubFrontmatter;

  if (frontmatter.slug !== path.basename(filePath, '.mdx')) {
    throw new Error(`Slug mismatch in ${filePath}: expected ${path.basename(filePath, '.mdx')} got ${frontmatter.slug}`);
  }

  return {
    ...frontmatter,
    kind,
    body: parsed.content.trim()
  };
}

function sortByPublishedDateDesc(entries: HubEntry[]) {
  return [...entries].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getHubEntries(kind: HubKind, locale: HubLocale) {
  const entries = listMdxFiles(kind, locale)
    .map((filePath) => parseMdxFile(kind, filePath))
    .filter((entry) => !entry.draft && entry.locale === locale);

  return sortByPublishedDateDesc(entries);
}

export function getHubEntry(kind: HubKind, locale: HubLocale, slug: string) {
  return getHubEntries(kind, locale).find((entry) => entry.slug === slug) ?? null;
}

export function getHubSlugs(kind: HubKind, locale: HubLocale) {
  return getHubEntries(kind, locale).map((entry) => entry.slug);
}

export function getHubRouteGroups() {
  const locales: HubLocale[] = ['de', 'en'];
  const kinds: HubKind[] = ['insights', 'playbooks', 'case-studies'];

  return kinds.flatMap((kind) =>
    locales.flatMap((locale) =>
      getHubSlugs(kind, locale).map((slug) => ({
        kind,
        locale,
        slug
      }))
    )
  );
}

export function getFeaturedInsights(locale: HubLocale, limit = 3) {
  return getHubEntries('insights', locale).slice(0, limit);
}
