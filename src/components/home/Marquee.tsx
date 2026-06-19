import styles from './Marquee.module.css';

const ITEMS = [
  'Gemini Live API',
  'React / TypeScript',
  'Google Cloud Run',
  'Vertex AI',
  'Python',
  'Vector Search',
  'Knowledge Graphs',
  'Google ADK',
  'GDG Tulsa',
  'Devpost Level 6',
  'LangChain',
  'NASA Space Apps',
];

export function Marquee() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className={styles.wrapper} aria-hidden="true">
      <div className={styles.track}>
        {doubled.map((item, i) => (
          <span key={i} className={styles.item}>
            {item}
            <span className={styles.sep}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
