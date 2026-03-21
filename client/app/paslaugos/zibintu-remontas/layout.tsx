import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Žibintų remontas | Automobilių servisas Vaidotuose - Autovaldika",
  description:
    "Žibintų reguliavimas yra svarbus, nes jis gali pagerinti automobilio matomumą ir sumažinti riziką kelionės metu.",
  keywords:
    "žibintų remontas, žibintų reguliavimas, priekinių žibintų remontas, žibintų keitimas, žibintų remontas netoliese, žibintų remontas Vaidotuose, žibintų poliravimas",
  robots: "index, follow",
};

export default function HeadlightRepairLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
