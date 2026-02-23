import { isBrowser, isServer } from "@utils/environment";

interface AchievementConfettiOptions {
  particleCount?: number;
  spread?: number;
  originY?: number;
}

const DEFAULT_PARTICLE_COUNT = 120;
const DEFAULT_SPREAD = 72;
const DEFAULT_ORIGIN_Y = 0.7;

type CanvasConfettiFn = typeof import("canvas-confetti");
type CanvasConfettiModule = { default: CanvasConfettiFn };

let confettiModulePromise: Promise<CanvasConfettiModule> | null = null;

const shouldReduceMotion = (): boolean =>
  Boolean(isBrowser && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);

const loadConfettiModule = async (): Promise<CanvasConfettiModule> => {
  if (!confettiModulePromise) {
    confettiModulePromise = import("canvas-confetti") as Promise<CanvasConfettiModule>;
  }

  return confettiModulePromise;
};

export async function launchAchievementConfetti(
  options: AchievementConfettiOptions = {}
): Promise<void> {
  if (isServer) {
    return;
  }

  const module = await loadConfettiModule();
  const fireConfetti = module.default;

  await fireConfetti({
    particleCount: options.particleCount ?? DEFAULT_PARTICLE_COUNT,
    spread: options.spread ?? DEFAULT_SPREAD,
    origin: { y: options.originY ?? DEFAULT_ORIGIN_Y },
    disableForReducedMotion: shouldReduceMotion(),
  });
}
