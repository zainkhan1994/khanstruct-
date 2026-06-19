import type {
  Project,
  Experience,
  Hackathon,
  Metric,
  Service,
  GDGEvent,
  NavItem,
} from './types';

// ─── Navigation ───────────────────────────────────────────────────────────

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/#services' },
  { label: 'Projects', href: '/projects' },
  { label: 'GDG Tulsa', href: '/gdg-tulsa' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
];

// ─── Services ─────────────────────────────────────────────────────────────

export const SERVICES: Service[] = [
  {
    id: 'design',
    title: 'Design',
    description:
      'Crafting functional digital experiences that tell your story and drive engagement — from first impression to conversion.',
    capabilities: [
      { icon: 'layout', label: 'Product UI & UX' },
      { icon: 'target', label: 'Landing Pages' },
      { icon: 'palette', label: 'Brand Systems' },
      { icon: 'layers', label: 'Design Systems' },
      { icon: 'film', label: 'Storytelling Visuals' },
    ],
    accentColor: '#d7ff3f',
  },
  {
    id: 'data',
    title: 'Data Management',
    description:
      'Building reliable data systems that help you make better decisions, faster — structured, normalized, and ready to scale.',
    capabilities: [
      { icon: 'git-branch', label: 'Data Pipelines' },
      { icon: 'database', label: 'CRM & Normalization' },
      { icon: 'bar-chart', label: 'Dashboards & Reporting' },
      { icon: 'server', label: 'Data Architecture' },
      { icon: 'book-open', label: 'Knowledge Systems' },
    ],
    accentColor: '#d7ff3f',
  },
  {
    id: 'ai',
    title: 'AI Implementation',
    description:
      'Deploying AI solutions and automation that streamline operations, reduce friction, and unlock compounding value.',
    capabilities: [
      { icon: 'cpu', label: 'AI Agents & Automation' },
      { icon: 'zap', label: 'Gemini & Vertex AI' },
      { icon: 'search', label: 'RAG & Vector Systems' },
      { icon: 'cloud', label: 'Google Cloud' },
      { icon: 'layers', label: 'Multimodal Applications' },
    ],
    accentColor: '#d7ff3f',
  },
];

// ─── Projects ─────────────────────────────────────────────────────────────

