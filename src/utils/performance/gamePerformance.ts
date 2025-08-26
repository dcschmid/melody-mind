/**
 * Simple Performance Utilities
 * Replaces the over-engineered class-based approach
 */

/**
 * Simple debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: number | null = null;
  return (...args: Parameters<T>): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(() => {
      // cast to any here only for invocation safety since T may be unknown-to-TS at callsite
      (func as unknown as (...a: unknown[]) => unknown)(...args);
    }, wait);
  };
}

/**
 * Simple throttle function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>): void => {
    if (!inThrottle) {
      // call with safe cast
      (func as unknown as (...a: unknown[]) => unknown)(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Simple animation function using requestAnimationFrame
 */
export function animate(
  callback: (timestamp: number) => void,
  duration: number = Infinity
): () => void {
  let animationId: number | null = null;
  let startTime: number | null = null;

  const step = (timestamp: number): void => {
    if (!startTime) {
      startTime = timestamp;
    }
    const elapsed = timestamp - startTime;

    if (elapsed < duration) {
      callback(timestamp);
      animationId = requestAnimationFrame(step);
    }
  };

  animationId = requestAnimationFrame(step);
  return (): void => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
}

/**
 * Simple game loop
 */
export function createGameLoop(
  update: (deltaTime: number) => void,
  render: () => void
): () => void {
  let lastTime = 0;
  let animationId: number | null = null;

  const gameLoop = (currentTime: number): void => {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    update(deltaTime);
    render();

    animationId = requestAnimationFrame(gameLoop);
  };

  animationId = requestAnimationFrame(gameLoop);
  return (): void => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
}

/**
 * Preload images efficiently
 */
export async function preloadImage(src: string): Promise<void> {
  return new Promise<void>((resolve: () => void, reject: (err?: unknown) => void): void => {
    const img = new Image();
    img.onload = (): void => resolve();
    img.onerror = (ev?: unknown): void => reject(ev);
    img.src = src;
  });
}

/**
 * Preload audio efficiently
 */
export async function preloadAudio(src: string): Promise<void> {
  return new Promise<void>((resolve: () => void, reject: (err?: unknown) => void): void => {
    const audio = new Audio();
    audio.oncanplaythrough = (): void => resolve();
    audio.onerror = (ev?: unknown): void => reject(ev);
    audio.src = src;
  });
}
