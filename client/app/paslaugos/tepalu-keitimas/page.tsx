'use client';

import { useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Image from 'next/image';
import { getServiceImage } from '../../components/utils/servicesConfig';
import Head from 'next/head';
import ReservationModal from '../../components/forms/ReservationModal';
import ScrollToTop from '../../components/ui/ScrollToTop';  
import { useScrollAnimation } from '../../components/utils/useScrollAnimation';
import PrivacyPolicy from '../../components/forms/PrivacyPolicy';
    export default function OilChangePage() {
  const containerRef = useScrollAnimation();
  const [isModalOpen, setIsModalOpen] = useState(false);
      
  return (
    <>
    <Head>
    <title>Tepalų keitimas | Variklio sala</title>
    <meta name="description" content="Reguliarus tepalų keitimas yra viena svarbiausių automobilio priežiūros procedūrų. Variklis turi daugybę greitai judančių detalių, ir be tinkamo tepalo jos pradeda greitai dėvėtis."/>
    </Head>
      <Header />
      <main className="pt-40 pb-20 px-4 bg-gray-50" ref={containerRef as React.RefObject<HTMLElement>}  >
        <div className="container mx-auto max-w-4xl"> 
          <div className="mt-4 mb-10">
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] max-w-3xl mx-auto shadow-lg">
              <Image
                src={getServiceImage('oil-change')}
                alt="Tepalų keitimas"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                  Tepalų keitimas
                </h1>
              </div>
            </div>
          </div>

          <section className="mt-10 space-y-8 text-gray-700">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              Kodėl tai būtina jūsų automobilio sveikatai?
              </h2>
              <p className="text-sm sm:text-base leading-relaxed">
                Reguliarus tepalų keitimas yra viena svarbiausių automobilio priežiūros procedūrų. 
                Variklis turi daugybę greitai judančių detalių, ir be tinkamo tepalo jos pradeda greitai dėvėtis. 
                Kokybiški, laiku pakeisti tepalai sudaro apsauginį sluoksnį, mažina trintį ir saugo variklį nuo perkaitimo bei metalo dalių pažeidimų.
                Būtent todėl ši paprasta procedūra tiesiogiai prailgina variklio tarnavimo laiką ir sumažina brangių remontų riziką.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
               Kada reikia keisti tepalus?
              </h3>
              <p className="text-sm sm:text-base leading-relaxed">
              Dažniausiai tepalus rekomenduojama keisti kas 8-12 tūkst. kilometrų arba pagal gamintojo rekomendacijas.
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
        <PrivacyPolicy />
      </main>
      <Footer />
      <ReservationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ScrollToTop />
      </>
  );
}

