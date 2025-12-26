import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Darbų galerija | Automobilių servisas Pagiriuose",
  description:
    "Peržiūrėkite mūsų atliktų darbų nuotraukas - prieš ir po remonto. Visi darbai buvo atlikti Pagiriuose.",
  keywords:
    "darbų galerija, remonto nuotraukos, automobilių remontas, prieš ir po, serviso darbai, darbų nuotraukos",
  robots: "index, follow",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
