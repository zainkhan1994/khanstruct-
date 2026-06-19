'use client';

import { useRef } from 'react';
import { useRevealAll } from '@/hooks/useScrollReveal';
import styles from './GDGMission.module.css';

const PILLARS = [
  {
    id: 'learn',
    title: 'Learn',
    description:
      'Share knowledge and learn from each other through workshops, tech talks, and hands-on sessions.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    id: 'connect',
    title: 'Connect',
    description:
      'Build meaningful connections with developers, leaders, and industry professionals.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'build',
    title: 'Build',
    description:
      'Create innovative solutions and projects that make a positive impact in our community.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
];

export function GDGMission() {
  const ref = useRef<HTMLElement>(null);
  useRevealAll(ref);

  return (
    <section
      ref={ref}
      className={styles.section}
      aria-labelledby="mission-heading"
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={`label reveal`}>Our Mission</p>
          <h2 id="mission-heading" className={`${styles.heading} reveal`} data-delay="0.08">
            Google Developer Group Tulsa is a community of developers, educators,
            leaders, and innovators learning and building together.
          </h2>
        </div>

        <div className={styles.pillars} role="list">
          {PILLARS.map((pillar, i) => (
            <div
              key={pillar.id}
              className={`${styles.pillar} reveal`}
              data-delay={`${0.16 + i * 0.1}`}
              role="listitem"
            >
              <div className={styles.pillarIcon} aria-hidden="true">
                {pillar.icon}
              </div>
              <h3 className={styles.pillarTitle}>{pillar.title}</h3>
              <p className={styles.pillarDesc}>{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
