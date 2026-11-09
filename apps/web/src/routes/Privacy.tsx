import { WhatsAppCta } from '@/components/layout';
import { Container } from '@/components/ui';
import { getSiteInfo } from '@/data';

/**
 * Daftar alat pengukuran yang benar-benar terpasang di build ini. Dibaca dari
 * env yang sama dengan lib/analytics.ts, jadi halaman ini tidak pernah
 * menjanjikan atau menyangkal cookie yang keadaannya berbeda dari kodenya.
 *
 * Vite mengganti import.meta.env saat build, jadi nilainya sudah tetap ketika
 * prerender berjalan di Node dan hasil hidrasi di peramban membaca nilai yang
 * sama. Tidak ada akses window di sini.
 */
function readEnv(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

const MEASUREMENT_TOOLS = [
  readEnv(import.meta.env.VITE_GA4_ID) === null ? null : 'Google Analytics 4',
  readEnv(import.meta.env.VITE_META_PIXEL_ID) === null ? null : 'Meta Pixel',
].filter((tool): tool is string => tool !== null);

const HEADING_CLASSES = 'mt-12 font-display text-2xl text-ink sm:text-3xl';
const BODY_CLASSES = 'mt-4 max-w-[62ch] leading-relaxed text-muted';
const LIST_CLASSES = 'mt-4 max-w-[62ch] list-disc space-y-2 pl-5 leading-relaxed text-muted';

/**
 * Kebijakan privasi. Isinya menggambarkan keadaan website ini apa adanya:
 * tidak ada formulir yang mengirim data ke server, tidak ada basis data
 * pelanggan, dan seluruh percakapan terjadi di WhatsApp.
 *
 * Yang sengaja TIDAK ditulis di sini: nama badan hukum, alamat kantor, alamat
 * email, dan tanggal berlaku. Keempatnya belum ada datanya, dan mengarangnya di
 * halaman yang justru dipakai untuk verifikasi Meta Ads adalah cara tercepat
 * membuat dokumen ini jadi bohong (REQUIREMENTS.md §7).
 */
export default function Privacy() {
  const site = getSiteInfo();

  return (
    <main className="bg-paper text-ink">
      <Container className="py-12 sm:py-16">
        <p className="label text-muted">Draf, menunggu peninjauan pemilik usaha</p>
        <h1 className="mt-4 font-display text-3xl text-ink sm:text-5xl">Kebijakan Privasi</h1>
        <p className="mt-6 max-w-[62ch] leading-relaxed text-muted">
          Halaman ini menjelaskan data apa saja yang tersentuh ketika Anda membuka website{' '}
          {site.name} dan ketika Anda memesan layanan. Ditulis sesuai keadaan website saat ini,
          bukan disalin dari templat.
        </p>

        <h2 className={HEADING_CLASSES}>Status dokumen ini</h2>
        <p className={BODY_CLASSES}>
          Ini draf. Isinya belum ditinjau dan belum disetujui pemilik usaha, jadi belum bisa
          diperlakukan sebagai dokumen hukum final. Nama badan hukum, alamat usaha, alamat email
          resmi, dan tanggal berlakunya belum dicantumkan karena datanya belum tersedia.
        </p>

        <h2 className={HEADING_CLASSES}>Website ini tidak mengumpulkan data Anda</h2>
        <p className={BODY_CLASSES}>
          Website ini terdiri dari halaman statis. Tidak ada satu pun formulir yang mengirim isian
          Anda ke server kami, karena memang tidak ada server aplikasi maupun basis data pelanggan
          di belakangnya. Yang berarti:
        </p>
        <ul className={LIST_CLASSES}>
          <li>Tidak ada pendaftaran akun, login, maupun kata sandi.</li>
          <li>Tidak ada kolom nama, nomor telepon, atau alamat yang dikirim dari halaman ini.</li>
          <li>
            Tombol pemesanan hanya menyiapkan teks pesan lalu membuka WhatsApp. Teks itu tersusun
            di peramban Anda dan tidak dikirim ke mana pun sebelum Anda sendiri mengirimnya.
          </li>
        </ul>

        <h2 className={HEADING_CLASSES}>Percakapan terjadi di WhatsApp</h2>
        <p className={BODY_CLASSES}>
          Seluruh pemesanan dan tanya jawab berlangsung di WhatsApp. Data yang Anda kirimkan di
          sana, misalnya nama, jenis kelamin, alamat lengkap beserta patokan, pilihan treatment,
          jadwal, dan catatan keluhan, kami terima sebagai pesan WhatsApp biasa dan kami pakai
          hanya untuk melayani pemesanan Anda beserta tindak lanjutnya.
        </p>
        <p className={BODY_CLASSES}>
          Percakapan itu tersimpan di aplikasi WhatsApp pada perangkat masing-masing dan tunduk
          pada kebijakan privasi WhatsApp serta Meta, yang berada di luar kendali kami. Kami tidak
          menyalin isi percakapan ke sistem lain, dan tidak menjual atau menukarkannya ke pihak
          ketiga mana pun.
        </p>

        <h2 className={HEADING_CLASSES}>Cookie dan pengukuran kunjungan</h2>
        {MEASUREMENT_TOOLS.length === 0 ? (
          <p className={BODY_CLASSES}>
            Versi website ini tidak memasang alat pengukuran kunjungan maupun pixel iklan, jadi
            website ini sendiri tidak menyimpan cookie apa pun di peramban Anda. Bila nanti alat
            pengukuran dipasang, bagian ini berubah mengikuti keadaan sebenarnya, bukan dibiarkan
            seperti sekarang.
          </p>
        ) : (
          <>
            <p className={BODY_CLASSES}>
              Versi website ini memasang {MEASUREMENT_TOOLS.join(' dan ')}. Skripnya dimuat setelah
              halaman tampil dan menyimpan cookie di peramban Anda untuk mengenali kunjungan yang
              berulang serta mengukur keefektifan iklan.
            </p>
            <ul className={LIST_CLASSES}>
              <li>
                Yang terkirim adalah data kunjungan seperti halaman yang dibuka, waktu kunjungan,
                jenis perangkat, dan perkiraan lokasi dari alamat IP.
              </li>
              <li>
                Klik tombol WhatsApp dikirim sebagai satu peristiwa berisi nama bagian halaman dan
                nama treatment yang Anda klik. Tidak ada nama, nomor, atau alamat Anda di dalamnya.
              </li>
              <li>
                Data kunjungan itu diolah oleh Google dan Meta sebagai penyedia layanannya, sesuai
                kebijakan privasi masing-masing.
              </li>
            </ul>
            <p className={BODY_CLASSES}>
              Anda bisa menolak atau menghapus cookie ini lewat pengaturan peramban Anda. Website
              tetap berfungsi penuh tanpanya.
            </p>
          </>
        )}

        <h2 className={HEADING_CLASSES}>Layanan pihak ketiga yang dimuat halaman ini</h2>
        <p className={BODY_CLASSES}>
          Huruf yang dipakai halaman ini dimuat dari Google Fonts. Karena berkasnya diminta
          langsung oleh peramban Anda, alamat IP Anda terbaca oleh server Google saat pemuatan itu
          terjadi. Selain itu, tombol pemesanan mengarah ke WhatsApp, yang terbuka sebagai
          aplikasi atau situs terpisah dengan kebijakan privasinya sendiri.
        </p>

        <h2 className={HEADING_CLASSES}>Permintaan terkait data Anda</h2>
        <p className={BODY_CLASSES}>
          Karena satu-satunya data yang kami pegang adalah riwayat percakapan WhatsApp Anda, Anda
          bisa meminta kami menghapus percakapan tersebut kapan saja lewat WhatsApp. Permintaan itu
          kami jalankan pada arsip percakapan di sisi kami.
        </p>

        <h2 className={HEADING_CLASSES}>Perubahan kebijakan</h2>
        <p className={BODY_CLASSES}>
          Kebijakan ini akan diperbarui ketika layanan berubah, misalnya ketika formulir pemesanan
          atau alat pengukuran kunjungan mulai dipasang. Versi yang berlaku adalah yang tampil di
          halaman ini.
        </p>

        <p className="mt-12 max-w-[62ch] border-t border-line pt-8 leading-relaxed text-muted">
          Ada yang ingin ditanyakan soal kebijakan ini? Sampaikan lewat WhatsApp.
        </p>
        <WhatsAppCta source="privacy" variant="secondary" className="mt-5">
          Tanya lewat WhatsApp
        </WhatsAppCta>
      </Container>
    </main>
  );
}
