'use client';

import { useScrollAnimation } from '../components/utils/useScrollAnimation';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/ui/ScrollToTop';
import PrivacyPolicy from '../components/forms/PrivacyPolicy';
import Link from 'next/link';
import Image from 'next/image';
import { articles } from './articlesData';

export default function ArticlesPage() {
  const containerRef = useScrollAnimation();

  return (
    <>
      <Header />
      <main className="pt-40 pb-20 px-4 bg-gray-50" ref={containerRef as React.RefObject<HTMLElement>}>
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-8 sm:mb-10 text-center">
            Straipsniai
          </h1>

          {articles.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <p className="text-sm sm:text-base text-gray-500">
                Grįžkite vėliau, kad galėtumėte perskaityti naudingus straipsnius apie automobilių priežiūrą ir remontą
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {articles.map((article, index) => (
                <Link
                  key={article.id}
                  href={`/straipsniai/${article.id}`}
                  className="block scroll-animate scroll-animate-delay-0"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                    {article.image && (
                      <div className="relative w-full h-48 sm:h-56 overflow-hidden">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-6 sm:p-8 flex-1 flex flex-col">
                      <div className="mb-4">
                        <time className="text-sm text-gray-500">
                          {new Date(article.date).toLocaleDateString('lt-LT', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 line-clamp-2">
                        {article.title}
                      </h2>
                      <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 line-clamp-3 flex-1">
                        {article.excerpt}
                      </p>
                      <div className="inline-flex items-center text-gray-800 font-semibold hover:text-gray-600 transition-colors text-sm sm:text-base mt-auto">
                        Skaityti daugiau
                        <svg
                          className="ml-2 w-4 h-4 sm:w-5 sm:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
        <PrivacyPolicy />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
