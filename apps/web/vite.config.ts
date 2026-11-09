import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { writeSitemapAndRobots } from './sitemap-plugin';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  ssgOptions: {
    // 'nested' menulis dist/<route>/index.html. Itu syarat supaya nginx
    // (try_files $uri $uri/) dan Netlify menyajikan HTML hasil prerender untuk
    // route sekunder, bukan jatuh ke fallback SPA. Crawler pratinjau tautan
    // WhatsApp tidak menjalankan JavaScript (DESIGN-SYSTEM.md §11.4).
    dirStyle: 'nested',
    // Jangan setel script ke 'async'. Vite memindahkan bundel modul ke <head>,
    // sementara vite-react-ssg menulis window.__VITE_REACT_SSG_HASH__ di akhir
    // <body>. Dengan 'async' bundel bisa jalan lebih dulu, hash terbaca undefined,
    // lalu fetch manifest kena 404 dan hidrasi gagal dengan "Unexpected token '<'".
    // Modul sudah ditunda secara default, jadi urutan bawaan yang benar.
    //
    // onFinished jalan sekali sesudah vite-react-ssg menulis seluruh HTML hasil
    // prerender ke outDir, jadi sitemap.xml dan robots.txt terbit setelah
    // kesepuluh halaman statis ada, bukan sebelumnya (DESIGN-SYSTEM.md §11.3).
    onFinished: async (outDir) => {
      await writeSitemapAndRobots(outDir);
    },
  },
});
