'use client';

import { useEffect, useRef, RefObject } from 'react';

export function useScrollAnimation(): RefObject<HTMLElement | null> {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = Array.from(
      container.querySelectorAll<HTMLElement>('.scroll-animate')
    );
    elements.forEach((el) => {
      el.classList.add(
        'opacity-0',
        'translate-y-6',
        'transition-all',
        'duration-700',
        'ease-out'
      );
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.classList.add('opacity-100', 'translate-y-0');
            target.classList.remove('opacity-0', 'translate-y-6');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '-50px',
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return containerRef;
}
