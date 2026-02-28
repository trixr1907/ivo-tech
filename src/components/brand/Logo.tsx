import Image from 'next/image';

import { resolveLogoAssetPath, type LogoStyle, type LogoTone, type LogoVariant } from '@/components/brand/logoAssets';

type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

type Props = {
  variant: LogoVariant;
  tone?: LogoTone;
  style?: LogoStyle;
  size?: LogoSize;
  className?: string;
  alt?: string;
  priority?: boolean;
};

type Intrinsic = { width: number; height: number };

const INTRINSIC_DIMENSIONS: Record<LogoVariant, Intrinsic> = {
  'lockup-horizontal': { width: 760, height: 280 },
  'lockup-stacked': { width: 760, height: 760 },
  wordmark: { width: 2080, height: 460 },
  'mark-core': { width: 1024, height: 1024 },
  'mark-detailed': { width: 1024, height: 1024 },
  'mark-micro': { width: 1024, height: 1024 }
};

const SIZE_SCALE: Record<Exclude<LogoSize, number>, number> = {
  xs: 0.14,
  sm: 0.2,
  md: 0.28,
  lg: 0.36,
  xl: 0.5
};

function getRenderSize(variant: LogoVariant, size: LogoSize): Intrinsic {
  const intrinsic = INTRINSIC_DIMENSIONS[variant];

  if (typeof size === 'number') {
    if (variant.startsWith('mark')) {
      return { width: size, height: size };
    }

    const ratio = intrinsic.height / intrinsic.width;
    return { width: size, height: Math.round(size * ratio) };
  }

  const factor = SIZE_SCALE[size];
  return {
    width: Math.round(intrinsic.width * factor),
    height: Math.round(intrinsic.height * factor)
  };
}

export function Logo({
  variant,
  tone = 'dark',
  style = 'premium',
  size = 'md',
  className,
  alt = '',
  priority = false
}: Props) {
  const src = resolveLogoAssetPath(variant, tone, style);
  const { width, height } = getRenderSize(variant, size);

  return (
    <Image
      className={className}
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      priority={priority}
      unoptimized
      decoding="async"
    />
  );
}
