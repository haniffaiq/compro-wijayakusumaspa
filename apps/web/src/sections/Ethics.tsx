import type { ReactNode } from 'react';

import { Container } from '@/components/ui';

type KetentuanItem = {
  id: string;
  body: ReactNode;
};

/**
 * Empat butir dari mockups/BRIEF.md §3.4, VERBATIM, termasuk bagian yang ditebalkan.
 * Teks ini tidak ada di `@/data` (bukan Treatment, Area, Faq, atau Testimonial), jadi
 * sengaja ditulis di sini sebagai satu-satunya tempatnya. Jangan diparafrase.
 */
const KETENTUAN: KetentuanItem[] = [
  {
    id: 'terapis-pria',
    body: (
      <>
        Seluruh penanganan pijat dilakukan oleh{' '}
        <strong className="font-semibold">terapis pria profesional</strong> yang terlatih dan
        berpengalaman.
      </>
    ),
  },
  {
    id: 'pelanggan-wanita',
    body: (
      <>
        Layanan untuk <strong className="font-semibold">pelanggan wanita</strong> diberikan{' '}
        <strong className="font-semibold">
          khusus bagi yang memiliki keluhan kesehatan atau keluhan fisik tertentu
        </strong>, guna memastikan terapi tepat sasaran dan tetap mematuhi batasan etika.
      </>
    ),
  },
  {
    id: 'sifat-layanan',
    body: (
      <>
        Layanan bersifat{' '}
        <strong className="font-semibold">terapi dan kebugaran profesional</strong> dengan
        batasan pelayanan yang jelas.
      </>
    ),
  },
  {
    id: 'cedera-berat',
    body: (
      <>
        Cedera berat, cedera akut, atau patah tulang{' '}
        <strong className="font-semibold">wajib melalui pemeriksaan medis</strong> terlebih
        dahulu.
      </>
    ),
  },
];

/**
 * S6 Ketentuan dan Etika Layanan. Section kepatuhan paling penting di halaman ini, jadi
 * sengaja TIDAK memakai `SectionHeading`: komponen itu mengunci warna judul ke `text-ink` dan
 * eyebrow/subtitle ke `text-muted`, keduanya tidak terlihat di atas latar `ink`. Pola yang
 * sama (markup judul ditulis manual untuk section ber-latar gelap) sudah dipakai Footer.tsx
 * dan contoh "on-dark" di Home.tsx, jadi ini mengikuti konvensi yang sudah ada, bukan
 * membangun komponen baru.
 *
 * Pembalikan ke `bg-ink` adalah alat hierarki (DESIGN-SYSTEM §2.3), bukan dekorasi: butir
 * kepatuhan ini tidak boleh terlewat mata. Supaya tidak terbaca sebagai fine print:
 * - ukuran teks butir `text-lg`/`text-xl` (18-20px), jauh di atas `body-sm` (fine print khas),
 * - tiap butir diberi `border-emphasis` (3px solid clay) di tepi kiri, sesuai DESIGN-SYSTEM
 *   §5.2 yang secara eksplisit menyediakan token ini untuk "tepi kiri catatan kepatuhan",
 * - angka urut Fraunces besar (>=24px) sebagai penanda, bukan ikon bulat bernomor,
 * - latar penuh ink, bukan kotak kecil di pojok, dan padding lapang (py-16/py-36) alih-alih
 *   dirapatkan.
 * Teks kecil di atas ink memakai `text-paper` atau `text-muted-inv`, tidak pernah `text-clay`
 * (DESIGN-SYSTEM §2.4: clay/ink hanya lolos AA untuk teks besar, rasio 3.15). Angka urut boleh
 * memakai clay karena ukurannya >=24px, yang dikecualikan secara eksplisit oleh aturan itu.
 *
 * Ritme section ini "lapang" (DESIGN-SYSTEM §4.3, kategori "pernyataan"): py-16 mobile,
 * py-36 desktop, berbeda dari Areas (padat) dan HowItWorks.
 */
export default function Ethics() {
  return (
    <section
      id="ketentuan"
      aria-labelledby="ketentuan-heading"
      className="on-dark bg-ink text-paper"
    >
      <Container className="py-16 sm:py-36">
        <div className="sm:grid sm:grid-cols-12 sm:gap-10">
          <div className="sm:col-span-4">
            <p className="label text-muted-inv">Sebelum Memesan</p>
            <h2
              id="ketentuan-heading"
              className="mt-2 font-display text-2xl text-paper sm:text-4xl"
            >
              Ketentuan dan Etika Layanan
            </h2>
            <p className="mt-4 max-w-sm text-muted-inv">
              Empat ketentuan berikut berlaku untuk seluruh pemesanan, dan kami minta dibaca
              dengan saksama sebelum sesi berlangsung.
            </p>
          </div>

          <ol className="mt-10 list-none space-y-6 sm:col-span-8 sm:mt-0 sm:space-y-8">
            {KETENTUAN.map((item, index) => (
              <li
                key={item.id}
                className="flex gap-4 border-l-[3px] border-clay pl-4 sm:gap-6 sm:pl-6"
              >
                <span
                  aria-hidden="true"
                  className="shrink-0 font-display text-2xl leading-none text-clay sm:text-3xl"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-lg leading-relaxed text-paper sm:text-xl">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
