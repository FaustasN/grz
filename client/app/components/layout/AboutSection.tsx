'use client';

import { Award, Users, Clock, Hammer } from 'lucide-react';
import { useScrollAnimation } from '../utils/useScrollAnimation';

export default function AboutSection() {
  const containerRef = useScrollAnimation();

  const features = [
    {
      icon: Award,
      title: 'Patirtis',
      description: 'Ilgametė patirtis automobilių remonto ir techninės priežiūros srityje. Nesvarbu ar tai būtų automobilio techninis gedimas ar remontas po eismo įvykio.'
    },
    {
      icon: Users,
      title: 'Profesionalumas',
      description: 'Darbo patirtis dirbant dilerių autoservisuose, kvalifikacijos kėlimai automobilių remonto ir priežiūros srityje.'
    },
    {
      icon: Clock,
      title: 'Greitis',
      description: 'Spartus ir kokybiškas aptarnavimas, neaukojant kokybės.'
    },
    {
      icon: Hammer,
      title: 'Universalumas',
      description: 'Perdegė automobilio lemputė – pakeisim. Neveikia stabdžiai – sutvarkysim. Reikia automobilio kėbulo remonto – suremontuosim.'
    }
  ];

  return (
    <section
      id="apie-mus"
      className="py-12 sm:py-16 md:py-20 px-4 bg-white scroll-mt-10"
      ref={containerRef as React.RefObject<HTMLElement>}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10 sm:mb-12 md:mb-16 scroll-animate">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">
            Variklio sala - Jūsų automobilis, mūsų rūpestis
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const delayClass = index % 4 === 0 ? 'scroll-animate-delay-0' : 
                             index % 4 === 1 ? 'scroll-animate-delay-100' : 
                             index % 4 === 2 ? 'scroll-animate-delay-200' : 
                             'scroll-animate-delay-300';
            
            return (
              <div
                key={index}
                className={`group p-6 sm:p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 scroll-animate ${delayClass}`}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-800 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon size={28} className="text-white sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 text-left leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
