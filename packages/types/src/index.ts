/**
 * Kontrak data bersama: dipakai apps/web sekarang, apps/api dan CRM di fase 2.
 * Setiap field yang datanya belum diberikan klien bertipe `| null` supaya UI
 * terpaksa menyediakan cabang "belum ditetapkan" alih-alih menampilkan angka
 * karangan (AGENTS.md §4.3).
 */

/** Filter katalog di S4: Semua, Relaksasi, Terapi, Pemulihan. */
export type TreatmentCategory = 'relaksasi' | 'terapi' | 'pemulihan';

export type Treatment = {
  slug: string;
  /** Nama resmi treatment, mis. "Pijat Tradisional". */
  name: string;
  /** Copywriting promosi dari GTM doc, verbatim. */
  tagline: string;
  /** Fokus manfaat dari GTM doc. */
  description: string;
  /** null = belum ditetapkan klien. */
  duration: string | null;
  /** Rupiah, null = belum ditetapkan klien. */
  price: number | null;
  /** Wajib ada untuk Cedera & Keseleo, Bekam, dan Vitalitas. */
  disclaimer?: string;
  category: TreatmentCategory;
  /** Path relatif ke aset gambar. */
  image: string;
};

export type Area = {
  slug: string;
  /** Nama area layanan, mis. "Jakarta Selatan". */
  name: string;
  /** Pengelompokan, mis. "DKI Jakarta", "Tangerang Selatan", "Depok & sekitarnya". */
  region: string;
  /** Cakupan tambahan, mis. "Cinere, Pondok Labu, Andara". null bila tidak ada. */
  note: string | null;
};

export type Faq = {
  slug: string;
  question: string;
  /** null = jawabannya masih menunggu data klien (jam operasional, pembayaran, transport). */
  answer: string | null;
};

export type Testimonial = {
  id: string;
  /** Nama singkat atau inisial. */
  author: string;
  area: string | null;
  /** Slug treatment yang diulas. */
  treatment: string | null;
  quote: string;
  /** Skala 1 sampai 5, null bila tidak ada. */
  rating: number | null;
  /**
   * true = baris contoh, bukan ulasan nyata. Wajib disaring sebelum live;
   * testimoni fabrikasi melanggar REQUIREMENTS.md §7.
   */
  isPlaceholder: boolean;
};

export type SiteInfo = {
  name: string;
  slogan: string;
  /** Deskripsi singkat untuk meta description dan footer. */
  description: string;
  /** Format internasional tanpa tanda plus. null = belum diberikan klien. */
  whatsappNumber: string | null;
  /** Teks siap tampil, mis. "Setiap hari, 09.00 sampai 23.00". null = belum ditetapkan. */
  openingHours: string | null;
  /** Origin absolut untuk canonical dan Open Graph. */
  siteUrl: string | null;
  googleReviewUrl: string | null;
};
