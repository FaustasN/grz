 "use client";

import { useState } from 'react';
import { Phone, MapPin, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ReservationModal from '../forms/ReservationModal';
import { trackReservationButtonClick } from '../utils/gtm';


export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReservationClick = () => {
    trackReservationButtonClick('hero_section');
    setIsModalOpen(true);
  };

  return (
    
      <section className="relative pt-48 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero-bg.webp"
            alt="Variklio sala serviso fonas"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 to-gray-800/60" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6 sm:space-y-8 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg px-2">
            Automobilių servisas Pagiriuose - profesionalus remontas ir diagnostika
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto drop-shadow-md px-4">
              Greitas, kokybiškas ir patikimas aptarnavimas kiekvienam klientui
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 justify-center items-center pt-4 sm:pt-6 px-4">
              <button
                onClick={handleReservationClick}
                className="flex items-center gap-2 sm:gap-3 bg-white text-gray-800 px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-base sm:text-lg font-semibold w-full sm:w-auto justify-center"
              >
                <Calendar size={20} className="sm:hidden" />
                <Calendar size={24} className="hidden sm:block" />
                <span>Rezervuoti laiką</span>
              </button>

              <a
                href="tel:+37062444062"
                className="flex items-center gap-2 sm:gap-3 bg-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-gray-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-base sm:text-lg font-semibold w-full sm:w-auto justify-center"
              >
                <Phone size={20} className="sm:hidden" />
                <Phone size={24} className="hidden sm:block" />
                <span className="text-sm sm:text-base">+370 624 44 062</span>
              </a>

              <Link
                href="https://share.google/tNkISjYTxfFL8kkVR"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-base sm:text-lg font-semibold border border-white/30 w-full sm:w-auto justify-center"
              >
                <MapPin size={20} className="sm:hidden" />
                <MapPin size={24} className="hidden sm:block" />
                <span>Kaip mus rasti</span>
              </Link>
            </div>
          </div>
        </div>
        <ReservationModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </section>
  );
}
