import { buildMetadata } from "../../lib/seo";

export const metadata = buildMetadata({
  path: "/paslaugos/zibintu-remontas",
  title: "Žibintų poliravimas ir reguliavimas Vilniuje | Autovaldika",
  description:
    "Žibintų poliravimas, reguliavimas ir remontas Vaidotuose, Vilniuje. Geresnis matomumas tamsoje ir saugesnė kelionė. Tel. +370 618 81791.",
  keywords:
    "žibintų poliravimas Vilnius, žibintų reguliavimas, žibintų remontas Vaidotuose",
});

export default function HeadlightRepairLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
