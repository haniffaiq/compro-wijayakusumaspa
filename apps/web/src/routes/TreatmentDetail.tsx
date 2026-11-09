import type { Treatment } from '@wijaya/types';
import { Link } from 'react-router-dom';

import { WhatsAppCta } from '@/components/layout';
import { Badge, Container } from '@/components/ui';
import { getAreas, getSiteInfo } from '@/data';

type TreatmentDetailProps = {
  /** Sudah dipastikan ada oleh layer route di App.tsx, jadi bukan optional. */
  treatment: Treatment;
};

const CATEGORY_LABEL: Record<Treatment['category'], string> = {
  relaksasi: 'Relaksasi',
  terapi: 'Terapi',
  pemulihan: 'Pemulihan',
};

/** Status jujur untuk field yang masih null, satu kalimat untuk semua tempat. */
const NOT_SET = 'Belum ditetapkan';

/**
 * Sama dengan aturan di sections/Treatments.tsx: Vitalitas diberi label
 * "Batasan Layanan" karena isinya batasan etika layanan, bukan catatan
 * prosedural seperti pada Bekam dan Pijat Cedera & Keseleo.
 */
function disclaimerLabel(slug: string): string {
  return slug === 'pijat-vitalitas' ? 'Batasan Layanan' : 'Catatan';
}

function formatPrice(price: number | null): string {
  return price === null ? NOT_SET : `Mulai Rp${price.toLocaleString('id-ID')}`;
}

/**
 * Keempat kombinasi ditulis eksplisit, seperti describePricing di
 * sections/Treatments.tsx. Saat ini `price` dan `duration` null untuk ketujuh
 * treatment, tapi tipe Treatment mengizinkan salah satunya terisi lebih dulu,
 * dan kalimat yang dipatok ke keadaan "keduanya kosong" akan berubah jadi
 * keterangan palsu begitu pemilik usaha mengisi salah satunya.
 */
function pricingNote({ duration, price }: Treatment): string {
  const tail = 'dikonfirmasi langsung lewat WhatsApp saat pemesanan.';

  if (duration === null && price === null) {
    return `Durasi dan harga belum ditetapkan pemilik usaha, jadi keduanya ${tail}`;
  }
  if (duration === null) return `Durasi belum ditetapkan pemilik usaha, jadi ${tail}`;
  if (price === null) return `Harga belum ditetapkan pemilik usaha, jadi ${tail}`;
  return `Durasi dan harga di atas ${tail}`;
}

/**
 * Halaman detail treatment, tujuh halaman dari getTreatments() (F-08).
 *
 * Harga dan durasi ditampilkan sebagai daftar definisi berisi status, bukan
 * dirangkai jadi kalimat seperti di kartu katalog: halaman ini punya ruang,
 * dan "Belum ditetapkan" yang berdiri sendiri di kolom nilai lebih sulit
 * disalahbaca sebagai angka yang gagal dimuat (REQUIREMENTS.md §3.2 S4). Tidak
 * ada "Rp" diikuti tanda pisah, dan tidak ada angka karangan.
 *
 * Satu <h1>, yaitu nama treatment. Breadcrumb di atasnya memakai dua tingkat
 * yang sama dengan BreadcrumbList JSON-LD yang dipasang PageHead: Beranda lalu
 * nama treatment. Tidak ada tingkat /layanan karena route indeks itu tidak ada,
 * dan menampilkannya berarti memasang tautan mati.
 */
/**
 * React 18 belum mengenali prop fetchPriority dan memperingatkannya saat render,
 * sementara tipe JSX menolak ejaan huruf kecil. Spread ini menulis atributnya apa
 * adanya ke DOM tanpa memicu peringatan. Bisa dihapus setelah naik ke React 19.
 */
const highFetchPriority = { fetchpriority: 'high' } as Record<string, string>;

