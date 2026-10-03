/**
 * boids.ts
 * ------------------------------------------------------------------
 * A Reynolds flocking simulation. Every boid steers using three local
 * rules, each computed only from its immediate neighbours:
 *
 *   Separation  push away from crowding neighbours, weighted by 1/distance
 *   Alignment   match the average heading of the neighbours
 *   Cohesion    drift toward the local centre of mass
 *
 * This module is pure logic with no DOM access. The canvas component owns
 * rendering and the animation loop. Initial positions and headings are
 * seeded from Math.random, so no two visits produce the same flight.
 *
 * Space is treated as a torus: boids wrap across the edges. That keeps the
 * flock evenly distributed instead of piling against a boundary.
 * ------------------------------------------------------------------
 */

export interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface FlockParams {
  separationWeight: number;
  alignmentWeight: number;
  cohesionWeight: number;
  /** Deliberately well under 1, so the cursor nudges the flock rather than
   *  dragging it. Strong enough to notice, too weak to take over. */
  pointerWeight: number;
  /** Radius over which the cursor has any influence at all. */
  pointerRadius: number;
  /** Extra top speed granted to boids near the cursor, as a fraction of the
   *  normal speed range. This is what sells the sense of approach. */
  pointerBoost: number;
  perceptionRadius: number;
  separationRadius: number;
  maxSpeed: number;
  minSpeed: number;
  maxSteer: number;
}

/** A point of interest, currently the pointer. */
export interface FlockTarget {
  x: number;
  y: number;
}

const TAU = Math.PI * 2;

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/**
 * Perception and separation radii are derived from the viewport so the
 * flock reads the same on a phone and on a wide desktop.
 */
export function createFlockParams(width: number, height: number): FlockParams {
  const span = Math.min(width, height);

  return {
    separationWeight: 1.6,
    alignmentWeight: 1.35,
    cohesionWeight: 1.25,
    pointerWeight: 0.55,
    pointerRadius: clamp(span * 0.55, 280, 540),
    pointerBoost: 0.6,
    perceptionRadius: clamp(span * 0.12, 64, 130),
    separationRadius: clamp(span * 0.05, 32, 64),
    maxSpeed: 140,
    minSpeed: 55,
    maxSteer: 420,
  };
}

function randomBoid(width: number, height: number, params: FlockParams): Boid {
  const heading = Math.random() * TAU;
  const speed = params.minSpeed + Math.random() * (params.maxSpeed - params.minSpeed);

  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: Math.cos(heading) * speed,
    vy: Math.sin(heading) * speed,
  };
}

/**
 * Shared scratch vector, consumed immediately by the caller. The step
 * loop runs this thousands of times a frame, so it avoids allocating.
 */
const scratch = { x: 0, y: 0 };

/**
 * Reynolds' seek: a desired velocity toward (dx, dy), expressed as the
 * steering force that would reach it, capped at maxSteer.
 */
function seek(
  dx: number,
  dy: number,
  currentVx: number,
  currentVy: number,
  params: FlockParams,
): { x: number; y: number } {
  const length = Math.hypot(dx, dy);
  if (length === 0) {
    scratch.x = 0;
    scratch.y = 0;
    return scratch;
  }

  let steerX = (dx / length) * params.maxSpeed - currentVx;
  let steerY = (dy / length) * params.maxSpeed - currentVy;

  const steerLength = Math.hypot(steerX, steerY);
  if (steerLength > params.maxSteer) {
    const scale = params.maxSteer / steerLength;
    steerX *= scale;
    steerY *= scale;
  }

  scratch.x = steerX;
  scratch.y = steerY;
  return scratch;
}

export class Flock {
  boids: Boid[] = [];

  private params: FlockParams;
  private count: number;
  private width: number;
  private height: number;

  constructor(width: number, height: number, count: number) {
    this.width = width;
    this.height = height;
    this.count = count;
    this.params = createFlockParams(width, height);
    this.reseed();
  }

  /** Discards the current flight and scatters a new one. */
  reseed(): void {
    this.boids = Array.from({ length: this.count }, () =>
      randomBoid(this.width, this.height, this.params),
    );
  }

  /**
   * Rescales existing positions into the new viewport so the flock
   * redistributes without visibly resetting mid-scroll.
   */
  resize(width: number, height: number, count: number): void {
    const scaleX = width / this.width;
    const scaleY = height / this.height;

    this.width = width;
    this.height = height;
    this.count = count;
    this.params = createFlockParams(width, height);

    for (const boid of this.boids) {
      boid.x *= scaleX;
      boid.y *= scaleY;
    }

    this.boids = this.boids.slice(0, count);
    while (this.boids.length < count) {
      this.boids.push(randomBoid(width, height, this.params));
    }

    this.wrapAll();
  }

