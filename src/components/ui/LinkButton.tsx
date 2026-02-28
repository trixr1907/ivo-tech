import { Button, type ButtonProps } from '@/components/ui/Button';

type Props = Extract<ButtonProps, { href: string }>;

export function LinkButton(props: Props) {
  return <Button {...props} />;
}
