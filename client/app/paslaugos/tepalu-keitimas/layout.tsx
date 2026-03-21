import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tepalų keitimas | Automobilių servisas Vaidotuose - Autovaldika",
  description:
    "Reguliarus tepalų keitimas yra viena svarbiausių automobilio priežiūros procedūrų. Variklis turi daugybę greitai judančių detalių, ir be tinkamo tepalo jos pradeda greitai dėvėtis.",
  keywords:
    "tepalų keitimas, alyvos keitimas, oro filtro keitimas, kuro filtro keitimas, variklio priežiūra, tepalų keitimas netoliese, tepalų keitimas Vaidotuose",
  robots: "index, follow",
};

export default function OilChangeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
