import Areas from '@/sections/Areas';
import Ethics from '@/sections/Ethics';
import Faq from '@/sections/Faq';
import FinalCta from '@/sections/FinalCta';
import Hero from '@/sections/Hero';
import HowItWorks from '@/sections/HowItWorks';
import Testimonials from '@/sections/Testimonials';
import Treatments from '@/sections/Treatments';
import Values from '@/sections/Values';

/**
 * Urutan section mengikuti REQUIREMENTS.md §3.2. Halaman ini hanya merangkai;
 * isinya dibaca tiap section sendiri dari src/data.
 *
 * Ketentuan layanan diletakkan sebelum alur pemesanan karena batasan layanan
 * harus terbaca sebelum orang memutuskan memesan, bukan sesudahnya.
 */
export default function Home() {
  return (
    <main className="bg-paper text-ink">
      <Hero />
      <Values />
      <Treatments />
      <Areas />
      <Ethics />
      <HowItWorks />
      <Testimonials />
      <Faq />
      <FinalCta />
    </main>
  );
}
