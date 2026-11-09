import type { ReactNode } from 'react';

import { WhatsAppCta } from '@/components/layout';
import { Container } from '@/components/ui';
import { getSiteInfo } from '@/data';

const HEADING_CLASSES = 'mt-12 font-display text-2xl text-ink sm:text-3xl';
const BODY_CLASSES = 'mt-4 max-w-[62ch] leading-relaxed text-muted';
const LIST_CLASSES = 'mt-4 max-w-[62ch] list-disc space-y-2 pl-5 leading-relaxed text-muted';

type Ketentuan = {
  id: string;
  body: ReactNode;
};

/**
 * Empat butir ketentuan layanan, kata per kata sama dengan yang tampil di
 * halaman utama (sections/Ethics.tsx, bersumber dari brief §3.4). Teks ini
 * bukan Treatment, Area, Faq, atau Testimonial, jadi tidak ada di `@/data`,
 * dan halaman syarat wajib memuat rumusan yang identik dengan halaman utama.
 * Jangan diparafrase di salah satu tempat saja.
 */
const KETENTUAN: Ketentuan[] = [
  {
    id: 'terapis-pria',
    body: (
      <>
        Seluruh penanganan pijat dilakukan oleh{' '}
        <strong className="font-semibold text-ink">terapis pria profesional</strong> yang terlatih
        dan berpengalaman.
      </>
    ),
  },
  {
    id: 'pelanggan-wanita',
    body: (
      <>
        Layanan untuk <strong className="font-semibold text-ink">pelanggan wanita</strong>{' '}
        diberikan{' '}
        <strong className="font-semibold text-ink">
          khusus bagi yang memiliki keluhan kesehatan atau keluhan fisik tertentu
        </strong>
        , guna memastikan terapi tepat sasaran dan tetap mematuhi batasan etika.
      </>
    ),
  },
  {
    id: 'sifat-layanan',
    body: (
      <>
        Layanan bersifat{' '}
        <strong className="font-semibold text-ink">terapi dan kebugaran profesional</strong> dengan
        batasan pelayanan yang jelas.
      </>
    ),
  },
  {
    id: 'cedera-berat',
    body: (
      <>
        Cedera berat, cedera akut, atau patah tulang{' '}
        <strong className="font-semibold text-ink">wajib melalui pemeriksaan medis</strong>{' '}
        terlebih dahulu.
      </>
    ),
  },
];

/**
 * Syarat dan ketentuan layanan.
 *
 * Yang sengaja dinyatakan "belum ditetapkan", bukan diisi angka contoh: harga,
 * durasi, jam operasional, metode pembayaran, biaya transport, dan ketentuan
 * pembatalan. Semuanya menunggu pemilik usaha (DESIGN-SYSTEM.md §12). Satu
 * nominal karangan di halaman ini cukup untuk menjadi janji yang tidak bisa
 * ditepati saat pelanggan menagihnya.
 */
