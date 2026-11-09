import { promises as fs } from 'node:fs';
import { isAbsolute, join } from 'node:path';

import { loadEnv } from 'vite';

// Impor langsung dari src/content/treatments, bukan dari src/data (lewat
// src/content/site.ts yang membaca import.meta.env). vite.config.ts dimuat
// dengan membundel file lokal yang diimpornya lalu menjalankannya di Node
// biasa, tanpa define import.meta.env milik Vite, jadi import.meta.env.X yang
// tidak dijaga di modul yang ikut terbundel membuat seluruh build gagal saat
// memuat config, bukan hanya saat prerender.
import { treatments } from './src/content/treatments';

/**
 * sitemap.xml dan robots.txt dihasilkan saat build (DESIGN-SYSTEM.md 11.3),
 * dipanggil dari ssgOptions.onFinished di vite.config.ts sesudah vite-react-ssg
 * menulis seluruh HTML hasil prerender ke outDir.
 *
 * VITE_SITE_URL dibaca lewat loadEnv, bukan process.env langsung, supaya
 * nilainya persis sama dengan yang dipakai import.meta.env.VITE_SITE_URL di
 * src/content/site.ts: gabungan file .env dan environment asli, dengan
 * environment asli menang. Mode dan root mengikuti resolusi default
 * vite-react-ssg saat tidak ada ssgOptions.mode (lihat build() di
 * node_modules/vite-react-ssg).
 */

const STATIC_PATHS = ['/', '/kebijakan-privasi', '/syarat-ketentuan'] as const;

function collectUrlPaths(): string[] {
  const treatmentPaths = treatments.map((treatment) => `/layanan/${treatment.slug}`);
  return [...STATIC_PATHS, ...treatmentPaths];
}

function normalizeSiteUrl(raw: string | undefined): string | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;
  return trimmed.replace(/\/+$/, '');
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildSitemapXml(origin: string, paths: string[]): string {
  const urlEntries = paths
    .map((path) => `  <url>\n    <loc>${escapeXml(`${origin}${path}`)}</loc>\n  </url>`)
    .join('\n');
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlEntries,
    '</urlset>',
    '',
  ].join('\n');
}

function buildRobotsTxt(sitemapUrl: string | null): string {
  const lines = ['User-agent: *', 'Allow: /'];
  if (sitemapUrl) {
    lines.push('', `Sitemap: ${sitemapUrl}`);
  }
  return `${lines.join('\n')}\n`;
}

/**
 * Dipanggil sekali di akhir build dengan outDir yang sama seperti yang ditulis
 * vite-react-ssg (biasanya "dist", relatif terhadap root proyek).
 *
 * VITE_SITE_URL kosong: sitemap.xml sengaja dilewati, bukan ditulis dengan
 * origin "undefined", karena sitemap berisi URL palsu lebih buruk daripada
 * tidak ada sitemap sama sekali, crawler bisa mengindeks tautan rusak.
 * robots.txt tetap diterbitkan tanpa baris Sitemap.
 */
export async function writeSitemapAndRobots(outDir: string): Promise<void> {
  const root = process.cwd();
  const out = isAbsolute(outDir) ? outDir : join(root, outDir);
  const mode = process.env.MODE || process.env.NODE_ENV || 'production';
  const env = loadEnv(mode, root, 'VITE_');
  const siteUrl = normalizeSiteUrl(env.VITE_SITE_URL);

  if (siteUrl === null) {
    console.warn(
      '[sitemap-plugin] VITE_SITE_URL kosong, sitemap.xml dilewati supaya tidak menerbitkan URL rusak seperti "undefined/layanan/...". Isi VITE_SITE_URL sebelum deploy produksi agar sitemap.xml ikut terbit.',
    );
    await fs.writeFile(join(out, 'robots.txt'), buildRobotsTxt(null), 'utf-8');
    return;
  }

  const paths = collectUrlPaths();
  await fs.writeFile(join(out, 'sitemap.xml'), buildSitemapXml(siteUrl, paths), 'utf-8');
  await fs.writeFile(join(out, 'robots.txt'), buildRobotsTxt(`${siteUrl}/sitemap.xml`), 'utf-8');
  console.log(`[sitemap-plugin] sitemap.xml diterbitkan dengan ${paths.length} URL.`);
}
