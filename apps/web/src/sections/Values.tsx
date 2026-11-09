import { Container, SectionHeading } from '@/components/ui';

type ValueItem = {
  id: string;
  title: string;
  description: string;
};

/**
 * Empat keunggulan dari mockups/BRIEF.md §3.3, verbatim. Bukan tipe domain di `@wijaya/types`
 * (bukan Treatment, Area, Faq, atau Testimonial), jadi ditulis di sini sebagai satu-satunya
 * tempatnya, mengikuti pola KETENTUAN di Ethics.tsx dan STEPS di HowItWorks.tsx.
 *
 * Privasi sengaja ditaruh pertama: untuk jasa pijat panggilan ke rumah, privasi adalah
 * keberatan terbesar calon pelanggan, jadi butuh ruang paling besar di render di bawah, bukan
 * kartu seukuran tiga lainnya (DESIGN-SYSTEM §0 dan §6.2 menolak eksplisit "kartu seragam").
 */
const VALUES: ValueItem[] = [
  {
    id: 'privasi',
    title: 'Privasi Pelanggan',
    description:
      'Terapis datang tanpa atribut mencolok. Data pemesanan hanya dipakai untuk jadwal dan penanganan terapi.',
  },
  {
    id: 'ketepatan',
    title: 'Ketepatan Waktu Kedatangan',
    description: 'Jadwal dikonfirmasi lebih dulu, dan pelanggan dikabari saat terapis berangkat.',
  },
  {
    id: 'kualitas',
    title: 'Kualitas Teknik Pemijatan',
    description: 'Dikerjakan terapis pria profesional yang terlatih dan berpengalaman.',
  },
  {
    id: 'whatsapp',
    title: 'Pemesanan lewat WhatsApp',
    description: 'Satu percakapan untuk treatment, jadwal, dan keluhan khusus.',
  },
];

/**
 * S3 Empat Keunggulan. Bukan empat kartu seragam: poin privasi dirender sebagai kartu
 * dominan bergambar (kolom 7/12 di desktop), tiga sisanya jadi daftar bergaris tanpa gambar
 * (kolom 5/12), mengikuti bobot isi sesuai arahan, bukan grid rapi yang menyamakan keempatnya.
 *
 * Ritme section ini py-14 mobile, py-20 tablet, py-28 desktop: tiga keadaan lebar (DESIGN-
 * SYSTEM §4.5), angka yang berbeda dari Areas (py-10/py-20), Ethics (py-16/py-36), dan dari
 * Treatments di section berikutnya.
 */
export default function Values() {
  const [dominant, ...secondary] = VALUES;

  return (
    <section
      id="keunggulan"
      aria-labelledby="keunggulan-heading"
      className="border-t border-line bg-paper"
    >
      <Container className="py-14 sm:py-20 lg:py-28">
        <SectionHeading
          id="keunggulan-heading"
          eyebrow="Kenapa Wijaya"
          title="Keunggulan yang Kami Jaga di Setiap Kunjungan"
          subtitle="Empat hal yang kami pastikan ada di setiap sesi, sebelum membahas treatment yang Anda pilih."
          className="max-w-2xl"
        />

        <div className="mt-10 grid gap-8 sm:mt-14 sm:grid-cols-12 sm:gap-10">
          <div className="overflow-hidden rounded-sm border border-line sm:col-span-7 sm:flex sm:items-stretch">
            <div className="sm:w-2/5 sm:shrink-0">
              <img
                src="/img/values.webp"
                width={1000}
                height={666}
                loading="lazy"
                alt="Tangan terapis memijat lengan bawah pasien dengan tekanan terukur, difoto hitam putih"
                className="img-mono h-56 w-full object-cover sm:h-full"
              />
            </div>
            <div className="flex-1 p-6 sm:p-8">
              <p className="label text-muted">Yang Paling Sering Ditanyakan</p>
              <h3 className="mt-2 font-display text-2xl text-ink sm:text-3xl">
                {dominant.title}
              </h3>
              <p className="mt-3 text-muted">{dominant.description}</p>
            </div>
          </div>

          <ol className="list-none divide-y divide-line border-y border-line sm:col-span-5">
            {secondary.map((value) => (
              <li key={value.id} className="py-6 sm:py-7">
                <h3 className="font-display text-lg text-ink sm:text-xl">{value.title}</h3>
                <p className="mt-2 text-muted">{value.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