export default function Terms() {
  const site = getSiteInfo();

  return (
    <main className="bg-paper text-ink">
      <Container className="py-12 sm:py-16">
        <p className="label text-muted">Draf, menunggu peninjauan pemilik usaha</p>
        <h1 className="mt-4 font-display text-3xl text-ink sm:text-5xl">Syarat &amp; Ketentuan</h1>
        <p className="mt-6 max-w-[62ch] leading-relaxed text-muted">
          Ketentuan berikut berlaku untuk seluruh pemesanan layanan pijat panggilan {site.name}.
          Dengan memesan lewat WhatsApp, Anda dianggap telah membaca dan menyetujuinya.
        </p>

        <h2 className={HEADING_CLASSES}>Status dokumen ini</h2>
        <p className={BODY_CLASSES}>
          Ini draf. Isinya belum ditinjau dan belum disetujui pemilik usaha, jadi belum bisa
          diperlakukan sebagai dokumen hukum final. Nama badan hukum, alamat usaha, dan tanggal
          berlakunya belum dicantumkan karena datanya belum tersedia.
        </p>

        <h2 className={HEADING_CLASSES}>Ketentuan layanan</h2>
        <ol className="mt-6 max-w-[62ch] space-y-5">
          {KETENTUAN.map((item, index) => (
            <li key={item.id} className="flex gap-4 border-l-[3px] border-clay pl-4">
              <span
                aria-hidden="true"
                className="shrink-0 font-display text-2xl leading-none text-clay"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="text-base leading-relaxed text-muted">{item.body}</p>
            </li>
          ))}
        </ol>

        <h2 className={HEADING_CLASSES}>Harga, durasi, dan biaya transport</h2>
        <p className={BODY_CLASSES}>
          Hal-hal berikut belum ditetapkan pemilik usaha dan karena itu belum berlaku sebagai
          ketentuan yang mengikat. Semuanya dikonfirmasi langsung lewat WhatsApp sebelum sesi
          dimulai, dan tidak ada angka yang kami cantumkan sebelum pemilik usaha menetapkannya:
        </p>
        <ul className={LIST_CLASSES}>
          <li>Harga setiap treatment.</li>
          <li>Durasi setiap treatment.</li>
          <li>Jam operasional.</li>
          <li>Metode pembayaran.</li>
          <li>Biaya transport, yang menyesuaikan jarak dari lokasi Anda.</li>
          <li>Ketentuan pembatalan dan perubahan jadwal.</li>
        </ul>

        <h2 className={HEADING_CLASSES}>Pemesanan dan konfirmasi</h2>
        <p className={BODY_CLASSES}>
          Pemesanan hanya berlaku lewat WhatsApp dan baru sah setelah kami mengirim konfirmasi
          jadwal. Saat memesan, Anda melengkapi nama, jenis kelamin, alamat lengkap beserta
          patokan, area, pilihan treatment, hari dan jam, serta catatan keluhan khusus yang wajib
          diisi untuk pelanggan wanita.
        </p>
        <p className={BODY_CLASSES}>
          Area layanan mengikuti daftar yang tercantum di halaman utama. Permintaan di luar area
          itu kami pertimbangkan satu per satu dan bisa kami tolak.
        </p>

        <h2 className={HEADING_CLASSES}>Kewajiban pelanggan</h2>
        <ul className={LIST_CLASSES}>
          <li>
            Memberitahukan kondisi kesehatan, cedera, kehamilan, atau keluhan yang relevan sebelum
            sesi dimulai, supaya terapis bisa menyesuaikan penanganan atau menolak dengan alasan
            keselamatan.
          </li>
          <li>
            Melakukan pemeriksaan medis terlebih dahulu untuk cedera berat, cedera akut, atau
            patah tulang. Kondisi seperti itu di luar cakupan layanan kami.
          </li>
          <li>
            Menyediakan tempat yang aman dan layak untuk sesi di lokasi Anda, serta alamat dan
            patokan yang benar.
          </li>
          <li>Menghormati batasan pelayanan profesional yang disebut di ketentuan di atas.</li>
        </ul>

        <h2 className={HEADING_CLASSES}>Penghentian sesi</h2>
        <p className={BODY_CLASSES}>
          Terapis berhak menghentikan sesi bila ada permintaan di luar batasan pelayanan, bila
          keselamatan pelanggan atau terapis terancam, atau bila kondisi kesehatan yang baru
          diketahui di lokasi membuat penanganan tidak aman dilakukan.
        </p>

        <h2 className={HEADING_CLASSES}>Sifat layanan</h2>
        <p className={BODY_CLASSES}>
          Layanan ini adalah terapi dan kebugaran, bukan tindakan medis, dan bukan pengganti
          diagnosis maupun pengobatan dokter. Hasil setiap sesi berbeda antar orang dan tidak kami
          janjikan sebagai kesembuhan.
        </p>

        <h2 className={HEADING_CLASSES}>Perubahan ketentuan</h2>
        <p className={BODY_CLASSES}>
          Ketentuan ini akan diperbarui begitu harga, durasi, jam operasional, metode pembayaran,
          dan skema transport ditetapkan. Versi yang berlaku adalah yang tampil di halaman ini.
        </p>

        <p className="mt-12 max-w-[62ch] border-t border-line pt-8 leading-relaxed text-muted">
          Ada bagian yang perlu dijelaskan lebih dahulu sebelum Anda memesan? Tanyakan lewat
          WhatsApp.
        </p>
        <WhatsAppCta source="terms" variant="secondary" className="mt-5">
          Tanya lewat WhatsApp
        </WhatsAppCta>
      </Container>
    </main>
  );
}
