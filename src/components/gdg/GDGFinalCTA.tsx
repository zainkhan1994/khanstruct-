'use client';

import { useRef } from 'react';
import { useRevealAll } from '@/hooks/useScrollReveal';
import styles from './GDGFinalCTA.module.css';

export function GDGFinalCTA() {
  const ref = useRef<HTMLElement>(null);
  useRevealAll(ref);

  return (
    <section
      ref={ref}
      className={styles.section}
      aria-labelledby="gdg-cta-heading"
    >
      <div className={styles.inner}>
        <div className={styles.content}>
          <h2 id="gdg-cta-heading" className={`${styles.heading} reveal`}>
            Let&apos;s build the future together
          </h2>
          <p className={`${styles.desc} reveal`} data-delay="0.08">
            Whether you&apos;re a developer, educator, student, or tech enthusiast,
            we&apos;d love to have you join our growing community in Tulsa.
          </p>
          <div className={`${styles.actions} reveal`} data-delay="0.16">
            <a
              href="https://gdg.community.dev/gdg-tulsa/"
              className="btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Join Our Community</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* Abstract network visual */}
        <div className={styles.network} aria-hidden="true">
          <NetworkVisual />
        </div>
      </div>
    </section>
  );
}

function NetworkVisual() {
  const nodes = [
    { x: 50, y: 50, r: 10 },
    { x: 20, y: 25, r: 6 },
    { x: 75, y: 20, r: 8 },
    { x: 85, y: 65, r: 6 },
    { x: 35, y: 78, r: 7 },
    { x: 65, y: 82, r: 5 },
    { x: 15, y: 60, r: 5 },
  ];

  const edges = [
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
    [1, 6], [2, 3], [3, 5], [4, 6],
  ];

  return (
    <svg
      viewBox="0 0 100 100"
      className={styles.svg}
      aria-hidden="true"
    >
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="rgba(215,255,63,0.15)"
          strokeWidth="0.5"
        />
      ))}
      {nodes.map((node, i) => (
        <circle
          key={i}
          cx={node.x}
          cy={node.y}
          r={node.r}
          fill="none"
          stroke={i === 0 ? 'rgba(215,255,63,0.5)' : 'rgba(215,255,63,0.2)'}
          strokeWidth="0.5"
          className={styles.svgNode}
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}
      {nodes.slice(1).map((node, i) => (
        <circle
          key={`dot-${i}`}
          cx={node.x}
          cy={node.y}
          r={1.5}
          fill="rgba(215,255,63,0.4)"
        />
      ))}
      <circle cx={50} cy={50} r={3} fill="rgba(215,255,63,0.8)" />
    </svg>
  );
}
