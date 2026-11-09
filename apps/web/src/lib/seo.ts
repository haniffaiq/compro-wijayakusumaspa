import type { Treatment } from '@wijaya/types';

import { getAreas, getSiteInfo, getTreatmentBySlug } from '@/data';

/**
 * Satu-satunya sumber metadata per route (DESIGN-SYSTEM.md §11.1). Judul dan
 * deskripsi dirangkai dari src/data/, jadi perubahan nama treatment atau daftar
 * area tidak perlu diedit dua kali.
 *
 * Modul ini bebas DOM: tidak menyentuh window atau document sama sekali, karena
 * vite-react-ssg mengeksekusinya di Node saat prerender (§11.4).
 */

/** Batas aman deskripsi meta sebelum dipotong mesin pencari (§11.1). */
export const DESCRIPTION_MAX_LENGTH = 155;

export type RouteIdentity =
  | { kind: 'home' }
  | { kind: 'treatment'; slug: string }
  | { kind: 'privacy' }
  | { kind: 'terms' }
  | { kind: 'notFound' };

export type OgImage = {
  /** Path absolut dari root situs, mis. /og/default.jpg */
  path: string;
  width: number;
  height: number;
  alt: string;
};

export type OpenGraphMeta = {
  title: string;
  description: string;
  type: 'website';
  siteName: string;
  locale: 'id_ID';
  /** null saat VITE_SITE_URL kosong, supaya tidak lahir URL rusak. */
  url: string | null;
  /** null selama aset 1200x630 belum ada. */
  image: OgImage | null;
};

export type TwitterMeta = {
  card: 'summary' | 'summary_large_image';
  title: string;
  description: string;
  image: string | null;
};

export type PageSeo = {
  route: RouteIdentity;
  /** Path route, null untuk 404 yang tidak punya alamat kanonik. */
  path: string | null;
  title: string;
  description: string;
  canonical: string | null;
  /** null berarti pakai perilaku default crawler, bukan noindex. */
  robots: string | null;
  openGraph: OpenGraphMeta;
  twitter: TwitterMeta;
};

export type MetaTag =
  | { name: string; content: string }
  | { property: string; content: string };

/**
 * Gambar Open Graph belum ada. §11.3 mewajibkan 1200x630, sementara public/img/
 * hanya memuat foto konten (1600x685 dan 1600x1200, format webp yang pratinjau
 * WhatsApp tidak selalu baca). Menunjuk ke file yang belum ada sama rusaknya
 * dengan tidak memasang apa pun, jadi tag og:image dihilangkan sampai asetnya
 * masuk (REQUIREMENTS.md §8). Isi konstanta ini dan seluruh tag ikut muncul.
 */
export const OG_IMAGE: OgImage | null = null;

/** Label pendek untuk breadcrumb dan navigasi, mengikuti tabel §11.1. */
const ROUTE_LABEL = {
  home: 'Beranda',
  privacy: 'Kebijakan Privasi',
  terms: 'Syarat & Ketentuan',
  notFound: 'Halaman Tidak Ditemukan',
} as const;

function siteOrigin(): string | null {
  const { siteUrl } = getSiteInfo();
  if (siteUrl === null) return null;

  const trimmed = siteUrl.trim().replace(/\/+$/, '');
  return trimmed === '' ? null : trimmed;
}

/**
 * Mengembalikan URL absolut, atau null bila VITE_SITE_URL kosong. Pemanggil
 * wajib memperlakukan null sebagai "tag dihilangkan", bukan string kosong.
 */
