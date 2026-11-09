/* eslint-disable react-refresh/only-export-components --
   File ini mengekspor tabel route, jadi fast refresh sudah mati di sini sejak
   sebelum ada komponen di dalamnya: tiap perubahan pada `routes` memaksa reload
   penuh. Kedua komponen di bawah adalah bagian dari tabel route itu, yaitu
   pemasangan head per route dan resolusi slug, bukan komponen UI yang dipakai
   halaman lain. Memindahkannya keluar memecah satu unit yang utuh tanpa
   menghidupkan kembali fast refresh. */
import { useParams } from 'react-router-dom';
import type { RouteRecord } from 'vite-react-ssg';
import { Head } from 'vite-react-ssg';

import RootLayout from './components/layout/RootLayout';
import { getTreatmentBySlug, getTreatments } from './data';
import { getRouteJsonLd, serializeJsonLd } from './lib/jsonld';
import type { RouteIdentity } from './lib/seo';
import { getPageSeo, toMetaTags } from './lib/seo';
import Home from './routes/Home';
import NotFound from './routes/NotFound';
import Privacy from './routes/Privacy';
import Terms from './routes/Terms';
import TreatmentDetail from './routes/TreatmentDetail';

/**
 * Satu-satunya tempat yang mencetak isi <head> per route.
 *
 * `Head` dari vite-react-ssg adalah pembungkus react-helmet-async, dan isinya
 * diambil kembali oleh prerender lalu ditulis ke dalam HTML statis sebelum
 * JavaScript jalan. Itu syarat mutlak F-12: crawler pratinjau tautan WhatsApp
 * tidak mengeksekusi JS, jadi meta yang hanya disuntik setelah hidrasi tidak
 * pernah terbaca (DESIGN-SYSTEM.md §11.4).
 *
 * Nilainya tidak dirangkai di sini, seluruhnya datang dari lib/seo.ts dan
 * lib/jsonld.ts. Tag yang datanya belum ada (og:image, canonical saat
 * VITE_SITE_URL kosong) sudah dibuang di sana, jadi komponen ini tidak pernah
 * menerbitkan URL rusak maupun properti karangan (§11.2).
 */
function PageHead({ route }: { route: RouteIdentity }) {
  const seo = getPageSeo(route);
  const jsonLdNodes = getRouteJsonLd(seo.route);

  return (
    <Head>
      <title>{seo.title}</title>
      {toMetaTags(seo).map((tag) =>
        'name' in tag ? (
          <meta key={`name:${tag.name}`} name={tag.name} content={tag.content} />
        ) : (
          <meta key={`property:${tag.property}`} property={tag.property} content={tag.content} />
        ),
      )}
      {seo.canonical === null ? null : <link rel="canonical" href={seo.canonical} />}
      {jsonLdNodes.map((node, index) => (
        // Isi script, bukan atribut: react-helmet memetakan children string
        // satu script menjadi innerHTML, dan serializeJsonLd sudah meloloskan
        // "<" supaya data tidak pernah bisa menutup tag lebih awal.
        <script key={`jsonld-${index}`} type="application/ld+json">
          {serializeJsonLd(node)}
        </script>
      ))}
    </Head>
  );
}

/**
 * Slug yang tidak dikenal berakhir di NotFound beserta meta noindex, bukan di
 * halaman detail kosong: getPageSeo memetakan slug asing ke identitas 404 dan
 * getRouteJsonLd tidak menerbitkan Service untuk layanan yang tidak ada.
 *
 * Pencarian treatment dikerjakan di layer route, bukan di dalam halamannya,
 * supaya TreatmentDetail menerima data yang sudah pasti ada dan tidak perlu
 * menangani cabang "mungkin undefined" untuk kedua kalinya.
 */
function TreatmentRoute() {
  const { slug } = useParams();
  const treatment = slug === undefined ? undefined : getTreatmentBySlug(slug);

  if (treatment === undefined) {
    return (
      <>
        <PageHead route={{ kind: 'notFound' }} />
        <NotFound />
      </>
    );
  }

  return (
    <>
      <PageHead route={{ kind: 'treatment', slug: treatment.slug }} />
      <TreatmentDetail treatment={treatment} />
    </>
  );
}

/**
 * Tabel route untuk vite-react-ssg. `entry` menunjuk file sumber tiap route
 * supaya prerender bisa memetakan CSS dan modul yang dipakai halaman itu.
 *
 * `getStaticPaths` mendaftarkan ketujuh slug treatment sebagai path statis.
 * Tanpa itu, route dinamis dibuang dari daftar prerender (filter bawaan
 * membuang path yang memuat ":" atau "*") dan /layanan/<slug> hanya hidup
 * setelah JavaScript jalan. Path ditulis relatif terhadap route induk "/",
 * bentuk yang sama dengan path anak lain di tabel ini.
 */
export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <RootLayout />,
    entry: 'src/components/layout/RootLayout.tsx',
    children: [
      {
        index: true,
        element: (
          <>
            <PageHead route={{ kind: 'home' }} />
            <Home />
          </>
        ),
        entry: 'src/routes/Home.tsx',
      },
      {
        path: 'layanan/:slug',
        element: <TreatmentRoute />,
        entry: 'src/routes/TreatmentDetail.tsx',
        getStaticPaths: () => getTreatments().map((treatment) => `layanan/${treatment.slug}`),
      },
      {
        path: 'kebijakan-privasi',
        element: (
          <>
            <PageHead route={{ kind: 'privacy' }} />
            <Privacy />
          </>
        ),
        entry: 'src/routes/Privacy.tsx',
      },
      {
        path: 'syarat-ketentuan',
        element: (
          <>
            <PageHead route={{ kind: 'terms' }} />
            <Terms />
          </>
        ),
        entry: 'src/routes/Terms.tsx',
      },
      {
        path: '*',
        element: (
          <>
            <PageHead route={{ kind: 'notFound' }} />
            <NotFound />
          </>
        ),
        entry: 'src/routes/NotFound.tsx',
      },
    ],
  },
];
