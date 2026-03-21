'use client';

import { Phone, Mail, MapPin, Clock, LucideIcon } from 'lucide-react';

interface ContactInfo {
  icon: LucideIcon;
  label: string;
  value?: string;
  href: string | null;
}

export default function ContactSection() {
  const contactInfo: ContactInfo[] = [
    {
      icon: Phone,
      label: 'Telefonas',
      value: '+370 618 81791',
      href: 'tel:+370 618 81791'
    },
    {
      icon: Mail,
      label: 'El. paštas',
      value: 'autovaldika@gmail.com',
      href: 'mailto:autovaldika@gmail.com'
    },
    {
      icon: MapPin,
      label: 'Adresas',
      value: 'Jaunystės g. 11A, LT-02236 Vilnius ',
      href: 'https://maps.app.goo.gl/MfJG2W5B3ZYPL31B6'
    },
    {
      icon: Clock,
      label: 'Darbo laikas',
      value: 'Pr-Sekm: 09:00-19:00',
      href: null
    }
  ];

  return (
    <section id="#kontaktai" className="py-12 sm:py-16 md:py-20 px-4 bg-white scroll-mt-32 sm:scroll-mt-60">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">
            Kontaktai
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Susisiekite su mumis telefonu arba atvykite į mūsų servisą
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
          <div className="space-y-4 sm:space-y-6">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="group flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <info.icon size={20} className="text-white sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-sm text-gray-500 mb-1">{info.label}</div>
                  {info.href ? (
                    <a
                      href={info.href}
                      className="text-base sm:text-lg font-semibold text-gray-800 hover:text-gray-600 transition-colors break-words"
                      target={info.icon === MapPin ? '_blank' : undefined}
                      rel={info.icon === MapPin ? 'noopener noreferrer' : undefined}
                    >
                      {info.value}
                    </a>
                  ) : (
                    <div className="text-base sm:text-lg font-semibold text-gray-800 break-words">
                      {info.value}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden shadow-xl h-[300px] sm:h-[400px] lg:h-auto lg:min-h-[500px]">
            <iframe
              src="https://www.google.com/maps?q=Jaunyst%C4%97s+g.+11A%2C+Vilnius+LT-02236&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
              title="TireService vieta žemėlapyje"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
