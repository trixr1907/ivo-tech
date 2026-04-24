import type { ReactElement, SVGProps } from 'react';

export type BrandIconName = 'frontend' | 'backend' | 'ops';
export type BrandIconStyle = 'outline' | 'duotone' | 'metallic';

type IconProps = Omit<SVGProps<SVGSVGElement>, 'name'> & {
  name: BrandIconName;
  size?: number;
  strokeWidth?: number;
  styleVariant?: BrandIconStyle;
};

type IconShapeProps = {
  duotone: boolean;
};

function FrontendIcon({ duotone }: IconShapeProps) {
  return (
    <>
      <rect x="3.5" y="4.5" width="17" height="13" rx="2" />
      <path d="M9 20h6" />
      <path d="M12 17.5V20" />
      {duotone ? <rect x="6.5" y="7.5" width="11" height="7" rx="1" className="icon-fill" /> : null}
    </>
  );
}

function BackendIcon({ duotone }: IconShapeProps) {
  return (
    <>
      <ellipse cx="12" cy="6.5" rx="7.5" ry="2.8" />
      <path d="M4.5 6.5v4.5c0 1.55 3.35 2.8 7.5 2.8s7.5-1.25 7.5-2.8V6.5" />
      <path d="M4.5 11v4.5c0 1.55 3.35 2.8 7.5 2.8s7.5-1.25 7.5-2.8V11" />
      {duotone ? <ellipse cx="12" cy="6.5" rx="5.2" ry="1.6" className="icon-fill" /> : null}
    </>
  );
}

function OpsIcon({ duotone }: IconShapeProps) {
  return (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.5v3" />
      <path d="M12 17.5v3" />
      <path d="M3.5 12h3" />
      <path d="M17.5 12h3" />
      <path d="M5.95 5.95l2.12 2.12" />
      <path d="M15.93 15.93l2.12 2.12" />
      <path d="M18.05 5.95l-2.12 2.12" />
      <path d="M8.07 15.93l-2.12 2.12" />
      {duotone ? <circle cx="12" cy="12" r="1.8" className="icon-fill" /> : null}
    </>
  );
}

const ICON_MAP: Record<BrandIconName, (props: IconShapeProps) => ReactElement> = {
  frontend: FrontendIcon,
  backend: BackendIcon,
  ops: OpsIcon
};

export function Icon({ name, size = 24, strokeWidth = 1.75, styleVariant = 'outline', className, ...rest }: IconProps) {
  const Render = ICON_MAP[name];
  const duotone = styleVariant === 'duotone' || styleVariant === 'metallic';
  const variantClass = styleVariant === 'metallic' ? 'brand-icon--metallic' : undefined;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={[ 'brand-icon', variantClass, className ].filter(Boolean).join(' ')}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      <Render duotone={duotone} />
    </svg>
  );
}
