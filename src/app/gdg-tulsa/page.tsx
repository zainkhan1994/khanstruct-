import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { GDGHero } from '@/components/gdg/GDGHero';
import { GDGMission } from '@/components/gdg/GDGMission';
import { GDGEvents } from '@/components/gdg/GDGEvents';
import { GDGFocusAreas } from '@/components/gdg/GDGFocusAreas';
import { GDGGetInvolved } from '@/components/gdg/GDGGetInvolved';
import { GDGFinalCTA } from '@/components/gdg/GDGFinalCTA';

export const metadata: Metadata = {
  title: 'Project GDG Tulsa',
  description:
    'Building a strong developer community in Tulsa through learning, networking, and innovation. Google Developer Group Tulsa.',
};

export default function GDGTulsaPage() {
  return (
    <>
      <Header />
      <main>
        <GDGHero />
        <GDGMission />
        <GDGEvents />
        <GDGFocusAreas />
        <GDGGetInvolved />
        <GDGFinalCTA />
      </main>
      <Footer />
    </>
  );
}
