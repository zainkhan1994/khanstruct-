// ─── Experience & Canvas ───────────────────────────────────────────────────

export type ExperienceSection =
  | 'hero'
  | 'services'
  | 'metrics'
  | 'projects'
  | 'gdg'
  | 'about'
  | 'contact';

export type QualityTier = 'high' | 'medium' | 'low';
export type RouteTransition = 'idle' | 'to-gdg' | 'to-home';

export interface ExperienceState {
  activeSection: ExperienceSection;
  sectionProgress: number;
  pageProgress: number;
  pointer: { x: number; y: number };
  routeTransition: RouteTransition;
  reducedMotion: boolean;
  quality: QualityTier;
  webglAvailable: boolean;
  earthFormed: boolean;
  activeService: 'design' | 'data' | 'ai' | null;
  /** True once the System Initialization loader hands off to the page. Gates the hero entrance. */
  introDone: boolean;
}

// ─── Content ──────────────────────────────────────────────────────────────

export interface Metric {
  value: string;
  label: string;
  numericTarget?: number;
  verified: boolean;
  note?: string;
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  summary: string;
  problem: string;
  solution: string;
  outcome: string;
  technologies: string[];
  coverImage: string;
  visualTheme: string;
  accentColor: string;
  featured: boolean;
  verifiedLinks: { label: string; url: string }[];
}

export interface Experience {
  id: string;
  period: string;
  company: string;
  role: string;
  description: string;
  tags: string[];
  location: string;
}

export interface Hackathon {
  id: string;
  title: string;
  organizer: string;
  year: string;
  prizePool?: string;
  participants?: string;
  project: string;
  inPerson?: boolean;
  location?: string;
}

export interface GDGEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  location: string;
  description: string;
  registrationUrl: string;
  coordinates?: { lat: number; lng: number };
  status: 'upcoming' | 'past' | 'canceled';
}

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface ServiceCapability {
  icon: string;
  label: string;
}

export interface Service {
  id: 'design' | 'data' | 'ai';
  title: string;
  description: string;
  capabilities: ServiceCapability[];
  accentColor: string;
}
