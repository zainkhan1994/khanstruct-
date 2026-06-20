'use client';

/* ════════════════════════════════════════════════════════════════════════
   SYSTEM INITIALIZATION — Khanstruct loader (orchestration)
   ────────────────────────────────────────────────────────────────────────
   Readiness-driven flow with an honest, continuously-easing percentage:
     preloadCriticalAssets() (fonts + paint) runs in parallel with a short
     brand cinematic. The bar eases toward 100 a little EVERY tick — never
     stepped, never frozen — and only completes once assets are ready AND the
     cinematic has played its minimum time → completeLoader() → store.introDone
     → runHeroEntrance() (in Hero.tsx).
   • The cinematic always plays for MIN_INTRO_MS (~5.5s) so the discipline +
     brand reveal is seen; a hard MAX_LOCK_MS cap guarantees it can never stick.
   • Reduced-motion gets a static mark + System Ready and a quick handoff.
   ════════════════════════════════════════════════════════════════════════ */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useExperience } from '@/store/experience';
import styles from './SiteLoader.module.css';

const MAX_LOCK_MS = 12000; // safety net: the loader can never hold the page past this

// Reduced-motion users get a short static intro instead of the cinematic.
// Everyone else — first visit OR refresh — runs the full brand cinematic, so a
// reload replays the same boot (no sessionStorage "seen" shortcut).
const TARGET_MS = { reduced: 600 };

// Minimum on-screen time for the full cinematic, kept in sync with the CSS
// reveal timeline (SiteLoader.module.css) so the disciplines + brand finish
// drawing before the loader may exit. The percentage is NOT stepped to this —
// it eases continuously (see `tick`) so it always reads as actively loading.
const MIN_INTRO_MS = 5400;

// Continuous progress easing. Every tick nudges the bar a fraction of the way
// toward 100, so it never plateaus or jumps a chunk at once — it decelerates
// naturally like a real download settling. A gentle creep while we wait for
// real assets + the minimum cinematic time, then a brisk glide to 100 once both
// are satisfied. Tuned against the ~60ms tick cadence below.
const EASE_WAIT = 0.02; // decelerating creep → high-80s% by MIN_INTRO_MS, always moving
const EASE_DONE = 0.16; // ~1s glide up to 100 once assets are ready
const WAIT_CEIL = 96; // honest cap: the bar never nears 100 until assets truly are ready

type LoaderMode = 'full' | 'reduced';
type LoaderPhase = 'boot' | 'intro' | 'exit';

/** matchMedia guarded for SSR. */
function mq(query: string): boolean {
  return typeof window !== 'undefined' && window.matchMedia(query).matches;
}

/** Human-readable loading status for a given progress percentage. */
function statusFor(pct: number): string {
  if (pct >= 100) return 'System Ready';
  if (pct >= 82) return 'Calibrating Interface';
  if (pct >= 60) return 'Loading AI Modules';
  if (pct >= 42) return 'Loading Data Modules';
  if (pct >= 20) return 'Loading Design Modules';
  return 'Initializing System';
}

