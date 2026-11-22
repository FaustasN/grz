import type { Metadata } from "next";
import { getArticleById } from "../articlesData";
import { buildMetadata } from "../../lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const articleId = parseInt(id, 10);
  const article = getArticleById(articleId);

  if (!article) {
    return {
      title: "Straipsnis nerastas | Autovaldika",
      description: "Atsiprašome, bet šis straipsnis neegzistuoja.",
      robots: "noindex, nofollow",
    };
  }

  return buildMetadata({
    path: `/straipsniai/${articleId}`,
    title: `${article.title} | Autovaldika`,
    description: article.excerpt,
  });
}

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
