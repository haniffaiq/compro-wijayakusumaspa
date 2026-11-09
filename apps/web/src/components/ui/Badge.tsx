import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Label kategori kecil (DESIGN-SYSTEM §6.3): kategori treatment, area layanan. Bukan hiasan,
 * jadi hanya dipakai saat memang menandai status nyata.
 * Pakai kelas global `.label` (uppercase, tracking 0.18em) daripada mengulang utility tracking.
 */
export default function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'label inline-flex items-center rounded-sm border border-line px-2 py-1 text-muted',
        className,
      )}
    >
      {children}
    </span>
  );
}
