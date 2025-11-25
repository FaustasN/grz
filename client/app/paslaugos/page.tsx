'use client';

import { useScrollAnimation } from '../components/utils/useScrollAnimation';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { getServiceImage } from '../components/utils/servicesConfig';
import ScrollToTop from '../components/ui/ScrollToTop';

export default function ServicesPage() {
  const containerRef = useScrollAnimation();
  return (
    <>
    <Head>
    <title>Paslaugos | Variklio sala</title>
    <meta name="description" content="Pilnas teikiamų paslaugų spektras jūsų automobiliui: diagnostika, stabdžių remontas, pakabos remontas, ratų suvedimas ir balansavimas, važiuoklės remontas, kėbulų remontas"/>
   
    </Head>
      <Header />
      <main className="pt-40 pb-20 px-4 bg-gray-50" ref={containerRef as React.RefObject<HTMLElement>}>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-8 sm:mb-10 text-center">
          Visos teikiamos paslaugos
        </h1>
      <div className="container mx-auto max-w-6xl">
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

          <Link
            href="/paslaugos/stabdziu-remontas"
            className="block w-full scroll-animate scroll-animate-delay-0"
          >
            <div className="relative rounded-2xl overflow-hidden transition-all duration-300 group hover:shadow-2xl hover:-translate-y-1 cursor-pointer aspect-[16/9] min-h-[170px] sm:min-h-[210px]">
              <Image
                src={getServiceImage('brake-repair')}
                alt="Stabdžių remontas"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 group-hover:from-black/80 group-hover:via-black/50 group-hover:to-black/30 transition-all duration-300 z-10" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-20">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                  Stabdžių remontas
                </h3>
              </div>
            </div>
          </Link>

          <Link
            href="/paslaugos/kebulo-remontas"
            className="block w-full scroll-animate scroll-animate-delay-200"
          >
            <div className="relative rounded-2xl overflow-hidden transition-all duration-300 group hover:shadow-2xl hover:-translate-y-1 cursor-pointer aspect-[16/9] min-h-[170px] sm:min-h-[210px]">
              <Image
                src={getServiceImage('body-repair')}
                alt='Kėbulų remontas / „Meninis lyginimas“'
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 group-hover:from-black/80 group-hover:via-black/50 group-hover:to-black/30 transition-all duration-300 z-10" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-20">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                  Kėbulų remontas / „Meninis lyginimas“
                </h3>
              </div>
            </div>
          </Link>
          <Link
            href="/paslaugos/zibintu-remontas"
            className="block w-full scroll-animate scroll-animate-delay-200"
          >
            <div className="relative rounded-2xl overflow-hidden transition-all duration-300 group hover:shadow-2xl hover:-translate-y-1 cursor-pointer aspect-[16/9] min-h-[170px] sm:min-h-[210px]">
              <Image
                src={getServiceImage('headlight-repair')}
                alt='Žibintų remontas'
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 group-hover:from-black/80 group-hover:via-black/50 group-hover:to-black/30 transition-all duration-300 z-10" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-20">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                  Žibintų remontas
                </h3>
              </div>
            </div>
          </Link>
          <Link
            href="tel:+37068513131"
            className="block w-full scroll-animate scroll-animate-delay-200"
          >
            <div className="relative rounded-2xl overflow-hidden transition-all duration-300 group hover:shadow-2xl hover:-translate-y-1 cursor-pointer aspect-[16/9] min-h-[170px] sm:min-h-[210px]">
              <Image
                src={getServiceImage('other-services')}
                alt='Trūksta paslaugų? Skambinkite mums'  
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 group-hover:from-black/80 group-hover:via-black/50 group-hover:to-black/30 transition-all duration-300 z-10" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-20">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white drop-shadow-lg">
                 Trūksta paslaugų? Susisiekite su mumis
                </h3>
              </div>
            </div>
          </Link>
        </div>
        </div>
        </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}


