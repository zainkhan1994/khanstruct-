'use client';

import { useRef } from 'react';
import { GDG_FOCUS_AREAS, GDG_METRICS } from '@/lib/content';
import { useRevealAll } from '@/hooks/useScrollReveal';
import styles from './GDGFocusAreas.module.css';

const ICONS: Record<string, React.ReactNode> = {
  google: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 12h6" />
      <path d="M12 8v4" />
    </svg>
  ),
  'trending-up': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
};

export function GDGFocusAreas() {
  const ref = useRef<HTMLElement>(null);
  useRevealAll(ref);

  return (
    <>
      <section
        ref={ref}
        className={styles.section}
        aria-labelledby="focus-heading"
      >
        <div className={styles.inner}>
          <p className={`label reveal`}>What We Focus On</p>
          <h2 id="focus-heading" className={`${styles.heading} reveal`} data-delay="0.08">
            What We Focus On
          </h2>

          <div className={styles.grid} role="list">
            {GDG_FOCUS_AREAS.map((area, i) => (
              <div
                key={area.id}
                className={`${styles.card} reveal`}
                data-delay={`${0.16 + i * 0.08}`}
                role="listitem"
              >
                <div className={styles.icon} aria-hidden="true">
                  {ICONS[area.icon] || ICONS.google}
                </div>
                <h3 className={styles.cardTitle}>{area.title}</h3>
                <p className={styles.cardDesc}>{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className={styles.metricsSection} aria-label="GDG Tulsa metrics">
        <div className={styles.metricsInner}>
          {GDG_METRICS.map((metric) => (
            <div key={metric.label} className={styles.metricItem}>
              <span className={styles.metricValue}>{metric.value}</span>
              <span className={styles.metricLabel}>{metric.label}</span>
              {!metric.verified && (
                <span className={styles.estimated} title="Estimated — not independently verified">
                  est.
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