export const PROJECTS: Project[] = [
  {
    slug: 'cortana-ai-agent',
    title: 'Cortana',
    category: 'AI Agent',
    summary:
      'Multimodal conversational AI agent with real-time voice, vision, cinematic visuals, and UI navigation in a single conversation.',
    problem:
      'Most AI assistants handle one modality at a time — voice or vision, never both at once, never in a visually coherent interface.',
    solution:
      'Built a unified agent using Gemini Live API that handles simultaneous voice input, visual understanding, and adaptive UI rendering with cinematic transitions.',
    outcome:
      'Submitted to Gemini API Developer Competition ($80K prize pool, 11,915 participants). Demonstrated multimodal coherence not available in comparable open submissions.',
    technologies: ['Gemini Live API', 'React', 'TypeScript', 'Cloud Run', 'Lit', 'Python'],
    coverImage: '/images/project-cortana.jpg',
    visualTheme: 'dark-blue',
    accentColor: '#4a9eff',
    featured: true,
    verifiedLinks: [
      { label: 'Devpost Submission', url: 'https://devpost.com/zainkhan1994-zk' },
    ],
  },
  {
    slug: 'blueprint-knowledge-system',
    title: 'Blueprint',
    category: 'Knowledge System',
    summary:
      'Personal operating system — 14 domain databases, evidence maps, normalization rules, and structured knowledge architecture powering all Khanstruct work.',
    problem:
      'Information accumulates without structure. Decisions degrade when context is scattered across notes, browser tabs, and memory.',
    solution:
      'Designed a hierarchical Notion-based knowledge system with 14 domain databases, cross-linked evidence maps, and normalization protocols that enforce source boundaries.',
    outcome:
      'Operational system that has supported 16+ hackathon submissions, 205+ GitHub repos, and multiple client engagements without drift or data loss.',
    technologies: ['Notion', 'Claude API', 'Vector Search', 'Knowledge Graphs', 'Python'],
    coverImage: '/images/project-blueprint.jpg',
    visualTheme: 'dark-purple',
    accentColor: '#a855f7',
    featured: true,
    verifiedLinks: [],
  },
  {
    slug: 'gemini-marketing-taskforce',
    title: 'Gemini Marketing Taskforce',
    category: 'Multi-Agent System',
    summary:
      'Autonomous multi-agent system automating marketing content creation — from strategy brief to final copy — built on Google Cloud ADK.',
    problem:
      'Marketing content pipelines are manual, slow, and inconsistent. Human review loops create bottlenecks in high-volume content operations.',
    solution:
      'Designed a multi-agent orchestration system where specialized agents handle strategy, copywriting, and review independently, coordinated by a supervisor agent.',
    outcome:
      'Submitted to ADK Hackathon ($50K prize pool, 10,376 participants). Demonstrated practical multi-agent coordination for production marketing workflows.',
    technologies: ['Google ADK', 'Gemini', 'Cloud Run', 'Python', 'Agent Orchestration'],
    coverImage: '/images/project-taskforce.jpg',
    visualTheme: 'dark-green',
    accentColor: '#22c55e',
    featured: true,
    verifiedLinks: [
      { label: 'Devpost Submission', url: 'https://devpost.com/zainkhan1994-zk' },
    ],
  },
  {
    slug: 'nasa-space-apps',
    title: 'NASA Space Apps Tulsa',
    category: 'Community & Web',
    summary:
      'Local lead organizer and website developer for NASA Space Apps Challenge in Tulsa — built V2 and V3 of the event website.',
    problem:
      'NASA Space Apps Tulsa needed a credible digital presence and operational coordination to attract serious participants and mentors.',
    solution:
      'Built and maintained the event website across two versions, coordinated local teams and mentors, and managed Houston judging operations.',
    outcome:
      'Successful in-person hackathon events with coordinated team submissions to Houston judging. Established Tulsa as a repeatable Space Apps location.',
    technologies: ['React', 'GitHub', 'Program Ops'],
    coverImage: '/images/project-spaceapps.jpg',
    visualTheme: 'dark-orange',
    accentColor: '#f97316',
    featured: false,
    verifiedLinks: [],
  },
  {
    slug: 'health-ehr-dashboard',
    title: 'Health EHR Dashboard',
    category: 'Data Engineering',
    summary:
      '70+ lab test dashboard with trend analysis, filtering, and CSV export for longitudinal personal health data tracking.',
    problem:
      'Medical lab results arrive as disconnected PDFs with no trend visibility, no filtering, and no ability to see patterns over time.',
    solution:
      'Built a React dashboard with Python data pipelines that parse, normalize, and visualize 70+ lab markers across time with export capability.',
    outcome:
      'Operational health tracking system with git-backed CSV pipelines and GitHub Pages documentation. Demonstrated practical EHR data engineering.',
    technologies: ['React', 'Python', 'CSV Pipelines', 'GitHub Pages', 'Data Viz'],
    coverImage: '/images/project-ehr.jpg',
    visualTheme: 'dark-gold',
    accentColor: '#fbbf24',
    featured: false,
    verifiedLinks: [
      { label: 'GitHub', url: 'https://github.com/zainkhan1994' },
    ],
  },
  {
    slug: 'cortana-maplens',
    title: 'Cortana MapLens',
    category: 'Geospatial AI',
    summary:
      'Visual memory map turning location history into a clustered, filtered, exportable geospatial timeline with AI-driven insights via Gemini.',
    problem:
      'Location history from Google Maps exports is raw JSON with no useful visualization, no clustering, and no way to extract meaningful patterns.',
    solution:
      'Built a React application on Google Maps Platform that clusters location data, provides temporal filtering, and uses Gemini for natural language insight generation.',
    outcome:
      'Submitted to Google Maps Platform Awards (3,932 participants). Demonstrated creative use of Maps Platform APIs combined with generative AI.',
    technologies: ['Google Maps API', 'React', 'Gemini', 'TypeScript', 'Python'],
    coverImage: '/images/project-maplens.jpg',
    visualTheme: 'dark-cyan',
    accentColor: '#06b6d4',
    featured: false,
    verifiedLinks: [
      { label: 'Devpost Submission', url: 'https://devpost.com/zainkhan1994-zk' },
    ],
  },
];

