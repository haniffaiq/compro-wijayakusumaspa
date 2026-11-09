import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

export type DrawerLink = {
  /** id section tujuan, tanpa tanda pagar. */
  id: string;
  label: string;
};

type MobileDrawerProps = {
  /** Dipasang di elemen dialog supaya pemicu bisa menunjuknya lewat aria-controls. */
  id: string;
  open: boolean;
  onClose: () => void;
  links: readonly DrawerLink[];
  /** id section yang sedang terlihat, dari useScrollSpy. */
  activeId?: string | null;
};

const TITLE_ID = 'menu-navigasi-judul';

/**
 * Overlay navigasi penuh layar (DESIGN-SYSTEM §6.6). Dibangun di atas <dialog> native, jadi
 * Escape, latar inert, dan pengembalian fokus ke tombol pemicu datang dari browser, bukan dari
 * state React yang harus dijaga sendiri.
 *
 * Isinya sengaja hanya navigasi. Menaruh CTA WhatsApp di sini akan berarti satu dialog modal
 * dibuka dari dalam dialog modal lain, dan dialog anak yang berada di subtree dialog tertutup
 * tidak akan pernah tampil. CTA WhatsApp tetap selalu terjangkau lewat navbar dan bilah bawah.
 */
export default function MobileDrawer({
  id,
  open,
  onClose,
  links,
  activeId = null,
}: MobileDrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Prerender di Node tidak punya HTMLDialogElement, dan ref-nya null di sana, jadi showModal
  // hanya pernah dipanggil setelah hidrasi di browser.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open && typeof dialog.showModal === 'function') dialog.showModal();
      return;
    }

    if (dialog.open) dialog.close();
  }, [open]);

  // Tanpa ini latar ikut bergeser di iOS walaupun dialognya modal (AGENTS.md §17.1 butir 7).
  useEffect(() => {
    if (!open || typeof document === 'undefined') return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <dialog
      id={id}
      ref={dialogRef}
      aria-labelledby={TITLE_ID}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className="fixed inset-x-0 top-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-transparent p-0 backdrop:bg-ink/80"
    >
      <div className="on-dark flex h-full flex-col bg-ink text-paper">
        <div className="mx-auto flex w-full max-w-content items-center justify-between gap-3 px-4 py-2 sm:px-6 sm:py-3">
          <p id={TITLE_ID} className="label text-muted-inv">
            Menu
          </p>
          <Button
            variant="icon"
            aria-label="Tutup menu navigasi"
            onClick={onClose}
            className="h-11 w-11 border-paper/60 text-paper hover:border-paper"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            >
              <line x1="5" y1="5" x2="19" y2="19" />
              <line x1="19" y1="5" x2="5" y2="19" />
            </svg>
          </Button>
        </div>

        <nav
          aria-label="Navigasi menu"
          className="mx-auto flex w-full max-w-content flex-1 flex-col justify-center overflow-y-auto px-4 py-8 sm:px-6"
        >
          <ul>
            {links.map((link) => {
              const active = link.id === activeId;

              return (
                <li key={link.id}>
                  {/*
                    Href absolut "/#id" supaya tautan ini tetap benar dari route sekunder
                    (kebijakan privasi, syarat ketentuan) tempat section itu tidak ada.
                  */}
                  <a
                    href={`/#${link.id}`}
                    aria-current={active ? 'true' : undefined}
                    onClick={onClose}
                    className={cn(
                      'inline-flex min-h-11 items-center py-1 font-display text-3xl leading-tight transition-colors duration-150 [transition-timing-function:ease] sm:text-5xl',
                      // clay di atas ink hanya lolos kontras untuk teks besar (§2.4), dan ukuran
                      // tautan ini jauh di atas 24px. Penanda aktif tidak bergantung warna saja:
                      // ada garis bawah dan aria-current.
                      active
                        ? 'text-clay underline decoration-2 underline-offset-[0.2em]'
                        : 'text-paper hover:text-muted-inv',
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </dialog>
  );
}
