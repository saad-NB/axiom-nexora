'use client';

import { useEffect, useRef } from 'react';

import { Flock, type FlockTarget } from '@/lib/boids';

import styles from './FlockCanvas.module.css';

/** Chevron half-height in CSS pixels at normal distance. */
const MARKER = 2.6;

/** A boid at the pointer is drawn this much larger, to read as nearer. */
const DEPTH_SCALE = 1.75;

/** Never advance more than 50ms in one frame, so a resumed tab does not jump. */
const MAX_DELTA = 0.05;

/** Rendering above 2x costs fill rate and buys nothing visible at this size. */
const MAX_DPR = 2;

/**
 * Density scales with viewport area, then is capped by core count so a
 * low-power mobile device does not pay for a desktop-sized flock.
 */
function markerCount(width: number, height: number, cores: number): number {
  const density = (width * height) / (1440 * 900);
  const base = Math.round(150 * density);
  const ceiling = cores >= 4 ? 190 : 120;

  return Math.min(Math.max(base, 60), ceiling);
}

/**
 * A decorative flocking simulation painted behind the page.
 *
 * Three things keep it out of the way of the content:
 *   - the canvas sits at z-index -1, so all text paints above it
 *   - pointer events are disabled in CSS, so it cannot be clicked or selected
 *   - it renders a single static frame when the visitor prefers reduced motion
 *
 * The loop pauses when the tab is hidden, which is the difference between a
 * background that feels alive and one that drains a laptop battery.
 */
export function FlockCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

    const sizeCanvas = () => {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    sizeCanvas();

    const cores = navigator.hardwareConcurrency ?? 4;
    const flock = new Flock(width, height, markerCount(width, height, cores));

    // Resolved once. --signal is a static token, and reading it inside the
    // draw loop would force a style recalculation on every frame.
    const fill = getComputedStyle(canvas).color;

    // Null until a real pointer moves, so the flock is never pulled toward
    // a cursor that does not exist, and never reacts to touch scrolling.
    let target: FlockTarget | null = null;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = fill;

      for (const boid of flock.boids) {
        // Same falloff the steering uses, so a larger marker really is a
        // boid that is being pulled along faster.
        const near = flock.influenceAt(boid.x, boid.y, target);
        const size = MARKER * (1 + (DEPTH_SCALE - 1) * near);

        ctx.save();
        ctx.translate(boid.x, boid.y);
        ctx.rotate(Math.atan2(boid.vy, boid.vx));
        ctx.beginPath();
        ctx.moveTo(size * 1.7, 0);
        ctx.lineTo(-size, size * 0.9);
        ctx.lineTo(-size * 0.45, 0);
        ctx.lineTo(-size, -size * 0.9);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    };

    let frame = 0;
    let lastTime = 0;

    const tick = (time: number) => {
      const delta = lastTime === 0 ? 0 : Math.min((time - lastTime) / 1000, MAX_DELTA);
      lastTime = time;

      if (delta > 0) flock.step(delta, target);
      draw();

      frame = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame !== 0) return;
      lastTime = 0;
      frame = window.requestAnimationFrame(tick);
    };

    const stop = () => {
      if (frame === 0) return;
      window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncWithMotionPreference = () => {
      stop();
      if (motionQuery.matches) {
        // A still scatter rather than an empty background.
        draw();
      } else {
        start();
      }
    };

    const onResize = () => {
      const nextWidth = window.innerWidth;
      const nextHeight = window.innerHeight;
      const nextDpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      if (nextWidth === width && nextHeight === height && nextDpr === dpr) return;

      width = nextWidth;
      height = nextHeight;
      dpr = nextDpr;
      sizeCanvas();
      flock.resize(width, height, markerCount(width, height, cores));
      draw();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        stop();
      } else if (!motionQuery.matches) {
        start();
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      // Mouse and pen only. A touch drag is a scroll, and steering the flock
      // around while someone reads would be hostile.
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      target = { x: event.clientX, y: event.clientY };
    };

    // Leaving the window should let the flock relax back to normal flight.
    const onPointerLeave = () => {
      target = null;
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);
    motionQuery.addEventListener('change', syncWithMotionPreference);

    syncWithMotionPreference();

    return () => {
      stop();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      motionQuery.removeEventListener('change', syncWithMotionPreference);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
