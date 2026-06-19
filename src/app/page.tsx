import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { Marquee } from '@/components/home/Marquee';
import { Services } from '@/components/home/Services';
import { Metrics } from '@/components/home/Metrics';
import { Projects } from '@/components/home/Projects';
import { GDGFeature } from '@/components/home/GDGFeature';
import { About } from '@/components/home/About';
import { ContactCTA } from '@/components/home/ContactCTA';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Metrics />
        <Projects />
        <GDGFeature />
        <About />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
