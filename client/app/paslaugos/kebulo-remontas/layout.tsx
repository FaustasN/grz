import { buildMetadata } from "../../lib/seo";

export const metadata = buildMetadata({
  path: "/paslaugos/kebulo-remontas",
  title: "Meninis lyginimas be dažymo Vilniuje | Autovaldika",
  description:
    "Meninis įlenkimų lyginimas be dažymo ir kėbulo remontas Vaidotuose, Vilniuje. Išsaugomi gamykliniai dažai ir automobilio vertė. Tel. +370 618 81791.",
  keywords:
    "meninis lyginimas Vilnius, įlenkimų lyginimas be dažymo, kėbulo remontas Vaidotuose",
});

export default function BodyRepairLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
