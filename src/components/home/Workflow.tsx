'use client';

import { useRef, useState } from 'react';
import { SERVICES } from '@/lib/content';
import { useRevealAll } from '@/hooks/useScrollReveal';
import styles from './Workflow.module.css';

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  layout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  ),
  palette: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 1 9 9h-9V3z" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  film: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="2" y="2" width="20" height="20" rx="2.18" />
      <path d="M7 2v20M17 2v20M2 12h20M2 7h5M17 7h5M2 17h5M17 17h5" />
    </svg>
  ),
  'git-branch': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <line x1="6" y1="3" x2="6" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  ),
  database: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  'bar-chart': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  server: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="2" y="2" width="20" height="8" rx="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  ),
  'book-open': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  cpu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
    </svg>
  ),
  zap: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  cloud: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  ),
};

export function Workflow() {
  const sectionRef = useRef<HTMLElement>(null);
  useRevealAll(sectionRef);
  const [active, setActive] = useState(0);

  return (
    <section
      id="services"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="workflow-heading"
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className="label reveal">What I Do</p>
          <h2 id="workflow-heading" className={`${styles.heading} reveal`} data-delay="0.08">
            End-to-end solutions<br />
            <em>for modern problems</em>
          </h2>
          <p className={`${styles.sub} reveal`} data-delay="0.14">
            From design systems to data pipelines and AI automation, I build
            systems that scale and experiences that convert.
          </p>
        </div>

        <div
          className={`${styles.panel} reveal`}
          data-delay="0.2"
          onMouseLeave={() => setActive(0)}
          role="list"
        >
          {SERVICES.map((service, i) => {
            const isActive = active === i;
            return (
              <div
                key={service.id}
                className={`${styles.col} ${isActive ? styles.colActive : ''}`}
                style={{ flexGrow: isActive ? 1.5 : 1 }}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                tabIndex={0}
                role="listitem"
                aria-current={isActive}
              >
                <div className={styles.colInner}>
                  <div className={styles.mockArea}>
                    <div className={styles.mock}>
                      <div className={styles.capsCard}>
                        <p className={styles.capsHead}>Capabilities</p>
                        <ul className={styles.capsList}>
                          {service.capabilities.map((cap) => (
                            <li key={cap.label} className={styles.capRow}>
                              <span className={styles.capIcon} aria-hidden="true">
                                {SERVICE_ICONS[cap.icon] || SERVICE_ICONS.layers}
                              </span>
                              <span className={styles.capLabel}>{cap.label}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className={styles.textArea}>
                    <span className={styles.num}>0{i + 1}</span>
                    <h3 className={styles.colTitle}>{service.title}</h3>
                    <p className={styles.colDesc}>{service.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
