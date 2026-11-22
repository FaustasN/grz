import { buildMetadata } from "../../lib/seo";

export const metadata = buildMetadata({
  path: "/paslaugos/tepalu-keitimas",
  title: "Tepalų keitimas Vaidotuose – alyva ir filtrai | Autovaldika",
  description:
    "Tepalų (alyvos) ir filtrų keitimas Vaidotuose. Reguliarus alyvos keitimas saugo variklį nuo dėvėjimosi. Registruokitės tel. +370 618 81791.",
  keywords:
    "tepalų keitimas Vaidotuose, alyvos keitimas, variklio alyvos keitimas, filtrų keitimas",
});

export default function OilChangeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
