'use client';

import { useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Image from 'next/image';
import { getServiceImage } from '../../components/utils/servicesConfig';
import Head from 'next/head';
import ContactFormModal from '../../components/forms/contactform';
import ScrollToTop from '../../components/ui/ScrollToTop';
import { useScrollAnimation } from '../../components/utils/useScrollAnimation';
import PrivacyPolicy from '../../components/forms/PrivacyPolicy';
import { trackReservationButtonClick } from '../../components/utils/gtm';
export default function HeadlightRepairPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useScrollAnimation();

  const handleContactClick = () => {
    trackReservationButtonClick('service_zibintu_remontas');
    setIsModalOpen(true);
  };
  return (
    <>
    <Head>
    <title>Žibintų remontas | Variklio sala</title>
    <meta name="description" content="Žibintų reguliavimas yra svarbus, nes jis gali pagerinti automobilio matomumą ir sumažinti riziką kelionės metu."/>
    </Head>
      <Header />
      <main className="pt-40 pb-20 px-4 bg-gray-50" ref={containerRef as React.RefObject<HTMLElement>}>
        <div className="container mx-auto max-w-4xl">
          <div className="mt-4 mb-10">
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] max-w-3xl mx-auto shadow-lg">
              <Image
                src={getServiceImage('headlight-repair')}
                alt="Žibintų remontas"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                  Žibintų remontas
                </h1>
              </div>
            </div>
          </div>

          <section className="mt-10 space-y-8 text-gray-700">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              Kodėl žibintų reguliavimas yra svarbus?
              </h2>
              <p className="text-sm sm:text-base leading-relaxed">
              Tikslus žibintų reguliavimas užtikrina, kad matomumas kelyje būtų optimalus, o Jūs nevaržytumėte kitų eismo dalyvių akies.
               Netinkamai sureguliuoti žibintai gali kelti pavojų tiek Jums, tiek priešpriešiniams vairuotojams.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Kaip atliekamas žibintų reguliavimas?
             </h3>
              <p className="text-sm sm:text-base leading-relaxed">
              Žibintai reguliuojami naudojant specializuotą įrangą, turinčią visus reikiamus sertifikatus. 
              Procedūra reikalauja ypatingo tikslumo, kad spindulys nukryptų tiksliai pagal gamintojo nustatytus parametrus.
              </p>
            </div>
          </section>

          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={handleContactClick}
              className="flex items-center gap-2 sm:gap-3 bg-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-gray-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-base sm:text-lg font-semibold"
            >
             Susisiekite
            </button>
          </div>
        </div>
        <PrivacyPolicy />
      </main>
      <Footer />
      <ContactFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ScrollToTop />
      </>
  );
}

