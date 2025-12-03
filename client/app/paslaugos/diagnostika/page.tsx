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
import PrivacyPolicy from '../../components/forms/PrivacyPolicy';
import { trackReservationButtonClick } from '../../components/utils/gtm';
export default function DiagnosticsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useScrollAnimation();

  const handleReservationClick = () => {
    trackReservationButtonClick('service_diagnostika');
    setIsModalOpen(true);
  };
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
              <p> Kompiuterinė automobilio diagnostika Pagiriuose – tai greitas ir tikslus būdas nustatyti
            automobilio gedimus dar prieš jiems tampant rimtesnėmis problemomis. Mūsų servise
            atliekame profesionalią variklio, elektronikos ir valdymo blokų diagnostiką, naudodami
            modernią įrangą, kuri leidžia matyti realius automobilio sistemos parametrus.
            Diagnostikos metu tikriname variklio darbą, klaidų kodus, kuro tiekimo sistemą, uždegimo
            modulį, turbinos slėgį, oro srauto matuoklę, DPF būklę, ABS / ESP sistemas, klimato
            kontrolę ir kitus svarbius parametrus. Reikšminga tai, kad ne tik perskaitome klaidas, bet ir
            nustatome jų priežastis – tai dažnai padeda išvengti bereikalingų išlaidų arba netinkamų
            detalių keitimo.</p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              Kada būtina atlikti diagnostiką?
              </h2>
              <p className="text-sm sm:text-base leading-relaxed">
              Jei užsidega „Check Engine“, automobilis trūkčioja, padidėja kuro sąnaudos, atsiranda
              keistas kvapas, sumažėja trauka arba matote kitus elektronikos sutrikimus – diagnostika
              leidžia suprasti tikrąją būklę. Pas mus diagnostika trunka vos 20–30 minučių, todėl klientai
              dažnai ją renkasi net profilaktiškai.
              Variklio Sala servise Pagiriuose gausite aiškų, suprantamą gedimų paaiškinimą ir
              rekomendaciją, kaip juos pašalinti. Tikslumas, greitis ir ilgametė patirtis leidžia mums
              diagnozuoti ir sudėtingiausius gedimus tiek naujesniuose, tiek senesniuose
              automobiliuose.
              </p>
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


