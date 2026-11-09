import { Accordion, Container, SectionHeading } from '@/components/ui';
import { getFaq } from '@/data';

/** Dipasang sama di setiap Accordion supaya browser menutup item lain saat satu dibuka. */
const FAQ_GROUP_NAME = 'faq';

/** Cabang jujur untuk Faq.answer === null (tipe mengizinkannya meski ketujuh butir saat ini terisi). */
const FALLBACK_ANSWER = 'Jawaban belum ditetapkan, akan dilengkapi sebelum situs ini tayang.';

/**
 * S9 (DESIGN-SYSTEM §4.3, ritme "padat": py-10 di mobile sampai py-20 di desktop, sama dengan
 * katalog dan area). Tujuh butir dari BRIEF.md §3.7, dirender lewat Accordion siap pakai (§6.4)
 * alih-alih membangun ulang <details>/<summary> sendiri.
 */
export default function Faq() {
  const items = getFaq();

  return (
    <section id="faq" aria-labelledby="faq-heading" className="border-t border-line bg-paper">
      <Container className="py-10 sm:py-16 lg:py-20">
        <SectionHeading
          id="faq-heading"
          eyebrow="Tanya Jawab"
          title="Pertanyaan yang Sering Diajukan"
          className="max-w-2xl"
        />
        <div className="mt-10 sm:mt-14">
          {items.map((item) => (
            <Accordion key={item.slug} name={FAQ_GROUP_NAME} question={item.question}>
              {item.answer ?? FALLBACK_ANSWER}
            </Accordion>
          ))}
        </div>
      </Container>
    </section>
  );
}
