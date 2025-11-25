'use client';

import { useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Image from 'next/image';
import Head from 'next/head';
import { getServiceImage } from '../../components/utils/servicesConfig';
import ReservationModal from '../../components/forms/ReservationModal';
import ScrollToTop from '../../components/ui/ScrollToTop';
import { useScrollAnimation } from '../../components/utils/useScrollAnimation'; 
export default function DiagnosticsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useScrollAnimation();
  return (
    <>
    <Head>
    <title>Kompiuterinė diagnostika | Variklio sala</title>
    <meta name="description" content="Kompiuterinė diagnostika yra svarbi, nes ji gali aptikti automobilio techninius gedimus, kurie gali būti sunkiai pastebimi žmogaus akimi. Kompiuterinė diagnostika gali būti naudojama aptikti variklio gedimus, transmisijos gedimus, stabdžių gedimus, vairo gedimus ir kitus techninius gedimus."/>
    </Head>
      <Header />
      <main className="pt-40 pb-20 px-4 bg-gray-50" ref={containerRef as React.RefObject<HTMLElement>}>
        <div className="container mx-auto max-w-4xl">
          <div className="mt-4 mb-10">
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] max-w-3xl mx-auto shadow-lg">
              <Image
                src={getServiceImage('diagnostics')}
                alt="Kompiuterinė diagnostika"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                  Kompiuterinė diagnostika
                </h1>
              </div>
            </div>
          </div>

          <section className="mt-10 space-y-8 text-gray-700">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                Kodėl ji tokia svarbi?
              </h2>
              <p className="text-sm sm:text-base leading-relaxed">
                Šiuolaikiniai automobiliai prikimšti kompiuterių, valdymo modulių ir visokiausių daviklių, todėl
                gedimai dažniausiai slepiasi ne ten, kur žmogaus akis juos matytų. Kompiuterinė diagnostika leidžia
                įlysti į šią elektroninę ekosistemą. Ji atliekama naudojant specializuotas programas ir profesionalią
                įrangą, kuri tikrina transporto priemonės techninę būklę, gyvus parametrus ir kiekvieno modulio klaidų kodus.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Kaip veikia šis patikrinimas?
              </h3>
              <p className="text-sm sm:text-base leading-relaxed">
                Diagnostikos įranga jungiasi prie automobilio valdymo sistemų ir nuskaito klaidų kodus ir gyvus parametrus.
                Tai padeda tiksliai suprasti, kuri vieta neveikia taip, kaip turėtų. Tokia analizė panaikina spėliones ir
                sutrumpina kelią iki realaus gedimo šaltinio.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Kodėl tai naudinga?
              </h4>
              <p className="text-sm sm:text-base leading-relaxed">
                Elektronikos gedimai dažnai sukelia simptomus, kuriuos sunku tiksliai įvardyti — variklis dirba
                nelygiai, prietaisų skydelyje užsidega lemputės, kondicionierius šaldo kaip nori. Kompiuterinė
                diagnostika leidžia greičiau ir tiksliau nustatyti šiuos sutrikimus. Kuo anksčiau problema pastebima,
                tuo pigiau ir paprasčiau ją išspręsti, o pats automobilis tarnauja patikimiau.
              </p>
            </div>
          </section>
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 sm:gap-3 bg-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-gray-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-base sm:text-lg font-semibold"
            >
              Rezervuoti laiką
            </button>
          </div>
        </div>
      </main>
      <Footer />
      <ReservationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ScrollToTop />
    </>
  );
}


