import AboutSection from './components/layout/AboutSection';
import Header from './components/layout/Header';  
import HeroSection from './components/layout/HeroSection';
import ServicesSection from './components/layout/ServicesSection';
import Footer from './components/layout/Footer';
import ContactSection from './components/layout/ContactSection';
import PrivacyPolicy from './components/forms/PrivacyPolicy';
import ScrollToTop from './components/ui/ScrollToTop';
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

