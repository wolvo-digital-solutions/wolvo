import { useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useMagnetic } from '@/hooks/useMagnetic';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';
type IconName = 'arrow-right' | 'arrow-up-right' | 'arrow-down' | 'none';

const ICONS = { 'arrow-right': ArrowRight, 'arrow-up-right': ArrowUpRight, 'arrow-down': ArrowDown } as const;

interface BaseProps {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  block?: boolean;
  /** Desktop-only magnetic pull (primary CTAs). */
  magnetic?: boolean;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = BaseProps & Omit<ComponentPropsWithoutRef<'button'>, keyof BaseProps> & { href?: undefined };
type ButtonAsLink = BaseProps & Omit<ComponentPropsWithoutRef<'a'>, keyof BaseProps> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = 'primary',
  size = 'md',
  icon = 'arrow-right',
  block,
  magnetic,
  children,
  className,
  ...rest
}: ButtonProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  useMagnetic(wrapRef, { enabled: !!magnetic });

  const Icon = icon !== 'none' ? ICONS[icon] : null;
  const classes = ['btn', `btn--${variant}`, size !== 'md' && `btn--${size}`, block && 'btn--block', className]
    .filter(Boolean)
    .join(' ');

  const content = (
    <span className="btn__label" data-magnetic-label>
      {children}
      {Icon && <Icon className={`btn__icon btn__icon--${icon}`} strokeWidth={2} aria-hidden="true" />}
    </span>
  );

  const element =
    'href' in rest && rest.href !== undefined ? (
      <a className={classes} {...(rest as ComponentPropsWithoutRef<'a'>)}>
        {content}
      </a>
    ) : (
      <button type="button" className={classes} {...(rest as ComponentPropsWithoutRef<'button'>)}>
        {content}
      </button>
    );

  if (!magnetic) return element;
  return (
    <span ref={wrapRef} className={`magnetic${block ? ' btn--block' : ''}`}>
      {element}
    </span>
  );
}
