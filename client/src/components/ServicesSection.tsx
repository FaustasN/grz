import { useState } from 'react';
import { Wrench, Target, Gauge, Package, ChevronDown, Image } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ServicesSection() {
  const { t } = useTranslation();
  const [isOtherServicesExpanded, setIsOtherServicesExpanded] = useState(false);
  
  const services = [
    {
      icon: Wrench,
      titleKey: 'services.list.tireInstallation.title',
      descriptionKey: 'services.list.tireInstallation.description',
      featuresKey: 'services.list.tireInstallation.features',
      isExpandable: false
    },
    {
      icon: Target,
      titleKey: 'services.list.wheelBalancing.title',
      descriptionKey: 'services.list.wheelBalancing.description',
      featuresKey: 'services.list.wheelBalancing.features',
      isExpandable: false
    },
    {
      icon: Gauge,
      titleKey: 'services.list.wheelAlignment.title',
      descriptionKey: 'services.list.wheelAlignment.description',
      featuresKey: 'services.list.wheelAlignment.features',
      isExpandable: false
    },
    {
      icon: Package,
      titleKey: 'services.list.otherServices.title',
      descriptionKey: 'services.list.otherServices.description',
      featuresKey: 'services.list.otherServices.features',
      isExpandable: true,
      additionalServicesKey: 'services.list.otherServices.additionalServices'
    }
  ];

  return (
    <section id="paslaugos" className="py-12 sm:py-16 md:py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">
            {t('services.title')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {services.map((service, index) => {
            const isOtherServices = service.isExpandable;
            const isExpanded = isOtherServices && isOtherServicesExpanded;
            const additionalServices = isOtherServices 
              ? (t(service.additionalServicesKey || '', { returnObjects: true }) as Array<{title: string, features: string[]}> || [])
              : [];

            return (
              <div
                key={index}
                className={`bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 ${
                  isOtherServices 
                    ? 'cursor-pointer hover:shadow-xl' 
                    : 'group hover:shadow-2xl hover:-translate-y-1'
                }`}
              >
                <div
                  onClick={() => isOtherServices && setIsOtherServicesExpanded(!isOtherServicesExpanded)}
                  className={`p-6 sm:p-8 ${isOtherServices ? 'hover:bg-gray-50' : ''}`}
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOtherServices ? '' : 'group-hover:scale-110'
                    }`}>
                      <service.icon size={24} className="text-white sm:w-7 sm:h-7" />
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex items-center justify-between gap-3 mb-2 sm:mb-3">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                          {t(service.titleKey)}
                        </h3>
                        {isOtherServices && (
                          <ChevronDown 
                            size={24} 
                            className={`text-gray-600 flex-shrink-0 transition-transform duration-300 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        )}
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                        {t(service.descriptionKey)}
                        </p>
                      <ul className="space-y-1.5 sm:space-y-2">
                        {(t(service.featuresKey, { returnObjects: true }) as string[]).map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-2 text-sm sm:text-base text-gray-700">
                            <div className="w-1.5 h-1.5 bg-gray-800 rounded-full flex-shrink-0"></div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Expandable additional services */}
                {isOtherServices && (
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0 border-t border-gray-100">
                      <div className="pt-6 space-y-4">
                        {additionalServices.map((additionalService, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-4 sm:p-5">
                            <h4 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
                              {additionalService.title}
                            </h4>
                            <ul className="space-y-1.5 sm:space-y-2">
                              {additionalService.features.map((feature: string, featureIdx: number) => (
                                <li key={featureIdx} className="flex items-center gap-2 text-sm sm:text-base text-gray-700">
                                  <div className="w-1.5 h-1.5 bg-gray-600 rounded-full flex-shrink-0"></div>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Gallery Button */}
        <div className="flex justify-center mt-10 sm:mt-12 md:mt-16">
          <a
            href="/gallery"
            className="flex items-center gap-2 sm:gap-3 bg-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-gray-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-base sm:text-lg font-semibold"
          >
            <Image size={20} className="sm:hidden" />
            <Image size={24} className="hidden sm:block" />
            <span>{t('services.galleryButton')}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
