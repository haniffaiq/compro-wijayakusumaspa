import { Outlet } from 'react-router-dom';

import Footer from './Footer';
import Navbar from './Navbar';
import WhatsAppBar from './WhatsAppBar';

const MAIN_CONTENT_ID = 'konten-utama';

/**
 * Shell yang membungkus semua route: navbar sticky, penutup, dan bilah aksi WhatsApp dipasang
 * sekali di sini, bukan diulang di tiap route.
 *
 * Padding bawah di pembungkus halaman adalah ruang kompensasi untuk WhatsAppBar yang fixed
 * (DESIGN-SYSTEM §6.7). Nilainya tetap, terpasang baik saat bilahnya terlihat maupun tidak,
 * supaya kemunculan bilah tidak menggeser layout. Operator plus di dalam calc() dikelilingi
 * garis bawah, syarat arbitrary value Tailwind: tanpa itu deklarasinya dibuang tanpa pesan.
 */
export default function RootLayout() {
  return (
    <>
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-sm focus:bg-ink focus:px-4 focus:text-sm focus:font-semibold focus:text-paper"
      >
        Lewati ke konten utama
      </a>

      <div className="flex min-h-dvh flex-col pb-[calc(5.5rem_+_env(safe-area-inset-bottom))]">
        <Navbar />
        <div id={MAIN_CONTENT_ID} tabIndex={-1} className="flex-1">
          <Outlet />
        </div>
        <Footer />
      </div>

      <WhatsAppBar />
    </>
  );
}
