'use client';

/* ════════════════════════════════════════════════════════════════════════
   GRAVITY-WELL FABRIC — a soft, grid-patterned surface (a "spacetime sheet")
   that deforms under the mass of the spheres resting on it.
   • A big glowing NUCLEUS (core) sits at centre; eight LARGE spheres ring it,
     each sinking the sheet into a well. Distant spheres glow like real light
     sources to convey depth; every sphere casts a ground shadow.
   • SMALL spheres shuttle at a constant, fluid speed: they emerge from a large
     sphere (never drawn while inside it), travel to the core, are held ~1s, then
     return to the same large sphere. The surface compresses along each path.
   • Hovering the core branches out the five representative stacks.
   • The header "Khanstruct" logo toggles the core: it fades out, and on the next
     click gently drops back in from above. While the core is absent, the smalls
     stream straight off into the distance and fade away.
   • Large spheres toggle ACTIVE/INACTIVE on click (inactive = dim "off" colour).
     Reactivating one sequentially re-launches its three smalls.
   • Camera tilt is scroll-driven (~45° → near-horizontal). Reduced-motion gets a
     single static frame.
   ════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from 'react';
import { useExperience } from '@/store/experience';
import styles from './HeroParticles.module.css';

const DEG = Math.PI / 180;

// Broad, long panoramic sheet (a "judan" — a long bolt of flowing silk).
const COLS = 64;
const ROWS = 20;
const PLANE_X = 4.3;
const PLANE_Z = 1.25;

const WELL_DEPTH = 0.48;
const FOCAL = 2.7;

const TILT_START = 45;
const TILT_END = 7;

// Shuttle: constant world-units/second (slow + fluid).
const SMALL_SPEED = 0.45;
const FLYOFF_SPEED = 0.4;
const CORE_HOLD = 1.0;
const DROP_HEIGHT = 1.7; // core falls in from this height

const SMALL_R = 0.05;
const FALLBACK_MS = 35000;

// Five representative stacks, branched from the core on hover.
const CORE_STACKS = ['Gemini', 'Claude', 'React', 'Python', 'Cloud Run'];

type Nucleus = { x: number; z: number; m: number; r: number; infl: number };
type Large = { x: number; z: number; m: number; r: number; infl: number; active: boolean };
// state: 0 = outbound, 1 = in core, 2 = inbound, 3 = resting at home.
type Small = {
  home: number;
  idx: number;
  state: 0 | 1 | 2 | 3;
  far: boolean; // this leg streams off into the distance (no core)
  tx: number; // target plane x for the current outbound leg
  tz: number;
  legDist: number;
  t: number;
  timer: number;
  nextRest: number; // randomised wait before the next launch
  rscale: number; // visual radius scale (shrinks as a fly-off sphere recedes)
  x: number;
  z: number;
  alpha: number; // visibility 0..1 (also scales its surface dimple)
};

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

    let w = 0;
    let h = 0;
    let scale = 1;
    let cx = 0;
    let cy = 0;

    const N = COLS * ROWS;
    const sxBuf = new Float32Array(N);
    const syBuf = new Float32Array(N);
    const dipBuf = new Float32Array(N);
    const perspBuf = new Float32Array(N);

    let nucleus: Nucleus = { x: 0, z: -0.04, m: 1.15, r: 0.26, infl: 0.72 };
    let larges: Large[] = [];
    let smalls: Small[] = [];

    // Transient burst particles — spawned by tapping a large sphere while the
    // core is absent. They scatter outward in random directions, recede + fade
    // like the fly-off smalls, then are removed. The tap count + tapping speed
    // decide how many spawn per tap.
    type Burst = {
      x: number; z: number; dx: number; dz: number;
      speed: number; age: number; life: number; alpha: number; rscale: number;
    };
    let bursts: Burst[] = [];
    let lastTapAt = 0;

    let largeScreen: ({ sx: number; sy: number; r: number } | null)[] = [];
    let coreScreen: { sx: number; sy: number; r: number } | null = null;
    let hoverLarge = -1;
    let hoverCore = false;
    let hoverCoreAmt = 0;

    // Core presence (driven by the store) + drop-in animation.
    let coreTargetPresent = useExperience.getState().corePresent;
    const unsubCore = useExperience.subscribe((s) => { coreTargetPresent = s.corePresent; });
    let coreShown = coreTargetPresent;
    let coreAlpha = coreTargetPresent ? 1 : 0;
    let coreDrop = 0; // world-y offset above the rest position

    let curA = TILT_START * DEG;
    let targetA = TILT_START * DEG;
    let scrollProgress = 0;
    let parX = 0;
    let parTarget = 0;
    let tSec = 0; // elapsed seconds — drives the flowing silk ripple

    let raf = 0;
    let inView = true;
    let allowed = false;
    let last = 0;
    let fallback = 0;

    function seed() {
      nucleus = { x: 0, z: -0.04, m: 1.15, r: 0.26, infl: 0.72 };
      const def: [number, number, number, number][] = [
        [-3.8, 0.42, 0.48, 0.106], // near, far-left
        [-2.4, -0.55, 0.42, 0.094], // far, left   → distant
        [-1.0, 0.52, 0.4, 0.09], // near, mid-left
        [1.1, 0.5, 0.44, 0.098], // near, mid-right
        [2.5, -0.55, 0.42, 0.094], // far, right   → distant
        [3.8, 0.42, 0.46, 0.1], // near, far-right
        [0.3, -0.82, 0.4, 0.09], // far, centre-back → distant
      ];
      larges = def.map(([x, z, m, r]) => ({ x, z, m, r, infl: 0.46, active: true }));
      largeScreen = new Array(larges.length).fill(null);
      smalls = [];
      for (let li = 0; li < larges.length; li++) {
        for (let k = 0; k < 3; k++) {
          smalls.push({
            home: li,
            idx: k,
            state: 3,
            far: false,
            tx: 0,
            tz: 0,
            legDist: 1,
            t: 0,
            timer: 0,
            nextRest: Math.random() * 3.0, // random initial launch time
            rscale: 1,
            x: larges[li].x,
            z: larges[li].z,
            alpha: 0,
          });
        }
      }
    }

    function surfaceY(x: number, z: number): number {
      // Gentle all-over undulation so the whole sheet flows like silk.
      let y =
        0.055 * Math.sin(x * 1.0 + tSec * 0.4) +
        0.04 * Math.sin(z * 1.7 - x * 0.45 + tSec * 0.31) +
        0.03 * Math.sin(x * 2.1 + z * 1.1 - tSec * 0.24);
      let dx = x - nucleus.x;
      let dz = z - nucleus.z;
      const coreWell = coreAlpha * (1 - Math.min(1, coreDrop / DROP_HEIGHT));
      y -= coreWell * (WELL_DEPTH * nucleus.m) / (1 + (dx * dx + dz * dz) / (nucleus.infl * nucleus.infl));
      for (let i = 0; i < larges.length; i++) {
        const L = larges[i];
        dx = x - L.x;
        dz = z - L.z;
        y -= (WELL_DEPTH * L.m) / (1 + (dx * dx + dz * dz) / (L.infl * L.infl));
      }
      for (let i = 0; i < smalls.length; i++) {
        const s = smalls[i];
        if (s.alpha <= 0.01) continue;
        dx = x - s.x;
        dz = z - s.z;
        y -= (WELL_DEPTH * 0.18 * s.alpha) / (1 + (dx * dx + dz * dz) / (0.34 * 0.34));
      }
      for (let i = 0; i < bursts.length; i++) {
        const b = bursts[i];
        if (b.alpha <= 0.02) continue;
        dx = x - b.x;
        dz = z - b.z;
        y -= (WELL_DEPTH * 0.16 * b.alpha) / (1 + (dx * dx + dz * dz) / (0.32 * 0.32));
      }
      return y;
    }

    function project(x: number, y: number, z: number, sinA: number, cosA: number) {
      const ry = y * cosA - z * sinA;
      const rz = y * sinA + z * cosA;
      const persp = FOCAL / (FOCAL - rz);
      return { sx: cx + x * persp * scale + parX, sy: cy - ry * persp * scale, persp };
    }

    function layout() {
      const rect = wrap!.getBoundingClientRect();
      w = Math.round(rect.width);
      h = Math.round(rect.height);
      if (w === 0 || h === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Fill the broad band, letting the grid bleed off all four edges.
      scale = Math.min(w * 0.3, h * 0.55);
      cx = w / 2;
      cy = h * 0.42;
      if (larges.length === 0) seed();
    }

    function updateScroll() {
      const vh = window.innerHeight || 800;
      scrollProgress = Math.max(0, Math.min(1, (window.scrollY || 0) / (vh * 0.92)));
      targetA = (TILT_START - (TILT_START - TILT_END) * scrollProgress) * DEG;
    }

    const randRest = () => 0.4 + Math.random() * 2.2; // random gap before next launch

    function launch(s: Small, coreOn: boolean) {
      const home = larges[s.home];
      s.far = !coreOn;
      if (s.far) {
        // no core → fly off in a random direction and recede into the distance
        const ang = Math.random() * Math.PI * 2;
        const dist = 2.2;
        s.tx = home.x + Math.cos(ang) * dist;
        s.tz = home.z + Math.sin(ang) * dist;
      } else {
        s.tx = nucleus.x;
        s.tz = nucleus.z;
      }
      s.legDist = Math.hypot(s.tx - home.x, s.tz - home.z) || 1;
      s.state = 0;
      s.t = 0;
    }

    function stepSmalls(dt: number) {
      const coreOn = coreAlpha > 0.5;
      for (let i = 0; i < smalls.length; i++) {
        const s = smalls[i];
        const home = larges[s.home];
        const spd = (s.far ? FLYOFF_SPEED : SMALL_SPEED);

        if (s.state === 0) {
          s.t += (spd * dt) / s.legDist;
          if (s.t >= 1) {
            s.t = 1;
            if (s.far) { s.state = 3; s.timer = 0; s.nextRest = randRest(); } // streamed away → respawn
            else { s.state = 1; s.timer = 0; }
          }
        } else if (s.state === 1) {
          if (!coreOn) { s.state = 2; s.t = 0; }
          else { s.timer += dt; if (s.timer >= CORE_HOLD) { s.state = 2; s.t = 0; } }
        } else if (s.state === 2) {
          s.t += (SMALL_SPEED * dt) / s.legDist;
          if (s.t >= 1) { s.t = 1; s.state = 3; s.timer = 0; s.nextRest = randRest(); }
        } else {
          s.timer += dt;
          if (home.active && s.timer >= s.nextRest) launch(s, coreOn);
        }

        // resolve plane position (constant speed → linear interpolation)
        if (s.state === 0) {
          s.x = home.x + (s.tx - home.x) * s.t;
          s.z = home.z + (s.tz - home.z) * s.t;
        } else if (s.state === 1) {
          s.x = nucleus.x; s.z = nucleus.z;
        } else if (s.state === 2) {
          s.x = nucleus.x + (home.x - nucleus.x) * s.t;
          s.z = nucleus.z + (home.z - nucleus.z) * s.t;
        } else {
          s.x = home.x; s.z = home.z;
        }

        // visibility — never shown inside the large or the core
        if (s.state === 1 || s.state === 3) {
          s.alpha = 0;
        } else {
          const dHome = Math.hypot(s.x - home.x, s.z - home.z);
          let a = Math.max(0, Math.min(1, (dHome - home.r * 0.85) / 0.16));
          if (s.far) {
            a *= 1 - Math.max(0, Math.min(1, (s.t - 0.55) / 0.45)); // fade into distance
          } else {
            const dCore = Math.hypot(s.x - nucleus.x, s.z - nucleus.z);
            a = Math.min(a, Math.max(0, Math.min(1, (dCore - nucleus.r * 0.7) / 0.16)));
          }
          s.alpha = a;
        }

        // fly-off spheres shrink as they recede ("moving away")
        s.rscale = s.state === 0 && s.far ? 1 - 0.6 * s.t : 1;
      }
    }

    function toggleLarge(i: number) {
      const L = larges[i];
      L.active = !L.active;
      if (L.active) {
        let k = 0;
        for (let j = 0; j < smalls.length; j++) {
          const s = smalls[j];
          if (s.home === i && s.state === 3) { s.timer = 0; s.nextRest = 0.2 + k * 0.5; k++; }
        }
      }
    }

    /** Tap a large sphere with the core absent → scatter a random burst of
        small spheres. Count grows with how fast / how many times you tap. */
    function spawnBurst(i: number) {
      const L = larges[i];
      const now = typeof performance !== 'undefined' ? performance.now() : 0;
      const gap = now - lastTapAt;
      lastTapAt = now;
      const speedMul = gap < 180 ? 3 : gap < 420 ? 2 : 1; // faster taps → bigger bursts
      const count = (2 + Math.floor(Math.random() * 4)) * speedMul; // random, tap-speed driven
      for (let n = 0; n < count; n++) {
        const ang = Math.random() * Math.PI * 2; // scatter in all directions
        bursts.push({
          x: L.x,
          z: L.z,
          dx: Math.cos(ang),
          dz: Math.sin(ang),
          speed: 0.42 + Math.random() * 0.34,
          age: 0,
          life: 2.6 + Math.random() * 1.7,
          alpha: 0,
          rscale: 1,
        });
      }
      if (bursts.length > 180) bursts.splice(0, bursts.length - 180); // cap for perf
    }

    function stepBursts(dt: number) {
      if (!bursts.length) return;
      for (let i = 0; i < bursts.length; i++) {
        const b = bursts[i];
        b.age += dt;
        b.x += b.dx * b.speed * dt;
        b.z += b.dz * b.speed * dt;
        const p = b.age / b.life;
        let a = Math.min(1, p / 0.1); // quick emerge
        a *= 1 - Math.max(0, Math.min(1, (p - 0.5) / 0.5)); // fade into the distance
        b.alpha = a;
        b.rscale = 1 - 0.55 * Math.min(1, p); // shrink as it recedes
      }
      bursts = bursts.filter((b) => b.age < b.life);
    }

    function pickLarge(clientX: number, clientY: number): number {
      const rect = canvas!.getBoundingClientRect();
      const px = clientX - rect.left;
      const py = clientY - rect.top;
      let best = -1;
      let bestD = Infinity;
      for (let i = 0; i < largeScreen.length; i++) {
        const ls = largeScreen[i];
        if (!ls) continue;
        const d = Math.hypot(px - ls.sx, py - ls.sy);
        if (d < ls.r + 14 && d < bestD) { bestD = d; best = i; }
      }
      return best;
    }

    function overCore(clientX: number, clientY: number): boolean {
      if (!coreScreen) return false;
      const rect = canvas!.getBoundingClientRect();
      const px = clientX - rect.left;
      const py = clientY - rect.top;
      return Math.hypot(px - coreScreen.sx, py - coreScreen.sy) < coreScreen.r * 1.25;
    }

    function drawGridLine(idxs: number[]) {
      for (let k = 0; k < idxs.length - 1; k++) {
        const a = idxs[k];
        const b = idxs[k + 1];
        const dip = Math.max(dipBuf[a], dipBuf[b]);
        const depth = (perspBuf[a] + perspBuf[b]) * 0.5;
        // Thin, faint threads; the far edge tapers softly into the dark so the
        // main receding edge stays only faintly visible.
        const alpha = Math.min(0.4, 0.04 + dip * 0.85) * Math.min(1, depth * 0.78);
        if (alpha < 0.008) continue;
        ctx!.lineWidth = Math.max(0.6, depth * 1.05);
        ctx!.strokeStyle = `rgba(206, 215, 234, ${alpha.toFixed(3)})`;
        ctx!.beginPath();
        ctx!.moveTo(sxBuf[a], syBuf[a]);
        ctx!.lineTo(sxBuf[b], syBuf[b]);
        ctx!.stroke();
      }
    }

    function drawShadow(x: number, z: number, rWorld: number, sinA: number, cosA: number, a: number) {
      const ps = project(x, surfaceY(x, z), z, sinA, cosA);
      const sr = rWorld * ps.persp * scale;
      if (sr <= 0.4) return;
      const g = ctx!.createRadialGradient(ps.sx, ps.sy, 0, ps.sx, ps.sy, sr * 1.35);
      g.addColorStop(0, `rgba(0,0,0,${(0.32 * a).toFixed(3)})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx!.fillStyle = g;
      ctx!.beginPath();
      ctx!.ellipse(ps.sx, ps.sy, sr * 1.25, sr * 0.46, 0, 0, Math.PI * 2);
      ctx!.fill();
    }

    type Ball = {
      kind: 'nucleus' | 'large' | 'small';
      x: number;
      z: number;
      r: number;
      active?: boolean;
      hovered?: boolean;
      large?: number;
      alpha?: number;
      yoff?: number;
      _d?: number;
    };

    function drawBall(b: Ball, sinA: number, cosA: number, coreLoad: number) {
      const a = b.alpha ?? 1;
      if (a <= 0.01) return;
      const sit = b.kind === 'nucleus' ? b.r * 0.35 : b.r * 0.9;
      const yTop = surfaceY(b.x, b.z) + sit + (b.yoff ?? 0);
      const p = project(b.x, yTop, b.z, sinA, cosA);
      const r = b.r * p.persp * scale;
      if (r <= 0.3) return;

      // ground shadow (conveys height above the surface)
      drawShadow(b.x, b.z, b.r, sinA, cosA, a * (b.kind === 'small' ? 0.7 : 1));

      // distance → glow like a far light source
      const farness = Math.max(0, Math.min(1, (1.04 - p.persp) / 0.34));

      if (b.kind === 'nucleus') {
        const boost = 1 + Math.min(coreLoad, 5) * 0.12;
        ctx!.save();
        ctx!.globalCompositeOperation = 'lighter';
        const gr = r * (3.2 + coreLoad * 0.12);
        const glow = ctx!.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, gr);
        glow.addColorStop(0, `rgba(255, 196, 96, ${(0.55 * a * boost).toFixed(3)})`);
        glow.addColorStop(0.35, `rgba(255, 150, 46, ${(0.22 * a * boost).toFixed(3)})`);
        glow.addColorStop(1, 'rgba(255, 140, 30, 0)');
        ctx!.fillStyle = glow;
        ctx!.beginPath();
        ctx!.arc(p.sx, p.sy, gr, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
        ctx!.globalAlpha = a;
        const g = ctx!.createRadialGradient(p.sx - r * 0.25, p.sy - r * 0.3, r * 0.1, p.sx, p.sy, r);
        g.addColorStop(0, '#fff7da');
        g.addColorStop(0.45, '#ffd271');
        g.addColorStop(0.85, '#ff9f33');
        g.addColorStop(1, '#f3851d');
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(p.sx, p.sy, r, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.globalAlpha = 1;
        coreScreen = { sx: p.sx, sy: p.sy, r };
        return;
      }

      const on = b.kind === 'large' ? b.active !== false : true;

      // Soft outer glow — broader + brighter the more distant (defocused light).
      ctx!.save();
      ctx!.globalCompositeOperation = 'lighter';
      const glowR = r * (1.7 + farness * 2.0);
      const gc = on ? '224, 231, 243' : '118, 126, 140';
      const og = ctx!.createRadialGradient(p.sx, p.sy, r * 0.2, p.sx, p.sy, glowR);
      og.addColorStop(0, `rgba(${gc}, ${(0.3 * (0.6 + farness) * a).toFixed(3)})`);
      og.addColorStop(1, `rgba(${gc}, 0)`);
      ctx!.fillStyle = og;
      ctx!.beginPath();
      ctx!.arc(p.sx, p.sy, glowR, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();

      // Soft body — bright core easing to a blurred edge (no hard rim).
      ctx!.globalAlpha = a;
      const br = r * 1.12;
      const body = ctx!.createRadialGradient(p.sx - r * 0.16, p.sy - r * 0.2, r * 0.04, p.sx, p.sy, br);
      if (on) {
        body.addColorStop(0, 'rgba(255,255,255,1)');
        body.addColorStop(0.42, 'rgba(228,234,243,1)');
        body.addColorStop(0.78, 'rgba(150,160,176,0.82)');
        body.addColorStop(1, 'rgba(60,66,78,0)');
      } else {
        // inactive "off" orb (tweak to taste)
        body.addColorStop(0, 'rgba(150,156,168,1)');
        body.addColorStop(0.42, 'rgba(96,103,116,1)');
        body.addColorStop(0.78, 'rgba(48,53,63,0.8)');
        body.addColorStop(1, 'rgba(20,23,29,0)');
      }
      ctx!.fillStyle = body;
      ctx!.beginPath();
      ctx!.arc(p.sx, p.sy, br, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.globalAlpha = 1;

      if (b.kind === 'large' && b.hovered) {
        ctx!.strokeStyle = 'rgba(215,255,63,0.85)';
        ctx!.lineWidth = 1.5;
        ctx!.beginPath();
        ctx!.arc(p.sx, p.sy, r * 1.28, 0, Math.PI * 2);
        ctx!.stroke();
      }
      if (b.kind === 'large' && b.large !== undefined) {
        largeScreen[b.large] = { sx: p.sx, sy: p.sy, r };
      }
    }

    function drawCoreStacks(amt: number) {
      if (amt < 0.02 || !coreScreen) return;
      const { sx, sy, r } = coreScreen;
      const base = r * 1.05;
      // Clamp the reach so the upward fan always stays inside the (short) canvas.
      const len = Math.min(r * 1.6 + 30, Math.max(34, sy - base - 30));
      const angs = [-153, -121.5, -90, -58.5, -27].map((d) => d * DEG);
      ctx!.save();
      ctx!.font = '600 12px ui-monospace, "Space Mono", monospace';
      ctx!.textBaseline = 'middle';
      for (let i = 0; i < 5; i++) {
        const ang = angs[i];
        const bx = sx + Math.cos(ang) * base;
        const by = sy + Math.sin(ang) * base;
        const nx = sx + Math.cos(ang) * (base + len * amt);
        const ny = sy + Math.sin(ang) * (base + len * amt);
        ctx!.strokeStyle = `rgba(215,255,63,${(0.5 * amt).toFixed(3)})`;
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(bx, by);
        ctx!.lineTo(nx, ny);
        ctx!.stroke();
        ctx!.fillStyle = `rgba(215,255,63,${amt.toFixed(3)})`;
        ctx!.beginPath();
        ctx!.arc(nx, ny, 2.5, 0, Math.PI * 2);
        ctx!.fill();
        const left = Math.cos(ang) < 0;
        ctx!.textAlign = left ? 'right' : 'left';
        ctx!.fillStyle = `rgba(243,243,240,${(0.95 * amt).toFixed(3)})`;
        ctx!.fillText(CORE_STACKS[i], nx + (left ? -8 : 8), ny);
      }
      ctx!.restore();
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      const sinA = Math.sin(curA);
      const cosA = Math.cos(curA);

      for (let r = 0; r < ROWS; r++) {
        const z = -PLANE_Z + (2 * PLANE_Z * r) / (ROWS - 1);
        for (let c = 0; c < COLS; c++) {
          const x = -PLANE_X + (2 * PLANE_X * c) / (COLS - 1);
          const y = surfaceY(x, z);
          const p = project(x, y, z, sinA, cosA);
          const i = r * COLS + c;
          sxBuf[i] = p.sx;
          syBuf[i] = p.sy;
          perspBuf[i] = p.persp;
          dipBuf[i] = -y;
        }
      }

      ctx!.lineWidth = 1;
      const rowIdx: number[] = new Array(COLS);
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) rowIdx[c] = r * COLS + c;
        drawGridLine(rowIdx);
      }
      const colIdx: number[] = new Array(ROWS);
      for (let c = 0; c < COLS; c++) {
        for (let r = 0; r < ROWS; r++) colIdx[r] = r * COLS + c;
        drawGridLine(colIdx);
      }

      let coreLoad = 0;
      for (let i = 0; i < smalls.length; i++) if (smalls[i].state === 1) coreLoad++;

      const balls: Ball[] = [];
      if (coreAlpha > 0.01) {
        balls.push({ kind: 'nucleus', x: nucleus.x, z: nucleus.z, r: nucleus.r, alpha: coreAlpha, yoff: coreDrop });
      } else {
        coreScreen = null;
      }
      for (let i = 0; i < larges.length; i++) {
        const L = larges[i];
        balls.push({ kind: 'large', x: L.x, z: L.z, r: L.r, active: L.active, hovered: i === hoverLarge, large: i });
      }
      for (let i = 0; i < smalls.length; i++) {
        const s = smalls[i];
        if (s.alpha <= 0.02) continue;
        balls.push({ kind: 'small', x: s.x, z: s.z, r: SMALL_R * s.rscale, alpha: s.alpha });
      }
      for (let i = 0; i < bursts.length; i++) {
        const b = bursts[i];
        if (b.alpha <= 0.02) continue;
        balls.push({ kind: 'small', x: b.x, z: b.z, r: SMALL_R * b.rscale, alpha: b.alpha });
      }

      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];
        b._d = b.z * cosA + (surfaceY(b.x, b.z) + (b.yoff ?? 0)) * sinA;
      }
      balls.sort((p, q) => (p._d ?? 0) - (q._d ?? 0));
      for (let i = 0; i < balls.length; i++) drawBall(balls[i], sinA, cosA, coreLoad);

      drawCoreStacks(hoverCoreAmt * coreAlpha);
    }

    function step(now: number) {
      const dt = Math.min((now - (last || now)) / 1000, 0.05);
      last = now;
      tSec += dt;
      curA += (targetA - curA) * 0.09;
      parX += (parTarget - parX) * 0.06;

      // core presence / drop animation
      if (coreTargetPresent && !coreShown) { coreShown = true; coreDrop = DROP_HEIGHT; }
      else if (!coreTargetPresent && coreShown) { coreShown = false; }
      coreAlpha += ((coreShown ? 1 : 0) - coreAlpha) * 0.12;
      coreDrop += (0 - coreDrop) * 0.07; // gentle, decelerating fall
      hoverCoreAmt += ((hoverCore ? 1 : 0) - hoverCoreAmt) * 0.16;

      stepSmalls(dt);
      stepBursts(dt);
      draw();
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
    updateScroll();
    curA = targetA;

    if (reduced) {
      setVisible(true);
      draw();
      const roR = new ResizeObserver(() => { layout(); updateScroll(); draw(); });
      roR.observe(wrap);
      return () => { roR.disconnect(); unsubCore(); };
    }

    const begin = () => {
      if (allowed) return;
      allowed = true;
      setVisible(true);
      startLoop();
    };
    if (introDone) begin();
    else fallback = window.setTimeout(begin, FALLBACK_MS);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
      parTarget = nx * 14;
      hoverLarge = pickLarge(e.clientX, e.clientY);
      hoverCore = overCore(e.clientX, e.clientY);
    };
    const onLeave = () => { parTarget = 0; hoverLarge = -1; hoverCore = false; };
    const onDown = (e: PointerEvent) => {
      const i = pickLarge(e.clientX, e.clientY);
      if (i < 0) return;
      // Core present → toggle the sphere active/inactive (unchanged).
      // Core absent → a tap scatters a random burst of small spheres instead,
      // so the sphere never goes inactive while the core is off.
      if (coreAlpha > 0.5) toggleLarge(i);
      else spawnBurst(i);
    };
    const onScroll = () => updateScroll();

    window.addEventListener('pointermove', onMove, { passive: true });
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('scroll', onScroll, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) startLoop();
        else stopLoop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const ro = new ResizeObserver(() => { layout(); updateScroll(); });
    ro.observe(wrap);

    return () => {
      stopLoop();
      window.clearTimeout(fallback);
      window.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerdown', onDown);
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
      ro.disconnect();
      unsubCore();
    };
  }, [introDone, reducedMotionStore]);

  return (
    <div
      ref={wrapRef}
      className={`${styles.wrap} ${visible ? styles.visible : ''}`}
      aria-hidden="true"
    >
      <div className={styles.backdrop} />
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
