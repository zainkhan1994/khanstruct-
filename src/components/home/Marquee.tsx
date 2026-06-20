import styles from './Marquee.module.css';

/* eslint-disable @next/next/no-img-element */

const ITEMS: { label: string; icon: string }[] = [
  { label: 'Gemini Live API', icon: 'gemini-live-api' },
  { label: 'React / TypeScript', icon: 'react' },
  { label: 'Google Cloud Run', icon: 'google-cloud-run' },
  { label: 'Vertex AI', icon: 'vertex-ai' },
  { label: 'Python', icon: 'python' },
  { label: 'Vector Search', icon: 'vector-search' },
  { label: 'Knowledge Graphs', icon: 'knowledge-graphs' },
  { label: 'Google ADK', icon: 'google-adk' },
  { label: 'GDG Tulsa', icon: 'google-adk' },
  { label: 'Devpost Level 6', icon: 'devpost' },
  { label: 'LangChain', icon: 'langchain' },
  { label: 'NASA Space Apps', icon: 'nasa' },
];

export function Marquee() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className={styles.wrapper} aria-hidden="true">
      <div className={styles.track}>
        {doubled.map((item, i) => (
          <span key={i} className={styles.item}>
            <img className={styles.icon} src={`/tech/${item.icon}.svg`} alt="" />
            {item.label}
            <span className={styles.sep}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
