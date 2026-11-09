import type { SiteInfo } from '@wijaya/types';

export const siteInfo: SiteInfo = {
  name: 'Wijaya Home Massage & Spa',
  slogan: 'Relaksasi Nyaman, Pelayanan Profesional, Langsung ke Rumah Anda!',
  description:
    'Jasa pijat panggilan ke rumah untuk area Jabodetabek, ditangani terapis pria profesional.',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || null,
  openingHours: null,
  siteUrl: import.meta.env.VITE_SITE_URL || null,
  googleReviewUrl: import.meta.env.VITE_GOOGLE_REVIEW_URL || null,
};
