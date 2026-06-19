'use client';

import { useRef } from 'react';
import { GDG_EVENTS } from '@/lib/content';
import { useRevealAll } from '@/hooks/useScrollReveal';
import styles from './GDGEvents.module.css';

export function GDGEvents() {
  const ref = useRef<HTMLElement>(null);
  useRevealAll(ref);

  return (
    <section
      id="events"
      ref={ref}
      className={styles.section}
      aria-labelledby="events-heading"
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={`label reveal`}>Events</p>
          <div className={styles.headerRow}>
            <h2 id="events-heading" className={`${styles.heading} reveal`} data-delay="0.08">
              Upcoming Events
            </h2>
            <a
              href="https://gdg.community.dev/gdg-tulsa/"
              className={`${styles.viewAll} reveal`}
              target="_blank"
              rel="noopener noreferrer"
              data-delay="0.08"
            >
              View All Events →
            </a>
          </div>
        </div>

        {GDG_EVENTS.length === 0 ? (
          <div className={`${styles.empty} reveal`} data-delay="0.16" role="status">
            <div className={styles.emptyIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <p className={styles.emptyTitle}>Events coming soon</p>
            <p className={styles.emptyDesc}>
              Check the GDG Tulsa community page for the latest events and
              meetup schedules.
            </p>
            <a
              href="https://gdg.community.dev/gdg-tulsa/"
              className="btn-outline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Visit GDG Tulsa on Meetup</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        ) : (
          <div className={styles.eventGrid} role="list">
            {GDG_EVENTS.filter((e) => e.status === 'upcoming').map((event, i) => (
              <article
                key={event.id}
                className={`${styles.eventCard} reveal`}
                data-delay={`${0.16 + i * 0.08}`}
                role="listitem"
              >
                <div className={styles.eventDate}>
                  <span className={styles.dateDay}>
                    {new Date(event.date).getDate()}
                  </span>
                  <span className={styles.dateMonth}>
                    {new Date(event.date).toLocaleString('en-US', { month: 'short' }).toUpperCase()}
                  </span>
                </div>
                <div className={styles.eventContent}>
                  <h3 className={styles.eventTitle}>{event.title}</h3>
                  <p className={styles.eventTime}>
                    {event.startTime} – {event.endTime} {event.timezone}
                  </p>
                  <p className={styles.eventLocation}>{event.location}</p>
                  <p className={styles.eventDesc}>{event.description}</p>
                  {event.registrationUrl && (
                    <a
                      href={event.registrationUrl}
                      className={styles.register}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Register Now →
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
