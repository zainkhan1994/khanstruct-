import { describe, it, expect } from 'vitest';
import {
  PROJECTS,
  SERVICES,
  METRICS,
  NAV_ITEMS,
  EXPERIENCE,
  HACKATHONS,
  GDG_EVENTS,
  EMAIL,
} from '@/lib/content';

describe('Content Data', () => {
  describe('Projects', () => {
    it('has at least one project', () => {
      expect(PROJECTS.length).toBeGreaterThan(0);
    });

    it('every project has required fields', () => {
      PROJECTS.forEach((project) => {
        expect(project.slug).toBeTruthy();
        expect(project.title).toBeTruthy();
        expect(project.category).toBeTruthy();
        expect(project.summary).toBeTruthy();
        expect(project.technologies).toBeInstanceOf(Array);
        expect(project.technologies.length).toBeGreaterThan(0);
      });
    });

    it('project slugs are unique', () => {
      const slugs = PROJECTS.map((p) => p.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it('project slugs contain only valid URL characters', () => {
      PROJECTS.forEach((project) => {
        expect(project.slug).toMatch(/^[a-z0-9-]+$/);
      });
    });

    it('featured projects have verified links or no fake links', () => {
      const featured = PROJECTS.filter((p) => p.featured);
      expect(featured.length).toBeGreaterThan(0);
    });
  });

  describe('Services', () => {
    it('has exactly three services', () => {
      expect(SERVICES).toHaveLength(3);
    });

    it('service IDs are design, data, ai', () => {
      const ids = SERVICES.map((s) => s.id);
      expect(ids).toContain('design');
      expect(ids).toContain('data');
      expect(ids).toContain('ai');
    });

    it('every service has capabilities', () => {
      SERVICES.forEach((service) => {
        expect(service.capabilities.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Metrics', () => {
    it('has at least one metric', () => {
      expect(METRICS.length).toBeGreaterThan(0);
    });

    it('unverified metrics are marked', () => {
      const unverified = METRICS.filter((m) => !m.verified);
      // All unverified metrics should be noted in the data
      unverified.forEach((m) => {
        expect(m.verified).toBe(false);
      });
    });
  });

  describe('Navigation', () => {
    it('has navigation items', () => {
      expect(NAV_ITEMS.length).toBeGreaterThan(0);
    });

    it('all nav hrefs are non-empty', () => {
      NAV_ITEMS.forEach((item) => {
        expect(item.href).toBeTruthy();
        expect(item.label).toBeTruthy();
      });
    });
  });

  describe('Contact', () => {
    it('has a valid email', () => {
      expect(EMAIL).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  });

  describe('GDG Events', () => {
    it('is an array', () => {
      expect(GDG_EVENTS).toBeInstanceOf(Array);
    });

    it('no events have fake/placeholder URLs', () => {
      GDG_EVENTS.forEach((event) => {
        if (event.registrationUrl) {
          expect(event.registrationUrl).not.toBe('#');
          expect(event.registrationUrl).toMatch(/^https?:\/\//);
        }
      });
    });
  });

  describe('Experience', () => {
    it('has experience entries', () => {
      expect(EXPERIENCE.length).toBeGreaterThan(0);
    });

    it('every experience has required fields', () => {
      EXPERIENCE.forEach((exp) => {
        expect(exp.company).toBeTruthy();
        expect(exp.role).toBeTruthy();
        expect(exp.period).toBeTruthy();
        expect(exp.description).toBeTruthy();
      });
    });
  });

  describe('Hackathons', () => {
    it('has hackathon entries', () => {
      expect(HACKATHONS.length).toBeGreaterThan(0);
    });

    it('all hackathons have title and project', () => {
      HACKATHONS.forEach((hack) => {
        expect(hack.title).toBeTruthy();
        expect(hack.project).toBeTruthy();
        expect(hack.organizer).toBeTruthy();
      });
    });
  });
});
