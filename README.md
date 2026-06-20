# Khanstruct

Production-quality website for Zain Khan / Khanstruct — Design. Data. AI Implementation.

## Stack

- **Next.js 14** (App Router)
- **React 18** + TypeScript (strict)
- **Custom WebGL Canvas** — persistent single-canvas renderer with Earth particle system
- **GSAP** — scroll-driven and entrance timelines
- **Zustand** — typed global experience state
- **CSS Modules** + **Tailwind CSS** — design token system
- **Vitest** — unit tests
- **Playwright** — E2E browser tests

---

## Setup

```bash
npm install
npm run dev       # http://localhost:3000
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run type-check` | TypeScript validation |
| `npm run lint` | ESLint check |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright e2e tests (requires running dev server) |

## Routes

| Route | Description |
|-------|-------------|
| `/` | Khanstruct homepage |
| `/gdg-tulsa` | GDG Tulsa community page |
| `/projects` | Project index |
| `/projects/[slug]` | Individual project detail |

---

## Architecture

### WebGL Canvas (`src/components/canvas/`)

One persistent `<canvas>` element mounts in the layout and stays alive across route changes.

**`ExperienceProvider`** — wraps the app, detects quality tier, reduced-motion, scroll, and pointer. Feeds normalized values into the global store.

**`ExperienceCanvas`** — mounts the canvas and manages the `WebGLCanvasRenderer` lifecycle. The renderer handles:

- Background particle field (lime-tinted, quality-adaptive count)
- Earth particle system with geographic continent approximation
- Formation animation: particles scatter → assemble into globe
- Section-aware rendering (Earth visible during hero/services/gdg sections)
- Pause on `visibilitychange`, resize handling with DPR cap

### Global State (`src/store/experience.ts`)

```ts
type ExperienceSection = 'hero' | 'services' | 'metrics' | 'projects' | 'gdg' | 'about' | 'contact';
type QualityTier = 'high' | 'medium' | 'low';
```

Zustand store distributed via hooks. No context overhead.

### Design Tokens (`src/app/globals.css`)

Dark, card-driven landing aesthetic — near-black neutral background, lime accent,
warm amber hero-orb glow. Sections use a centered eyebrow-pill + heading pattern,
rounded card surfaces, and rounded buttons.

```css
--color-bg: #07070a
--color-bg-elevated: #0c0c11
--color-panel: #0e0e13
--color-accent: #d7ff3f        /* lime */
--color-warm: #ffb347          /* hero-orb core glow */
--color-text: #f3f3f0
--color-text-muted: #8a8a96
--color-border: rgba(255,255,255,0.07)
--radius: 16px                 /* card radius; --radius-sm 10px, --radius-lg 24px, --radius-pill 100px */
```

### Content (`src/lib/content.ts`)

All site content is in a single typed config file. Never fabricated:
- Projects, experience, hackathons, metrics, GDG events
- Unverified metrics flagged with `verified: false`
- Empty `GDG_EVENTS` array — populate when real events are available

---

## Performance

**Quality tiers** (auto-detected by device):

| Tier | Earth Particles | Background Particles | DPR |
|------|----------------|---------------------|-----|
| High | ~3000 | 120 | 1.5× |
| Medium | ~1800 | 70 | 1.5× |
| Low | ~1000 | 40 | 1.0× |

- Canvas pauses when `document.hidden`
- DPR capped at 1.5
- No draw calls per frame for offscreen content
- All geometries and buffers disposed on unmount

---

## Content Editing

### Adding a Project

Edit `src/lib/content.ts` — add to the `PROJECTS` array:

```ts
{
  slug: 'my-project',       // URL: /projects/my-project
  title: 'My Project',
  category: 'AI Agent',
  summary: 'One paragraph summary.',
  problem: '...',
  solution: '...',
  outcome: '...',           // Do not fabricate outcomes
  technologies: ['React', 'Python'],
  coverImage: '/images/project-my-project.jpg',
  visualTheme: 'dark-blue',
  accentColor: '#4a9eff',
  featured: true,           // Show on homepage
  verifiedLinks: [
    { label: 'GitHub', url: 'https://...' }
  ],
}
```

### Adding GDG Events

Edit `GDG_EVENTS` in `src/lib/content.ts`:

```ts
{
  id: 'event-jan-2026',
  title: 'AI Workshop',
  date: '2026-01-15',
  startTime: '6:30 PM',
  endTime: '9:00 PM',
  timezone: 'CST',
  location: 'Tulsa Tech Hub',
  description: '...',
  registrationUrl: 'https://gdg.community.dev/...',
  status: 'upcoming',
}
```

### Updating Metrics

In `src/lib/content.ts`, set `verified: true` only when the metric is independently verifiable.

---

## Asset Replacement

### Portrait Photo
Replace `public/photo.jpg` — referenced in `src/components/home/About.tsx`.

### Project Covers
Add images to `public/images/` matching each project's `coverImage` field.
The current components use a placeholder initial letter until real images are available.

---

## Accessibility

- Skip-to-content link (focus-visible, styled)
- Semantic landmarks: `header[role="banner"]`, `main`, `footer[role="contentinfo"]`, `nav[aria-label]`
- Heading hierarchy enforced (h1 → h2 → h3)
- All interactive elements keyboard-accessible
- Mobile menu: `aria-expanded`, `aria-controls`, `role="dialog"`, `aria-modal`
- WebGL canvas: `aria-hidden="true"` throughout — content never depends on WebGL
- `prefers-reduced-motion`: disables formation animation, marquee, scroll cues, cursor

---

## Troubleshooting

**WebGL not rendering** — The canvas gracefully degrades. HTML content always renders. Check browser WebGL support at `chrome://gpu`.

**Fonts not loading** — Google Fonts loaded via `next/font/google`. No manual font files needed.

**Build fails on TypeScript** — Run `npm run type-check` for detailed output. Test files are excluded from the main tsconfig.

**E2E tests fail** — Playwright requires the dev server running on port 3000. Run `npm run dev` in one terminal, then `npm run test:e2e` in another.

---

## Deployment

Optimized for **Vercel** (zero config). Also compatible with:
- Any Node.js host running `next start`
- Static export (`next build && next export`) if dynamic routes aren't needed

Environment variables: none required for current implementation.
