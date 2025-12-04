'use client';

import { useScrollAnimation } from '../../components/utils/useScrollAnimation';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ScrollToTop from '../../components/ui/ScrollToTop';
import PrivacyPolicy from '../../components/forms/PrivacyPolicy';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { getArticleById } from '../articlesData';

export default function ArticlePage() {
  const params = useParams();
  const containerRef = useScrollAnimation();
  
  const articleId = parseInt(params.id as string, 10);
  const article = getArticleById(articleId);

  if (!article) {
    return (
      <>
        <Header />
        <main className="pt-40 pb-20 px-4 bg-gray-50">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Straipsnis nerastas
            </h1>
            <p className="text-gray-600 mb-6">
              Atsiprašome, bet šis straipsnis neegzistuoja.
            </p>
          </div>
        </main>
        <Footer />
        <ScrollToTop />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-40 pb-20 px-4 bg-gray-50" ref={containerRef as React.RefObject<HTMLElement>}>
        <div className="container mx-auto max-w-4xl">

          <article className="bg-white rounded-2xl overflow-hidden shadow-lg">
            {article.image && (
              <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                  priority
                />
              </div>
            )}
            
            <div className="p-6 sm:p-8 md:p-10">
              <div className="mb-4 sm:mb-6">
                <time className="text-sm sm:text-base text-gray-500">
                  {new Date(article.date).toLocaleDateString('lt-LT', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-6 sm:mb-8">
                {article.title}
              </h1>
              
              <div className="prose prose-lg max-w-none text-gray-700">
                <div className="whitespace-pre-line text-base sm:text-lg leading-relaxed">
                  {article.content}
                </div>
              </div>
            </div>
          </article>
        </div>
        <PrivacyPolicy />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
