import { buildMetadata } from "../../lib/seo";

export const metadata = buildMetadata({
  path: "/paslaugos/diagnostika",
  title: "Kompiuterinė automobilio diagnostika Vaidotuose | Autovaldika",
  description:
    "Kompiuterinė automobilio diagnostika Vaidotuose: nuskaitome klaidų kodus ir randame gedimo priežastį. Registruokitės tel. +370 618 81791.",
  keywords:
    "kompiuterinė diagnostika, automobilio diagnostika Vaidotuose, variklio diagnostika, klaidų nuskaitymas",
});

export default function DiagnosticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
