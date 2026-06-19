'use client';

/* ════════════════════════════════════════════════════════════════════════
   HERO CONSTELLATION — drifting particle field that periodically converges
   into the Khanstruct "K" monogram, then disperses. Same K geometry as the
   loader mark, so the hero reads as the *running* system the loader booted.
   • One <canvas>, 2D. Particles drift + link into a constellation; a subset
     eases toward sampled points on the K on a slow loop (drift → form → hold
     → disperse). Cursor adds gentle parallax + local repulsion.
   • Perf/UX guards: starts only after the loader hands off (introDone), pauses
     when scrolled off-screen, caps DPR, and renders a single static frame for
     reduced-motion users (no rAF).
   ════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from 'react';
import { useExperience } from '@/store/experience';
import styles from './HeroParticles.module.css';

// K monogram in a 60×76 box — identical strokes to the loader's <svg> mark.
const K_SEGMENTS: [number, number][][] = [
  [[14, 8], [14, 68]], // stem
  [[14, 42], [50, 8]], // upper diagonal
  [[14, 42], [52, 68]], // lower diagonal
];
const K_W = 60;
const K_H = 76;
const TARGET_COUNT = 64; // points sampled along the K outline

// Electric-blue → violet (loader palette) with rare lime accent sparks.
const PALETTE = ['#5b8cff', '#9cc0ff', '#9a7bff'];
const ACCENT = '#d7ff3f';

// Brighter "signal" colors for the data pulses that ride the links.
const PULSE_COLOR = '#cfe0ff';
const PULSE_ACCENT = '#eaff8f';

const CYCLE_MS = 12000; // full drift→form→hold→disperse loop
// Safety net only: the loader reliably flips introDone (≤ its 34s hard cap), so
// this just covers the loader being absent/broken — sits above that cap so we
// never spin the rAF loop underneath a still-visible loader.
const HERO_FALLBACK_MS = 35000;

const HOLO_AMP = 0.5; // ~28° peak Y-axis tilt of the formed K
const HOLO_SPEED = 0.0009; // tilt angular speed (rad/ms ⇒ ~7s wobble)
const FOCAL = 620; // perspective focal length (px) for the pseudo-3D projection
const BLOOM_MS = 750; // center light-bloom duration when the K locks in

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number; // K target (px), valid for forming particles
  ty: number;
  ti: number; // index into normalized target list
  forms: boolean;
  depth: number; // 0..1 parallax depth
  r: number;
  color: string;
  accent: boolean;
};

// A data pulse travels the edge from particle `a` to `b`, then hops onward.
type Pulse = {
  a: number;
  b: number;
  t: number; // 0..1 progress along the a→b edge
  speed: number; // px/s
  color: string;
  accent: boolean;
};

// Resolved on-screen position for a particle this frame (form lerp + parallax).
// `dz` is the Y-tilt depth (>0 toward viewer) used for holographic shading.
type RPos = { x: number; y: number; f: number; dz: number };

/** smoothstep */
const smooth = (t: number) => t * t * (3 - 2 * t);

/** Form strength across one normalized cycle [0,1): 0 = free, 1 = pinned to K. */
function formAmount(p: number): number {
  if (p < 0.3) return 0;
  if (p < 0.46) return smooth((p - 0.3) / 0.16);
  if (p < 0.74) return 1;
  if (p < 0.9) return 1 - smooth((p - 0.74) / 0.16);
  return 0;
}

/** Evenly sample TARGET_COUNT points along the K outline (normalized to box). */
function sampleK(): { nx: number; ny: number }[] {
  const segs = K_SEGMENTS.map(([a, b]) => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    return { a, dx, dy, len: Math.hypot(dx, dy) };
  });
  const total = segs.reduce((s, seg) => s + seg.len, 0);
  const pts: { nx: number; ny: number }[] = [];
  for (let i = 0; i < TARGET_COUNT; i++) {
    let d = (i / TARGET_COUNT) * total;
    for (const seg of segs) {
      if (d <= seg.len || seg === segs[segs.length - 1]) {
        const f = seg.len ? d / seg.len : 0;
        pts.push({ nx: seg.a[0] + seg.dx * f, ny: seg.a[1] + seg.dy * f });
        break;
      }
      d -= seg.len;
    }
  }
  return pts;
}

