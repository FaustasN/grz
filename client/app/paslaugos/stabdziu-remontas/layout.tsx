import { buildMetadata } from "../../lib/seo";

export const metadata = buildMetadata({
  path: "/paslaugos/stabdziu-remontas",
  title: "Stabdžių remontas Vaidotuose – kaladėlės, diskai | Autovaldika",
  description:
    "Stabdžių remontas Vaidotuose: kaladėlių ir diskų keitimas, stabdžių sistemos patikra. Vairas vibruoja stabdant? Atvykite. Tel. +370 618 81791.",
  keywords:
    "stabdžių remontas Vaidotuose, stabdžių kaladėlių keitimas, stabdžių diskų keitimas",
});

export default function BrakeRepairLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
