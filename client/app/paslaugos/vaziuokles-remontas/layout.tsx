import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Važiuoklės remontas | Automobilių servisas Pagiriuose",
  description:
    "Važiuoklės remontas yra svarbus, nes jis gali pagerinti automobilio važiavimo kokybę ir sumažinti riziką kelionės metu.",
  keywords:
    "važiuoklės remontas, pakabos remontas, amortizatorių keitimas, trauklių keitimas, šarnyrų keitimas, važiuoklės remontas netoliese, važiuoklės remontas Pagiriuose",
  robots: "index, follow",
};

export default function SuspensionRepairLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
