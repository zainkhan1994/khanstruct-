'use client';

import { useEffect } from 'react';
import { useExperience } from '@/store/experience';

interface ExperienceProviderProps {
  children: React.ReactNode;
}

/**
 * Lightweight global provider. The heavy WebGL/earth visuals were removed in
 * favor of static SVG, so this only syncs the user's reduced-motion preference.
 */
export function ExperienceProvider({ children }: ExperienceProviderProps) {
  const { setReducedMotion } = useExperience();

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [setReducedMotion]);

  return <>{children}</>;
}
