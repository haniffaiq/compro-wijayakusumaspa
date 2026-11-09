import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui';
import type { ButtonVariant } from '@/components/ui';
import { getSiteInfo } from '@/data';
import { trackWhatsAppClick } from '@/lib/analytics';
import { buildWhatsAppMessage, buildWhatsAppUrl } from '@/lib/whatsapp';

type WhatsAppDialogProps = {
  open: boolean;
  onClose: () => void;
  /** Nama treatment siap tampil, ikut masuk ke pesan ter-prefill. */
  treatment?: string;
};

const COPY_IDLE = '';
const COPY_DONE = 'Pesan sudah disalin.';
const COPY_FAILED = 'Penyalinan otomatis gagal. Salin teks di atas secara manual.';

const CloseIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-[18px] w-[18px]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
  >
    <line x1="5" y1="5" x2="19" y2="19" />
    <line x1="19" y1="5" x2="5" y2="19" />
  </svg>
);

/**
 * Cabang jujur saat VITE_WHATSAPP_NUMBER belum diisi: buildWhatsAppUrl mengembalikan null,
 * jadi tombol CTA tidak boleh menautkan ke mana pun. Dialog ini mengakui nomornya belum ada,
 * menampilkan pesan ter-prefill apa adanya, dan menyediakan tombol salin supaya pelanggan
 * tetap bisa memakai formulir pemesanan begitu nomor resminya tersedia.
 *
 * Pakai <dialog> native (DESIGN-SYSTEM §6.6): Escape, inert latar, dan pengembalian fokus ke
 * pemicu sudah ditangani browser, jadi tidak ada focus trap buatan sendiri yang perlu dirawat.
 */
export default function WhatsAppDialog({ open, onClose, treatment }: WhatsAppDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [copyStatus, setCopyStatus] = useState(COPY_IDLE);
  const message = buildWhatsAppMessage({ treatment });

  // Satu halaman punya beberapa CTA WhatsApp, jadi tiap instance dialog ikut terpasang. id yang
  // dikarang manual akan kembar dan membuat aria-labelledby menunjuk elemen yang ambigu;
  // useId memberi id unik yang sama antara hasil prerender dan hasil hidrasi.
  const instanceId = useId();
  const titleId = `${instanceId}-judul`;
  const messageLabelId = `${instanceId}-pesan`;

  // showModal hanya ada di browser. vite-react-ssg merender komponen ini di Node saat
  // prerender, dan di sana ref-nya null, jadi efek ini tidak pernah menyentuh DOM palsu.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open && typeof dialog.showModal === 'function') dialog.showModal();
      return;
    }

    if (dialog.open) dialog.close();
  }, [open]);

  // showModal sudah membuat latar inert, tapi iOS tetap menggulirkan body di belakang
  // dialog, jadi scroll dikunci manual selama dialog terbuka (AGENTS.md §17.1 butir 7).
  useEffect(() => {
    if (!open || typeof document === 'undefined') return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [open]);

  /**
   * Status salin direset di jalur penutupan, bukan di dalam effect yang memantau `open`:
   * setState sinkron di dalam effect memicu render berantai. Semua cara menutup dialog lewat
   * sini, termasuk Escape, karena <dialog> native memicu event `close`-nya sendiri.
   */
  const handleClose = (): void => {
    setCopyStatus(COPY_IDLE);
    onClose();
  };

  const handleCopy = (): void => {
    const clipboard = typeof navigator === 'undefined' ? null : navigator.clipboard;
    // Clipboard API tidak ada di konteks non-secure (http di jaringan lokal), jadi
    // kegagalannya diberi instruksi manual alih-alih dibiarkan senyap.
    if (!clipboard) {
      setCopyStatus(COPY_FAILED);
      return;
    }

    void clipboard.writeText(message).then(
      () => setCopyStatus(COPY_DONE),
      () => setCopyStatus(COPY_FAILED),
    );
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={handleClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) handleClose();
      }}
      className="fixed inset-0 m-auto h-fit max-h-[85dvh] w-[min(92vw,34rem)] max-w-none overflow-y-auto border-0 bg-transparent p-0 backdrop:bg-ink/80"
    >
      <div className="rounded-sm border border-line bg-paper p-5 text-ink sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="font-display text-xl leading-snug sm:text-2xl">
            Nomor WhatsApp belum tersedia
          </h2>
          <Button
            variant="icon"
            aria-label="Tutup dialog pesan WhatsApp"
            onClick={handleClose}
            className="h-11 w-11 shrink-0"
          >
            <CloseIcon />
          </Button>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-muted">
          Nomor WhatsApp resmi {getSiteInfo().name} belum diberikan oleh pemilik usaha, jadi tombol
          ini belum bisa membuka percakapan. Salin pesan di bawah, lalu kirimkan begitu nomornya
          tersedia.
        </p>

        <p id={messageLabelId} className="label mt-5 text-muted">
          Pesan ter-prefill
        </p>
        <pre
          aria-labelledby={messageLabelId}
          className="mt-2 whitespace-pre-wrap break-words rounded-sm border border-line p-4 font-sans text-sm leading-relaxed text-ink"
        >
          {message}
        </pre>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Button onClick={handleCopy}>Salin pesan</Button>
          <p role="status" className="text-sm text-muted">
            {copyStatus}
          </p>
        </div>
      </div>
    </dialog>
  );
}

