import type { HTMLAttributes, ReactNode } from 'react';

type Props = HTMLAttributes<HTMLDivElement> & {
  title: string;
  description: string;
  titleId?: string;
  actions?: ReactNode;
};

function joinClassNames(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(' ');
}

export function SectionHead({ title, description, titleId, actions, className, ...rest }: Props) {
  return (
    <div {...rest} className={joinClassNames('section-head', className)}>
      <h2 id={titleId}>{title}</h2>
      <p>{description}</p>
      {actions ? <div className="section-head-actions">{actions}</div> : null}
    </div>
  );
}
