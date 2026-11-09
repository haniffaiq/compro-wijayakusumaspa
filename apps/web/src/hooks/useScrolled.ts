import { useEffect, useState } from 'react';

const DEFAULT_THRESHOLD = 10;

/**
 * Mengembalikan true setelah halaman tergulir melewati `thresholdPx`,
 * dipakai Navbar untuk berubah dari chrome minim ke state solid
 * (DESIGN-SYSTEM.md §6.5) dan untuk memunculkan bilah aksi WhatsApp.
 */
export function useScrolled(thresholdPx: number = DEFAULT_THRESHOLD): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // vite-react-ssg merender komponen ini di Node tanpa objek `window`.
    // Effect ini hanya jalan setelah hidrasi di browser, tapi dijaga
    // eksplisit supaya tidak diam-diam gagal kalau lingkungan eksekusinya
    // berubah di kemudian hari.
    if (typeof window === 'undefined') return;

    const handleScroll = (): void => {
      const next = window.scrollY > thresholdPx;
      // Spec minta tidak memaksa render ulang kalau nilainya sama persis,
      // supaya event scroll yang sering menembak tidak bikin komponen
      // konsumen render ulang tanpa perlu.
      setScrolled((prev) => (prev === next ? prev : next));
    };

    // Jalankan sekali di awal: halaman bisa termuat sudah tergulir
    // (reload dengan hash anchor, tombol back), bukan cuma saat scroll baru.
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [thresholdPx]);

  return scrolled;
}
