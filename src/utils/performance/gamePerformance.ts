/**
 * Simple Performance Utilities
 * Replaces the over-engineered class-based approach
 */

/**
 * Simple debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: number | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => func(...args), wait);
  };
}

/**
 * Simple throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
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

  const animate = (timestamp: number) => {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    if (elapsed < duration) {
      callback(timestamp);
      animationId = requestAnimationFrame(animate);
    }
  };

  animationId = requestAnimationFrame(animate);
  return () => {
    if (animationId) cancelAnimationFrame(animationId);
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

  const gameLoop = (currentTime: number) => {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    update(deltaTime);
    render();

    animationId = requestAnimationFrame(gameLoop);
  };

  animationId = requestAnimationFrame(gameLoop);
  return () => {
    if (animationId) cancelAnimationFrame(animationId);
  };
}

/**
 * Preload images efficiently
 */
export async function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Preload audio efficiently
 */
export async function preloadAudio(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.oncanplaythrough = () => resolve();
    audio.onerror = reject;
    audio.src = src;
  });
}
