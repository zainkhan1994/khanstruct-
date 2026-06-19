'use client';

import { useEffect, useRef } from 'react';
import { METRICS } from '@/lib/content';
import styles from './Metrics.module.css';

export function Metrics() {
  const sectionRef = useRef<HTMLElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animated.current) {
          animated.current = true;
          animateCounters(el);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-label="Metrics and achievements"
    >
      <div className={styles.inner}>
        {METRICS.map((metric, i) => (
          <div
            key={metric.label}
            className={styles.item}
            style={{ transitionDelay: `${i * 0.08}s` }}
          >
            {metric.verified ? (
              <span
                className={styles.value}
                data-target={metric.numericTarget}
                data-suffix={metric.value.replace(/[\d]/g, '')}
                aria-label={`${metric.value} ${metric.label}`}
              >
                {metric.value}
              </span>
            ) : (
              <span
                className={`${styles.value} ${styles.unverified}`}
                title="Estimated — not yet independently verified"
                aria-label={`${metric.value} ${metric.label} (estimated)`}
              >
                {metric.value}
              </span>
            )}
            <span className={styles.label}>{metric.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function animateCounters(el: HTMLElement) {
  const items = el.querySelectorAll<HTMLElement>('[data-target]');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  items.forEach((item) => {
    const target = parseInt(item.dataset.target || '0', 10);
    const suffix = item.dataset.suffix || '';
    if (!target || prefersReduced) return;

    const duration = 1800;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      item.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}
