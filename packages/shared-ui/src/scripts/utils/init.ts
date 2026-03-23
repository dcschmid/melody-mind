const FLAG_PREFIX = "__mm";

const buildFlagName = (name: string): string => `${FLAG_PREFIX}${name}Initialized`;

export const createInitializer = (name: string, init: () => void): (() => void) => {
  const flagName = buildFlagName(name);

  return () => {
    if ((window as Record<string, unknown>)[flagName]) {
      return;
    }
    (window as Record<string, unknown>)[flagName] = true;

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
      init();
    }
  };
};
