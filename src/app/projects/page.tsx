import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PROJECTS } from '@/lib/content';
import styles from './projects.module.css';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'A selection of projects across design, data engineering, and AI implementation by Zain Khan / Khanstruct.',
};

export default function ProjectsPage() {
  return (
    <>
      <Header />
      <main>
        <section className={styles.hero}>
          <div className={styles.inner}>
            <p className={`label ${styles.label}`}>Selected Work</p>
            <h1 className={styles.heading}>
              Real<br />
              <em>deliverables.</em>
            </h1>
            <p className={styles.desc}>
              Production deployments, competition submissions, and community systems — not mockups.
            </p>
          </div>
        </section>

        <section className={styles.grid} aria-labelledby="projects-list-heading">
          <div className={styles.inner}>
            <h2 id="projects-list-heading" className="sr-only">All Projects</h2>
            <div className={styles.cards} role="list">
              {PROJECTS.map((project, i) => (
                <article
                  key={project.slug}
                  className={styles.card}
                  role="listitem"
                >
                  <Link href={`/projects/${project.slug}`} className={styles.cardLink}>
                    <div className={styles.cardNum} aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div
                      className={styles.cardVisual}
                      style={{ '--accent': project.accentColor } as React.CSSProperties}
                      aria-hidden="true"
                    >
                      <span className={styles.cardInitial}>
                        {project.title.charAt(0)}
                      </span>
                    </div>
                    <div className={styles.cardBody}>
                      <span
                        className={styles.cardCategory}
                        style={{ color: project.accentColor }}
                      >
                        {project.category}
                      </span>
                      <h3 className={styles.cardTitle}>{project.title}</h3>
                      <p className={styles.cardSummary}>{project.summary}</p>
                      <div className={styles.cardTags}>
                        {project.technologies.slice(0, 4).map((tech) => (
                          <span key={tech} className={styles.tag}>{tech}</span>
                        ))}
                      </div>
                    </div>
                    <span className={styles.cardArrow} aria-hidden="true">→</span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