export function HeroParticles() {
  const introDone = useExperience((s) => s.introDone);
  const reducedMotionStore = useExperience((s) => s.reducedMotion);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced =
      reducedMotionStore ||
      (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    const normTargets = sampleK();
    let particles: Particle[] = [];
    let pulses: Pulse[] = [];
    let w = 0;
    let h = 0;
    let linkDist = 100;

    const pointer = { x: 0, y: 0, active: false, down: false, ox: 0, oy: 0, tox: 0, toy: 0 };
    const PARALLAX = 16;

    let raf = 0;
    let inView = true;
    let allowed = false;
    let t0 = 0;
    let last = 0;
    let fallback = 0;
    let holoAngle = 0; // current Y-tilt of the K
    let kcx = 0; // K center (px) — pivot for the tilt + bloom origin
    let kcy = 0;
    let bloomT0 = 0; // timestamp of the last lock-in bloom (0 = idle)
    let prevEfa = 0; // previous effective form amount (for lock-in edge detect)
    let assist = 0; // cursor-gravity pull, 0..1, eased

    /** Map normalized K targets onto the current canvas + assign to particles. */
    function placeTargets() {
      const box = Math.min(w, h) * 0.72;
      const scale = box / K_H;
      const offX = (w - K_W * scale) / 2;
      const offY = (h - K_H * scale) / 2;
      kcx = offX + (K_W / 2) * scale;
      kcy = offY + (K_H / 2) * scale;
      for (const p of particles) {
        if (!p.forms) continue;
        const t = normTargets[p.ti];
        p.tx = offX + t.nx * scale;
        p.ty = offY + t.ny * scale;
      }
    }

    function seed() {
      const n = Math.max(50, Math.min(130, Math.round((w * h) / 3200)));
      const formCount = Math.min(n, TARGET_COUNT); // one particle per K point
      particles = Array.from({ length: n }, (_, i) => {
        const accent = i % 13 === 0;
        const forms = i < formCount;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 14,
          vy: (Math.random() - 0.5) * 14,
          tx: 0,
          ty: 0,
          ti: i % TARGET_COUNT,
          forms,
          depth: 0.3 + Math.random() * 0.7,
          r: 0.8 + Math.random() * 1.3,
          color: accent ? ACCENT : PALETTE[i % PALETTE.length],
          accent,
        };
      });
      placeTargets();
      seedPulses();
    }

    function layout() {
      const rect = wrap!.getBoundingClientRect();
      w = Math.round(rect.width);
      h = Math.round(rect.height);
      if (w === 0 || h === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      linkDist = Math.min(w, h) * 0.2;
      if (particles.length === 0) seed();
      else {
        for (const p of particles) {
          p.x = Math.min(p.x, w);
          p.y = Math.min(p.y, h);
        }
        placeTargets();
      }
    }

    /** Resolve on-screen positions for this frame: form-lerp toward the K
        (projected through a Y-axis tilt for a holographic read) + parallax. */
    function computeR(faFn: (p: Particle) => number): RPos[] {
      const cos = Math.cos(holoAngle);
      const sin = Math.sin(holoAngle);
      return particles.map((p) => {
        const f = p.forms ? faFn(p) : 0;
        const par = 0.4 + 0.6 * p.depth;
        let tx = p.tx;
        let ty = p.ty;
        let dz = 0;
        if (p.forms) {
          // Rotate the flat mark about a vertical axis through its center,
          // then apply perspective so the near edge looms, the far edge recedes.
          const bx = p.tx - kcx;
          const by = p.ty - kcy;
          const z = bx * sin;
          const persp = FOCAL / (FOCAL - z);
          tx = kcx + bx * cos * persp;
          ty = kcy + by * persp;
          dz = z;
        }
        return {
          x: (p.forms ? p.x + (tx - p.x) * f : p.x) + pointer.ox * par,
          y: (p.forms ? p.y + (ty - p.y) * f : p.y) + pointer.oy * par,
          f,
          dz: dz * f,
        };
      });
    }

    /** Pick a node linked to `from` (within linkDist) to route a pulse onward. */
    function pickNeighbor(R: RPos[], from: number, exclude: number): number {
      const near: number[] = [];
      let best = -1;
      let bestD = Infinity;
      for (let i = 0; i < R.length; i++) {
        if (i === from || i === exclude) continue;
        const d = Math.hypot(R[i].x - R[from].x, R[i].y - R[from].y);
        if (d < linkDist) near.push(i);
        if (d < bestD) { bestD = d; best = i; }
      }
      if (near.length) return near[(Math.random() * near.length) | 0];
      return best; // nothing within linkDist — hop to the nearest node
    }

    function seedPulses() {
      const count = Math.max(4, Math.min(12, Math.round(particles.length / 14)));
      const R = computeR(() => 0);
      pulses = Array.from({ length: count }, (_, i) => {
        const a = (Math.random() * particles.length) | 0;
        const b = pickNeighbor(R, a, -1);
        const accent = i % 4 === 0;
        return {
          a,
          b: b < 0 ? (a + 1) % particles.length : b,
          t: Math.random(),
          speed: 58 + Math.random() * 55,
          color: accent ? PULSE_ACCENT : PULSE_COLOR,
          accent,
        };
      });
    }

    /** Advance each pulse along its edge; on arrival, hop to a linked neighbor. */
    function updatePulses(R: RPos[], dt: number) {
      for (const pulse of pulses) {
        const A = R[pulse.a];
        const B = R[pulse.b];
        if (!A || !B) continue;
        const len = Math.hypot(B.x - A.x, B.y - A.y) || 1;
        pulse.t += (pulse.speed * dt) / len;
        if (pulse.t >= 1) {
          pulse.t = 0;
          const next = pickNeighbor(R, pulse.b, pulse.a);
          pulse.a = pulse.b;
          pulse.b = next < 0 ? (pulse.b + 1) % particles.length : next;
        }
      }
    }

    function drawPulses(R: RPos[]) {
      for (const pulse of pulses) {
        const A = R[pulse.a];
        const B = R[pulse.b];
        if (!A || !B) continue;
        const dx = B.x - A.x;
        const dy = B.y - A.y;
        const len = Math.hypot(dx, dy) || 1;
        const hx = A.x + dx * pulse.t;
        const hy = A.y + dy * pulse.t;
        // comet trail fading back along the edge
        const trail = Math.min(18, pulse.t * len);
        const txp = hx - (dx / len) * trail;
        const typ = hy - (dy / len) * trail;
        const grad = ctx!.createLinearGradient(txp, typ, hx, hy);
        grad.addColorStop(0, 'rgba(207, 224, 255, 0)');
        grad.addColorStop(1, pulse.color);
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = 1.5;
        ctx!.beginPath();
        ctx!.moveTo(txp, typ);
        ctx!.lineTo(hx, hy);
        ctx!.stroke();
        // soft halo + bright head
        ctx!.fillStyle = pulse.color;
        ctx!.globalAlpha = 0.22;
        ctx!.beginPath();
        ctx!.arc(hx, hy, pulse.accent ? 5 : 4, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.globalAlpha = 1;
        ctx!.beginPath();
        ctx!.arc(hx, hy, pulse.accent ? 2.1 : 1.7, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
    }

    function drawScene(R: RPos[], withPulses: boolean) {
      ctx!.clearRect(0, 0, w, h);

      // Constellation links — brighter where the K is forming.
      ctx!.lineWidth = 1;
      for (let i = 0; i < R.length; i++) {
        for (let j = i + 1; j < R.length; j++) {
          const dx = R[i].x - R[j].x;
          const dy = R[i].y - R[j].y;
          const d = Math.hypot(dx, dy);
          if (d >= linkDist) continue;
          const boost = 0.55 + 0.45 * Math.max(R[i].f, R[j].f);
          const a = (1 - d / linkDist) * 0.5 * boost;
          ctx!.strokeStyle = `rgba(124, 162, 255, ${a.toFixed(3)})`;
          ctx!.beginPath();
          ctx!.moveTo(R[i].x, R[i].y);
          ctx!.lineTo(R[j].x, R[j].y);
          ctx!.stroke();
        }
      }

      // Nodes — grow + brighten as they lock into the K; the near side of the
      // tilt reads larger/brighter than the far side for a sense of depth.
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const f = R[i].f;
        const depth = Math.max(0.6, Math.min(1.4, 1 + 0.5 * (R[i].dz / 80)));
        const r = p.r * (1 + 0.5 * f) * depth;
        if (p.accent) {
          ctx!.globalAlpha = Math.min(1, (0.12 + 0.18 * f) * depth);
          ctx!.fillStyle = p.color;
          ctx!.beginPath();
          ctx!.arc(R[i].x, R[i].y, r * 4, 0, Math.PI * 2);
          ctx!.fill();
        }
        ctx!.globalAlpha = Math.min(1, (0.7 + 0.3 * f) * depth);
        ctx!.fillStyle = p.color;
        ctx!.beginPath();
        ctx!.arc(R[i].x, R[i].y, r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;

      // Data signals riding the links (drawn on top of nodes).
      if (withPulses) drawPulses(R);
    }

    /** Soft additive light-bloom from the K center, fired the moment it locks
        in — the same "burst" beat as the loader, scaled down. */
    function drawBloom(now: number) {
      if (!bloomT0) return;
      const e = now - bloomT0;
      if (e >= BLOOM_MS) {
        bloomT0 = 0;
        return;
      }
      const prog = e / BLOOM_MS;
      const radius = Math.min(w, h) * (0.1 + prog * 0.45);
      const alpha = (1 - prog) * 0.55;
      ctx!.save();
      ctx!.globalCompositeOperation = 'lighter';
      const g = ctx!.createRadialGradient(kcx, kcy, 0, kcx, kcy, radius);
      g.addColorStop(0, `rgba(190, 212, 255, ${alpha.toFixed(3)})`);
      g.addColorStop(0.45, `rgba(120, 160, 255, ${(alpha * 0.4).toFixed(3)})`);
      g.addColorStop(1, 'rgba(120, 160, 255, 0)');
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, w, h);
      ctx!.restore();
    }

    function step(now: number) {
      if (!t0) t0 = now;
      const dt = Math.min((now - (last || now)) / 1000, 0.05);
      last = now;
      const phase = ((now - t0) % CYCLE_MS) / CYCLE_MS;
      const fa = formAmount(phase);

      // Cursor gravity: holding pulls the K together early, overriding the timer.
      const aTarget = pointer.down ? 1 : 0;
      assist += (aTarget - assist) * 0.08;
      if (aTarget === 1 && assist > 0.995) assist = 1;
      else if (aTarget === 0 && assist < 0.005) assist = 0;
      const efa = Math.max(fa, assist); // effective form amount

      // Fire the center bloom the instant the K locks in (via timer or hold).
      if (prevEfa < 1 && efa >= 1) bloomT0 = now;
      prevEfa = efa;

      // Holographic Y-axis tilt — gentle continuous wobble (drives computeR).
      holoAngle = Math.sin(now * HOLO_SPEED) * HOLO_AMP;

      // Ease parallax offset toward target.
      pointer.ox += (pointer.tox - pointer.ox) * 0.06;
      pointer.oy += (pointer.toy - pointer.oy) * 0.06;

      for (const p of particles) {
        // gentle wander
        p.vx += (Math.random() - 0.5) * 6 * dt;
        p.vy += (Math.random() - 0.5) * 6 * dt;
        // cursor repulsion (only matters while loosely drifting)
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          const RAD = 110;
          if (d2 < RAD * RAD) {
            const d = Math.sqrt(d2) || 1;
            const force = (1 - d / RAD) * 240 * (1 - efa);
            p.vx += (dx / d) * force * dt;
            p.vy += (dy / d) * force * dt;
          }
        }
        // clamp speed
        const sp = Math.hypot(p.vx, p.vy);
        const MAX = 26;
        if (sp > MAX) {
          p.vx = (p.vx / sp) * MAX;
          p.vy = (p.vy / sp) * MAX;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        // soft bounce at edges
        if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); }
        else if (p.x > w) { p.x = w; p.vx = -Math.abs(p.vx); }
        if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); }
        else if (p.y > h) { p.y = h; p.vy = -Math.abs(p.vy); }
      }

      const R = computeR(() => efa);
      updatePulses(R, dt);
      drawScene(R, true);
      drawBloom(now);
      raf = requestAnimationFrame(step);
    }

    function startLoop() {
      if (raf || !inView || !allowed || reduced) return;
      last = 0;
      raf = requestAnimationFrame(step);
    }
    function stopLoop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    layout();

    if (reduced) {
      // Static "formed K" frame — calm, no animation, no pulses.
      setVisible(true);
      drawScene(computeR(() => 1), false);
    } else {
      const begin = () => {
        if (allowed) return;
        allowed = true;
        setVisible(true);
        startLoop();
      };
      if (introDone) begin();
      else fallback = window.setTimeout(begin, HERO_FALLBACK_MS);

      const onMove = (e: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        pointer.x = e.clientX - rect.left;
        pointer.y = e.clientY - rect.top;
        pointer.active = pointer.x >= 0 && pointer.x <= w && pointer.y >= 0 && pointer.y <= h;
        pointer.tox = (pointer.x / w - 0.5) * PARALLAX;
        pointer.toy = (pointer.y / h - 0.5) * PARALLAX;
      };
      const onLeave = () => {
        pointer.active = false;
        pointer.tox = 0;
        pointer.toy = 0;
      };
      const onDown = () => { pointer.down = true; };
      const onUp = () => { pointer.down = false; };
      window.addEventListener('pointermove', onMove, { passive: true });
      canvas.addEventListener('pointerleave', onLeave);
      canvas.addEventListener('pointerdown', onDown);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);

      const io = new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting;
          if (inView) startLoop();
          else stopLoop();
        },
        { threshold: 0 },
      );
      io.observe(canvas);

      const ro = new ResizeObserver(() => layout());
      ro.observe(wrap);

      return () => {
        stopLoop();
        window.clearTimeout(fallback);
        window.removeEventListener('pointermove', onMove);
        canvas.removeEventListener('pointerleave', onLeave);
        canvas.removeEventListener('pointerdown', onDown);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        io.disconnect();
        ro.disconnect();
      };
    }

    // Reduced-motion: still re-fit + redraw on resize (no loop).
    const ro = new ResizeObserver(() => {
      layout();
      drawScene(computeR(() => 1), false);
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [introDone, reducedMotionStore]);

  return (
    <div
      ref={wrapRef}
      className={`${styles.wrap} ${visible ? styles.visible : ''}`}
      aria-hidden="true"
    >
      <div className={styles.backdrop} />
      <canvas ref={canvasRef} className={styles.canvas} />
      <span className={styles.tag}>K · SYSTEM</span>
    </div>
  );
}
