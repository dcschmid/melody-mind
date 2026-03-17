import { logError } from '../../utils/error-handler';

/**
 * Script Initialization Utilities
 *
 * Provides consistent initialization patterns for client-side scripts.
 * Prevents double initialization and handles DOM ready state.
 */

/**
 * Gets a value from window with proper typing.
 */
function getWindowFlag(flagName: string): boolean {
  return (window as unknown as Record<string, unknown>)[flagName] === true;
}

/**
 * Sets a value on window with proper typing.
 */
function setWindowFlag(flagName: string, value: boolean): void {
  (window as unknown as Record<string, unknown>)[flagName] = value;
}

/**
 * Deletes a value from window with proper typing.
 */
function deleteWindowFlag(flagName: string): void {
  delete (window as unknown as Record<string, unknown>)[flagName];
}

/**
 * Creates a singleton initializer that prevents double initialization.
 *
 * @param name - Unique name for this initializer (used in global flag)
 * @param init - The initialization function to run
 * @returns A function that initializes once and handles DOM ready
 *
 * @example
 * const initAudioPlayer = createInitializer('AudioPlayer', () => {
 *   // Setup audio players
 * });
 *
 * // Call on script load
 * initAudioPlayer();
 */
export function createInitializer(name: string, init: () => void): () => void {
  const flagName = `__mm${name}Initialized`;

  return () => {
    // Prevent double initialization
    if (getWindowFlag(flagName)) {
      return;
    }
    setWindowFlag(flagName, true);

    // Handle DOM ready state
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
      init();
    }
  };
}

/**
 * Creates an async initializer that prevents double initialization.
 *
 * @param name - Unique name for this initializer
 * @param init - The async initialization function to run
 * @returns A function that initializes once and handles DOM ready
 *
 * @example
 * const initTranscripts = createAsyncInitializer('Transcripts', async () => {
 *   const data = await fetchTranscripts();
 *   setupTranscripts(data);
 * });
 */
export function createAsyncInitializer(name: string, init: () => Promise<void>): () => void {
  const flagName = `__mm${name}Initialized`;

  return () => {
    if (getWindowFlag(flagName)) {
      return;
    }
    setWindowFlag(flagName, true);

    const runInit = async () => {
      try {
        await init();
      } catch (error) {
        logError(error, `Failed to initialize ${name}`);
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener(
        'DOMContentLoaded',
        () => {
          void runInit();
        },
        { once: true },
      );
    } else {
      void runInit();
    }
  };
}

/**
 * Checks if an initializer has already run.
 * Useful for conditional logic in dependent scripts.
 *
 * @param name - The initializer name to check
 * @returns True if already initialized
 */
export function isInitialized(name: string): boolean {
  const flagName = `__mm${name}Initialized`;
  return getWindowFlag(flagName);
}

/**
 * Resets an initializer flag (mainly for testing).
 *
 * @param name - The initializer name to reset
 */
export function resetInitializer(name: string): void {
  const flagName = `__mm${name}Initialized`;
  deleteWindowFlag(flagName);
}
