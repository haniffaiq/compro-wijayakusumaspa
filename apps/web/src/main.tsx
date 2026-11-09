import { ViteReactSSG } from 'vite-react-ssg';

import { routes } from './App';
import { initAnalytics } from './lib/analytics';
import './styles/index.css';

/**
 * initAnalytics dipanggil hanya saat isClient true. vite-react-ssg memanggil
 * fungsi ini juga saat prerender tiap route di Node (isClient false di sana),
 * dan initAnalytics sendiri sudah menjaga lewat getBrowserWindow, tapi
 * pengecekan isClient di sini membuat niatnya eksplisit: GA4 dan Meta Pixel
 * (F-09) hanya boleh menyala di browser pengunjung sesudah hidrasi, bukan
 * selama build (AGENTS.md §11).
 */
export const createRoot = ViteReactSSG({ routes }, ({ isClient }) => {
  if (isClient) {
    initAnalytics();
  }
});
