export type HeroVariantId = 'default' | 'outcome' | 'speed';
export type HeroVariantSource = 'query' | 'storage' | 'assigned' | 'default';

type HeroVariantResolution = {
  variant: HeroVariantId;
  source: HeroVariantSource;
  experimentEnabled: boolean;
};

type ResolveHeroVariantOptions = {
  queryValue: string | null | undefined;
  enabledRaw?: string | undefined;
  weightsRaw?: string | undefined;
  random?: () => number;
};

const HERO_VARIANT_STORAGE_KEY = 'ivo-tech:hero-variant';
const DEFAULT_WEIGHTS: Record<HeroVariantId, number> = {
  default: 50,
  outcome: 25,
  speed: 25
};

export function parseHeroVariant(value: string | null | undefined): HeroVariantId | null {
  const normalized = (value ?? '').trim().toLowerCase();
  if (!normalized) return null;
  if (normalized === 'default' || normalized === 'outcome' || normalized === 'speed') return normalized;
  return null;
}

export function normalizeHeroVariant(value: string | null | undefined): HeroVariantId {
  return parseHeroVariant(value) ?? 'default';
}

export function isHeroExperimentEnabled(raw = process.env.NEXT_PUBLIC_HERO_EXPERIMENT_ENABLED): boolean {
  const normalized = (raw ?? '').trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
}

export function parseHeroVariantWeights(raw = process.env.NEXT_PUBLIC_HERO_EXPERIMENT_WEIGHTS): Record<HeroVariantId, number> {
  const normalized = (raw ?? '').trim();
  if (!normalized) return { ...DEFAULT_WEIGHTS };

  const segments = normalized
    .split(',')
    .map((segment) => Number(segment.trim()))
    .filter((value) => Number.isFinite(value) && value >= 0);

  if (segments.length !== 3) return { ...DEFAULT_WEIGHTS };

  const [defaultWeight, outcomeWeight, speedWeight] = segments;
  const total = defaultWeight + outcomeWeight + speedWeight;
  if (total <= 0) return { ...DEFAULT_WEIGHTS };

  return {
    default: defaultWeight,
    outcome: outcomeWeight,
    speed: speedWeight
  };
}

export function assignHeroVariant(
  random = Math.random,
  weights = parseHeroVariantWeights()
): HeroVariantId {
  const safeRandom = Math.min(Math.max(random(), 0), 0.999999);
  const total = weights.default + weights.outcome + weights.speed;
  if (total <= 0) return 'default';

  const target = safeRandom * total;
  if (target < weights.default) return 'default';
  if (target < weights.default + weights.outcome) return 'outcome';
  return 'speed';
}

function readStoredVariant(): HeroVariantId | null {
  if (typeof window === 'undefined') return null;
  try {
    return parseHeroVariant(window.localStorage.getItem(HERO_VARIANT_STORAGE_KEY));
  } catch {
    return null;
  }
}

function persistVariant(variant: HeroVariantId) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(HERO_VARIANT_STORAGE_KEY, variant);
  } catch {
    // Ignore storage write errors (private mode / blocked storage).
  }
}

export function resolveHeroVariant(options: ResolveHeroVariantOptions): HeroVariantResolution {
  const queryVariant = parseHeroVariant(options.queryValue);
  if (queryVariant) {
    persistVariant(queryVariant);
    return { variant: queryVariant, source: 'query', experimentEnabled: isHeroExperimentEnabled(options.enabledRaw) };
  }

  const experimentEnabled = isHeroExperimentEnabled(options.enabledRaw);
  if (!experimentEnabled) {
    return { variant: 'default', source: 'default', experimentEnabled: false };
  }

  const storedVariant = readStoredVariant();
  if (storedVariant) {
    return { variant: storedVariant, source: 'storage', experimentEnabled: true };
  }

  const assignedVariant = assignHeroVariant(options.random ?? Math.random, parseHeroVariantWeights(options.weightsRaw));
  persistVariant(assignedVariant);
  return { variant: assignedVariant, source: 'assigned', experimentEnabled: true };
}
