import { useState } from 'react';
import { Phone, MapPin, Calendar, Facebook } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReservationModal from './ReservationModal';

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <section className="relative pt-24 pb-20 px-4 overflow-hidden">
        {/* Background image su overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/hero-bg.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 to-gray-800/60" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6 sm:space-y-8 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-lg px-2">
              {t('hero.title')}
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto drop-shadow-md px-4">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 justify-center items-center pt-4 sm:pt-6 px-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 sm:gap-3 bg-white text-gray-800 px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-base sm:text-lg font-semibold w-full sm:w-auto justify-center"
              >
                <Calendar size={20} className="sm:hidden" />
                <Calendar size={24} className="hidden sm:block" />
                <span>{t('hero.bookTime')}</span>
              </button>

              <a
                href="tel:+37062444062"
                className="flex items-center gap-2 sm:gap-3 bg-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-gray-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-base sm:text-lg font-semibold w-full sm:w-auto justify-center"
              >
                <Phone size={20} className="sm:hidden" />
                <Phone size={24} className="hidden sm:block" />
                <span className="text-sm sm:text-base">{t('hero.phone')}</span>
              </a>

              <a
                href="https://share.google/tNkISjYTxfFL8kkVR"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-base sm:text-lg font-semibold border border-white/30 w-full sm:w-auto justify-center"
              >
                <MapPin size={20} className="sm:hidden" />
                <MapPin size={24} className="hidden sm:block" />
                <span>{t('hero.findUs')}</span>
              </a>
              
              <a
                href="https://www.facebook.com/p/Variklio-sala-61581165962744/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-base sm:text-lg font-semibold border border-white/30 w-full sm:w-auto justify-center"
              >
                <Facebook size={20} className="sm:hidden" />
                <Facebook size={24} className="hidden sm:block" />
                <span>{t('hero.facebook')}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <ReservationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
