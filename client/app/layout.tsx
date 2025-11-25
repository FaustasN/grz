import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Varikliosala.lt | Automobilių Servisas Pagiriuose",
  description:
    "Varikliosala.lt – Profesionalus automobilių servisas Pagiriuose – stabdžių, pakabos, alyvos, diagnostikos, ratų suvedimo ir elektronikos darbai.",
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
    </html>
  );
}

