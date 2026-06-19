'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRevealAll } from '@/hooks/useScrollReveal';
import styles from './GDGHero.module.css';

export function GDGHero() {
  const ref = useRef<HTMLElement>(null);
  useRevealAll(ref);

  return (
    <section ref={ref} className={styles.hero} aria-labelledby="gdg-hero-heading">
      <div className={styles.inner}>
        <div className={styles.content}>
          <div className={`${styles.back} reveal`}>
            <Link href="/" className={styles.backLink}>
              <span aria-hidden="true">←</span> Back to Home
            </Link>
          </div>

          <p className={`label reveal`} data-delay="0.05">Community Project</p>

          <h1 id="gdg-hero-heading" className={`${styles.heading} reveal`} data-delay="0.1">
            Project<br />GDG Tulsa
          </h1>

          <p className={`${styles.description} reveal`} data-delay="0.18">
            Building a strong developer community in Tulsa through learning,
            networking, and innovation. Google Developer Group Tulsa is where
            developers, educators, and innovators come together.
          </p>

          <div className={`${styles.actions} reveal`} data-delay="0.26">
            <a
              href="https://gdg.community.dev/gdg-tulsa/"
              className="btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Join Our Community</span>
              <span aria-hidden="true">→</span>
            </a>
            <a href="#events" className="btn-outline">
              <span>View Events</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* Tulsa digital-earth visual with a radiating pulse on the TULSA point */}
        <div className={`${styles.earthVisual} reveal`} data-delay="0.08" aria-hidden="true">
          <Image
            src="/gdg-tulsa-earth.png"
            alt=""
            width={1672}
            height={941}
            sizes="(max-width: 900px) 92vw, 46vw"
            className={styles.earthImg}
            priority
          />
          {/* Centered on the image's TULSA halo (≈67% x, 57% y) */}
          <span className={styles.tulsa}>
            <span className={styles.ring} style={{ '--d': '0s' } as React.CSSProperties} />
            <span className={styles.ring} style={{ '--d': '1s' } as React.CSSProperties} />
            <span className={styles.ring} style={{ '--d': '2s' } as React.CSSProperties} />
            <span className={styles.core} />
          </span>
        </div>
      </div>
    </section>
  );
}
