import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type AccordionProps = {
  question: ReactNode;
  children: ReactNode;
  /** Samakan `name` antar item FAQ supaya browser menutup item lain saat satu dibuka (grouping native). */
  name?: string;
  className?: string;
};

/**
 * <details>/<summary> native (DESIGN-SYSTEM §6.4): keyboard dan screen reader sudah benar
 * tanpa state React maupun JavaScript tambahan. Indikator "+" dibangun lewat varian
 * Tailwind `after:`/`group-open:` di atas `::after`, supaya tidak perlu menambah CSS global.
 */
export default function Accordion({ question, children, name, className }: AccordionProps) {
  return (
    <details
      name={name}
      className={cn('group border-t border-line py-5 last:border-b sm:py-6', className)}
    >
      <summary
        className={cn(
          'relative flex min-h-11 cursor-pointer list-none items-center gap-4 py-1 pr-8 font-display text-lg text-ink',
          '[&::-webkit-details-marker]:hidden',
          "after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:font-sans after:text-xl after:font-semibold after:leading-none after:text-ink after:transition-transform after:duration-200 after:content-['+'] after:[transition-timing-function:ease]",
          'group-open:after:rotate-45',
          'sm:text-xl',
        )}
      >
        {question}
      </summary>
      <div className="mt-3 max-w-2xl text-muted">{children}</div>
    </details>
  );
}
