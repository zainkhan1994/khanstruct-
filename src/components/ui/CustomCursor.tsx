'use client';

import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ cx: 0, cy: 0, tx: 0, ty: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Only show on devices with fine pointer (mouse)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const onMove = (e: PointerEvent) => {
      pos.current.tx = e.clientX;
      pos.current.ty = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    const loop = () => {
      const p = pos.current;
      p.cx += (p.tx - p.cx) * 0.12;
      p.cy += (p.ty - p.cy) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${p.cx}px`;
        ringRef.current.style.top = `${p.cy}px`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    const onEnter = () => document.body.classList.add('cursor-hover');
    const onLeave = () => document.body.classList.remove('cursor-hover');

    window.addEventListener('pointermove', onMove);
    rafRef.current = requestAnimationFrame(loop);

    const interactives = document.querySelectorAll('a,button,[role="button"]');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    // Show the cursors
    if (ringRef.current) ringRef.current.style.opacity = '1';
    if (dotRef.current) dotRef.current.style.opacity = '1';

    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{ opacity: 0 }}
        aria-hidden="true"
      />
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{ opacity: 0 }}
        aria-hidden="true"
      />
    </>
  );
}
