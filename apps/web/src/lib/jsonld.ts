import type { Treatment } from '@wijaya/types';

import { getAreas, getFaq, getSiteInfo, getTreatmentBySlug } from '@/data';
import type { RouteIdentity } from '@/lib/seo';
import { OG_IMAGE, absoluteUrl, getRouteLabel, routePath } from '@/lib/seo';

/**
 * Pembangun JSON-LD untuk empat schema di DESIGN-SYSTEM.md §11.2, dirangkai
 * dari src/data/ yang sama dengan halaman.
 *
 * Aturan keras §11.2: properti yang datanya belum ada dihilangkan, bukan diisi
 * string kosong atau karangan. Itu ditegakkan lewat pruneJsonLd di bawah, bukan
 * lewat kedisiplinan manual, karena satu kelupaan saja sudah cukup untuk
 * menerbitkan data terstruktur palsu (REQUIREMENTS.md §7 butir 8).
 *
 * Modul ini bebas DOM supaya aman dieksekusi Node saat prerender (§11.4).
 */

export type JsonLdPrimitive = string | number | boolean;
export type JsonLdValue = JsonLdPrimitive | JsonLdValue[] | { [key: string]: JsonLdValue };
export type JsonLdObject = { [key: string]: JsonLdValue };

/** Bentuk mentah sebelum dibersihkan: masih boleh memuat null dan undefined. */
export type JsonLdDraft =
  | JsonLdPrimitive
  | null
  | undefined
  | JsonLdDraft[]
  | { [key: string]: JsonLdDraft };

/**
 * Membuang kunci bernilai null, undefined, string kosong, serta array dan objek
 * yang jadi kosong setelah isinya dibuang. Rekursif, jadi properti bersarang
 * ikut terjaga.
 */
export function pruneJsonLd(value: JsonLdDraft): JsonLdValue | undefined {
  if (value === null || value === undefined) return undefined;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
  }

  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value === 'boolean') return value;

  if (Array.isArray(value)) {
    const items = value
      .map((item) => pruneJsonLd(item))
      .filter((item): item is JsonLdValue => item !== undefined);
    return items.length === 0 ? undefined : items;
  }

  const object = pruneJsonLdObject(value);
  return Object.keys(object).length === 0 ? undefined : object;
}

/** Varian untuk node tingkat atas: selalu mengembalikan objek. */
export function pruneJsonLdObject(input: { [key: string]: JsonLdDraft }): JsonLdObject {
  const output: JsonLdObject = {};

  for (const [key, value] of Object.entries(input)) {
    const pruned = pruneJsonLd(value);
    if (pruned !== undefined) output[key] = pruned;
  }

  return output;
}

const SCHEMA_CONTEXT = 'https://schema.org';

/** Anchor @id supaya Service bisa menunjuk bisnis yang sama, bukan menyalinnya. */
function businessId(): string | null {
  const home = absoluteUrl('/');
  return home === null ? null : `${home}#business`;
}

function areaServed(): JsonLdDraft[] {
  return getAreas().map((area) => ({
    '@type': 'AdministrativeArea',
    name: area.name,
    // region yang sama dengan name hanya akan jadi self-containment yang tidak
    // berarti, jadi dilewati.
    containedInPlace:
      area.region === area.name ? null : { '@type': 'AdministrativeArea', name: area.region },
  }));
}

function ogImageUrl(): string | null {
  return OG_IMAGE === null ? null : absoluteUrl(OG_IMAGE.path);
}

/**
 * LocalBusiness digabung DaySpa untuk halaman utama (§11.2).
 *
 * Yang sengaja tidak ada selama datanya null: telephone, openingHours,
 * openingHoursSpecification, priceRange, paymentAccepted, aggregateRating,
 * review, dan address. Bisnis ini home service tanpa alamat publik, jadi
 * cakupan wilayah diwakili areaServed.
 */
