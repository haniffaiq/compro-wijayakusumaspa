import { Container } from '@/components/ui';
import { useScrolled } from '@/hooks';

import { WhatsAppCta } from './WhatsAppDialog';

/**
 * Kira-kira setinggi satu layar ponsel kelas bawah, jadi bilah ini baru muncul setelah pembuka
 * benar-benar terlewat, bukan langsung menempel saat halaman terbuka.
 */
const SHOW_AFTER_PX = 420;

/**
 * Aksi WhatsApp saat menggulir (DESIGN-SYSTEM §6.7). Bilah tipis menempel di dasar layar,
 * bukan bulatan mengambang: bulatan menutupi konten dan tidak punya tempat untuk kalimat ajakan.
 *
 * Ruang kompensasi setinggi bilah ini ada di RootLayout, bukan di sini, karena bilahnya fixed
 * dan tidak bisa menyisihkan ruang untuk dirinya sendiri.
 *
 * Saat belum terlihat, komponen tidak dirender sama sekali alih-alih digeser keluar layar.
 * Bilah tersembunyi yang masih berisi tombol akan tetap bisa difokus dengan Tab, dan arah visual
 * ini juga melarang animasi dekoratif (§9 MOTION 1), jadi transisi masuk tidak dibutuhkan.
 */
export default function WhatsAppBar() {
  const scrolled = useScrolled(SHOW_AFTER_PX);

  if (!scrolled) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper pb-[env(safe-area-inset-bottom)]">
      <Container className="flex items-center justify-between gap-3 py-2.5">
        {/* Kalimatnya pendek supaya bilah tetap tipis saat teks membungkus di 360px. */}
        <p className="min-w-0 text-sm leading-snug text-ink">
          Atur jadwal kunjungan terapis Anda.
        </p>
        <WhatsAppCta source="sticky-bar" className="shrink-0" />
      </Container>
    </div>
  );
}
