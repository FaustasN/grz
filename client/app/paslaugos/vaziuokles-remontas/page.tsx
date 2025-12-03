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
import { trackReservationButtonClick } from '../../components/utils/gtm';
  export default function SuspensionRepairPage() {
  const containerRef = useScrollAnimation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReservationClick = () => {
    trackReservationButtonClick('service_vaziuokles_remontas');
    setIsModalOpen(true);
  };

  return (
    <>
    <Head>
    <title>Važiuoklės remontas | Variklio sala</title>
    <meta name="description" content="Važiuoklės remontas yra svarbus, nes jis gali pagerinti automobilio važiavimo kokybę ir sumažinti riziką kelionės metu."/>
    </Head>
      <Header />
      <main className="pt-40 pb-20 px-4 bg-gray-50" ref={containerRef as React.RefObject<HTMLElement>}>
        <div className="container mx-auto max-w-4xl">
          <div className="mt-4 mb-10">
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] max-w-3xl mx-auto shadow-lg">
              <Image
                src={getServiceImage('suspension-repair')}
                alt="Važiuoklės remontas"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                  Važiuoklės remontas
                </h1>
              </div>
            </div>
          </div>

          <section className="mt-10 space-y-8 text-gray-700">
            <div className="space-y-3">
              <p>Važiuoklės remontas Pagiriuose – tai paslauga, kuri reikalauja patirties ir tikslumo, nes
              važiuoklė tiesiogiai lemia automobilio stabilumą, komfortą ir saugumą. Variklio Sala servise
              atliekame visų važiuoklės elementų patikrą ir remontą: amortizatorių keitimą, trauklių,
               šarnyrų, įvorių, stabilizatoriaus traukių, guolių ir kitų dalių keitimą.</p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              Kada reikėtų tvarkyti važiuoklę?
              </h2>
              <p className="text-sm sm:text-base leading-relaxed">
              Dažniausi požymiai, rodantys, kad važiuoklei reikia dėmesio: bildesiai, klaksėjimas, vairas
             traukia į šoną, nelygus padangų nusidėvėjimas, automobilis „plaukioja“ važiuojant.
                   Važiuoklė nuolat patiria apkrovas, todėl natūralu, kad dalys dėvisi greičiau, ypač važinėjant
                 prastesniais keliais.
              </p>
              <h3 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              Kuo išsiskiriame?
              </h3>
              <p className="text-sm sm:text-base leading-relaxed">Mūsų meistrai turi patirties dirbant tiek su ekonomiškais automobiliais, tiek su premium
              klasės modeliais. Diagnozuojame ne tik gedimą, bet ir priežastį, kodėl jis atsirado, kad
              ateityje būtų išvengta pakartotinių remonto darbų.
              Važiuoklės remontas atliekamas operatyviai, naudojant tik patikimų gamintojų detales.
              Galime derinti remonto darbus su 3D ratų suvedimu, kad automobilis būtų saugus ir
              stabilus iškart po remonto.</p>
            </div>
          </section>

          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={handleReservationClick}
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

