import { Award, Users, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AboutSection() {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: Award,
      titleKey: 'about.features.experience.title',
      descriptionKey: 'about.features.experience.description'
    },
    {
      icon: Users,
      titleKey: 'about.features.professionalism.title',
      descriptionKey: 'about.features.professionalism.description'
    },
    {
      icon: Clock,
      titleKey: 'about.features.speed.title',
      descriptionKey: 'about.features.speed.description'
    }
  ];

  return (
    <section id="apie-mus" className="py-12 sm:py-16 md:py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">
            {t('about.title')}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 sm:p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-800 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon size={28} className="text-white sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
                {t(feature.titleKey)}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {t(feature.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
