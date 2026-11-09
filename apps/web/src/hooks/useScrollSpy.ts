import { useEffect, useState } from 'react';

export type UseScrollSpyOptions = {
  /**
   * Menggeser batas aktif viewport untuk IntersectionObserver.
   * Default menganggap section "aktif" begitu bagian atasnya melewati
   * sepertiga viewport, supaya menu nav berpindah sebelum section
   * sebelumnya benar-benar habis tergulir (F-04).
   */
  rootMargin?: string;
};

const DEFAULT_ROOT_MARGIN = '-20% 0px -70% 0px';

/**
 * Memantau daftar id section dan mengembalikan id yang sedang terlihat,
 * untuk menandai menu navigasi aktif (REQUIREMENTS.md F-04).
 *
 * Dibangun dengan IntersectionObserver, bukan penghitungan scrollY manual,
 * karena observer tidak memicu reflow dan tidak perlu throttle sendiri.
 */
export function useScrollSpy(ids: string[], options: UseScrollSpyOptions = {}): string | null {
  const { rootMargin = DEFAULT_ROOT_MARGIN } = options;
  const [activeId, setActiveId] = useState<string | null>(null);

  // Dependency di-ratakan jadi string karena array literal yang dibuat
  // inline oleh caller punya identitas baru tiap render, yang akan membuat
  // observer dibongkar-pasang terus padahal isinya sama.
  const idsKey = ids.join(',');

  useEffect(() => {
    // vite-react-ssg merender section ini di Node saat build (prerender),
    // tempat IntersectionObserver tidak ada. Diam saja di server, observer
    // baru terpasang setelah hidrasi di browser.
    if (typeof IntersectionObserver === 'undefined') return;

    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    // Section yang id-nya belum ada di DOM (belum di-mount, atau typo di
    // caller) cukup dilewati, bukan dilempar sebagai error.
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;

        // Beberapa section bisa tumpang tindih terlihat sekaligus saat
        // scroll cepat; yang paling atas yang dianggap section aktif.
        const topmost = visible.reduce((a, b) =>
          a.boundingClientRect.top <= b.boundingClientRect.top ? a : b,
        );
        setActiveId(topmost.target.id);
      },
      { rootMargin },
    );

    targets.forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
    // idsKey merepresentasikan isi `ids`; lihat komentar di atas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, rootMargin]);

  return activeId;
}
