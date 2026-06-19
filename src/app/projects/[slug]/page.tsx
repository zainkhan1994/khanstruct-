import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PROJECTS } from '@/lib/content';
import styles from './project.module.css';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return { title: 'Project Not Found' };

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  const currentIndex = PROJECTS.findIndex((p) => p.slug === slug);
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <Link href="/projects" className={styles.back}>
              <span aria-hidden="true">←</span> All Projects
            </Link>
            <div className={styles.heroContent}>
              <span
                className={styles.category}
                style={{ color: project.accentColor }}
              >
                {project.category}
              </span>
              <h1 className={styles.heading}>{project.title}</h1>
              <p className={styles.summary}>{project.summary}</p>
            </div>
            <div
              className={styles.heroVisual}
              style={{ '--accent': project.accentColor } as React.CSSProperties}
              aria-hidden="true"
            >
              <span className={styles.heroInitial}>{project.title.charAt(0)}</span>
            </div>
          </div>
        </section>

        {/* Content */}
        <article className={styles.content}>
          <div className={styles.contentInner}>
            <div className={styles.main}>
              {/* Problem */}
              <section className={styles.section} aria-labelledby="problem-heading">
                <h2 id="problem-heading" className={styles.sectionLabel}>Problem</h2>
                <p className={styles.sectionText}>{project.problem}</p>
              </section>

              {/* Solution */}
              <section className={styles.section} aria-labelledby="solution-heading">
                <h2 id="solution-heading" className={styles.sectionLabel}>Solution</h2>
                <p className={styles.sectionText}>{project.solution}</p>
              </section>

              {/* Outcome */}
              <section className={styles.section} aria-labelledby="outcome-heading">
                <h2 id="outcome-heading" className={styles.sectionLabel}>Outcome</h2>
                <p className={styles.sectionText}>{project.outcome}</p>
              </section>
            </div>

            <aside className={styles.sidebar}>
              {/* Technologies */}
              <div className={styles.sideBlock}>
                <h3 className={styles.sideLabel}>Technologies</h3>
                <div className={styles.tags}>
                  {project.technologies.map((tech) => (
                    <span key={tech} className={styles.tag}>{tech}</span>
                  ))}
                </div>
              </div>

              {/* Links */}
              {project.verifiedLinks.length > 0 && (
                <div className={styles.sideBlock}>
                  <h3 className={styles.sideLabel}>Links</h3>
                  <div className={styles.links}>
                    {project.verifiedLinks.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        className={styles.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label} →
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </article>

        {/* Next Project */}
        <section className={styles.next} aria-label="Next project">
          <div className={styles.nextInner}>
            <p className={styles.nextLabel}>Next Project</p>
            <Link href={`/projects/${nextProject.slug}`} className={styles.nextLink}>
              <span
                className={styles.nextCategory}
                style={{ color: nextProject.accentColor }}
              >
                {nextProject.category}
              </span>
              <h3 className={styles.nextTitle}>{nextProject.title}</h3>
              <span className={styles.nextArrow} aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.cta}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaHeading}>Interested in working together?</h2>
            <Link href="/#contact" className="btn-primary">
              <span>Get In Touch</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
