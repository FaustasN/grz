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
      value: '+370 624 44 062',
      href: 'tel:+37062444062'
    },
    {
      icon: Mail,
      label: 'El. paštas',
      value: 'varikliosala@gmail.com',
      href: 'mailto:varikliosala@gmail.com'
    },
    {
      icon: MapPin,
      label: 'Adresas',
      value: 'Kalno g. 83, Melekonių k, 14119 Melekonys',
      href: 'https://www.google.com/maps/place/Kalno+g.+83,+Melekoni%C5%B3+k.,+14119+Vilniaus+r.+sav./@54.5678119,25.2085306,17z/data=!3m1!4b1!4m6!3m5!1s0x46ddebac38c8f489:0x6e12249e592b92a4!8m2!3d54.5678119!4d25.2111055!16s%2Fg%2F11s7y_vsj0?entry=ttu&g_ep=EgoyMDI1MTAxNC4wIKXMDSoASAFQAw%3D%3D'
    },
    {
      icon: Clock,
      label: 'Darbo laikas',
      value: 'Pr-Pt: 10:00-20:00, Še: 9:00-15:00',
      href: null
    }
  ];

  return (
    <section id="#kontaktai" className="py-12 sm:py-16 md:py-20 px-4 bg-white scroll-mt-32 sm:scroll-mt-36">
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2302.817!2d25.2085306!3d54.5678119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46ddebac38c8f489%3A0x6e12249e592b92a4!2sKalno%20g.%2083%2C%20Melekoni%C5%B3%20k.%2C%2014119%20Vilniaus%20r.%20sav.!5e0!3m2!1slt!2slt!4v1729350000000!5m2!1slt!2slt"
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
