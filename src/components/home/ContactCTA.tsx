'use client';

import { useRef } from 'react';
import { CONTACT_LINKS, EMAIL } from '@/lib/content';
import { useRevealAll } from '@/hooks/useScrollReveal';
import { ContactButton } from '@/components/contact/ContactButton';
import styles from './ContactCTA.module.css';

export function ContactCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  useRevealAll(sectionRef);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="contact-heading"
    >
      <div className={styles.inner}>
        <div className={styles.left}>
          <div className={`${styles.available} reveal`} aria-label="Currently available">
            <span className={styles.availDot} aria-hidden="true" />
            <span>Available — 2026</span>
          </div>

          <h2 id="contact-heading" className={`${styles.heading} reveal`} data-delay="0.08">
            Let&apos;s build<br />
            something<br />
            <em>amazing together</em>
          </h2>

          <p className={`${styles.description} reveal`} data-delay="0.16">
            Have a project in mind? Let&apos;s talk about how we can work together.
          </p>

          <ContactButton
            className={`${styles.emailBtn} reveal`}
            data-delay="0.24"
            aria-label="Open the message panel"
          >
            <span>{EMAIL}</span>
            <span aria-hidden="true">↗</span>
          </ContactButton>
        </div>

        <div className={styles.right}>
          <ul className={styles.links} role="list" aria-label="External profiles">
            {CONTACT_LINKS.map((link, i) => (
              <li
                key={link.label}
                className={`${styles.linkItem} reveal`}
                data-delay={`${0.12 + i * 0.1}`}
              >
                <a
                  href={link.url}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.linkLabel}>{link.label}</span>
                  <span className={styles.linkSub}>{link.sublabel} →</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
