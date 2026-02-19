type BrandLockupVariant = 'header' | 'compact' | 'meta';

type BrandLockupProps = {
  variant: BrandLockupVariant;
  className?: string;
};

function joinClassNames(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export function BrandLockup({ variant, className }: BrandLockupProps) {
  const rootClassName = joinClassNames('brand-lockup', `brand-lockup--${variant}`, className);
  const showWordmark = variant !== 'meta';
  const loading: 'eager' | 'lazy' = variant === 'header' ? 'eager' : 'lazy';

  return (
    <span className={rootClassName} role="img" aria-label="ivo-tech">
      <picture className="brand-lockup-mark-wrap">
        <source srcSet="/assets/logo-mark.avif" type="image/avif" />
        <source srcSet="/assets/logo-mark.webp" type="image/webp" />
        <img className="brand-lockup-mark" src="/assets/logo-mark.png" alt="" width={64} height={64} loading={loading} decoding="async" />
      </picture>

      {showWordmark ? (
        <picture className="brand-lockup-wordmark-wrap">
          <source srcSet="/assets/logo.avif" type="image/avif" />
          <source srcSet="/assets/logo.webp" type="image/webp" />
          <img className="brand-lockup-wordmark" src="/assets/logo.png" alt="" width={240} height={64} loading={loading} decoding="async" />
        </picture>
      ) : null}
    </span>
  );
}
