import type { Metadata } from "next";
import { getArticleById } from "../articlesData";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const articleId = parseInt(params.id, 10);
  const article = getArticleById(articleId);

  if (!article) {
    return {
      title: "Straipsnis nerastas | Automobilių servisas Pagiriuose",
      description: "Atsiprašome, bet šis straipsnis neegzistuoja.",
      robots: "noindex, nofollow",
    };
  }

  return {
    title: `${article.title} | Automobilių servisas Pagiriuose`,
    description: article.excerpt,
    keywords: "automobilių straipsniai, priežiūros patarimai, remonto gidai",
    robots: "index, follow",
  };
}

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
