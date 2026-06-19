'use client';

import { useEffect, useRef } from 'react';

export function useScrollReveal<T extends HTMLElement>(
  options: IntersectionObserverInit = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, ...options }
    );

    // Observe the element and all .reveal children
    const targets = el.querySelectorAll('.reveal');
    targets.forEach((t) => observer.observe(t));
    if (el.classList.contains('reveal')) observer.observe(el);

    return () => observer.disconnect();
  }, [options]);

  return ref;
}

export function useRevealAll(containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const delay = target.dataset.delay ? parseFloat(target.dataset.delay) : 0;
            setTimeout(() => {
              target.classList.add('is-visible');
            }, delay * 1000);
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const targets = container.querySelectorAll('.reveal');
    targets.forEach((t) => observer.observe(t));

    return () => observer.disconnect();
  }, [containerRef]);
}
