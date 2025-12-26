import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Straipsniai | Automobilių servisas Pagiriuose",
  description:
    "Naudingi straipsniai apie automobilių priežiūrą, remontą ir techninę diagnostiką. Patarimai iš profesionalų.",
  keywords:
    "automobilių straipsniai, priežiūros patarimai, remonto gidai, automobilių diagnostika",
  robots: "index, follow",
};

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
