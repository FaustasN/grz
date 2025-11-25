'use client';

import Image from 'next/image';
import { Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { getServiceImage } from '../utils/servicesConfig';
import { useScrollAnimation } from '../utils/useScrollAnimation';
export default function ServicesSection() {
  const containerRef = useScrollAnimation();
  return (
    <section
      id="paslaugos"
      className="py-12 sm:py-16 md:py-20 px-4 bg-gray-50"
      ref={containerRef as React.RefObject<HTMLElement>}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10 sm:mb-12 md:mb-16 scroll-animate">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">
            Teikiamos paslaugos
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Pilnas spektras teikiamų paslaugų jūsų automobiliui
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
          <Link
            href="/paslaugos/diagnostika"
            className="block w-full scroll-animate scroll-animate-delay-0"
          >
            <div className="relative rounded-2xl overflow-hidden transition-all duration-300 group hover:shadow-2xl hover:-translate-y-1 cursor-pointer aspect-[16/9] min-h-[170px] sm:min-h-[210px]">
              <Image
                src={getServiceImage('diagnostics')}
                alt="Kompiuterinė diagnostika"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 group-hover:from-black/80 group-hover:via-black/50 group-hover:to-black/30 transition-all duration-300 z-10" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-20">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                  Kompiuterinė diagnostika
                </h3>
              </div>
            </div>
          </Link>

          <Link
            href="/paslaugos/tepalu-keitimas"
            className="block w-full scroll-animate scroll-animate-delay-200"
          >
            <div className="relative rounded-2xl overflow-hidden transition-all duration-300 group hover:shadow-2xl hover:-translate-y-1 cursor-pointer aspect-[16/9] min-h-[170px] sm:min-h-[210px]">
              <Image
                src={getServiceImage('oil-change')}
                alt="Tepalų keitimas"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 group-hover:from-black/80 group-hover:via-black/50 group-hover:to-black/30 transition-all duration-300 z-10" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-20">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                  Tepalų keitimas
                </h3>
              </div>
            </div>
          </Link>

          <Link
            href="/paslaugos/3d-ratu-suvedimas"
            className="block w-full scroll-animate scroll-animate-delay-0"
          >
            <div className="relative rounded-2xl overflow-hidden transition-all duration-300 group hover:shadow-2xl hover:-translate-y-1 cursor-pointer aspect-[16/9] min-h-[170px] sm:min-h-[210px]">
              <Image
                src={getServiceImage('wheel-alignment')}
                alt="3D ratų suvedimas"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 group-hover:from-black/80 group-hover:via-black/50 group-hover:to-black/30 transition-all duration-300 z-10" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-20">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                  3D ratų suvedimas
                </h3>
              </div>
            </div>
          </Link>

          <Link
            href="/paslaugos/vaziuokles-remontas"
            className="block w-full scroll-animate scroll-animate-delay-200"
          >
            <div className="relative rounded-2xl overflow-hidden transition-all duration-300 group hover:shadow-2xl hover:-translate-y-1 cursor-pointer aspect-[16/9] min-h-[170px] sm:min-h-[210px]">
              <Image
                src={getServiceImage('suspension-repair')}
                alt="Važiuoklės remontas"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 group-hover:from-black/80 group-hover:via-black/50 group-hover:to-black/30 transition-all duration-300 z-10" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-20">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                  Važiuoklės remontas
                </h3>
              </div>
            </div>
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-10 sm:mt-12 md:mt-16">
          <Link
            href="/galerija"
            className="flex items-center gap-2 sm:gap-3 bg-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-gray-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-base sm:text-lg font-semibold"
          >
            <ImageIcon size={20} className="sm:hidden" />   
            <ImageIcon size={24} className="hidden sm:block" />
            <span>Darbų galerija</span>
          </Link>
          <Link
              href="/paslaugos"
            className="flex items-center gap-2 sm:gap-3 bg-white text-gray-800 border-2 border-gray-800 px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-base sm:text-lg font-semibold"
          >
            <span>Daugiau paslaugų</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
