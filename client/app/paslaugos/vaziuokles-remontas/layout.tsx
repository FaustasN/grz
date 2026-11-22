import { buildMetadata } from "../../lib/seo";

export const metadata = buildMetadata({
  path: "/paslaugos/vaziuokles-remontas",
  title: "Važiuoklės ir pakabos remontas Vaidotuose | Autovaldika",
  description:
    "Važiuoklės ir pakabos remontas Vaidotuose: amortizatorių, šarnyrų, traukių keitimas. Saugesnis ir patogesnis važiavimas. Tel. +370 618 81791.",
  keywords:
    "važiuoklės remontas Vaidotuose, pakabos remontas, amortizatorių keitimas, šarnyrų keitimas, traukių keitimas",
  image: "/suspensionrepair.webp",
});

export default function SuspensionRepairLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
