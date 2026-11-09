import type { ReactNode } from 'react';

import { WhatsAppCta } from '@/components/layout';
import { Container, SectionHeading } from '@/components/ui';
import { cn } from '@/lib/utils';

type IconProps = {
  className?: string;
};

/** Ikon dekoratif, bukan indikator langkah bernomor: `aria-hidden` dan `currentColor` (§7). */
function ChatIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 5h16v11H9l-4 4V5Z" />
      <line x1="8" y1="9" x2="16" y2="9" />
      <line x1="8" y1="13" x2="13" y2="13" />
    </svg>
  );
}

function FormIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="6" y="4" width="12" height="16" rx="1" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <line x1="9" y1="10" x2="15" y2="10" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  );
}

function ScheduleIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="5" width="16" height="15" rx="1" />
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="16" y1="3" x2="16" y2="7" />
      <polyline points="8.5 14 11 16.5 15.5 12" />
    </svg>
  );
}

function LocationIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.25" />
    </svg>
  );
}

type Step = {
  id: string;
  title: string;
  description: string;
  Icon: (props: IconProps) => ReactNode;
};

/**
 * Alur pemesanan empat langkah. Sengaja BUKAN ikon bulat bernomor (instruksi tegas melarang
 * pola itu): tiap langkah dibedakan lewat ikon SVG bermakna (chat, formulir, kalender,
 * lokasi), bukan lingkaran berisi angka. Teks ini tidak ada di `@/data` (bukan tipe domain di
 * `@wijaya/types`), jadi ditulis di sini sebagai satu-satunya tempatnya.
 */
const STEPS: Step[] = [
  {
    id: 'chat',
    title: 'Chat via WhatsApp',
    description:
      'Mulai percakapan dengan tim kami lewat WhatsApp untuk menyampaikan kebutuhan Anda.',
    Icon: ChatIcon,
  },
  {
    id: 'formulir',
    title: 'Isi Formulir Pemesanan',
    description:
      'Lengkapi data pemesanan langsung di dalam chat, mengikuti urutan formulir di samping.',
    Icon: FormIcon,
  },
  {
    id: 'konfirmasi',
    title: 'Konfirmasi Jadwal dan Terapis',
    description: 'Tim kami mengonfirmasi jadwal layanan beserta terapis yang akan bertugas.',
    Icon: ScheduleIcon,
  },
  {
    id: 'kedatangan',
    title: 'Terapis Datang ke Lokasi',
    description: 'Terapis tiba di alamat Anda sesuai jadwal yang telah disepakati.',
    Icon: LocationIcon,
  },
];

type FormField = {
  label: string;
  note?: string;
};

/** Urutan tetap dari mockups/BRIEF.md §3.8. Tidak ada di `@/data`, ditulis di sini saja. */
const FORM_FIELDS: FormField[] = [
  { label: 'Nama Pelanggan' },
  { label: 'Jenis Kelamin' },
  { label: 'Alamat Lengkap & Patokan' },
  { label: 'Area' },
  { label: 'Pilihan Treatment' },
  { label: 'Hari & Jam Layanan' },
  { label: 'Catatan Keluhan Khusus', note: 'wajib diisi untuk pelanggan wanita' },
];

/**
 * S7 Alur Pemesanan. Dua kolom di desktop: daftar langkah di kiri, kartu formulir pemesanan
 * (urutan isian tetap sesuai BRIEF §3.8) di kanan, diakhiri CTA WhatsApp.
 *
 * Ritme section ini py-14 mobile / py-24 desktop, dipilih berbeda dari Areas (py-10/py-20,
 * kategori "padat") dan Ethics (py-16/py-36, kategori "pernyataan"), supaya ketiga section
 * punya ritme vertikal yang berbeda satu sama lain sesuai arahan.
 */
export default function HowItWorks() {
  return (
    <section id="pemesanan" aria-labelledby="pemesanan-heading" className="border-t border-line">
      <Container className="py-14 sm:py-24">
        <SectionHeading
          eyebrow="Cara Memesan"
          title="Alur Pemesanan"
          subtitle="Empat langkah dari percakapan pertama sampai terapis tiba di lokasi Anda."
          id="pemesanan-heading"
        />

        <div className="mt-10 grid gap-10 sm:mt-14 sm:grid-cols-2 sm:gap-16">
          <ol className="list-none">
            {STEPS.map((step, index) => (
              <li
                key={step.id}
                className={cn('flex gap-4 py-6 sm:gap-6', index > 0 && 'border-t border-line')}
              >
                <step.Icon className="h-6 w-6 shrink-0 text-clay" />
                <div>
                  <h3 className="font-display text-lg text-ink sm:text-xl">{step.title}</h3>
                  <p className="mt-1 text-muted">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="rounded-sm border border-dashed border-line p-6 sm:p-8">
            <p className="label text-muted">Formulir Pemesanan WhatsApp</p>
            <ol className="mt-4 list-none space-y-3 text-sm text-ink sm:text-base">
              {FORM_FIELDS.map((field, index) => (
                <li
                  key={field.label}
                  className={cn(index < FORM_FIELDS.length - 1 && 'border-b border-line pb-3')}
                >
                  {field.label}
                  {field.note ? <span className="ml-1 text-muted">({field.note})</span> : null}
                </li>
              ))}
            </ol>
            <WhatsAppCta source="alur-pemesanan" className="mt-6" />
          </div>
        </div>
      </Container>
    </section>
  );
}
