import { buildMetadata } from "../lib/seo";

export const metadata = buildMetadata({
  path: "/galerija",
  title: "Darbų galerija – prieš ir po remonto | Autovaldika",
  description:
    "Autovaldika atliktų darbų nuotraukos prieš ir po remonto. Visi darbai atlikti mūsų autoservise Vaidotuose.",
});

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
