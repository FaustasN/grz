import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "3D ratų suvedimas | Automobilių servisas Vaidotuose - Autovaldika",
  description:
    "Šiame puslapyje aprašoma 3D ratų suvedimo paslauga, kuri atliekama su modernia įranga, kuri leidžia tiksliai sureguliuoti ratų geometriją pagal gamintojo parametrus.",
  keywords:
    "3D ratų suvedimas, ratų balansavimas, padangų keitimas, vairo traukės keitimas, ratų geometrija, ratų suvedimas netoliese, ratų suvedimas Vaidotuose",
  robots: "index, follow",
};

export default function WheelAlignmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
