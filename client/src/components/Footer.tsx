import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8 sm:py-10 md:py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
            <img 
            src="/transperent_logo.png" 
            alt="TireService Logo" 
            className="h-12 sm:h-16 w-auto object-contain"
          />
            </h3>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{t('footer.links.title')}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#apie-mus" className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors">
                  {t('footer.links.about')}
                </a>
              </li>
              <li>
                <a href="#paslaugos" className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors">
                  {t('footer.links.services')}
                </a>
              </li>
              <li>
                <a href="#kontaktai" className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors">
                  {t('footer.links.contact')}
                </a>
              </li>
              <li>
                <a href="https://rekvizitai.vz.lt/imone/variklio_sala/" className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors">
                  {t('footer.links.info')}
                </a>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-2 md:col-span-1">
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{t('footer.contact.title')}</h4>
            <ul className="space-y-2 text-sm sm:text-base text-gray-400">
              <li>
                  <a href="tel:+37062444062" className="hover:text-white transition-colors">
                  {t('footer.contact.phone')}
                </a>
              </li>
              <li>
                <a href="mailto:varikliosala@gmail.com" className="hover:text-white transition-colors break-all">
                  {t('footer.contact.email')}
                </a>
              </li>
              <li>{t('footer.contact.address')}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 sm:pt-8 text-center text-gray-400">
          <p className="text-xs sm:text-sm">&copy; {currentYear} varikliosala.lt. {t('footer.rights')}.</p>
        </div>
      </div>
    </footer>
  );
}
