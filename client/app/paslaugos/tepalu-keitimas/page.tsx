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
    export default function OilChangePage() {
  const containerRef = useScrollAnimation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleContactClick = () => {
    trackReservationButtonClick('service_tepalu_keitimas');
    setIsModalOpen(true);
  };
      
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
              Profesionalus tepalų keitimas Pagiriuose – būtina paslauga norint užtikrinti ilgesnį variklio
              tarnavimo laiką ir sklandų automobilio darbą. Mūsų servise keičiame visų tipų alyvą:
                sintetinę, pusiau sintetinę, ilgalaikę (LongLife) ir gamintojo rekomenduotą alyvą konkrečiai
               markei.
                 Tepalų keitimo metu pakeičiame ne tik variklio alyvą, bet ir alyvos filtrą, o esant poreikiui –
                     oro, kuro ar salono filtrus. Profilaktiškai patikriname variklio sandarumą, aušinimo skysčio
                 lygį, diržus ir automobilio būklę, kad klientas žinotų visą realią situaciją.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
               Kada reikia keisti tepalus?
              </h3>
              <p className="text-sm sm:text-base leading-relaxed">
              Pasenusi alyva praranda tepamąsias savybes, didina trintį ir variklio nusidėvėjimą. Laiku
             neatliktas keitimas gali sukelti rimtus ir brangius gedimus, įskaitant variklio užsikirtimą.
             Rekomenduojame keisti kas 10 000–15 000 km arba kartą per metus.
             Variklio Sala servisas užtikrina greitą ir kokybišką paslaugą – dažniausiai tai trunka vos
             15–30 minučių. Naudojame tik patikimų gamintojų alyvą ir filtrus. Atvykite pasikeisti tepalų
              Pagiriuose ir būkite ramūs, kad jūsų automobilio variklis dirbs sklandžiai.
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

