import { buildMetadata } from "../../lib/seo";

export const metadata = buildMetadata({
  path: "/paslaugos/3d-ratu-suvedimas",
  title: "3D ratų suvedimas Vilniuje, Vaidotuose | Autovaldika",
  description:
    "3D ratų suvedimas Vaidotuose, Vilniuje: ratų geometrija reguliuojama modernia įranga pagal gamintojo parametrus. Tel. +370 618 81791.",
  keywords:
    "3D ratų suvedimas Vilnius, ratų suvedimas Vaidotuose, ratų geometrija, ratų geometrijos reguliavimas",
});

export default function WheelAlignmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
