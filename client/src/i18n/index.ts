import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import lt from './locales/lt.json';
import en from './locales/en.json';

const resources = {
  lt: {
    translation: lt
  },
  en: {
    translation: en
  }
};

// Get saved language from localStorage or use default
const getSavedLanguage = (): string => {
  const saved = localStorage.getItem('i18nextLng');
  if (saved && (saved === 'lt' || saved === 'en')) {
    return saved;
  }
  return 'lt'; // default language
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getSavedLanguage(),
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false // React already does escaping
    }
  });

// Save language to localStorage whenever it changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
});

export default i18n;
