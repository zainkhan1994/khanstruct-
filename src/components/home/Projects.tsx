'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { PROJECTS } from '@/lib/content';
import { useRevealAll } from '@/hooks/useScrollReveal';
import styles from './Projects.module.css';

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  useRevealAll(sectionRef);

  const featured = PROJECTS.filter((p) => p.featured);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="projects-heading"
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className="label reveal">Selected Work</p>
          <h2 id="projects-heading" className={`${styles.heading} reveal`} data-delay="0.08">
            Building solutions<br />
            <em>that make an impact</em>
          </h2>
          <p className={`${styles.subheading} reveal`} data-delay="0.12">
            A selection of projects across design, data, and AI implementation.
          </p>
        </div>

        <div className={styles.grid} role="list">
          {featured.map((project, i) => (
            <article
              key={project.slug}
              className={`${styles.card} reveal`}
              data-delay={`${0.2 + i * 0.12}`}
              role="listitem"
            >
              <Link href={`/projects/${project.slug}`} className={styles.cardLink}>
                <div className={styles.imageWrapper}>
                  <div
                    className={styles.imagePlaceholder}
                    style={{ '--accent': project.accentColor } as React.CSSProperties}
                    aria-hidden="true"
                  >
                    <div className={styles.imagePlaceholderInner}>
                      <span className={styles.projectInitial}>
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className={styles.imageOverlay} aria-hidden="true" />
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>
                    <span
                      className={styles.category}
                      style={{ color: project.accentColor }}
                    >
                      {project.category}
                    </span>
                    <span className={styles.arrow} aria-hidden="true">→</span>
                  </div>
                  <h3 className={styles.cardTitle}>{project.title}</h3>
                  <p className={styles.cardSummary}>{project.summary}</p>
                  <div className={styles.tags}>
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span key={tech} className={styles.tag}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className={`${styles.footer} reveal`} data-delay="0.5">
          <Link href="/projects" className="btn-outline">
            <span>View All Projects</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