  /**
   * How strongly a position is affected by the target, from 1 at the target
   * down to 0 at the edge of the pointer radius. Shared with the renderer so
   * a boid drawn larger is exactly the same boid that is flying faster.
   */
  influenceAt(x: number, y: number, target: FlockTarget | null): number {
    if (!target) return 0;
    const radius = this.params.pointerRadius;
    const distance = Math.hypot(target.x - x, target.y - y);
    // The epsilon matters: the radius is derived from a float product, so a
    // boid sitting exactly on the boundary can land a hair inside it and
    // report a vanishing but non-zero influence.
    if (distance >= radius - 1e-6) return 0;
    return clamp(1 - distance / radius, 0, 1);
  }

  /** Advances the simulation by dt seconds. */
  step(dt: number, target: FlockTarget | null = null): void {
    const {
      separationWeight,
      alignmentWeight,
      cohesionWeight,
      pointerWeight,
      pointerBoost,
      maxSpeed,
      minSpeed,
      maxSteer,
    } = this.params;

    const speedRange = maxSpeed - minSpeed;
    const perceptionSq = this.params.perceptionRadius * this.params.perceptionRadius;
    const separationSq = this.params.separationRadius * this.params.separationRadius;

    for (const boid of this.boids) {
      let separationX = 0;
      let separationY = 0;
      let separationCount = 0;
      let alignmentX = 0;
      let alignmentY = 0;
      let alignmentCount = 0;
      let cohesionX = 0;
      let cohesionY = 0;
      let cohesionCount = 0;

      for (const other of this.boids) {
        if (other === boid) continue;

        const dx = other.x - boid.x;
        const dy = other.y - boid.y;
        const distanceSq = dx * dx + dy * dy;
        if (distanceSq > perceptionSq || distanceSq === 0) continue;

        if (distanceSq < separationSq) {
          // Inverse distance falloff, so closer neighbours push harder.
          const inverse = 1 / Math.sqrt(distanceSq);
          separationX -= dx * inverse;
          separationY -= dy * inverse;
          separationCount += 1;
        }

        alignmentX += other.vx;
        alignmentY += other.vy;
        alignmentCount += 1;

        cohesionX += other.x;
        cohesionY += other.y;
        cohesionCount += 1;
      }

      let steerX = 0;
      let steerY = 0;

      if (separationCount > 0) {
        const steer = seek(separationX, separationY, boid.vx, boid.vy, this.params);
        steerX += steer.x * separationWeight;
        steerY += steer.y * separationWeight;
      }

      if (alignmentCount > 0) {
        const steer = seek(
          alignmentX / alignmentCount,
          alignmentY / alignmentCount,
          boid.vx,
          boid.vy,
          this.params,
        );
        steerX += steer.x * alignmentWeight;
        steerY += steer.y * alignmentWeight;
      }

      if (cohesionCount > 0) {
        const steer = seek(
          cohesionX / cohesionCount - boid.x,
          cohesionY / cohesionCount - boid.y,
          boid.vx,
          boid.vy,
          this.params,
        );
        steerX += steer.x * cohesionWeight;
        steerY += steer.y * cohesionWeight;
      }

      // A fourth, weaker rule: drift toward the pointer. Weighted by
      // proximity and capped well below the flocking rules, so the flock
      // leans toward the cursor without collapsing onto it.
      const pointerInfluence = this.influenceAt(boid.x, boid.y, target);
      if (target && pointerInfluence > 0) {
        const steer = seek(target.x - boid.x, target.y - boid.y, boid.vx, boid.vy, this.params);
        const pull = pointerInfluence * pointerWeight;
        steerX += steer.x * pull;
        steerY += steer.y * pull;
      }

      const totalSteer = Math.hypot(steerX, steerY);
      if (totalSteer > maxSteer) {
        steerX *= maxSteer / totalSteer;
        steerY *= maxSteer / totalSteer;
      }

      boid.vx += steerX * dt;
      boid.vy += steerY * dt;

      // Boids near the target are allowed to overspeed, so the flock appears
      // to accelerate toward the pointer and then ease off as it passes.
      const influence = this.influenceAt(boid.x, boid.y, target);
      const localMaxSpeed = maxSpeed + speedRange * pointerBoost * influence;

      const speed = Math.hypot(boid.vx, boid.vy);
      if (speed > localMaxSpeed || speed < minSpeed) {
        const clamped = speed > localMaxSpeed ? localMaxSpeed : minSpeed;
        if (speed > 0) {
          boid.vx = (boid.vx / speed) * clamped;
          boid.vy = (boid.vy / speed) * clamped;
        }
      }

      boid.x += boid.vx * dt;
      boid.y += boid.vy * dt;

      if (boid.x < 0) boid.x += this.width;
      else if (boid.x >= this.width) boid.x -= this.width;

      if (boid.y < 0) boid.y += this.height;
      else if (boid.y >= this.height) boid.y -= this.height;
    }
  }

  private wrapAll(): void {
    for (const boid of this.boids) {
      boid.x = ((boid.x % this.width) + this.width) % this.width;
      boid.y = ((boid.y % this.height) + this.height) % this.height;
    }
  }
}
