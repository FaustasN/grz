import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kėbulo remontas / Meninis lyginimas | Automobilių servisas Pagiriuose",
  description:
    "Kėbulo remontas / Meninis lyginimas yra svarbi procedūra, kuri efektyviai atkuria kėbulo paviršių, neprarandant automobilio vertės.",
  keywords:
    "kėbulo remontas, meninis lyginimas, kėbulo dažymas, įlenkimų šalinimas, automobilių kėbulo remontas, kėbulo remontas netoliese, kėbulo remontas Pagiriuose",
  robots: "index, follow",
};

export default function BodyRepairLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
