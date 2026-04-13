import { z } from 'zod';

const APP_ENV_VALUES = ['development', 'staging', 'production'] as const;

const appEnvSchema = z.enum(APP_ENV_VALUES);
const isProductionBuild = process.env.NODE_ENV === 'production';

function inferAppEnv(nodeEnv: string | undefined): z.infer<typeof appEnvSchema> {
  if (nodeEnv === 'production') return 'production';
  return 'development';
}

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_APP_ENV: appEnvSchema,
  NEXT_PUBLIC_SENTRY_DSN: z.union([z.literal(''), z.string().url()]).optional().default(''),
  NEXT_PUBLIC_CSP_REPORT_URI: z.union([z.literal(''), z.string().url()]).optional().default('')
});

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const rawAppEnv = process.env.NEXT_PUBLIC_APP_ENV?.trim();

if (isProductionBuild && (!rawSiteUrl || !rawAppEnv)) {
  throw new Error('NEXT_PUBLIC_SITE_URL and NEXT_PUBLIC_APP_ENV must be explicitly set in production.');
}

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: rawSiteUrl || 'https://ivo-tech.com',
  NEXT_PUBLIC_APP_ENV: rawAppEnv || inferAppEnv(process.env.NODE_ENV),
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN ?? '',
  NEXT_PUBLIC_CSP_REPORT_URI: process.env.NEXT_PUBLIC_CSP_REPORT_URI ?? ''
});

if (!parsed.success) {
  throw new Error(`Invalid env configuration: ${parsed.error.message}`);
}

if (parsed.data.NEXT_PUBLIC_APP_ENV === 'production' && !parsed.data.NEXT_PUBLIC_SITE_URL.startsWith('https://')) {
  throw new Error('NEXT_PUBLIC_SITE_URL must use https in production.');
}

export const env = parsed.data;

export type AppEnv = z.infer<typeof appEnvSchema>;
