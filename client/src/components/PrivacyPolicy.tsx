import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ChevronDown } from 'lucide-react';

interface PrivacySection {
  title: string;
  items: string[];
}

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Check if user has already accepted
  useEffect(() => {
    const accepted = localStorage.getItem('privacyPolicyAccepted');
    if (accepted === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('privacyPolicyAccepted', 'true');
    setIsVisible(false);
  };

  // Get privacy policy sections from i18n
  const privacySections = t('privacy.sections', { returnObjects: true }) as PrivacySection[];

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-lg animate-slide-up">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        {!isExpanded ? (
          // Compact view
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">{t('privacy.title')}</span>
                {' '}
                {t('privacy.compactText')}
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsExpanded(true)}
                className="flex-1 sm:flex-none px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
              >
                {t('privacy.more')}
                <ChevronDown size={16} />
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-semibold"
              >
                {t('privacy.accept')}
              </button>
            </div>
          </div>
        ) : (
          // Expanded view
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">{t('privacy.title')}</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={t('privacy.close')}
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="text-gray-700">
                {privacySections && Array.isArray(privacySections) && privacySections.map((section, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="text-base font-bold mt-4 mb-2 text-gray-800">
                      {section.title}
                    </h3>
                    <ul className="list-disc ml-6 mb-3 space-y-1">
                      {section.items && Array.isArray(section.items) && section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-gray-200">
              <button
                onClick={handleAccept}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
              >
                {t('privacy.readAndAccept')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

