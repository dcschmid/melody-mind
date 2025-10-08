type EndGameModule = typeof import("./endGameUtils");

let endGameModulePromise: Promise<EndGameModule> | null = null;

function loadEndGameModule(): Promise<EndGameModule> {
  if (!endGameModulePromise) {
    endGameModulePromise = import("./endGameUtils");
  }
  return endGameModulePromise;
}

type HandleEndGameParams = Parameters<EndGameModule["handleEndGame"]>;
type RestartGameParams = Parameters<EndGameModule["restartGame"]>;

/**
 * Dynamically import `endGameUtils` and delegate to `handleEndGame`.
 * Keeps the large overlay implementation out of the main game bundle.
 */
export async function handleEndGameLazy(
  ...args: HandleEndGameParams
): Promise<ReturnType<EndGameModule["handleEndGame"]>> {
  const mod = await loadEndGameModule();
  return mod.handleEndGame(...args);
}

/**
 * Dynamically import `endGameUtils` and delegate to `restartGame`.
 */
export async function restartGameLazy(
  ...args: RestartGameParams
): Promise<ReturnType<EndGameModule["restartGame"]>> {
  const mod = await loadEndGameModule();
  return mod.restartGame(...args);
}
