/**
 * Satu-satunya tempat yang menyusun tautan dan pesan WhatsApp (AGENTS.md §7).
 * WhatsApp adalah satu-satunya titik konversi bisnis ini, jadi logikanya tidak
 * boleh diduplikasi di komponen: satu bug di sini mematikan seluruh jalur
 * pendapatan, dan menambalnya di dua tempat berarti salah satu akan tertinggal.
 */

/**
 * Bentuk opts dibuat sama dengan parameter trackWhatsAppClick di lib/analytics
 * supaya satu handler klik bisa meneruskan objek yang sama ke keduanya tanpa
 * menyusun ulang field.
 */
export type WhatsAppLinkOptions = {
  /** Nama treatment siap tampil, mis. "Pijat Tradisional". */
  treatment?: string;
  /** Section asal klik, dipakai analytics sebagai source_section. */
  source: string;
};

/**
 * Pilihan area ikut dicantumkan di pesan supaya pelanggan tahu cakupan layanan
 * tanpa harus kembali ke halaman. Urutannya mengikuti mockups/BRIEF.md §7.
 */
const AREA_OPTIONS = 'Jaksel / Jakpus / Tangsel / Depok (Cinere, Pondok Labu, Andara)';

const OPENING_WITHOUT_TREATMENT =
  'Halo Wijaya Home Massage & Spa, saya mau memesan layanan pijat panggilan.';

/**
 * E.164 memuat maksimal 15 digit, dan nomor Indonesia berawalan 62 minimal
 * 11 digit. Batas bawah 10 dipakai supaya nomor luar negeri tetap lolos.
 */
const MIN_NUMBER_DIGITS = 10;
const MAX_NUMBER_DIGITS = 15;

function normalizeTreatment(treatment: string | undefined): string | null {
  const trimmed = treatment?.trim();
  return trimmed ? trimmed : null;
}

/**
 * Nomor dari env dibersihkan jadi digit saja karena wa.me hanya menerima digit:
 * nilai seperti "+62 812-345-678" akan menghasilkan tautan mati kalau diteruskan
 * apa adanya. Nilai yang jelas salah bentuk (masih berawalan 0, atau panjangnya
 * di luar rentang E.164) diperlakukan sebagai belum dikonfigurasi, supaya UI
 * memakai cabang "nomor belum tersedia" alih-alih memberi pelanggan tautan rusak.
 */
function normalizeWhatsAppNumber(raw: string | undefined): string | null {
  const digits = raw?.replace(/[^0-9]/g, '') ?? '';
  if (digits.length < MIN_NUMBER_DIGITS || digits.length > MAX_NUMBER_DIGITS) return null;
  if (digits.startsWith('0')) return null;
  return digits;
}

/**
 * Mengembalikan nomor WhatsApp yang siap dipakai di URL, atau null bila env
 * belum diisi. Nomor tidak pernah di-hardcode: klien belum memberikannya
 * (mockups/BRIEF.md §7) dan mengarang nomor contoh berarti mengirim pelanggan
 * ke nomor orang lain.
 */
export function getWhatsAppNumber(): string | null {
  return normalizeWhatsAppNumber(import.meta.env.VITE_WHATSAPP_NUMBER);
}

/** Dipakai UI untuk memilih antara tautan WhatsApp dan cabang pratinjau pesan. */
export function isWhatsAppConfigured(): boolean {
  return getWhatsAppNumber() !== null;
}

/**
 * Kerangka formulir pemesanan, urutan field tetap sesuai mockups/BRIEF.md §3.8
 * dan §7. Di-export terpisah supaya UI bisa menampilkan pratinjau dan tombol
 * salin selama nomor WhatsApp belum tersedia.
 */
export function buildWhatsAppMessage(options: { treatment?: string } = {}): string {
  const treatment = normalizeTreatment(options.treatment);

  return [
    treatment
      ? `Halo Wijaya Home Massage & Spa, saya mau memesan ${treatment}.`
      : OPENING_WITHOUT_TREATMENT,
    '',
    'Formulir Pemesanan',
    'Nama Pelanggan:',
    'Jenis Kelamin:',
    'Alamat Lengkap & Patokan:',
    `Area: ${AREA_OPTIONS}`,
    treatment ? `Pilihan Treatment: ${treatment}` : 'Pilihan Treatment:',
    'Hari & Jam Layanan:',
    'Catatan Keluhan Khusus: (wajib diisi untuk pelanggan wanita)',
  ].join('\n');
}

/**
 * Menyusun deep link wa.me dengan pesan ter-prefill (F-01, F-02, F-03).
 *
 * Mengembalikan null selama VITE_WHATSAPP_NUMBER belum diisi. Null dipilih
 * alih-alih string kosong atau tautan placeholder supaya pemanggil terpaksa
 * menyediakan cabang jujur: tombol yang tetap terlihat aktif tapi membuka
 * tautan rusak lebih merugikan daripada tombol yang mengakui nomornya belum ada.
 *
 * `options.source` tidak dipakai di URL (tidak ada parameter pelacakan yang
 * ikut terkirim ke pelanggan), tapi tetap bagian dari kontrak opts supaya
 * handler klik memakai satu objek untuk tautan dan untuk analytics.
 */
export function buildWhatsAppUrl(options: WhatsAppLinkOptions): string | null {
  const number = getWhatsAppNumber();
  if (!number) return null;

  const text = encodeURIComponent(buildWhatsAppMessage({ treatment: options.treatment }));
  return `https://wa.me/${number}?text=${text}`;
}
