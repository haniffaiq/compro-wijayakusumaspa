import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button, Container } from '@/components/ui';
import { getSiteInfo } from '@/data';
import { useScrollSpy, useScrolled } from '@/hooks';
import { cn } from '@/lib/utils';

import MobileDrawer from './MobileDrawer';
import type { DrawerLink } from './MobileDrawer';
import { WhatsAppCta } from './WhatsAppDialog';

/**
 * Lima anchor halaman utama. id-nya adalah kontrak dengan worker section: tiap section wajib
 * memakai id yang sama, kalau tidak tautan ini menunjuk ke tempat yang tidak ada.
 *
 * Daftar yang sama diulang di Footer.tsx, bukan di-export dari sini, karena file komponen yang
 * meng-export konstanta non-primitif mematikan fast refresh (aturan react-refresh), dan folder
 * layout ini tidak boleh ditambah file baru.
 */
const NAV_LINKS: readonly DrawerLink[] = [
  { id: 'layanan', label: 'Layanan' },
  { id: 'area', label: 'Area' },
  { id: 'ketentuan', label: 'Ketentuan' },
  { id: 'ulasan', label: 'Ulasan' },
  { id: 'faq', label: 'FAQ' },
];

const SECTION_IDS = NAV_LINKS.map((link) => link.id);

const DRAWER_ID = 'menu-navigasi';

/** Ambang gulir sebelum navbar memakai garis pembatas. Cukup kecil supaya terasa langsung. */
const SCROLLED_THRESHOLD_PX = 24;

/**
 * Tinggi navbar sticky plus sedikit kelonggaran. Dipakai sebagai scroll-padding-top di elemen
 * akar supaya judul section tidak tertutup navbar saat anchor diklik. Nilainya diset dari sini,
 * bukan ditempel scroll-mt di tiap section, supaya tingginya punya satu sumber kebenaran.
 */
const SCROLL_PADDING_TOP = '5rem';

type WordmarkProps = {
  /** Selalu dari getSiteInfo().name, jangan pernah ditulis ulang di JSX. */
  name: string;
  className?: string;
};

/**
 * Wordmark tipografis. Logo resmi belum ada (DESIGN-SYSTEM §1), jadi identitasnya adalah nama
 * dalam Fraunces dengan ampersand italic clay sebagai motif.
 *
 * Catatan kontras: clay di atas ink hanya lolos untuk teks besar (§2.4), jadi di atas latar ink
 * pemanggil wajib memakai ukuran minimal text-2xl (24px).
 */
export function Wordmark({ name, className }: WordmarkProps) {
  const [head, tail] = name.split('&');

  if (tail === undefined) {
    return <span className={cn('font-display', className)}>{name}</span>;
  }

  return (
    <span className={cn('font-display', className)}>
      {head.trim()} <span className="italic text-clay">&amp;</span> {tail.trim()}
    </span>
  );
}

/**
 * Chrome navigasi minim (DESIGN-SYSTEM §6.5), bukan nav bar penuh: satu baris, wordmark kiri,
 * label kecil dan tombol lingkaran 44px di kanan.
 *
 * Di bawah lg, kelima anchor pindah ke overlay penuh layar supaya barisnya tetap satu dan tidak
 * memakan layar yang sudah sempit. Dari lg ke atas, overlay tidak perlu karena anchor-nya muat
 * inline, jadi tombol menu disembunyikan daripada menyediakan dua jalan ke hal yang sama.
 */
export default function Navbar() {
  const site = getSiteInfo();
  const scrolled = useScrolled(SCROLLED_THRESHOLD_PX);
  const activeId = useScrollSpy(SECTION_IDS);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const previous = root.style.scrollPaddingTop;
    root.style.scrollPaddingTop = SCROLL_PADDING_TOP;
    return () => {
      root.style.scrollPaddingTop = previous;
    };
  }, []);

  return (
    <>
      <header
        className={cn(
          // bg-paper solid, bukan paper/95 plus blur: glassmorphism termasuk yang dihindari di
          // arah visual ini (§0), dan latar solid menjamin kontras teks apa pun yang lewat.
          'sticky top-0 z-40 border-b bg-paper transition-colors duration-150 [transition-timing-function:ease]',
          scrolled ? 'border-line' : 'border-transparent',
        )}
      >
        <Container className="flex items-center justify-between gap-3 py-2 lg:py-3">
          {/*
            min-w-0 plus truncate adalah jaring pengaman lebar: di 360px wordmark masih muat
            utuh, dan di lebar yang lebih sempit lagi dia memendek sendiri alih-alih mendorong
            seluruh halaman jadi bisa digulir ke samping.
          */}
          <Link to="/" className="inline-flex min-h-11 min-w-0 items-center">
            <Wordmark
              name={site.name}
              className="block truncate text-sm leading-tight sm:text-xl lg:text-2xl"
            />
          </Link>

          <nav aria-label="Navigasi halaman" className="hidden lg:block">
            <ul className="flex items-center">
              {NAV_LINKS.map((link) => {
                const active = link.id === activeId;

                return (
                  <li key={link.id}>
                    {/* Href absolut supaya anchor tetap benar dari route sekunder. */}
                    <a
                      href={`/#${link.id}`}
                      aria-current={active ? 'true' : undefined}
                      className={cn(
                        'label inline-flex min-h-11 items-center px-3 transition-colors duration-150 [transition-timing-function:ease]',
                        // Penanda aktif tidak bergantung warna saja: ada garis bawah dan
                        // aria-current. clay-deep dipakai, bukan clay, karena teks label kecil
                        // butuh rasio AA normal di atas paper (§2.4).
                        active
                          ? 'text-clay-deep underline decoration-2 underline-offset-4'
                          : 'text-muted hover:text-ink',
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <WhatsAppCta
              source="navbar"
              variant="ghost"
              className="label px-0 text-ink hover:text-clay-deep hover:no-underline sm:px-2"
            >
              WhatsApp
            </WhatsAppCta>

            <div className="flex items-center gap-2 lg:hidden">
              <span className="label hidden select-none text-muted sm:inline" aria-hidden="true">
                Menu
              </span>
              <Button
                variant="icon"
                aria-label="Buka menu navigasi"
                aria-haspopup="dialog"
                aria-expanded={menuOpen}
                aria-controls={DRAWER_ID}
                onClick={() => setMenuOpen(true)}
                className="h-11 w-11"
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
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </svg>
              </Button>
            </div>
          </div>
        </Container>
      </header>

      {/* Di luar <header> supaya dialog top layer tidak bergantung pada konteks sticky. */}
      <MobileDrawer
        id={DRAWER_ID}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={NAV_LINKS}
        activeId={activeId}
      />
    </>
  );
}
