import type { Treatment } from '@wijaya/types';

export const treatments: Treatment[] = [
  {
    slug: 'pijat-tradisional',
    name: 'Pijat Tradisional',
    tagline: 'Redakan Otot Kaku, Kembalikan Kesegaran Tubuh.',
    description:
      'Pijatan menyeluruh untuk melepas lelah setelah padatnya aktivitas.',
    duration: null,
    price: null,
    category: 'relaksasi',
    image: '/img/treatment-tradisional.webp',
  },
  {
    slug: 'refleksi',
    name: 'Refleksi',
    tagline: 'Relaksasi Area Kaki Setelah Beraktivitas.',
    description:
      'Pijat refleksi khusus untuk melancarkan sirkulasi dan menyegarkan kembali tubuh Anda.',
    duration: null,
    price: null,
    category: 'relaksasi',
    image: '/img/treatment-refleksi.webp',
  },
  {
    slug: 'bekam',
    name: 'Bekam',
    tagline: 'Terapi Bekam Higienis dengan Prosedur Aman.',
    description:
      'Layanan bekam profesional dengan peralatan steril untuk menjaga kebugaran tubuh.',
    duration: null,
    price: null,
    disclaimer:
      'Prosedur memakai alat steril. Disarankan tidak mandi air dingin 2 sampai 3 jam setelah terapi.',
    category: 'terapi',
    image: '/img/treatment-bekam.webp',
  },
  {
    slug: 'thai-massage',
    name: 'Thai Massage',
    tagline: 'Peregangan Tubuh untuk Meningkatkan Fleksibilitas.',
    description:
      'Kombinasi stretching dan pemijatan untuk melemaskan otot kaku.',
    duration: null,
    price: null,
    category: 'relaksasi',
    image: '/img/treatment-thai.webp',
  },
  {
    slug: 'sport-massage',
    name: 'Sport Massage',
    tagline: 'Pemulihan Otot Optimal Pasca-Olahraga.',
    description:
      'Pemijatan terarah yang disesuaikan dengan kebutuhan pemulihan otot Anda.',
    duration: null,
    price: null,
    category: 'pemulihan',
    image: '/img/treatment-sport.webp',
  },
  {
    slug: 'pijat-cedera-keseleo',
    name: 'Pijat Cedera & Keseleo',
    tagline: 'Penanganan Terarah untuk Keseleo & Otot Terkilir.',
    description:
      'Terapi terarah untuk mempercepat pemulihan cedera otot ringan.',
    duration: null,
    price: null,
    disclaimer:
      'Untuk cedera berat, cedera akut, atau patah tulang, lakukan pemeriksaan medis terlebih dahulu.',
    category: 'pemulihan',
    image: '/img/treatment-cedera.webp',
  },
  {
    slug: 'pijat-vitalitas',
    name: 'Pijat Vitalitas',
    tagline: 'Relaksasi Nyaman dengan Batasan Profesional yang Jelas.',
    description:
      'Perawatan kebugaran tubuh dengan standar etika dan kenyamanan tertinggi.',
    duration: null,
    price: null,
    disclaimer:
      'Relaksasi kebugaran yang dilakukan secara profesional dengan batasan pelayanan yang jelas, demi menjaga kenyamanan dan etika.',
    category: 'relaksasi',
    image: '/img/treatment-vitalitas.webp',
  },
];
