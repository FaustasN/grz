import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Save to localStorage
    localStorage.setItem('i18nextLng', lng);
    // Close dropdown smoothly after selecting
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLanguage = i18n.language;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
      >
        <Globe size={16} />
        <span className="text-sm font-medium">
          {currentLanguage === 'lt' ? 'LT' : 'EN'}
        </span>
      </button>

      <div
        className={`absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-200 z-50 origin-top-right ${
          open ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'
        }`}
        role="listbox"
      >
        <button
          onClick={() => changeLanguage('lt')}
          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors duration-200 first:rounded-t-lg ${
            currentLanguage === 'lt' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
          }`}
          role="option"
          aria-selected={currentLanguage === 'lt'}
        >
          LT - Lietuvių
        </button>
        <button
          onClick={() => changeLanguage('en')}
          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors duration-200 last:rounded-b-lg ${
            currentLanguage === 'en' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
          }`}
          role="option"
          aria-selected={currentLanguage === 'en'}
        >
          EN - English
        </button>
      </div>
    </div>
  );
}
