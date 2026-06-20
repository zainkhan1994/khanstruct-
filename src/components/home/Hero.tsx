'use client';

import { useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useExperience } from '@/store/experience';
import { BOOK_MEETING_URL } from '@/lib/content';
import { HeroParticles } from './HeroParticles';
import styles from './Hero.module.css';

// Safety net: if the loader never signals (JS error / unexpected teardown),
// reveal anyway shortly after the loader's own hard cap so copy is never stuck.
const HERO_FALLBACK_MS = 4500;

export function Hero() {
  const reducedMotion = useExperience((s) => s.reducedMotion);
  const introDone = useExperience((s) => s.introDone);
  const contentRef = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);
  const timers = useRef<number[]>([]);

  // The hero entrance, extracted into a callable so the loader controls *when*
  // it runs. It must not auto-run before the loader transition reaches handoff.
  const runHeroEntrance = useCallback(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    const el = contentRef.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>('[data-reveal]');
    items.forEach((item, idx) => {
      const delay = reducedMotion ? 0 : parseFloat(item.dataset.delay ?? `${idx * 0.08}`) * 1000;
      timers.current.push(
        window.setTimeout(() => item.classList.add(styles.revealed), delay),
      );
    });
  }, [reducedMotion]);

  useEffect(() => {
    if (introDone) {
      runHeroEntrance();
      return;
    }
    const fallback = window.setTimeout(runHeroEntrance, HERO_FALLBACK_MS);
    return () => window.clearTimeout(fallback);
  }, [introDone, runHeroEntrance]);

  // Clear any in-flight stagger timers on unmount.
  useEffect(() => () => timers.current.forEach((t) => clearTimeout(t)), []);

  return (
    <section className={styles.hero} aria-label="Hero">
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.inner} ref={contentRef}>
        <p className={`label ${styles.hiddenInit}`} data-reveal data-delay="0.1">
          Design · Data · AI Implementation
        </p>

        <h1 className={`${styles.heading} ${styles.hiddenInit}`} data-reveal data-delay="0.22">
          Design. Data.<br />
          <span className={styles.accent}>AI Implementation.</span>
        </h1>

        <p className={`${styles.description} ${styles.hiddenInit}`} data-reveal data-delay="0.38">
          Khanstruct helps organizations design better experiences, manage data
          intelligently, and implement AI systems that drive real impact.
        </p>

        <div className={`${styles.ctas} ${styles.hiddenInit}`} data-reveal data-delay="0.52">
          <Link href="/#contact" className="btn-primary">
            <span>Work With Me</span>
            <span aria-hidden="true">→</span>
          </Link>
          <a
            href={BOOK_MEETING_URL}
            className="btn-outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Book a Meeting</span>
            <span aria-hidden="true">↗</span>
          </a>
          <Link href="/projects" className="btn-outline">
            <span>View My Work</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className={`${styles.credentials} ${styles.hiddenInit}`} data-reveal data-delay="0.62">
          <div className={styles.credItem}>
            <span className={styles.credValue}>16</span>
            <span className={styles.credLabel}>Hackathons</span>
          </div>
          <div className={styles.credDivider} aria-hidden="true" />
          <div className={styles.credItem}>
            <span className={styles.credValue}>205+</span>
            <span className={styles.credLabel}>GitHub Repos</span>
          </div>
          <div className={styles.credDivider} aria-hidden="true" />
          <div className={styles.credItem}>
            <span className={styles.credValue}>GDG</span>
            <span className={styles.credLabel}>Tulsa Lead</span>
          </div>
        </div>

        {/* Gravity-well fabric — wide centerpiece beneath the hero copy */}
        <div className={`${styles.visual} ${styles.hiddenInit}`} data-reveal data-delay="0.72">
          <HeroParticles />
        </div>
      </div>

      {/* Scroll cue */}
      <div className={`${styles.scrollCue} ${styles.hiddenInit}`} data-reveal data-delay="1.0" aria-hidden="true">
        <div className={styles.scrollLine} />
        <span className={styles.scrollText}>Scroll</span>
      </div>
    </section>
  );
}