export default function TreatmentDetail({ treatment }: TreatmentDetailProps) {
  const site = getSiteInfo();
  const areas = getAreas();
  const areaNotes = Array.from(
    new Set(areas.map((area) => area.note).filter((note): note is string => note !== null)),
  );

  return (
    <main className="bg-paper text-ink">
      <Container className="pb-12 pt-6 sm:pb-16 sm:pt-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                to="/"
                className="label inline-flex min-h-11 items-center text-muted transition-colors duration-150 [transition-timing-function:ease] hover:text-ink"
              >
                Beranda
              </Link>
            </li>
            <li aria-hidden="true" className="label text-muted">
              /
            </li>
            <li>
              <span aria-current="page" className="label text-ink">
                {treatment.name}
              </span>
            </li>
          </ol>
        </nav>

        <div className="mt-6 sm:grid sm:grid-cols-12 sm:gap-10">
          <div className="sm:col-span-7">
            <Badge>{CATEGORY_LABEL[treatment.category]}</Badge>
            <h1 className="mt-4 font-display text-3xl text-ink sm:text-5xl">{treatment.name}</h1>
            <p className="mt-4 font-display text-xl italic text-ink sm:text-2xl">
              {treatment.tagline}
            </p>
            <p className="mt-5 max-w-[60ch] text-muted">{treatment.description}</p>

            <WhatsAppCta source="treatment-detail" treatment={treatment.name} className="mt-7">
              {`Pesan ${treatment.name} via WhatsApp`}
            </WhatsAppCta>
          </div>

          <div className="mt-8 sm:col-span-5 sm:mt-0">
            <img
              src={treatment.image}
              width={800}
              height={600}
              {...highFetchPriority}
              alt={`Sesi ${treatment.name} ditangani terapis profesional, difoto hitam putih`}
              className="img-mono h-56 w-full object-cover sm:h-72"
            />
          </div>
        </div>
      </Container>

      <section aria-labelledby="harga-heading" className="border-t border-line">
        <Container className="py-10 sm:py-14">
          <h2 id="harga-heading" className="font-display text-2xl text-ink sm:text-3xl">
            Durasi dan Harga
          </h2>

          <dl className="mt-6 grid gap-6 border-y border-line py-6 sm:grid-cols-2 sm:gap-10">
            <div>
              <dt className="label text-muted">Durasi</dt>
              <dd className="mt-2 font-display text-xl text-ink">{treatment.duration ?? NOT_SET}</dd>
            </div>
            <div>
              <dt className="label text-muted">Harga</dt>
              <dd className="mt-2 font-display text-xl text-ink">{formatPrice(treatment.price)}</dd>
            </div>
          </dl>

          <p className="mt-6 max-w-[60ch] text-sm text-muted">
            {pricingNote(treatment)} Biaya transport menyesuaikan jarak dari lokasi Anda, dan
            skema rincinya juga belum ditetapkan.
          </p>

          {treatment.disclaimer ? (
            <div className="mt-8 max-w-[60ch] border-l-[3px] border-clay pl-4">
              <p className="label text-clay">{disclaimerLabel(treatment.slug)}</p>
              <p className="mt-2 text-base leading-relaxed text-ink">{treatment.disclaimer}</p>
            </div>
          ) : null}
        </Container>
      </section>

      <section aria-labelledby="area-detail-heading" className="border-t border-line">
        <Container className="py-10 sm:py-14">
          <h2 id="area-detail-heading" className="font-display text-2xl text-ink sm:text-3xl">
            Area Layanan
          </h2>
          <p className="mt-4 max-w-[60ch] text-muted">
            {treatment.name} dilayani sebagai pijat panggilan ke rumah di titik berikut.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {areas.map((area) => (
              <Badge key={area.slug}>{area.name}</Badge>
            ))}
          </div>

          {areaNotes.map((note) => (
            <p key={note} className="mt-3 text-sm text-muted">
              {note}
            </p>
          ))}
        </Container>
      </section>

      {/*
        Sengaja tanpa CTA WhatsApp kedua di penutup halaman. Setiap instance
        WhatsAppCta ikut menanam dialog beserta pesan ter-prefill-nya ke dalam
        DOM, jadi CTA kembar berarti teks formulir yang sama terbit dua kali di
        HTML hasil prerender. Jalur pesan di bagian bawah layar sudah dipegang
        WhatsAppBar yang fixed dari RootLayout dan ikut di halaman ini.
      */}
      <section aria-labelledby="sebelum-pesan-heading" className="border-t border-line">
        <Container className="py-10 sm:py-14">
          <h2 id="sebelum-pesan-heading" className="font-display text-2xl text-ink sm:text-3xl">
            Sebelum Anda memesan
          </h2>
          <p className="mt-4 max-w-[60ch] text-muted">
            Seluruh pemesanan {site.name} berjalan lewat WhatsApp. Tombol pesan di halaman ini
            sudah membawa formulir pemesanan yang terisi nama treatment ini, jadi Anda cukup
            melengkapi alamat dan jadwalnya.
          </p>
          <p className="mt-4 max-w-[60ch] text-muted">
            Ketentuan layanan berlaku untuk seluruh pemesanan, termasuk ketentuan pelanggan wanita
            dan kewajiban pemeriksaan medis untuk cedera berat. Rinciannya ada di{' '}
            <Link
              to="/syarat-ketentuan"
              className="text-ink underline decoration-1 underline-offset-4 transition-colors duration-150 [transition-timing-function:ease] hover:text-clay-deep"
            >
              Syarat &amp; Ketentuan
            </Link>
            .
          </p>

          <Link
            to="/#layanan"
            className="mt-6 inline-flex min-h-11 items-center font-sans text-sm font-semibold text-ink underline decoration-1 underline-offset-4 transition-colors duration-150 [transition-timing-function:ease] hover:text-clay-deep"
          >
            Lihat semua layanan
          </Link>
        </Container>
      </section>
    </main>
  );
}
