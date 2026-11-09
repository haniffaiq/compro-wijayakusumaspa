/**
 * Analytics klik WhatsApp (F-09). GA4 dan Meta Pixel keduanya opsional:
 * tanpa env, seluruh modul ini jadi no-op tanpa error dan tanpa warning, karena
 * demo dan preview dijalankan tanpa properti analytics sama sekali
 * (AGENTS.md §11).
 *
 * Nama event `click_whatsapp` beserta param `source_section` dan `treatment`
 * adalah kontrak jangka panjang yang nanti jadi dasar atribusi lead di CRM
 * (AGENTS.md §18.3). Mengganti namanya memutus data historis.
 */

/** gtag.js membaca tiap entri dataLayer sebagai daftar argumen perintah. */
type GtagArgs = unknown[];

type GtagFn = (...args: GtagArgs) => void;

/**
 * Stub resmi Meta Pixel: `queue` menampung event yang dikirim sebelum
 * fbevents.js selesai dimuat, dan `callMethod` dipasang oleh skrip itu saat siap.
 */
type FbqFn = {
  (...args: GtagArgs): void;
  callMethod?: (...args: GtagArgs) => void;
  queue: GtagArgs[];
  push: (...args: GtagArgs) => void;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
    fbq?: FbqFn;
    _fbq?: FbqFn;
  }
}

export type WhatsAppClickParams = {
  /** Section asal klik, mis. "hero", "treatment-card", "floating-cta". */
  source: string;
  /** Nama treatment bila CTA-nya spesifik per treatment. */
  treatment?: string;
};

const EVENT_CLICK_WHATSAPP = 'click_whatsapp';

/**
 * Nilai pengganti saat CTA tidak terikat treatment tertentu. Param tetap
 * dikirim supaya laporan tidak punya baris kosong yang ambigu, dan "none"
 * terbaca jelas sebagai "CTA umum", bukan sebagai treatment karangan.
 */
const TREATMENT_NOT_SPECIFIED = 'none';

let initialized = false;

/**
 * vite-react-ssg memprerender route ini di Node, jadi modul dieksekusi tanpa
 * window maupun document. Setiap akses ke DOM wajib lewat gerbang ini, kalau
 * tidak build produksi pecah di tahap prerender.
 */
function getBrowserWindow(): (Window & typeof globalThis) | null {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null;
  return window;
}

function readEnv(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/**
 * Skrip disuntik dari JS setelah mount, bukan ditulis di <head> index.html.
 * Skrip yang disuntik dinamis otomatis tidak memblokir parser, dan `async`
 * dipasang eksplisit supaya niatnya terbaca: analytics tidak boleh menahan LCP
 * (REQUIREMENTS.md §5.1).
 */
function injectScript(win: Window & typeof globalThis, src: string): void {
  const script = win.document.createElement('script');
  script.src = src;
  script.async = true;
  win.document.head.appendChild(script);
}

function setupGa4(win: Window & typeof globalThis): void {
  const measurementId = readEnv(import.meta.env.VITE_GA4_ID);
  if (!measurementId) return;

  win.dataLayer = win.dataLayer ?? [];
  if (typeof win.gtag !== 'function') {
    win.gtag = function gtag(): void {
      /**
       * `arguments` dipakai sengaja, bukan rest param: gtag.js memeriksa setiap
       * entri dataLayer dengan Object.prototype.toString dan hanya memproses
       * yang benar-benar objek `arguments` sebagai perintah gtag. Array biasa
       * masuk ke jalur perintah legacy dan event-nya dibuang tanpa error.
       */
      // eslint-disable-next-line prefer-rest-params
      win.dataLayer?.push(arguments);
    };
  }

  win.gtag('js', new Date());
  win.gtag('config', measurementId);
  injectScript(
    win,
    `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`,
  );
}

function createFbqStub(): FbqFn {
  const stub = ((...args: GtagArgs): void => {
    const callMethod = stub.callMethod;
    if (callMethod) {
      callMethod.apply(stub, args);
      return;
    }
    stub.queue.push(args);
  }) as FbqFn;

  stub.queue = [];
  // fbevents.js dan beberapa integrasi pihak ketiga memanggil fbq.push sebagai
  // alias fbq, jadi aliasnya ikut dipasang persis seperti snippet resmi.
  stub.push = stub;
  stub.loaded = true;
  stub.version = '2.0';
  return stub;
}

function setupMetaPixel(win: Window & typeof globalThis): void {
  const pixelId = readEnv(import.meta.env.VITE_META_PIXEL_ID);
  if (!pixelId) return;

  if (typeof win.fbq !== 'function') {
    const stub = createFbqStub();
    win.fbq = stub;
    win._fbq = win._fbq ?? stub;
  }

  win.fbq('init', pixelId);
  win.fbq('track', 'PageView');
  injectScript(win, 'https://connect.facebook.net/en_US/fbevents.js');
}

/**
 * Memasang provider yang env-nya terisi. Idempoten dan aman dipanggil dari
 * effect setelah hidrasi. Tanpa env apa pun, fungsi ini tidak melakukan apa-apa.
 */
export function initAnalytics(): void {
  if (initialized) return;
  const win = getBrowserWindow();
  if (!win) return;

  initialized = true;
  setupGa4(win);
  setupMetaPixel(win);
}

/**
 * Melaporkan satu klik CTA WhatsApp (F-09).
 *
 * Init dipanggil di sini juga, bukan hanya dari layer UI: klik adalah satu-satunya
 * konversi yang diukur, dan kalau skrip belum dimuat, stub GA4 dan Meta Pixel
 * mengantre event sampai skripnya siap, jadi klik pertama tidak hilang.
 *
 * Saat kedua env kosong, `win.gtag` dan `win.fbq` tetap undefined dan optional
 * call di bawah jadi no-op senyap. Tidak ada pemanggilan fungsi yang tidak ada.
 */
export function trackWhatsAppClick(params: WhatsAppClickParams): void {
  const win = getBrowserWindow();
  if (!win) return;

  initAnalytics();

  const payload = {
    source_section: params.source,
    treatment: params.treatment?.trim() || TREATMENT_NOT_SPECIFIED,
  };

  win.gtag?.('event', EVENT_CLICK_WHATSAPP, payload);
  win.fbq?.('trackCustom', EVENT_CLICK_WHATSAPP, payload);
}
