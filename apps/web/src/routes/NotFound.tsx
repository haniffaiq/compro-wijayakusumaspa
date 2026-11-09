import { Link } from 'react-router-dom';

import { Button, Container } from '@/components/ui';
import { getTreatments } from '@/data';

const LINK_CLASSES =
  'inline-flex min-h-11 items-center text-muted underline decoration-1 underline-offset-4 transition-colors duration-150 [transition-timing-function:ease] hover:text-ink';

/**
 * Halaman 404 (F-11). Dipakai dua kali: oleh route catch-all, dan oleh
 * /layanan/:slug ketika slugnya tidak dikenal. Keduanya dipasangi meta
 * `robots: noindex, follow` oleh PageHead di App.tsx, jadi URL ngawur tidak
 * ikut terindeks sebagai duplikat halaman utama.
 *
 * Tujuh tautan treatment ikut ditampilkan karena sebab paling mungkin orang
 * mendarat di sini adalah salah tulis slug layanan, dan daftar itu memulihkan
 * kunjungannya dalam satu klik, bukan memaksanya mencari ulang dari beranda.
 *
 * CTA utamanya anchor biasa, bukan Link: halaman ini bisa tersaji sebelum
 * JavaScript selesai dimuat, dan tautan yang hanya hidup setelah hidrasi akan
 * jadi tombol mati tepat di satu-satunya jalan keluar halaman ini.
 */
export default function NotFound() {
  const treatments = getTreatments();

  return (
    <main className="bg-paper text-ink">
      <Container className="py-16 sm:py-24">
        <p className="label text-muted">Galat 404</p>
        <h1 className="mt-4 font-display text-3xl text-ink sm:text-5xl">Halaman ini tidak ada</h1>
        <p className="mt-6 max-w-[60ch] leading-relaxed text-muted">
          Tautannya mungkin salah tulis, atau halamannya memang belum dibuat. Seluruh layanan,
          area, dan ketentuan pemesanan ada di halaman utama.
        </p>

        <Button as="a" href="/" className="mt-8">
          Kembali ke halaman utama
        </Button>

        <div className="mt-12 border-t border-line pt-8 sm:grid sm:grid-cols-12 sm:gap-10">
          <div className="sm:col-span-5">
            <h2 className="label text-muted">Halaman yang dicari</h2>
            <ul className="mt-2">
              <li>
                <a href="/#layanan" className={LINK_CLASSES}>
                  Layanan
                </a>
              </li>
              <li>
                <a href="/#area" className={LINK_CLASSES}>
                  Area layanan
                </a>
              </li>
              <li>
                <a href="/#ketentuan" className={LINK_CLASSES}>
                  Ketentuan dan etika layanan
                </a>
              </li>
              <li>
                <a href="/#faq" className={LINK_CLASSES}>
                  Tanya jawab
                </a>
              </li>
            </ul>
          </div>

          <div className="mt-8 sm:col-span-7 sm:mt-0">
            <h2 className="label text-muted">Tujuh treatment</h2>
            <ul className="mt-2">
              {treatments.map((treatment) => (
                <li key={treatment.slug}>
                  <Link to={`/layanan/${treatment.slug}`} className={LINK_CLASSES}>
                    {treatment.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </main>
  );
}
