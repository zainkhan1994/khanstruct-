'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useRevealAll } from '@/hooks/useScrollReveal';
import styles from './GDGFeature.module.css';

export function GDGFeature() {
  const sectionRef = useRef<HTMLElement>(null);
  useRevealAll(sectionRef);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="gdg-heading"
    >
      <div className={styles.inner}>
        <div className={styles.content}>
          <p className={`label reveal`}>Community Leadership</p>
          <h2 id="gdg-heading" className={`${styles.heading} reveal`} data-delay="0.08">
            GDG Tulsa
          </h2>
          <p className={`${styles.description} reveal`} data-delay="0.16">
            Empowering developers, educators, and leaders through Google Developer
            Group initiatives. Building a strong developer community in Tulsa through
            learning, networking, and innovation.
          </p>
          <div className={`${styles.actions} reveal`} data-delay="0.24">
            <Link href="/gdg-tulsa" className="btn-primary">
              <span>Explore GDG Tulsa</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className={`${styles.stats} reveal`} data-delay="0.32">
            <div className={styles.stat}>
              <span className={styles.statVal}>500+</span>
              <span className={styles.statLbl}>Members</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statVal}>25+</span>
              <span className={styles.statLbl}>Events</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statVal}>Tulsa</span>
              <span className={styles.statLbl}>Oklahoma</span>
            </div>
          </div>
        </div>

        {/* Visual */}
        <div className={`${styles.visual} reveal`} data-delay="0.12" aria-hidden="true">
          <div className={styles.globe}>
            {/* Decorative globe representation */}
            <div className={styles.globeRing} style={{ '--scale': '1' } as React.CSSProperties} />
            <div className={styles.globeRing} style={{ '--scale': '0.75' } as React.CSSProperties} />
            <div className={styles.globeRing} style={{ '--scale': '0.5' } as React.CSSProperties} />
            <div className={styles.globeCore} />
            <div className={styles.tulsaPin}>
              <div className={styles.pinPulse} />
              <div className={styles.pinDot} />
            </div>
            <div className={styles.globeLabel}>GDG Tulsa</div>
          </div>
        </div>
      </div>
    </section>
  );
}
