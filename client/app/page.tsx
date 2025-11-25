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
        <section id="hero"><HeroSection /></section>
        <section id="apie-mus"><AboutSection /></section>
        <section id="paslaugos"><ServicesSection /></section>
        <section id="kontaktai"><ContactSection /></section>
      </main>
      <PrivacyPolicy />
      <Footer />
      <ScrollToTop />
    </>
  );
}

