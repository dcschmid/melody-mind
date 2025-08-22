/**
 * Game Performance Optimization Utilities
 *
 * Optimized performance utilities for the MelodyMind game engine
 * Focuses on memory management, animation performance, and user experience
 */

/**
 * Game performance optimization utilities
 */
export class GamePerformanceOptimizer {
  private static instance: GamePerformanceOptimizer;

  private constructor() {
    // Performance monitoring removed - focus on core optimizations
  }

  /**
   *
   */
  public static getInstance(): GamePerformanceOptimizer {
    if (!GamePerformanceOptimizer.instance) {
      GamePerformanceOptimizer.instance = new GamePerformanceOptimizer();
    }
    return GamePerformanceOptimizer.instance;
  }

  /**
   * Optimize DOM queries with caching
   */
  public static createElementCache<T extends HTMLElement>(
    selector: string,
    container: Document | HTMLElement = document
  ): () => T | null {
    let cachedElement: T | null = null;

    return () => {
      if (!cachedElement) {
        cachedElement = container.querySelector(selector) as T;
      }
      return cachedElement;
    };
  }

  /**
   * Debounce function calls for better performance
   */
  public static debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: number | null = null;

    return (...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(() => func(...args), wait);
    };
  }

  /**
   * Throttle function calls for better performance
   */
  public static throttle<T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false;

    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  /**
   * Optimize animations using requestAnimationFrame
   */
  public static animate(
    callback: (timestamp: number) => void,
    duration: number = Infinity
  ): () => void {
    let animationId: number | null = null;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }
      const elapsed = timestamp - startTime;

      if (elapsed < duration) {
        callback(timestamp);
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }

  /**
   * Memory management utilities
   */
  public static getMemoryUsage(): { used: number; total: number } | null {
    if ("memory" in performance) {
      const memory = (
        performance as Performance & {
          memory?: { usedJSHeapSize: number; totalJSHeapSize: number };
        }
      ).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
      };
    }
    return null;
  }

  /**
   * Cleanup event listeners to prevent memory leaks
   */
  public static cleanupEventListeners(
    element: HTMLElement,
    eventType: string,
    handler: EventListener
  ): void {
    element.removeEventListener(eventType, handler);
  }

  /**
   * Optimize image loading
   */
  public static preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }

  /**
   * Optimize audio loading
   */
  public static preloadAudio(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => resolve();
      audio.onerror = () => reject(new Error(`Failed to load audio: ${src}`));
      audio.src = src;
    });
  }

  /**
   * Batch DOM updates for better performance
   */
  public static batchDOMUpdates(updates: (() => void)[]): void {
    // Use requestAnimationFrame to batch updates
    requestAnimationFrame(() => {
      updates.forEach((update) => update());
    });
  }

  /**
   * Optimize scroll performance
   */
  public static optimizeScroll(
    element: HTMLElement,
    callback: (scrollTop: number) => void
  ): () => void {
    let ticking = false;

    const updateScroll = () => {
      callback(element.scrollTop);
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    element.addEventListener("scroll", requestTick, { passive: true });

    return () => {
      element.removeEventListener("scroll", requestTick);
    };
  }

  /**
   * Cleanup resources
   */
  public cleanup(): void {
    // Cleanup removed - no performance monitoring needed
  }
}

/**
 * Game-specific performance optimizations
 */
export class GamePerformanceUtils {
  /**
   * Optimize game loop performance
   */
  public static createGameLoop(
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
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }

  /**
   * Optimize question loading
   */
  public static async preloadQuestions(questions: Array<{ coverSrc?: string }>): Promise<void> {
    const preloadPromises = questions.map(async (question) => {
      if (question.coverSrc) {
        try {
          await GamePerformanceOptimizer.preloadImage(question.coverSrc);
        } catch {
          console.warn("Failed to preload image:", question.coverSrc);
        }
      }
    });

    await Promise.allSettled(preloadPromises);
  }

  /**
   * Optimize audio preloading for game
   */
  public static async preloadGameAudio(audioUrls: string[]): Promise<void> {
    const preloadPromises = audioUrls.map(async (url) => {
      try {
        await GamePerformanceOptimizer.preloadAudio(url);
      } catch {
        console.warn("Failed to preload audio:", url);
      }
    });

    await Promise.allSettled(preloadPromises);
  }
}
