'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRevealAll } from '@/hooks/useScrollReveal';
import styles from './About.module.css';

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  useRevealAll(sectionRef);

  return (
    <section
      id="about"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="about-heading"
    >
      <div className={styles.inner}>
        {/* Portrait */}
        <div className={`${styles.portrait} reveal`} data-delay="0.0">
          <div className={styles.portraitFrame}>
            <Image
              src="/photo.jpg"
              alt="Zain Khan — Founder, Khanstruct"
              width={480}
              height={560}
              className={styles.image}
              priority={false}
            />
            <div className={styles.portraitOverlay} aria-hidden="true" />
            <div className={styles.portraitHalo} aria-hidden="true" />
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <p className={`label reveal`} data-delay="0.0">About Me</p>
          <h2 id="about-heading" className={`${styles.heading} reveal`} data-delay="0.08">
            Operator.<br />Builder.<br />
            <em>Problem Solver.</em>
          </h2>
          <div className={`${styles.body} reveal`} data-delay="0.16">
            <p>
              I build under the studio identity <strong>Khanstruct</strong> — multimodal AI
              agents, automation pipelines, and structured knowledge systems. My work spans
              real production deployments, not mockups.
            </p>
            <p>
              I think in hierarchies. Every system I build is grounded in verifiable inputs,
              explicit source boundaries, and repeatable outputs. If you can&apos;t point to
              the source, it&apos;s not real.
            </p>
            <p>
              16 hackathons. 205 GitHub repos. Devpost Level 6. Google Developer Program
              since 2022. GDG Tulsa organizer. NASA Space Apps local lead.
            </p>
          </div>

          <div className={`${styles.principles} reveal`} data-delay="0.24">
            {[
              { n: '01', title: 'Evidence before narrative', body: 'Every layer grounded in verifiable inputs with explicit source boundaries. No drift.' },
              { n: '02', title: 'Ship, then iterate', body: 'A deployed agent that does one thing correctly beats a prototype doing everything in theory.' },
              { n: '03', title: 'Hierarchies clarify everything', body: 'Good architecture is a taxonomy. The right structure makes every failure diagnosable.' },
              { n: '04', title: 'Community is infrastructure', body: 'Running GDG Tulsa and NASA Space Apps is part of the engineering ecosystem.' },
            ].map((p) => (
              <div key={p.n} className={styles.principle}>
                <span className={styles.principleNum}>{p.n}</span>
                <div>
                  <p className={styles.principleTitle}>{p.title}</p>
                  <p className={styles.principleBody}>{p.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={`${styles.actions} reveal`} data-delay="0.32">
            <Link href="/projects" className="btn-outline">
              <span>View My Work</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
