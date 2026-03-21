import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kompiuterinė diagnostika | Automobilių servisas Vaidotuose - Autovaldika",
  description:
    "Šiame puslapyje aprašoma apie kompiuterinės diagnostikos naudą automobilių diagnostikai",
  keywords:
    "kompiuterinė diagnostika, automobilių diagnostika, klaidų šalinimas, variklių diagnostika, variklio diagnostika netoliese, kompiuterinė diagnostika Vaidotuose",
  robots: "index, follow",
};

export default function DiagnosticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
