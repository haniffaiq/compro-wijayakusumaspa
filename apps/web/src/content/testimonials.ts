import type { Testimonial } from '@wijaya/types';

/**
 * Array kosong karena belum ada ulasan riil dari pelanggan.
 * Mengarang testimoni melanggar AGENTS.md §4.3 dan BRIEF.md §3.6.
 * Testimonial hanya boleh diisi setelah:
 * 1. Layanan sudah live dan melayani pelanggan nyata.
 * 2. Pelanggan memberikan izin eksplisit untuk dipublikasikan.
 * 3. Ulasan diverifikasi sebagai ulasan genuine, bukan placeholder.
 */
export const testimonials: Testimonial[] = [];
