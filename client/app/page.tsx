import AboutSection from './components/layout/AboutSection';
import Header from './components/layout/Header';  
import HeroSection from './components/layout/HeroSection';
import ServicesSection from './components/layout/ServicesSection';
import Footer from './components/layout/Footer';
import ContactSection from './components/layout/ContactSection';
import PrivacyPolicy from './components/forms/PrivacyPolicy';
import ScrollToTop from './components/ui/ScrollToTop';
import { buildMetadata } from './lib/seo';

export const metadata = buildMetadata({
  path: '/',
  title: 'Autoservisas Vaidotuose, Vilniuje | Autovaldika',
  description:
    'Autoservisas Vaidotuose: kompiuterinė diagnostika, tepalų keitimas, 3D ratų suvedimas, važiuoklės, stabdžių ir kėbulo remontas. Skambinkite +370 618 81791.',
  keywords:
    'autoservisas Vaidotuose, automobilių servisas Vaidotai, auto servisas Vilnius, automobilių remontas, Autovaldika',
});

export default async function HomePage() {
  return (
    <>
      <Header  />
      <main>
        <section id="hero" className="scroll-mt-[120px]"><HeroSection /></section>
        <section id="apie-mus" className="scroll-mt-[120px]"><AboutSection /></section>
        <section id="paslaugos" className="scroll-mt-[120px]"><ServicesSection /></section>
        <section id="kontaktai" className="scroll-mt-[120px]"><ContactSection /></section>
      </main>
      <PrivacyPolicy />
      <Footer />
      <ScrollToTop />
    </>
  );
}

