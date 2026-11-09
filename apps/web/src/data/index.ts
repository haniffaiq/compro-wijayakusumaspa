import type { Area, Faq, SiteInfo, Testimonial, Treatment } from '@wijaya/types';
import { areas } from '../content/areas';
import { faq } from '../content/faq';
import { siteInfo } from '../content/site';
import { testimonials } from '../content/testimonials';
import { treatments } from '../content/treatments';

/**
 * Satu-satunya pintu akses data untuk komponen (AGENTS.md §18.2).
 * Komponen tidak pernah mengimpor src/content/ langsung, supaya pindah ke API
 * di fase 2 hanya mengubah isi file ini.
 *
 * Signature sengaja sinkron, bukan Promise: menulis state loading sekarang
 * berarti menulis cabang yang tidak pernah jalan di v1. Di v2, isi fungsi
 * diganti dengan call API, tapi signature dan return type tetap sama.
 */

export function getTreatments(): Treatment[] {
  return treatments;
}

export function getTreatmentBySlug(slug: string): Treatment | undefined {
  return getTreatments().find((treatment) => treatment.slug === slug);
}

export function getAreas(): Area[] {
  return areas;
}

export function getFaq(): Faq[] {
  return faq;
}

export function getTestimonials(): Testimonial[] {
  return testimonials;
}

/**
 * Mengembalikan informasi situs dari src/content/site.ts. Signature tetap sama,
 * dan di v2 hanya isi yang berubah menjadi call API tanpa mengubah return type.
 */
export function getSiteInfo(): SiteInfo {
  return siteInfo;
}
