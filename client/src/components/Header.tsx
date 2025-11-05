import { Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img 
            src="/transperent_logo.png" 
            alt="TireService Logo" 
            className="h-12 sm:h-16 w-auto object-contain"
            onClick={() => window.location.href = '/'}
          />
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <a
            href="tel:+37062444062"
            className="flex items-center gap-2 bg-gray-800 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-gray-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md text-sm sm:text-base font-semibold"
          >
            <Phone size={18} className="sm:hidden" />
            <Phone size={20} className="hidden sm:block" />
            <span className="hidden sm:inline">{t('header.call')}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
