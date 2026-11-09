import { WhatsAppCta } from '@/components/layout';
import { Container } from '@/components/ui';
import { getSiteInfo } from '@/data';

const CLOSING_EYEBROW = 'Mulai Kapan Saja';

/**
 * S10, penutup halaman. Pembalikan ke latar `ink` (DESIGN-SYSTEM §2.5) dipakai sebagai alat
 * hierarki terakhir sebelum footer, bukan dekorasi. SectionHeading sengaja tidak dipakai di
 * sini: komponen itu mengunci warna judul ke `text-ink`, yang tidak terbaca di atas latar gelap.
 *
 * Ritme sengaja berbeda dari S8 (ulasan) dan S9 (FAQ): py-20 sampai py-40, paling lapang di
 * antara ketiganya karena ini satu pernyataan penutup, bukan daftar konten.
 */
export default function FinalCta() {
  const site = getSiteInfo();

  return (
    <section id="kontak" aria-labelledby="kontak-heading" className="on-dark bg-ink text-paper">
      <Container className="py-20 sm:py-28 lg:py-40">
        <p className="label text-muted-inv">{CLOSING_EYEBROW}</p>

        {/* Slogan resmi, tidak boleh dipotong (DESIGN-SYSTEM §3.2): ukuran font yang mengalah. */}
        <h2
          id="kontak-heading"
          className="mt-3 max-w-2xl font-display text-2xl leading-snug text-paper sm:text-4xl"
        >
          {site.slogan}
        </h2>

        <div className="mt-8">
          <WhatsAppCta source="final-cta" />
        </div>

        {/* Teks kecil di atas ink: paper/muted-inv saja, clay di atas ink hanya lolos untuk teks besar (§2.4). */}
        <p className="mt-8 text-sm text-muted-inv">
          {site.openingHours
            ? `Jam operasional: ${site.openingHours}`
            : 'Jam operasional belum ditetapkan.'}
        </p>
      </Container>
    </section>
  );
}
