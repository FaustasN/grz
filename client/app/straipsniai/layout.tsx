import { buildMetadata } from "../lib/seo";

export const metadata = buildMetadata({
  path: "/straipsniai",
  title: "Straipsniai apie automobilių priežiūrą | Autovaldika",
  description:
    "Patarimai apie automobilio priežiūrą, remontą ir diagnostiką iš Autovaldika meistrų.",
  // noindex while articlesData is empty; remove when the first article is published
  noindex: true,
});

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
