/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WHATSAPP_NUMBER?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_GA4_ID?: string;
  readonly VITE_META_PIXEL_ID?: string;
  readonly VITE_GOOGLE_REVIEW_URL?: string;
  /** Fase 2. Kosong di v1 = mode konten statis (AGENTS.md §11). */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
