import { buildMetadata } from "../lib/seo";

export const metadata = buildMetadata({
  path: "/paslaugos",
  title: "Autoserviso paslaugos Vaidotuose | Autovaldika",
  description:
    "Visos Autovaldika autoserviso paslaugos: diagnostika, tepalų keitimas, 3D ratų suvedimas, važiuoklės, stabdžių, kėbulo ir žibintų remontas Vaidotuose.",
  keywords:
    "autoserviso paslaugos, automobilių remontas Vaidotuose, automobilių remontas Vilnius",
});

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
