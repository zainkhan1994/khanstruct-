'use client';

import { useRef } from 'react';
import { useRevealAll } from '@/hooks/useScrollReveal';
import styles from './GDGGetInvolved.module.css';

const CHANNELS = [
  {
    id: 'meetup',
    label: 'Join on Meetup',
    url: 'https://www.meetup.com/gdg-tulsa/',
    description: 'RSVP for events and stay updated',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
      </svg>
    ),
  },
  {
    id: 'discord',
    label: 'Join on Discord',
    url: '#',
    description: 'Real-time community discussions',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="9" />
        <path d="M8.5 14.5s0-3 3.5-3 3.5 3 3.5 3" />
        <circle cx="9" cy="10" r="0.5" fill="currentColor" />
        <circle cx="15" cy="10" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: 'Follow on LinkedIn',
    url: 'https://linkedin.com/company/gdg-tulsa',
    description: 'Professional updates and announcements',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

export function GDGGetInvolved() {
  const ref = useRef<HTMLElement>(null);
  useRevealAll(ref);

  return (
    <section
      ref={ref}
      className={styles.section}
      aria-labelledby="involved-heading"
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={`label reveal`}>Get Involved</p>
          <h2 id="involved-heading" className={`${styles.heading} reveal`} data-delay="0.08">
            Get Involved
          </h2>
          <p className={`${styles.desc} reveal`} data-delay="0.14">
            Join our community of developers, educators, and leaders. There&apos;s a place for everyone.
          </p>
        </div>

        <div className={styles.channels} role="list">
          {CHANNELS.map((ch, i) => (
            <a
              key={ch.id}
              href={ch.url}
              className={`${styles.channel} reveal`}
              data-delay={`${0.2 + i * 0.08}`}
              target="_blank"
              rel="noopener noreferrer"
              role="listitem"
            >
              <div className={styles.channelIcon} aria-hidden="true">
                {ch.icon}
              </div>
              <div className={styles.channelContent}>
                <span className={styles.channelLabel}>{ch.label}</span>
                <span className={styles.channelDesc}>{ch.description}</span>
              </div>
              <span className={styles.channelArrow} aria-hidden="true">→</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
