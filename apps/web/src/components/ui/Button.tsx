import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon';

type CommonProps = {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    /** Default. Dipakai untuk aksi (submit form, buka dialog), bukan navigasi. */
    as?: 'button';
  };

type ButtonAsAnchor = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & {
    /** Dipakai untuk navigasi (pindah halaman/anchor). Jangan pakai `<div>` yang diklik lewat JS. */
    as: 'a';
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

// DESIGN-SYSTEM §6.1: target interaktif minimum 44x44px di semua varian dan semua breakpoint.
const baseClasses =
  'inline-flex min-h-11 min-w-11 items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-colors duration-150 [transition-timing-function:ease] disabled:cursor-not-allowed disabled:opacity-60';

// Radius selalu sm (hampir tajam), kecuali tombol ikon yang lingkaran penuh (§5.1, §6.1).
const variantClasses: Record<ButtonVariant, string> = {
  primary: 'rounded-sm bg-clay px-5 py-3 text-paper hover:bg-clay-deep',
  secondary:
    'rounded-sm border border-ink bg-transparent px-5 py-3 text-ink hover:bg-ink hover:text-paper',
  ghost: 'rounded-sm bg-transparent px-2 py-3 text-ink hover:underline',
  icon: 'rounded-full border border-line bg-transparent p-0 text-ink hover:border-ink',
};

/**
 * Satu komponen untuk dua kasus pakai: `as="a"` untuk navigasi (butuh `href`), default `button`
 * untuk aksi. Tanpa shadow (§5.3), hierarki lewat warna dan border saja.
 */
export default function Button(props: ButtonProps) {
  const { variant = 'primary', className, children, as, ...rest } = props;
  const classes = cn(baseClasses, variantClasses[variant], className);

  // `as` sudah dicek di sini untuk pembeda; `rest` tidak ikut ter-narrow otomatis oleh TS
  // karena keduanya hasil destructure terpisah, jadi perlu assertion eksplisit per cabang.
  if (as === 'a') {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={buttonRest.type ?? 'button'} className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
