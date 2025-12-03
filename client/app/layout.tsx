import type { Metadata } from "next";
import "./globals.css";
import { GoogleTagManager } from '@next/third-parties/google';

export const metadata: Metadata = {
  title: "Automobilių servisas Pagiriuose | Remontas, diagnostika, 3D suvedimas",
  description:
    "Greitas ir patikimas automobilių servisas Pagiriuose: remontas, diagnostika, tepalų keitimas ir 3D ratų suvedimas. Skambinkite +370 624 44 062",
  keywords:
    "auto servisas Vilnius, auto servisas Pagiriai, automobilių servisas, stabdžių remontas, stabdžių kaladėlių keitimas, stabdžių diskų keitimas, būgninių stabdžių remontas, ABS sistemos remontas, alyvos keitimas, oro filtro keitimas, kuro filtro keitimas, diagnostika, klaidų šalinimas, ratų suvedimas, ratų balansavimas, padangų keitimas, vairo traukės keitimas, pakabos remontas, amortizatorių keitimas, techninė apžiūra, elektroninės sistemos, generatoriaus keitimas, starterio remontas, webasto montavimas, automobilio šildymo sistema, uždegimo žvakių keitimas, centrinio užrakto remontas",
  robots: "index, follow",

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="lt">
      <body className="antialiased bg-white text-gray-900">{children}</body>
      <GoogleTagManager gtmId="GTM-KWVPNDHR" />
    </html>
  );
}