// ─── Experience ───────────────────────────────────────────────────────────

export const EXPERIENCE: Experience[] = [
  {
    id: 'khanstruct',
    period: '2026 – Present',
    company: 'Khanstruct',
    role: 'Founder & AI Engineer',
    location: 'Tulsa, OK',
    description:
      'Independent AI studio building multimodal agents, automation pipelines, and structured knowledge systems. Built Cortana — a multimodal AI agent with real-time voice, vision, and UI navigation using Gemini Live API. Designed personal Second Brain at scale in Notion.',
    tags: ['Gemini Live API', 'React', 'TypeScript', 'Cloud Run', 'Python'],
  },
  {
    id: 'rcubed',
    period: '2024 – 2025',
    company: 'R-Cubed Consulting',
    role: 'Business Development, Marketing & Ops',
    location: 'Tulsa, OK',
    description:
      'Oracle and NetSuite consulting firm. Owned the full sales pipeline, company website, and marketing operations. Authored the BDR Outbound Handbook. Completed NetSuite SuiteLife Partner Training.',
    tags: ['HubSpot', 'Apollo', 'WordPress', 'Oracle', 'NetSuite'],
  },
  {
    id: 'trulo',
    period: '2024 – 2025',
    company: 'Trulo Homes / Red River Dev',
    role: 'Marketing Director',
    location: 'Tulsa, OK',
    description:
      'Multi-location real estate marketing across 8 markets. Full Google + Meta stack management. Earned Google Ads Display Certification. 26+ Google Business Profile events in a single quarter.',
    tags: ['Google Ads', 'Meta Ads', 'Analytics', 'Looker Studio'],
  },
  {
    id: 'roserock',
    period: '2024 – 2025',
    company: 'Rose Rock Development',
    role: 'Marketing & Client Operations',
    location: 'Tulsa, OK',
    description:
      'Supported marketing and operational materials across Reunion Building, Palace, Adams, and Vandever properties. Meta Business Suite, web development, calendar management.',
    tags: ['Meta Business', 'Canva', 'Google Workspace'],
  },
];

// ─── Hackathons ───────────────────────────────────────────────────────────

export const HACKATHONS: Hackathon[] = [
  {
    id: 'gemini-live',
    title: 'Gemini Live Agent Challenge',
    organizer: 'Google',
    year: '2026',
    prizePool: '$80K',
    participants: '11,915',
    project: 'Cortana — Multimodal AI Agent',
  },
  {
    id: 'gemini-3',
    title: 'Gemini 3 Hackathon',
    organizer: 'Google',
    year: '2025–2026',
    prizePool: '$100K',
    participants: '35,628',
    project: 'Submitted project entry',
  },
  {
    id: 'adk',
    title: 'Agent Dev Kit Hackathon',
    organizer: 'Google Cloud',
    year: '2025',
    prizePool: '$50K',
    participants: '10,376',
    project: 'Gemini Marketing Taskforce',
  },
  {
    id: 'worlds-largest',
    title: "World's Largest Hackathon",
    organizer: 'Bolt',
    year: '2025',
    prizePool: '$1M+',
    participants: '128,453',
    project: 'Submitted project entry',
  },
  {
    id: 'meta-horizon',
    title: 'Meta Horizon Creator Competition',
    organizer: 'Meta',
    year: '2025',
    prizePool: '$1M',
    participants: '1,407',
    project: 'The Spartan Covenant — AI sci-fi game',
  },
  {
    id: 'perplexity',
    title: 'Perplexity Hackathon',
    organizer: 'Perplexity',
    year: '2025',
    prizePool: '$35K',
    participants: '4,367',
    project: 'Cortona OS — multi-agent workflow system',
  },
  {
    id: 'maps-platform',
    title: 'Google Maps Platform Awards',
    organizer: 'Google',
    year: '2025',
    participants: '3,932',
    project: 'Cortana MapLens',
  },
  {
    id: 'houston',
    title: 'Houston Hackathon 2025',
    organizer: 'Impact Hub Houston',
    year: '2025',
    participants: '70',
    project: 'Open data solutions for Houston',
    inPerson: true,
    location: 'Houston, TX',
  },
];

