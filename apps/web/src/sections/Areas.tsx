import type { Area } from '@wijaya/types';

import { Badge, Container, SectionHeading } from '@/components/ui';
import { getAreas } from '@/data';

type RegionGroup = {
  region: string;
  areas: Area[];
};

/**
 * Mengelompokkan area menurut field `region`, urutan kolom mengikuti urutan kemunculan
 * pertama tiap region di `getAreas()` (saat ini: DKI Jakarta, Tangerang Selatan, Depok dan
 * sekitarnya), bukan diurutkan ulang di sini. Data tetap satu sumber di `@/data`.
 */
function groupByRegion(areas: Area[]): RegionGroup[] {
  const order: string[] = [];
  const byRegion = new Map<string, Area[]>();

  for (const area of areas) {
    if (!byRegion.has(area.region)) {
      order.push(area.region);
      byRegion.set(area.region, []);
    }
    byRegion.get(area.region)?.push(area);
  }

  return order.map((region) => ({ region, areas: byRegion.get(region) ?? [] }));
}

/**
 * S5 Area Layanan. Dikelompokkan per region dari `getAreas()`. Sengaja tanpa Google Maps JS
 * API (REQUIREMENTS menghindarinya); cukup daftar chip per wilayah, yang juga dipakai sebagai
 * contoh pemakaian Badge yang disahkan DESIGN-SYSTEM §6.3 ("area layanan" disebut eksplisit).
 *
 * Ritme section ini "padat" (DESIGN-SYSTEM §4.3): py-10 mobile, py-20 desktop.
 */
export default function Areas() {
  const regions = groupByRegion(getAreas());

  return (
    <section id="area" aria-labelledby="area-heading" className="border-t border-line">
      <img
        src="/img/ambience.webp"
        width={1200}
        height={800}
        loading="lazy"
        alt="Ruang perawatan yang bersih dan tenang, difoto hitam putih"
        className="img-mono h-48 w-full object-cover sm:h-64"
      />

      <Container className="py-10 sm:py-20">
        <SectionHeading
          eyebrow="Jangkauan Layanan"
          title="Area Layanan"
          subtitle="Pijat panggilan ke rumah tersedia di titik-titik berikut, dikelompokkan menurut wilayah."
          id="area-heading"
        />

        <div className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-10">
          {regions.map(({ region, areas }) => {
            const notes = Array.from(
              new Set(
                areas
                  .map((area) => area.note)
                  .filter((note): note is string => Boolean(note)),
              ),
            );

            return (
              <div key={region}>
                <h3 className="font-display text-xl text-ink">{region}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {areas.map((area) => (
                    <Badge key={area.slug}>{area.name}</Badge>
                  ))}
                </div>
                {notes.map((note) => (
                  <p key={note} className="mt-3 text-sm text-muted">
                    {note}
                  </p>
                ))}
              </div>
            );
          })}
        </div>

        <p className="mt-10 max-w-2xl border-t border-line pt-6 text-sm text-muted">
          Biaya transport menyesuaikan jarak dari lokasi Anda. Skema rincinya belum ditetapkan
          dan akan dikonfirmasi langsung saat pemesanan.
        </p>
      </Container>
    </section>
  );
}
