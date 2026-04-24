type UnknownRecord = Record<string, unknown>;

type NormalizedCspReport = {
  disposition: string;
  documentUri: string;
  effectiveDirective: string;
  violatedDirective: string;
  blockedUri: string;
  originalPolicy: string;
  sourceFile: string;
  lineNumber: number | null;
  columnNumber: number | null;
  sample: string;
  referrer: string;
};

type CspReportBucket = {
  count: number;
  resetAt: number;
};

export type CspNoiseClass = 'none' | 'next_runtime_inline' | 'browser_extension' | 'local_development';

function asRecord(value: unknown): UnknownRecord | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as UnknownRecord;
}

const globalCspStore = globalThis as typeof globalThis & { __ivoCspReportBuckets?: Map<string, CspReportBucket> };
const cspBuckets = globalCspStore.__ivoCspReportBuckets ?? new Map<string, CspReportBucket>();
globalCspStore.__ivoCspReportBuckets = cspBuckets;

const cspBucketWindowMs = 10 * 60 * 1000;

function normalizeKeyText(value: string) {
  return value
    .toLowerCase()
    .replace(/[a-f0-9]{16,}/g, '*')
    .replace(/\b\d+\b/g, '#')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildReportKey(report: NormalizedCspReport) {
  return [
    report.effectiveDirective || 'unknown',
    report.violatedDirective || 'unknown',
    normalizeKeyText(report.blockedUri || 'unknown'),
    normalizeKeyText(report.documentUri || 'unknown'),
    normalizeKeyText(report.sourceFile || 'unknown'),
    normalizeKeyText(report.sample || '')
  ].join('|');
}

function shouldLogNoiseOccurrence(count: number) {
  return count === 50 || count === 200 || count === 500 || count % 1000 === 0;
}

function registerReportOccurrence(report: NormalizedCspReport, noiseClass: CspNoiseClass) {
  const now = Date.now();
  const key = `${noiseClass}|${buildReportKey(report)}`;
  const bucket = cspBuckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    const next = { count: 1, resetAt: now + cspBucketWindowMs };
    cspBuckets.set(key, next);
    const shouldLog = noiseClass === 'none';
    return { key, count: next.count, shouldLog };
  }

  bucket.count += 1;
  cspBuckets.set(key, bucket);
  const shouldLog =
    noiseClass === 'none'
      ? bucket.count === 10 || bucket.count === 50 || bucket.count % 100 === 0
      : shouldLogNoiseOccurrence(bucket.count);
  return { key, count: bucket.count, shouldLog };
}

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function asNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function clampText(value: string, maxLength = 360) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1)}…`;
}

function isBrowserExtensionUrl(value: string) {
  return /^(chrome-extension|moz-extension|safari-web-extension|edge-extension):/i.test(value);
}

function isLikelyNextRuntimeNoise(report: NormalizedCspReport) {
  const directive = report.effectiveDirective.toLowerCase();
  const blockedInline = report.blockedUri.toLowerCase() === 'inline';
  const sample = report.sample.toLowerCase();
  const sourceFile = report.sourceFile.toLowerCase();
  const documentUri = report.documentUri.toLowerCase();
  const looksLikeNextRuntime =
    sample.includes('__next_f.push') ||
    sourceFile.includes('/_next/static/') ||
    (sourceFile.endsWith('.js') && sourceFile.includes('/_next/'));

  return (
    blockedInline &&
    (directive === 'script-src' || directive === 'script-src-elem' || directive === 'script-src-attr') &&
    looksLikeNextRuntime &&
    (documentUri.startsWith('http://') || documentUri.startsWith('https://'))
  );
}

function isLocalDevelopmentDocument(documentUri: string) {
  const uri = documentUri.trim();
  if (!uri) return false;

  try {
    const host = new URL(uri).hostname.toLowerCase();
    return host === '127.0.0.1' || host === 'localhost' || host === '::1';
  } catch {
    return false;
  }
}

export function classifyCspNoise(report: NormalizedCspReport): CspNoiseClass {
  if (isLocalDevelopmentDocument(report.documentUri)) {
    return 'local_development';
  }

  if (
    isBrowserExtensionUrl(report.blockedUri) ||
    isBrowserExtensionUrl(report.sourceFile) ||
    isBrowserExtensionUrl(report.documentUri)
  ) {
    return 'browser_extension';
  }

  if (isLikelyNextRuntimeNoise(report)) {
    return 'next_runtime_inline';
  }

  return 'none';
}

function normalizeLegacyReport(payload: unknown): NormalizedCspReport | null {
  const record = asRecord(payload);
  const report = record ? asRecord(record['csp-report']) : null;
  if (!report) return null;

  return {
    disposition: asString(report['disposition']) || 'report',
    documentUri: asString(report['document-uri']),
    effectiveDirective: asString(report['effective-directive']),
    violatedDirective: asString(report['violated-directive']),
    blockedUri: asString(report['blocked-uri']),
    originalPolicy: asString(report['original-policy']),
    sourceFile: asString(report['source-file']),
    lineNumber: asNumber(report['line-number']),
    columnNumber: asNumber(report['column-number']),
    sample: asString(report['script-sample']),
    referrer: asString(report['referrer'])
  };
}

function normalizeReportingApiEnvelope(payload: unknown): UnknownRecord | null {
  const arrayPayload = Array.isArray(payload) ? payload : [payload];
  const first = arrayPayload[0];
  return asRecord(first);
}

function normalizeReportingApiReport(payload: unknown): NormalizedCspReport | null {
  const envelope = normalizeReportingApiEnvelope(payload);
  if (!envelope) return null;

  const body = asRecord(envelope['body']);
  if (!body) return null;

  return {
    disposition: asString(body['disposition']) || asString(envelope['type']) || 'report',
    documentUri: asString(body['documentURL']),
    effectiveDirective: asString(body['effectiveDirective']),
    violatedDirective: asString(body['violatedDirective']),
    blockedUri: asString(body['blockedURL']),
    originalPolicy: asString(body['originalPolicy']),
    sourceFile: asString(body['sourceFile']),
    lineNumber: asNumber(body['lineNumber']),
    columnNumber: asNumber(body['columnNumber']),
    sample: asString(body['sample']),
    referrer: asString(body['referrer'])
  };
}

export function normalizeCspReport(payload: unknown): NormalizedCspReport | null {
  return normalizeLegacyReport(payload) ?? normalizeReportingApiReport(payload);
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;

  return 'unknown';
}

function createNoContentResponse() {
  return new Response(null, {
    status: 204,
    headers: { 'cache-control': 'no-store' }
  });
}

export async function handleCspReportRequest(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, errorCode: 'method_not_allowed' }), {
      status: 405,
      headers: {
        'content-type': 'application/json',
        Allow: 'POST'
      }
    });
  }

  let payload: unknown = null;

  try {
    payload = await request.json();
  } catch {
    // Ignore malformed payloads and return 204 to avoid client retries.
    return createNoContentResponse();
  }

  const normalized = normalizeCspReport(payload);
  if (!normalized) {
    return createNoContentResponse();
  }

  const clientIp = getClientIp(request);
  const userAgent = asString(request.headers.get('user-agent'));
  const noiseClass = classifyCspNoise(normalized);
  const occurrence = registerReportOccurrence(normalized, noiseClass);

  if (!occurrence.shouldLog) {
    return createNoContentResponse();
  }

  const logTag = noiseClass === 'none' ? '[csp-report]' : '[csp-report-noise]';
  console.warn(logTag, {
    at: new Date().toISOString(),
    count: occurrence.count,
    noiseClass,
    clientIp,
    userAgent: clampText(userAgent, 180),
    disposition: normalized.disposition,
    effectiveDirective: clampText(normalized.effectiveDirective),
    violatedDirective: clampText(normalized.violatedDirective),
    blockedUri: clampText(normalized.blockedUri),
    documentUri: clampText(normalized.documentUri),
    sourceFile: clampText(normalized.sourceFile),
    lineNumber: normalized.lineNumber,
    columnNumber: normalized.columnNumber,
    sample: clampText(normalized.sample, 240)
  });

  return createNoContentResponse();
}