// ─── Metrics ──────────────────────────────────────────────────────────────

export const METRICS: Metric[] = [
  { value: '20+', label: 'Projects Delivered', numericTarget: 20, verified: false },
  { value: '16', label: 'Hackathons Entered', numericTarget: 16, verified: true },
  { value: '205+', label: 'GitHub Repositories', numericTarget: 205, verified: true },
  { value: '$3M+', label: 'Prize Pools Entered', verified: true },
];

// ─── GDG Events ───────────────────────────────────────────────────────────

export const GDG_EVENTS: GDGEvent[] = [
  // No upcoming events confirmed — leaving empty for client to populate
];

// ─── GDG Focus Areas ──────────────────────────────────────────────────────

export const GDG_FOCUS_AREAS = [
  {
    id: 'google-tech',
    icon: 'google',
    title: 'Google Technologies',
    description:
      'From Android to Cloud, we explore the best of Google developer tools and platforms.',
  },
  {
    id: 'career',
    icon: 'trending-up',
    title: 'Career Growth',
    description: 'Helping developers level up their skills and advance their careers.',
  },
  {
    id: 'community',
    icon: 'users',
    title: 'Community Impact',
    description: 'Using technology to solve real problems and give back to our community.',
  },
  {
    id: 'diversity',
    icon: 'heart',
    title: 'Diversity & Inclusion',
    description: 'Creating an inclusive space for everyone to learn, share, and grow together.',
  },
];

// ─── GDG Metrics ──────────────────────────────────────────────────────────

export const GDG_METRICS: Metric[] = [
  { value: '500+', label: 'Members', verified: false },
  { value: '25+', label: 'Events Hosted', verified: false },
  { value: '50+', label: 'Workshops', verified: false },
  { value: '15+', label: 'Community Partners', verified: false },
];

// ─── Contact Links ────────────────────────────────────────────────────────

export const CONTACT_LINKS = [
  { label: 'GitHub', sublabel: 'zainkhan1994 · 205 repos', url: 'https://github.com/zainkhan1994' },
  { label: 'Google Dev Profile', sublabel: 'g.dev/khanstruct', url: 'https://g.dev/khanstruct' },
  { label: 'Devpost', sublabel: 'Level 6 · 16 Hackathons', url: 'https://devpost.com/zainkhan1994-zk' },
  { label: 'Kaggle', sublabel: 'zainkhan1994', url: 'https://www.kaggle.com/zainkhan1994zk' },
  { label: 'LinkedIn', sublabel: 'Connect with Zain', url: 'https://linkedin.com/in/zainkhan1994' },
];

export const EMAIL = 'zain@thekhanstruct.com';

// Google Calendar appointment scheduling page (opens in a new tab).
export const BOOK_MEETING_URL =
  'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3jDQ8YdrtmpjDaXr3o_8efW9KZBnbNbwV_OxGqULG2iCXWrRTTngJXv38J005y_f5AzZf49qyo';
