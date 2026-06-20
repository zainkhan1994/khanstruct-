import { create } from 'zustand';
import type { ExperienceState, ExperienceSection, QualityTier, RouteTransition } from '@/lib/types';

interface ExperienceStore extends ExperienceState {
  setActiveSection: (section: ExperienceSection) => void;
  setSectionProgress: (progress: number) => void;
  setPageProgress: (progress: number) => void;
  setPointer: (x: number, y: number) => void;
  setRouteTransition: (transition: RouteTransition) => void;
  setReducedMotion: (reduced: boolean) => void;
  setQuality: (quality: QualityTier) => void;
  setWebglAvailable: (available: boolean) => void;
  setEarthFormed: (formed: boolean) => void;
  setActiveService: (service: 'design' | 'data' | 'ai' | null) => void;
  setIntroDone: (done: boolean) => void;
  // Hero gravity-well core: present by default; the header logo toggles it.
  corePresent: boolean;
  toggleCore: () => void;
}

export const useExperience = create<ExperienceStore>((set) => ({
  activeSection: 'hero',
  sectionProgress: 0,
  pageProgress: 0,
  pointer: { x: 0, y: 0 },
  routeTransition: 'idle',
  reducedMotion: false,
  quality: 'high',
  webglAvailable: true,
  earthFormed: false,
  activeService: null,
  introDone: false,
  corePresent: true,

  setActiveSection: (section) => set({ activeSection: section }),
  setSectionProgress: (progress) => set({ sectionProgress: progress }),
  setPageProgress: (progress) => set({ pageProgress: progress }),
  setPointer: (x, y) => set({ pointer: { x, y } }),
  setRouteTransition: (transition) => set({ routeTransition: transition }),
  setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
  setQuality: (quality) => set({ quality }),
  setWebglAvailable: (available) => set({ webglAvailable: available }),
  setEarthFormed: (formed) => set({ earthFormed: formed }),
  setActiveService: (service) => set({ activeService: service }),
  setIntroDone: (done) => set({ introDone: done }),
  toggleCore: () => set((s) => ({ corePresent: !s.corePresent })),
}));
