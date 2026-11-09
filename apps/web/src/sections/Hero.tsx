import type { Area } from '@wijaya/types';

import { WhatsAppCta } from '@/components/layout';
import { Button, Container } from '@/components/ui';
import { getAreas, getSiteInfo, getTreatments } from '@/data';

/**
 * Urutan kemunculan pertama tiap `region` di `getAreas()`, tanpa duplikat. Dipakai untuk
 * menyusun kalimat cakupan area di hero tanpa mengetik ulang nama wilayah: kalau area baru
 * ditambah di `src/content/areas.ts`, kalimat ini ikut berubah sendiri.
 */
function getUniqueRegions(areas: Area[]): string[] {
  const seen = new Set<string>();
  const regions: string[] = [];

  for (const area of areas) {
    if (!seen.has(area.region)) {
      seen.add(area.region);
      regions.push(area.region);
    }
  }

  return regions;
}

/**
 * Menyusun daftar jadi kalimat Indonesia yang wajar, memakai "serta" (bukan "dan") sebelum
 * item terakhir supaya tidak bertabrakan dengan "dan" yang sudah ada di dalam nama region itu
 * sendiri (mis. "Depok dan sekitarnya").
 */
function formatRegionList(regions: string[]): string {
  if (regions.length === 0) return '';
  if (regions.length === 1) return regions[0];
  if (regions.length === 2) return `${regions[0]} serta ${regions[1]}`;

  const last = regions[regions.length - 1];
  return `${regions.slice(0, -1).join(', ')}, serta ${last}`;
}

/**
 * S2 Pembuka. Satu-satunya `<h1>` di seluruh halaman: slogan resmi dari `getSiteInfo().slogan`,
 * tidak boleh diparafrase (DESIGN-SYSTEM §3.2). Sengaja BUKAN pola "headline kiri + subtitle +
 * dua tombol + gambar kanan + strip empat item" yang sudah ditolak (BRIEF §0): di sini gambar
 * jadi latar penuh, teks menumpuk di bagian bawah lewat scrim gelap, dan tidak ada strip apa
 * pun di bawahnya.
 *
 * Tinggi section memakai `dvh` (bukan `vh`) karena toolbar in-app browser WhatsApp/Instagram
 * muncul-hilang (DESIGN-SYSTEM §9, AGENTS.md §17). Ritme section ini tidak diukur dengan
 * `py-*` seperti section lain: tingginya ditentukan gambar, bukan padding vertikal seragam,
 * jadi otomatis berbeda dari ritme Values, Treatments, Areas, maupun Ethics.
 */
/**
 * React 18 belum mengenali prop fetchPriority dan memperingatkannya saat render,
 * sementara tipe JSX menolak ejaan huruf kecil. Spread ini menulis atributnya apa
 * adanya ke DOM tanpa memicu peringatan. Bisa dihapus setelah naik ke React 19.
 */
const highFetchPriority = { fetchpriority: 'high' } as Record<string, string>;

export default function Hero() {
  const site = getSiteInfo();
  const regions = getUniqueRegions(getAreas());
  const treatmentCount = getTreatments().length;

  return (
    <section aria-label="Pembuka" className="relative isolate overflow-hidden bg-ink">
      <img
        src="/img/hero.webp"
        width={1600}
        height={1200}
        {...highFetchPriority}
        alt={`Ruang terapi ${site.name} dengan tirai krem, cahaya pagi, dan tanaman hijau, suasana sebelum sesi dimulai`}
        className="img-mono h-[72dvh] min-h-[460px] w-full object-cover sm:h-[82dvh] lg:h-[88dvh]"
      />

      {/* Scrim monokrom (hanya ink, tanpa warna lain) supaya teks di atas foto tetap terbaca. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/0"
      />

      {/* Motif identitas ampersand (DESIGN-SYSTEM §1), diulang di sini sebagai watermark besar beropasitas rendah, murni dekoratif. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 top-2 select-none font-display italic leading-[0.7] text-paper/10"
        style={{ fontSize: 'clamp(8rem, 24vw, 16rem)' }}
      >
        &amp;
      </span>

      <div className="on-dark absolute inset-0 flex flex-col justify-end">
        <Container className="pb-10 pt-16 sm:pb-14 lg:pb-16">
          <p className="label text-paper">Pijat Panggilan ke Rumah</p>

          <h1 className="mt-3 max-w-3xl font-display leading-[1.12] text-paper" style={{ fontSize: 'clamp(1.85rem, 6vw, 4rem)' }}>
            {site.slogan}
          </h1>

          <p className="mt-5 max-w-xl text-muted-inv">{site.description}</p>

          <p className="mt-2 max-w-xl text-muted-inv">
            {treatmentCount} pilihan treatment, mencakup {formatRegionList(regions)}.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <WhatsAppCta source="hero" />
            <Button
              as="a"
              href="#layanan"
              variant="secondary"
              className="border-paper text-paper hover:bg-paper hover:text-ink"
            >
              Lihat Pilihan Treatment
            </Button>
          </div>
        </Container>
      </div>
    </section>
  );
}