export function buildLocalBusinessJsonLd(): JsonLdObject {
  const site = getSiteInfo();

  return pruneJsonLdObject({
    '@context': SCHEMA_CONTEXT,
    '@type': ['LocalBusiness', 'DaySpa'],
    '@id': businessId(),
    name: site.name,
    slogan: site.slogan,
    description: site.description,
    url: absoluteUrl('/'),
    image: ogImageUrl(),
    areaServed: areaServed(),
  });
}

/** Service per halaman detail treatment (§11.2). `offers` menunggu price list. */
export function buildServiceJsonLd(treatment: Treatment): JsonLdObject {
  const site = getSiteInfo();
  const path = routePath({ kind: 'treatment', slug: treatment.slug });

  return pruneJsonLdObject({
    '@context': SCHEMA_CONTEXT,
    '@type': 'Service',
    name: treatment.name,
    serviceType: treatment.name,
    description: treatment.description,
    url: path === null ? null : absoluteUrl(path),
    image: absoluteUrl(treatment.image),
    provider: {
      '@type': ['LocalBusiness', 'DaySpa'],
      '@id': businessId(),
      name: site.name,
      url: absoluteUrl('/'),
    },
    areaServed: areaServed(),
  });
}

/**
 * FAQPage untuk halaman utama (§11.2). Pertanyaan yang jawabannya masih null
 * dibuang, karena Question tanpa acceptedAnswer tidak sah dan jawaban karangan
 * jauh lebih buruk lagi.
 */
export function buildFaqPageJsonLd(): JsonLdObject | undefined {
  const entries = getFaq().filter((item) => item.answer !== null);
  if (entries.length === 0) return undefined;

  return pruneJsonLdObject({
    '@context': SCHEMA_CONTEXT,
    '@type': 'FAQPage',
    url: absoluteUrl('/'),
    mainEntity: entries.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  });
}

/**
 * BreadcrumbList untuk route sekunder (§11.2). Hanya dua tingkat: tidak ada
 * route indeks /layanan, jadi menambahkannya berarti menerbitkan tautan mati.
 * `item` dihilangkan saat VITE_SITE_URL kosong; schema.org masih sah dengan
 * position dan name saja.
 */
export function buildBreadcrumbListJsonLd(route: RouteIdentity): JsonLdObject | undefined {
  if (route.kind === 'home' || route.kind === 'notFound') return undefined;

  const path = routePath(route);
  if (path === null) return undefined;

  return pruneJsonLdObject({
    '@context': SCHEMA_CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: getRouteLabel({ kind: 'home' }),
        item: absoluteUrl('/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: getRouteLabel(route),
        item: absoluteUrl(path),
      },
    ],
  });
}

/** Semua node JSON-LD yang perlu dipasang di satu route, sudah dibersihkan. */
export function getRouteJsonLd(route: RouteIdentity): JsonLdObject[] {
  if (route.kind === 'home') {
    const faq = buildFaqPageJsonLd();
    return faq === undefined ? [buildLocalBusinessJsonLd()] : [buildLocalBusinessJsonLd(), faq];
  }

  if (route.kind === 'notFound') return [];

  const nodes: JsonLdObject[] = [];

  if (route.kind === 'treatment') {
    const treatment = getTreatmentBySlug(route.slug);
    // Slug tidak dikenal berarti 404; getPageSeo juga memetakannya ke noindex.
    if (treatment === undefined) return [];
    nodes.push(buildServiceJsonLd(treatment));
  }

  const breadcrumb = buildBreadcrumbListJsonLd(route);
  if (breadcrumb !== undefined) nodes.push(breadcrumb);

  return nodes;
}

/**
 * Serialisasi untuk ditaruh sebagai isi <script type="application/ld+json">.
 * `<` diloloskan supaya isi data tidak pernah bisa menutup tag script lebih
 * awal, sekalipun sumbernya nanti berganti dari file statis ke API fase 2.
 */
export function serializeJsonLd(value: JsonLdObject | JsonLdObject[]): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
