import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type ContainerProps = {
  /** Elemen pembungkus. Default `div`; `section`/`footer` dipakai agar landmark semantik tidak hilang (AGENTS.md §8). */
  as?: 'div' | 'section' | 'footer';
  className?: string;
  children: ReactNode;
};

/**
 * Satu sumber kebenaran untuk max-width dan padding horizontal halaman (DESIGN-SYSTEM §4.2).
 * Jangan ulangi `max-w-content px-4 sm:px-6` di komponen lain, pakai ini.
 */
export default function Container({ as = 'div', className, children }: ContainerProps) {
  const Component = as;

  return (
    <Component className={cn('mx-auto max-w-content px-4 sm:px-6', className)}>
      {children}
    </Component>
  );
}
