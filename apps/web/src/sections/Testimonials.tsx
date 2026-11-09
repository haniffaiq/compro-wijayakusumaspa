import type { Testimonial } from '@wijaya/types';

import { Container, SectionHeading } from '@/components/ui';
import { getTestimonials, getTreatmentBySlug } from '@/data';

/**
 * BRIEF.md §3.6: ulasan hanya boleh tampil setelah pelanggan memberi izin eksplisit, dan
 * dilarang keras mengarang nama, rating, atau kutipan. getTestimonials() sengaja mengembalikan
 * array kosong sampai syarat itu terpenuhi (lihat src/content/testimonials.ts). Copy di bawah
 * menjelaskan sebabnya, bukan sekadar menyatakan "belum ada data".
 */
const EMPTY_STATE_TITLE = 'Belum Ada Ulasan yang Dipublikasikan';
const EMPTY_STATE_BODY =
  'Ulasan hanya ditampilkan setelah pelanggan memberi izin, dan kami tidak menampilkan ulasan buatan.';

function describeTreatment(slug: string | null): string | null {
  if (slug === null) return null;
  return getTreatmentBySlug(slug)?.name ?? null;
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const treatmentName = describeTreatment(testimonial.treatment);
  const meta = [testimonial.author, testimonial.area, treatmentName].filter(
    (part): part is string => part !== null,
  );

  return (
    <figure className="border-t border-line py-6 first:border-t-0 sm:py-8">
      <blockquote className="max-w-2xl font-display text-xl leading-snug text-ink sm:text-2xl">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-4 text-sm text-muted">
        {meta.join(', ')}
        {testimonial.rating !== null ? ` · ${testimonial.rating}/5` : ''}
      </figcaption>
    </figure>
  );
}

/**
 * S8 (DESIGN-SYSTEM §4.3, ritme "lapang": py-16 di mobile sampai py-36 di desktop). Dua
 * keadaan ditangani: array terisi, dan array kosong yang tampil sekarang. `isPlaceholder`
 * disaring di sini, bukan di src/data, supaya cabang kosong tetap benar seandainya baris
 * contoh suatu saat tersisip di sumbernya.
 */
export default function Testimonials() {
  const testimonials = getTestimonials().filter((item) => !item.isPlaceholder);
  const hasTestimonials = testimonials.length > 0;

  return (
    <section
      id="ulasan"
      aria-labelledby="ulasan-heading"
      className="border-t border-line bg-paper"
    >
      <Container className="py-16 sm:py-24 lg:py-36">
        <SectionHeading
          id="ulasan-heading"
          eyebrow="Ulasan"
          title={hasTestimonials ? 'Apa Kata Pelanggan Kami' : EMPTY_STATE_TITLE}
          subtitle={hasTestimonials ? undefined : EMPTY_STATE_BODY}
          className="max-w-xl"
        />
        {hasTestimonials ? (
          <div className="mt-10 sm:mt-14">
            {testimonials.map((item) => (
              <TestimonialCard key={item.id} testimonial={item} />
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
