import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paslaugos | Automobilių servisas Pagiriuose",
  description:
    "Pilnas teikiamų paslaugų spektras jūsų automobiliui: diagnostika, stabdžių remontas, pakabos remontas, ratų suvedimas ir balansavimas, važiuoklės remontas, kėbulų remontas",
  keywords:
    "auto servisas, paslaugos, diagnostika, stabdžių remontas, ratų suvedimas, važiuoklės remontas, kėbulų remontas, tepalų keitimas, žibintų remontas,  remontas netoliese,  remontas Pagiriuose, žibintų poliravimas",
  robots: "index, follow",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
