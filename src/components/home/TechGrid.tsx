'use client';

import { useRef } from 'react';
import { useRevealAll } from '@/hooks/useScrollReveal';
import styles from './TechGrid.module.css';

/* The real Khanstruct stack — drawn from project technologies, experience, and
   the marquee in src/lib/content.ts. Presented as the signature tile grid.
   `icon` is a brand SVG in public/tech/ (Simple Icons, brand-colored; abstract
   concepts use a custom accent glyph). */
const TECH: { name: string; icon: string }[] = [
  { name: 'Gemini Live API', icon: 'gemini-live-api' },
  { name: 'Vertex AI', icon: 'vertex-ai' },
  { name: 'Google Cloud Run', icon: 'google-cloud-run' },
  { name: 'Google ADK', icon: 'google-adk' },
  { name: 'Claude API', icon: 'claude-api' },
  { name: 'React', icon: 'react' },
  { name: 'TypeScript', icon: 'typescript' },
  { name: 'Next.js', icon: 'nextjs' },
  { name: 'Python', icon: 'python' },
  { name: 'Vector Search', icon: 'vector-search' },
  { name: 'Knowledge Graphs', icon: 'knowledge-graphs' },
  { name: 'LangChain', icon: 'langchain' },
  { name: 'Google Maps API', icon: 'google-maps-api' },
  { name: 'Notion', icon: 'notion' },
  { name: 'GitHub', icon: 'github' },
  { name: 'Looker Studio', icon: 'looker-studio' },
  { name: 'HubSpot', icon: 'hubspot' },
  { name: 'Lit', icon: 'lit' },
];

export function TechGrid() {
  const ref = useRef<HTMLElement>(null);
  useRevealAll(ref);

  return (
    <section ref={ref} className={styles.section} aria-labelledby="tech-heading">
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className="label reveal">The Stack</p>
          <h2 id="tech-heading" className={`${styles.heading} reveal`} data-delay="0.08">
            Tools &amp; platforms<br />
            <em>behind every build</em>
          </h2>
          <p className={`${styles.sub} reveal`} data-delay="0.14">
            From Google&apos;s AI platform to structured knowledge systems — the
            technologies powering Khanstruct projects, day to day.
          </p>
        </div>

        <div className={styles.grid} role="list">
          {TECH.map((tech, i) => (
            <div
              key={tech.name}
              className={`${styles.tile} reveal`}
              data-delay={`${Math.min(0.12 + (i % 6) * 0.05, 0.4)}`}
              role="listitem"
            >
              <span className={styles.icon} aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/tech/${tech.icon}.svg`} alt="" loading="lazy" />
              </span>
              <span className={styles.name}>{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