export function absoluteUrl(path: string): string | null {
  const origin = siteOrigin();
  if (origin === null) return null;

  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${suffix}`;
}

export function routePath(route: RouteIdentity): string | null {
  switch (route.kind) {
    case 'home':
      return '/';
    case 'treatment':
      return `/layanan/${route.slug}`;
    case 'privacy':
      return '/kebijakan-privasi';
    case 'terms':
      return '/syarat-ketentuan';
    case 'notFound':
      return null;
  }
}

export function getRouteLabel(route: RouteIdentity): string {
  if (route.kind === 'treatment') {
    return getTreatmentBySlug(route.slug)?.name ?? ROUTE_LABEL.notFound;
  }
  return ROUTE_LABEL[route.kind];
}

function normalize(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function clampDescription(text: string): string {
  const value = normalize(text);
  if (value.length <= DESCRIPTION_MAX_LENGTH) return value;

  const cut = value.slice(0, DESCRIPTION_MAX_LENGTH);
  const lastSpace = cut.lastIndexOf(' ');
  const head = lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
  return head.replace(/[\s,.;:]+$/, '');
}

/**
 * Menyusun daftar area sebanyak yang masih masuk sisa anggaran karakter, lalu
 * berhenti. Dipotong di tengah nama area akan menghasilkan deskripsi yang salah
 * secara faktual, jadi area yang tidak kebagian tempat dibuang utuh.
 */
function areaClause(prefix: string, budget: number): string | null {
  let clause = '';

  for (const area of getAreas()) {
    const next = clause === '' ? `${prefix}${area.name}` : `${clause}, ${area.name}`;
    if (next.length + 1 > budget) break;
    clause = next;
  }

  return clause === '' ? null : `${clause}.`;
}

function composeDescription(lead: string, areaPrefix: string): string {
  const base = normalize(lead);
  const sentence = /[.!?]$/.test(base) ? base : `${base}.`;
  const budget = DESCRIPTION_MAX_LENGTH - sentence.length - 1;
  const clause = budget > 0 ? areaClause(areaPrefix, budget) : null;

  return clampDescription(clause === null ? sentence : `${sentence} ${clause}`);
}

function treatmentSeo(treatment: Treatment): { title: string; description: string } {
  return {
    title: `${treatment.name}, Pijat Panggilan ke Rumah`,
    description: composeDescription(treatment.description, 'Panggilan ke rumah area '),
  };
}

function titleAndDescription(route: RouteIdentity): { title: string; description: string } {
  const site = getSiteInfo();

  switch (route.kind) {
    case 'home':
      return {
        title: `${site.name}, Pijat Panggilan Jabodetabek`,
        description: composeDescription(site.description, 'Melayani '),
      };
    case 'treatment': {
      const treatment = getTreatmentBySlug(route.slug);
      if (treatment === undefined) return titleAndDescription({ kind: 'notFound' });
      return treatmentSeo(treatment);
    }
    case 'privacy':
      return {
        title: ROUTE_LABEL.privacy,
        description: clampDescription(`Kebijakan privasi ${site.name}. ${site.description}`),
      };
    case 'terms':
      return {
        title: ROUTE_LABEL.terms,
        description: clampDescription(
          `Syarat dan ketentuan layanan ${site.name}. ${site.description}`,
        ),
      };
    case 'notFound':
      return {
        title: ROUTE_LABEL.notFound,
        description: clampDescription(`Halaman ini tidak ada. ${site.description}`),
      };
  }
}

/**
 * Metadata lengkap satu route. Slug treatment yang tidak dikenal jatuh ke
 * metadata 404 beserta robots noindex, bukan ke judul halaman utama, supaya URL
 * salah tidak ikut terindeks sebagai duplikat.
 */
export function getPageSeo(route: RouteIdentity): PageSeo {
  const site = getSiteInfo();
  const resolved: RouteIdentity =
    route.kind === 'treatment' && getTreatmentBySlug(route.slug) === undefined
      ? { kind: 'notFound' }
      : route;

  const { title, description } = titleAndDescription(resolved);
  const path = routePath(resolved);
  const canonical = path === null ? null : absoluteUrl(path);
  const imageUrl = OG_IMAGE === null ? null : absoluteUrl(OG_IMAGE.path);

  return {
    route: resolved,
    path,
    title,
    description,
    canonical,
    robots: resolved.kind === 'notFound' ? 'noindex, follow' : null,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: site.name,
      locale: 'id_ID',
      url: canonical,
      image: imageUrl === null ? null : OG_IMAGE,
    },
    twitter: {
      card: imageUrl === null ? 'summary' : 'summary_large_image',
      title,
      description,
      image: imageUrl,
    },
  };
}

/**
 * Bentuk siap-render untuk komponen Head vite-react-ssg. Tag yang datanya null
 * tidak masuk daftar, jadi layer route tidak perlu menulis kondisional sendiri.
 */
export function toMetaTags(seo: PageSeo): MetaTag[] {
  const tags: MetaTag[] = [{ name: 'description', content: seo.description }];

  if (seo.robots !== null) tags.push({ name: 'robots', content: seo.robots });

  tags.push(
    { property: 'og:type', content: seo.openGraph.type },
    { property: 'og:site_name', content: seo.openGraph.siteName },
    { property: 'og:locale', content: seo.openGraph.locale },
    { property: 'og:title', content: seo.openGraph.title },
    { property: 'og:description', content: seo.openGraph.description },
  );

  if (seo.openGraph.url !== null) {
    tags.push({ property: 'og:url', content: seo.openGraph.url });
  }

  const ogImage = seo.openGraph.image;
  const ogImageUrl = ogImage === null ? null : absoluteUrl(ogImage.path);
  if (ogImage !== null && ogImageUrl !== null) {
    tags.push(
      { property: 'og:image', content: ogImageUrl },
      { property: 'og:image:width', content: String(ogImage.width) },
      { property: 'og:image:height', content: String(ogImage.height) },
      { property: 'og:image:alt', content: ogImage.alt },
    );
  }

  tags.push(
    { name: 'twitter:card', content: seo.twitter.card },
    { name: 'twitter:title', content: seo.twitter.title },
    { name: 'twitter:description', content: seo.twitter.description },
  );

  if (seo.twitter.image !== null) {
    tags.push({ name: 'twitter:image', content: seo.twitter.image });
  }

  return tags;
}
