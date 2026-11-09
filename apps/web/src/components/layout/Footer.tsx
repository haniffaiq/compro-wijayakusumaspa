import { Link } from 'react-router-dom';

import { Container } from '@/components/ui';
import { getAreas, getSiteInfo } from '@/data';

import { Wordmark } from './Navbar';
import { WhatsAppCta } from './WhatsAppDialog';

/**
 * Lima anchor yang sama dengan Navbar. Sengaja diulang di sini, bukan di-import, karena file
 * komponen yang meng-export konstanta non-primitif mematikan fast refresh, dan daftar file di
 * folder layout ini tetap. id-nya adalah kontrak dengan worker section.
 */
const PAGE_LINKS = [
  { id: 'layanan', label: 'Layanan' },
  { id: 'area', label: 'Area' },
  { id: 'ketentuan', label: 'Ketentuan' },
  { id: 'ulasan', label: 'Ulasan' },
  { id: 'faq', label: 'FAQ' },
] as const;

const LEGAL_LINKS = [
  { to: '/kebijakan-privasi', label: 'Kebijakan Privasi' },
  { to: '/syarat-ketentuan', label: 'Syarat & Ketentuan' },
] as const;

const FOOTER_LINK_CLASSES =
  'inline-flex min-h-11 items-center text-muted-inv transition-colors duration-150 [transition-timing-function:ease] hover:text-paper';

/**
 * Penutup halaman di atas latar ink. Pembalikan terang ke gelap adalah alat hierarki di arah
 * visual ini (§2.5), jadi footer memang gelap dan bukan sekadar pita abu di bawah.
 *
 * Nomor WhatsApp dan jam operasional dinyatakan belum ada, bukan disembunyikan atau dikarang:
 * keduanya dibaca dari data, jadi begitu klien memberikannya, baris ini berubah sendiri.
 */
const BUILD_YEAR = new Date().getFullYear();

export default function Footer() {
  const site = getSiteInfo();
  const areas = getAreas();

  return (
    <footer className="on-dark relative overflow-hidden bg-ink text-paper">
      {/* Ampersand raksasa beropasitas rendah, motif identitas yang sama dengan wordmark (§1). */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 -left-6 select-none font-display text-[clamp(7rem,26vw,16rem)] italic leading-[0.75] text-paper/5"
      >
        &amp;
      </span>

      <Container className="relative py-12 sm:py-16 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-12 sm:gap-8">
          <div className="sm:col-span-5">
            {/* text-2xl memenuhi batas teks besar, syarat agar ampersand clay boleh di atas ink. */}
            <Wordmark name={site.name} className="block text-2xl leading-snug" />
            <p className="mt-4 max-w-sm text-muted-inv">{site.slogan}</p>
          </div>

          <nav aria-label="Navigasi footer" className="sm:col-span-4">
            <h2 className="label text-muted-inv">Halaman</h2>
            <ul className="mt-1">
              {PAGE_LINKS.map((link) => (
                <li key={link.id}>
                  {/* Href absolut supaya anchor tetap benar dari route sekunder. */}
                  <a href={`/#${link.id}`} className={FOOTER_LINK_CLASSES}>
                    {link.label}
                  </a>
                </li>
              ))}
              {LEGAL_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={FOOTER_LINK_CLASSES}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sm:col-span-3">
            <h2 className="label text-muted-inv">Area layanan</h2>
            <ul className="mt-3 space-y-1 text-muted-inv">
              {areas.map((area) => (
                <li key={area.slug}>{area.name}</li>
              ))}
            </ul>
            <div className="mt-6">
              <WhatsAppCta source="footer" />
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-2 border-t border-paper/20 pt-6 text-sm text-muted-inv sm:mt-16">
          {site.whatsappNumber ? null : (
            <p>
              Nomor WhatsApp resmi belum diberikan oleh pemilik usaha, jadi belum dicantumkan di
              sini.
            </p>
          )}
          {site.openingHours ? (
            <p>Jam operasional: {site.openingHours}</p>
          ) : (
            <p>Jam operasional belum ditetapkan.</p>
          )}
          <p>
            {/*
              BUILD_YEAR dihitung sekali saat modul dievaluasi, bukan di setiap render, supaya
              nilai hasil prerender dan nilai saat hidrasi tidak bisa berbeda di pergantian
              tahun. Halaman statis tidak butuh tahun yang hidup.
            */}
            &copy; {BUILD_YEAR} {site.name}.
          </p>
        </div>
      </Container>
    </footer>
  );
}
