import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import PrivacyPolicy from './components/PrivacyPolicy';


function App() {
  const { i18n } = useTranslation();
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div key={i18n.language} className="fade-in">
        <main>
          <HeroSection />
          <AboutSection />
          <ServicesSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
      <ScrollToTop />
      <PrivacyPolicy />
    </div>
  );
}

export default App;
