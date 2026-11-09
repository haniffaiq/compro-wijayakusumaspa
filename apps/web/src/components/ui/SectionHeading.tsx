import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type SectionHeadingProps = {
  /** Hanya render bila membawa informasi yang tidak ada di judul (DESIGN-SYSTEM §6.8). */
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /**
   * Tag HTML heading, default `h2`. Ubah ini supaya hierarki `<h1>`-`<h6>` halaman tidak
   * melompat; ukuran visual tetap mengikuti token `h2` apa pun levelnya (AGENTS.md §8).
   */
  level?: HeadingLevel;
  className?: string;
  id?: string;
};

/**
 * Judul section. Rata kiri di semua breakpoint, tanpa ornamen (§6.8): pemisah hanya lewat
 * garis `line` atau pembalikan warna yang diatur section itu sendiri, bukan di sini.
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  level = 'h2',
  className,
  id,
}: SectionHeadingProps) {
  const Heading = level;

  return (
    <div className={cn('text-left', className)}>
      {eyebrow ? <p className="label text-muted">{eyebrow}</p> : null}
      <Heading
        id={id}
        className={cn('font-display text-ink', eyebrow && 'mt-2', 'text-2xl sm:text-4xl')}
      >
        {title}
      </Heading>
      {subtitle ? <p className="mt-4 max-w-2xl text-muted">{subtitle}</p> : null}
    </div>
  );
}