export type WhatsAppCtaProps = {
  /** Section asal klik untuk analytics, mis. "navbar", "footer", "sticky-bar". */
  source: string;
  /** Nama treatment bila CTA-nya spesifik, ikut ke pesan ter-prefill dan ke analytics. */
  treatment?: string;
  variant?: ButtonVariant;
  className?: string;
  /** Default "Pesan via WhatsApp". Ganti hanya bila konteksnya menuntut label lain. */
  children?: ReactNode;
};

const DEFAULT_CTA_LABEL = 'Pesan via WhatsApp';

/**
 * Satu-satunya tombol WhatsApp yang dipakai di seluruh situs, supaya dua jalurnya tidak
 * ditulis ulang per section dan tidak ada tempat yang lupa menangani nomor kosong:
 *
 * 1. Nomor tersedia: tautan wa.me asli, tab baru, rel="noopener noreferrer", klik dilacak.
 * 2. Nomor kosong: buildWhatsAppUrl null, jadi tombol membuka WhatsAppDialog di atas.
 *
 * Komponen ini sengaja ditempatkan serumah dengan dialognya, bukan di file sendiri, karena
 * folder layout ini punya daftar file tetap dan keduanya memang satu unit perilaku.
 */
export function WhatsAppCta({
  source,
  treatment,
  variant = 'primary',
  className,
  children = DEFAULT_CTA_LABEL,
}: WhatsAppCtaProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  // Nilainya berasal dari env, jadi konstan sepanjang umur halaman: cabang di bawah tidak
  // pernah bertukar setelah render pertama dan urutan hook tetap stabil.
  const url = buildWhatsAppUrl({ treatment, source });

  if (url) {
    return (
      <Button
        as="a"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        variant={variant}
        className={className}
        onClick={() => trackWhatsAppClick({ source, treatment })}
      >
        {children}
      </Button>
    );
  }

  return (
    <>
      <Button variant={variant} className={className} onClick={() => setDialogOpen(true)}>
        {children}
      </Button>
      {/*
        Klik ini sengaja tidak dilacak sebagai click_whatsapp: tidak ada percakapan yang
        benar-benar terjadi selama nomornya kosong, dan menghitungnya akan menggelembungkan
        metrik konversi yang nanti dipakai mengoptimasi Meta Ads.
      */}
      <WhatsAppDialog
        open={dialogOpen}
        treatment={treatment}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}