export function SiteLoader() {
  const setIntroDone = useExperience((s) => s.setIntroDone);

  const [mounted, setMounted] = useState(true);
  const [mode, setMode] = useState<LoaderMode>('full');
  const [phase, setPhase] = useState<LoaderPhase>('boot');
  const [isMobile, setIsMobile] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const srRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const msgRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  /* ── Decide mode + lock scroll BEFORE first paint (no flash of "boot"). ── */
  useLayoutEffect(() => {
    const reduced = mq('(prefers-reduced-motion: reduce)');
    const small = mq('(max-width: 640px)');

    setIsMobile(small);
    setMode(reduced ? 'reduced' : 'full');
    setPhase('intro');
    setHydrated(true);

    // Scroll + interaction lock. scrollbar-gutter (globals) keeps width stable
    // so restoring scroll causes no horizontal jump.
    document.documentElement.classList.add('loader-active');
    document.body.classList.add('is-loading');

    // Controlled focus: park focus on the (non-trapping) loader region so
    // keyboard/SR users start at the announcement, not hidden page content.
    rootRef.current?.focus({ preventScroll: true });
  }, []);

  /* ── Orchestrate a progress-driven boot the user can watch. Each effect run
        owns its own controller so StrictMode's dev double-invoke restarts. ── */
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const timers: number[] = [];
    let interval = 0;

    const reduced = mq('(prefers-reduced-motion: reduce)');
    const small = mq('(max-width: 640px)');
    const resolvedMode: LoaderMode = reduced ? 'reduced' : 'full';

    // Mirror the CSS --sp speed multiplier so JS exit timing matches the wipe.
    const sp = small ? 0.9 : 1.0;
    const targetMs = resolvedMode === 'full' ? MIN_INTRO_MS : TARGET_MS.reduced;
    // Full mode uses the slow cinematic wipe (sp-scaled); reduced motion keeps
    // a short snappy exit so those users aren't held up.
    const exitMs = resolvedMode === 'full' ? Math.round(900 * sp) : 380;

    const start = typeof performance !== 'undefined' ? performance.now() : 0;
    const nowMs = () => (typeof performance !== 'undefined' ? performance.now() : start);

    /** Real readiness — fonts + a paint frame. Gates true completion so the
        percentage never reaches 100% before the page can actually appear. */
    const preloadCriticalAssets = (): Promise<void> => {
      const tasks: Promise<unknown>[] = [];
      if (typeof document !== 'undefined' && 'fonts' in document) {
        tasks.push(document.fonts.ready.catch(() => undefined));
      }
      tasks.push(
        new Promise<void>((res) =>
          requestAnimationFrame(() => requestAnimationFrame(() => res())),
        ),
      );
      if (typeof document !== 'undefined') {
        document
          .querySelectorAll<HTMLImageElement>('img[data-critical]')
          .forEach((img) => {
            if (img.decode) tasks.push(img.decode().catch(() => undefined));
          });
      }
      // Soft cap so a hung resource never holds the bar below 100% forever.
      const softCap = new Promise<void>((res) => window.setTimeout(res, 3000));
      return Promise.race([Promise.all(tasks).then(() => undefined), softCap]);
    };

    let assetsReady = false;
    preloadCriticalAssets().then(() => {
      assetsReady = true;
    });

    /** Restore the page: unlock scroll, return focus, drop the loader. */
    const completeLoader = () => {
      document.documentElement.classList.remove('loader-active');
      document.body.classList.remove('is-loading');
      const main = document.getElementById('main-content');
      if (main) {
        try {
          main.focus({ preventScroll: true });
        } catch {
          main.focus();
        }
      }
      setMounted(false);
    };

    // Hard safety net: force the page open at MAX_LOCK_MS no matter what.
    const hardStop = window.setTimeout(() => {
      controller.abort();
      window.clearInterval(interval);
      setIntroDone(true);
      setPhase('exit');
      timers.push(window.setTimeout(completeLoader, exitMs));
    }, MAX_LOCK_MS);

    // Imperative updates — avoids re-rendering the whole loader every tick.
    const paint = (pct: number) => {
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${pct / 100})`;
      if (pctRef.current) pctRef.current.textContent = `${Math.round(pct)}%`;
    };
    let lastMsg = '';
    const announce = (pct: number) => {
      const m = statusFor(pct);
      if (m === lastMsg) return;
      lastMsg = m;
      if (msgRef.current) msgRef.current.textContent = m;
      if (srRef.current) srRef.current.textContent = `${m}.`; // SR live region
    };

    let exited = false;
    const beginExit = () => {
      if (exited || signal.aborted) return;
      exited = true;
      window.clearInterval(interval);
      paint(100);
      announce(100);
      dotRef.current?.classList.add(styles.barDotReady);
      setPhase('exit');
      // Hero entrance begins as the panels part (no flash, single run).
      timers.push(window.setTimeout(() => setIntroDone(true), Math.round(120 * sp)));
      timers.push(
        window.setTimeout(() => {
          window.clearTimeout(hardStop);
          completeLoader();
        }, exitMs),
      );
    };

    let shown = 0; // current displayed %, eased continuously (never reset/jumped)
    const tick = () => {
      if (signal.aborted) return;
      const elapsed = nowMs() - start;

      if (resolvedMode === 'full') {
        // Hand off only once real assets are ready AND the cinematic has had its
        // minimum screen time — then glide briskly; until then, creep gently so
        // the bar is always visibly moving (no plateau, no frozen feel).
        const ready = assetsReady && elapsed >= MIN_INTRO_MS;
        shown += (100 - shown) * (ready ? EASE_DONE : EASE_WAIT);
        if (!ready) shown = Math.min(shown, WAIT_CEIL); // honest: not near-100 till ready
        else if (shown > 99.4) shown = 100; // snap the final hair so we can exit
      } else {
        shown = (elapsed / targetMs) * 100; // reduced motion: quick linear fill
      }

      shown = Math.max(0, Math.min(100, shown));
      paint(shown);
      announce(shown);
      if (shown >= 100) beginExit();
    };

    interval = window.setInterval(tick, 60);
    tick();

    return () => {
      controller.abort();
      window.clearInterval(interval);
      window.clearTimeout(hardStop);
      timers.forEach((t) => window.clearTimeout(t));
      // If torn down mid-run, never leave the page locked.
      document.documentElement.classList.remove('loader-active');
      document.body.classList.remove('is-loading');
    };
  }, [setIntroDone]);

  if (!mounted) return null;

  return (
    <div
      ref={rootRef}
      id="site-loader"
      className={styles.loader}
      data-mode={mode}
      data-phase={phase}
      data-mobile={isMobile ? 'true' : 'false'}
      data-hydrated={hydrated ? 'true' : 'false'}
      role="status"
      aria-live="polite"
      aria-label="Loading Khanstruct"
      tabIndex={-1}
    >
      <span ref={srRef} className={styles.srOnly}>
        Loading Khanstruct — initializing system.
      </span>

      {/* Split-wipe panels — the deep-black background that parts on exit */}
      <div className={`${styles.panel} ${styles.panelTop}`} aria-hidden="true" />
      <div className={`${styles.panel} ${styles.panelBottom}`} aria-hidden="true" />

      {/* Texture */}
      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      {/* Light bloom that flares from center on exit — the "enter" flash */}
      <div className={styles.burst} aria-hidden="true" />

      {/* Thin electric-blue architectural lines */}
      <svg
        className={styles.architecture}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line className={styles.archLine} x1="50" y1="6" x2="50" y2="94" />
        <rect className={styles.archLine} x="8" y="10" width="84" height="80" fill="none" />
        {/* corner ticks */}
        <line className={styles.archTick} x1="8" y1="16" x2="14" y2="16" />
        <line className={styles.archTick} x1="92" y1="16" x2="86" y2="16" />
        <line className={styles.archTick} x1="8" y1="84" x2="14" y2="84" />
        <line className={styles.archTick} x1="92" y1="84" x2="86" y2="84" />
        {/* measurement ticks */}
        <line className={styles.archTick} x1="38" y1="10" x2="38" y2="13" />
        <line className={styles.archTick} x1="62" y1="10" x2="62" y2="13" />
      </svg>

      {/* Timed content */}
      <div className={styles.stage} aria-hidden="true">
        {/* persistent spine + signal */}
        <div className={styles.spine} />
        <div className={styles.signalPoint} />
        <p className={styles.sysLabel}>
          Khanstruct<span className={styles.sep}>/</span>
          <span className={styles.muted}>System Initialization</span>
        </p>

        {/* Stage 2 — disciplines */}
        <div className={`${styles.stageLayer}`}>
          <div className={styles.disciplines}>
            <div className={styles.discipline} data-k="design">
              <span className={styles.branch} />
              <span className={styles.branchDot} />
              <span className={styles.word}>DESIGN</span>
              <span className={styles.descriptor}>
                <b>Interface</b> / Brand / Experience
              </span>
            </div>
            <div className={styles.discipline} data-k="data">
              <span className={styles.branch} />
              <span className={styles.branchDot} />
              <span className={styles.word}>DATA</span>
              <span className={styles.descriptor}>
                <b>Pipelines</b> / Structure / Insight
              </span>
            </div>
            <div className={styles.discipline} data-k="ai">
              <span className={styles.branch} />
              <span className={styles.branchDot} />
              <span className={styles.word}>AI</span>
              <span className={styles.descriptor}>
                <b>Agents</b> / Automation / Intelligence
              </span>
            </div>
          </div>
        </div>

        {/* Stage 3 — assembly */}
        <div className={`${styles.stageLayer} ${styles.markWrap}`}>
          <svg className={styles.kmark} viewBox="0 0 60 76" aria-hidden="true">
            <path className={styles.kStroke} pathLength={1} d="M14 8 L14 68" />
            <path className={styles.kStroke} pathLength={1} d="M14 42 L50 8" />
            <path className={styles.kStroke} pathLength={1} d="M14 42 L52 68" />
            <circle className={styles.kJoint} cx="14" cy="42" r="3.4" />
          </svg>
          <h1 className={styles.brand}>KHANSTRUCT</h1>
          <p className={styles.tagline}>
            DESIGN<span className={styles.dotsep}>·</span>DATA
            <span className={styles.dotsep}>·</span>AI
          </p>
        </div>
      </div>

      {/* Live loading status — visible the entire boot (progress is real:
          time-based but gated so it can't hit 100% before assets are ready) */}
      <div className={styles.statusBar} aria-hidden="true">
        <span ref={dotRef} className={styles.barDot} />
        <span ref={msgRef} className={styles.barMsg}>
          Initializing System
        </span>
        <span className={styles.progressTrack}>
          <span ref={fillRef} className={styles.progressFill} />
        </span>
        <span ref={pctRef} className={styles.progressPct}>
          0%
        </span>
      </div>
    </div>
  );
}
