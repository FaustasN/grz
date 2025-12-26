import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stabdžių remontas | Automobilių servisas Pagiriuose",
  description:
    "Stabdžiai yra vienas iš pagrindinių Jūsų automobilio saugumo elementų. Stabdymo kelias ilgėja arba vairas vibruoja stabdant.",
  keywords:
    "stabdžių remontas, stabdžių kaladėlių keitimas, stabdžių diskų keitimas, būgninių stabdžių remontas, ABS sistemos remontas, stabdžių remontas netoliese, stabdžių remontas Pagiriuose",
  robots: "index, follow",
};

export default function BrakeRepairLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
