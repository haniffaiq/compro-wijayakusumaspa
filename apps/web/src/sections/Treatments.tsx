import type { Treatment } from '@wijaya/types';

import { WhatsAppCta } from '@/components/layout';
import { Badge, Container, SectionHeading } from '@/components/ui';
import { getTreatments } from '@/data';
import { cn } from '@/lib/utils';

const CATEGORY_LABEL: Record<Treatment['category'], string> = {
  relaksasi: 'Relaksasi',
  terapi: 'Terapi',
  pemulihan: 'Pemulihan',
};

/**
 * Vitalitas disebut "Batasan Layanan", bukan "Catatan" generik: isinya adalah batasan etika
 * layanan (BRIEF §3.2 dan §4 butir 4), berbeda sifat dari catatan prosedural Bekam dan Pijat
 * Cedera & Keseleo.
 */
function disclaimerLabel(slug: string): string {
  return slug === 'pijat-vitalitas' ? 'Batasan Layanan' : 'Catatan';
}

/**
 * `price` dan `duration` keduanya `null` untuk ketujuh treatment saat ini (menunggu pemilik
 * usaha, DESIGN-SYSTEM §12 butir 4), tapi fungsi ini tetap menangani keempat kombinasi karena
 * tipe `Treatment` mengizinkan salah satu terisi lebih dulu di masa depan tanpa mengubah UI.
 * Tidak pernah menulis angka atau "Rp" diikuti tanda pisah untuk status kosong (BRIEF §3.2):
 * itu terbaca sebagai elemen desain yang rusak, bukan status yang jujur.
 */
function describePricing(treatment: Treatment): string {
  const { price, duration } = treatment;

  if (price === null && duration === null) {
    return 'Harga dan durasi belum ditetapkan, dikonfirmasi langsung saat pemesanan.';
  }
  if (price === null) {
    return `Durasi ${duration}. Harga belum ditetapkan, dikonfirmasi langsung saat pemesanan.`;
  }
  if (duration === null) {
    return `Durasi belum ditetapkan. Harga mulai Rp${price.toLocaleString('id-ID')}.`;
  }
  return `Durasi ${duration}. Harga mulai Rp${price.toLocaleString('id-ID')}.`;
}

/**
 * S4 Tujuh Treatment. Bukan grid kartu seragam (DESIGN-SYSTEM §4.4, §6.2): baris selang-seling
 * kiri-kanan, sisi gambar bergantian tiap baris lewat `sm:flex-row-reverse`. Pijat Vitalitas
 * (baris terakhir) diberi padding lebih lapang, kolom gambar lebih sempit, dan latar sedikit
 * diberi nada (`bg-ink/5`) karena penjelasan batasannya paling panjang di antara ketujuhnya.
 *
 * Ritme section ini py-12 mobile, py-16 tablet, py-24 desktop: tiga keadaan lebar (DESIGN-
 * SYSTEM §4.5), angka yang sengaja berbeda dari Areas (py-10/py-20), Ethics (py-16/py-36), dan
 * dari Values sebelumnya (py-14/py-20/py-28).
 */
export default function Treatments() {
  const treatments = getTreatments();

  return (
    <section
      id="layanan"
      aria-labelledby="layanan-heading"
      className="border-t border-line bg-paper"
    >
      <Container className="py-12 sm:py-16 lg:py-24">
        <SectionHeading
          id="layanan-heading"
          eyebrow="Pilihan Layanan"
          title="Tujuh Treatment, Satu Kunjungan ke Rumah"
          subtitle="Setiap treatment dikerjakan terapis pria profesional yang terlatih. Harga dan durasi belum ditetapkan pemilik usaha, dikonfirmasi langsung lewat WhatsApp saat Anda memesan."
          className="max-w-2xl"
        />

        <div className="mt-10 divide-y divide-line border-y border-line sm:mt-14">
          {treatments.map((treatment, index) => {
            const isReversed = index % 2 === 1;
            const isVitalitas = treatment.slug === 'pijat-vitalitas';

            return (
              <article
                key={treatment.slug}
                className={cn(
                  'sm:flex sm:items-stretch',
                  isReversed && 'sm:flex-row-reverse',
                  isVitalitas && 'bg-ink/5',
                )}
              >
                <div className={cn('sm:shrink-0', isVitalitas ? 'sm:w-1/3' : 'sm:w-2/5')}>
                  <img
                    src={treatment.image}
                    width={800}
                    height={600}
                    loading="lazy"
                    alt={`Sesi ${treatment.name} ditangani terapis profesional, difoto hitam putih`}
                    className="img-mono h-56 w-full object-cover sm:h-full"
                  />
                </div>

                <div
                  className={cn(
                    'flex-1 px-5 sm:px-10',
                    isVitalitas ? 'py-10 sm:py-14' : 'py-8 sm:py-10',
                  )}
                >
                  <Badge>{CATEGORY_LABEL[treatment.category]}</Badge>
                  <h3 className="mt-3 font-display text-2xl text-ink sm:text-3xl">
                    {treatment.name}
                  </h3>
                  <p className="mt-3 font-display text-xl italic text-ink sm:text-2xl">
                    {treatment.tagline}
                  </p>
                  <p className="mt-3 text-muted">{treatment.description}</p>

                  {treatment.disclaimer ? (
                    <div className="mt-4 border-l-[3px] border-clay pl-4">
                      <p className="label text-clay">{disclaimerLabel(treatment.slug)}</p>
                      <p className="mt-1 text-sm text-ink">{treatment.disclaimer}</p>
                    </div>
                  ) : null}

                  <p className="mt-4 text-xs text-muted">{describePricing(treatment)}</p>

                  <WhatsAppCta source="treatments" treatment={treatment.name} className="mt-5">
                    {`Pesan ${treatment.name} via WhatsApp`}
                  </WhatsAppCta>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
