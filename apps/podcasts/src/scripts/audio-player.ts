/**
 * Custom audio player behavior with keyboard and progress control.
 * Uses shared utilities for time formatting and initialization.
 */
import { formatTime } from '../utils/format-time';
import { logError } from '../utils/error-handler';
import { createInitializer } from './utils/init';
import { AUDIO_CONFIG } from '../constants';

const initAudioPlayers = () => {
  const players = document.querySelectorAll('.episode-player');
  if (!players.length) {
    return;
  }

  const cleanupFunctions: (() => void)[] = [];

  players.forEach((player) => {
    const audio = player.querySelector('.episode-player__audio');
    if (!(audio instanceof HTMLAudioElement)) {
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    const playerId = player.getAttribute('data-player-id') || '';
    const toggleButton = player.querySelector('[data-action="toggle"]');
    const rewindButton = player.querySelector('[data-action="rewind"]');
    const forwardButton = player.querySelector('[data-action="forward"]');
    const retryButton = player.querySelector('[data-action="retry"]');
    const playIcon = toggleButton?.querySelector('.episode-player__control-icon--play');
    const pauseIcon = toggleButton?.querySelector('.episode-player__control-icon--pause');
    const progress = player.querySelector('.episode-player__progress');
    const progressFill = player.querySelector('.episode-player__progress-fill');
    const timeDisplay = player.querySelector('.episode-player__time');
    const status = player.querySelector('.episode-player__status');
    const hint = player.querySelector('.episode-player__shortcut-hint');

    let isPlaying = false;
    const title = audio.dataset.title || 'episode';

    // Broadcast progress for transcript sync.
    const dispatchTimeEvent = () => {
      if (!playerId) {
        return;
      }
      const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
      const currentTime = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
      window.dispatchEvent(
        new CustomEvent('audio:time', {
          detail: {
            playerId,
            currentTime,
            duration,
            isPlaying,
          },
        }),
      );
    };

    const setStatus = (message: string) => {
      if (status instanceof HTMLElement) {
        status.textContent = message;
      }
    };

    const updateToggleButton = () => {
      if (!(toggleButton instanceof HTMLButtonElement)) {
        return;
      }
      toggleButton.dataset.state = isPlaying ? 'playing' : 'paused';
      toggleButton.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
      toggleButton.setAttribute('aria-label', `${isPlaying ? 'Pause' : 'Play'} ${title}`);
      if (playIcon instanceof SVGElement) {
        playIcon.style.display = isPlaying ? 'none' : 'block';
      }
      if (pauseIcon instanceof SVGElement) {
        pauseIcon.style.display = isPlaying ? 'block' : 'none';
      }
    };

    const updateProgress = () => {
      if (
        !(progressFill instanceof HTMLElement) ||
        !(progress instanceof HTMLElement) ||
        !(timeDisplay instanceof HTMLElement)
      ) {
        return;
      }

      const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
      const currentTime = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
      const progressValue = duration ? (currentTime / duration) * 100 : 0;

      progressFill.style.width = `${progressValue}%`;
      progress.setAttribute('aria-valuenow', Math.round(progressValue).toString());

      const currentFormatted = formatTime(currentTime);
      const durationFormatted = duration ? formatTime(duration) : '0:00';
      timeDisplay.textContent = `${currentFormatted} / ${durationFormatted}`;
      progress.setAttribute('aria-valuetext', `${currentFormatted} of ${durationFormatted}`);
    };

    const applySeek = (timeSeconds: number, autoplay: boolean) => {
      if (!Number.isFinite(timeSeconds)) {
        return;
      }
      const duration = Number.isFinite(audio.duration) ? audio.duration : null;
      const clampedTime =
        duration === null ? Math.max(0, timeSeconds) : Math.min(Math.max(0, timeSeconds), duration);
      audio.currentTime = clampedTime;
      if (autoplay) {
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {
            // Silently handle play errors (e.g., autoplay restrictions)
          });
        }
      }
      updateProgress();
      dispatchTimeEvent();
    };

    const seekToPosition = (clientX: number) => {
      if (!(progress instanceof HTMLElement) || !Number.isFinite(audio.duration)) {
        return;
      }
      const rect = progress.getBoundingClientRect();
      const percent = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      audio.currentTime = percent * audio.duration;
    };

    toggleButton?.addEventListener(
      'click',
      () => {
        if (audio.paused || audio.ended) {
          audio.play();
        } else {
          audio.pause();
        }
      },
      { signal },
    );

    rewindButton?.addEventListener(
      'click',
      () => {
        audio.currentTime = Math.max(0, audio.currentTime - AUDIO_CONFIG.SKIP_SECONDS);
        updateProgress();
        dispatchTimeEvent();
      },
      { signal },
    );

    forwardButton?.addEventListener(
      'click',
      () => {
        if (Number.isFinite(audio.duration)) {
          audio.currentTime = Math.min(
            audio.duration,
            audio.currentTime + AUDIO_CONFIG.SKIP_SECONDS,
          );
          updateProgress();
          dispatchTimeEvent();
        }
      },
      { signal },
    );

    progress?.addEventListener(
      'click',
      (event) => {
        if (event instanceof MouseEvent) {
          seekToPosition(event.clientX);
          updateProgress();
          dispatchTimeEvent();
        }
      },
      { signal },
    );

    progress?.addEventListener(
      'keydown',
      (event) => {
        if (!(event instanceof KeyboardEvent)) {
          return;
        }
        if (!Number.isFinite(audio.duration)) {
          return;
        }

        if (['ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) {
          event.preventDefault();
          switch (event.key) {
            case 'ArrowLeft':
              audio.currentTime = Math.max(0, audio.currentTime - AUDIO_CONFIG.SKIP_SECONDS);
              break;
            case 'ArrowRight':
              audio.currentTime = Math.min(
                audio.duration,
                audio.currentTime + AUDIO_CONFIG.SKIP_SECONDS,
              );
              break;
            case 'Home':
              audio.currentTime = 0;
              break;
            case 'End':
              audio.currentTime = audio.duration;
              break;
            case 'PageUp':
              audio.currentTime = Math.min(
                audio.duration,
                audio.currentTime + AUDIO_CONFIG.SKIP_LARGE_SECONDS,
              );
              break;
            case 'PageDown':
              audio.currentTime = Math.max(0, audio.currentTime - AUDIO_CONFIG.SKIP_LARGE_SECONDS);
              break;
          }
          updateProgress();
          dispatchTimeEvent();
        }
      },
      { signal },
    );

    player.addEventListener(
      'keydown',
      (event) => {
        if (!(event instanceof KeyboardEvent)) {
          return;
        }
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
          return;
        }
        if (target.classList.contains('episode-player__progress')) {
          return;
        }
        if (['BUTTON', 'A', 'INPUT', 'TEXTAREA'].includes(target.tagName)) {
          return;
        }

        if (event.code === 'Space') {
          event.preventDefault();
          if (toggleButton instanceof HTMLButtonElement) {
            toggleButton.click();
          }
        } else if (event.code === 'ArrowLeft') {
          if (rewindButton instanceof HTMLButtonElement) {
            rewindButton.click();
          }
        } else if (event.code === 'ArrowRight') {
          if (forwardButton instanceof HTMLButtonElement) {
            forwardButton.click();
          }
        } else if (event.key === '?') {
          event.preventDefault();
          if (hint instanceof HTMLElement) {
            hint.classList.toggle('episode-player__shortcut-hint--hidden');
          }
        }
      },
      { signal },
    );

    window.addEventListener(
      'transcript:seek',
      (event) => {
        if (!(event instanceof CustomEvent)) {
          return;
        }
        const detail = event.detail;
        if (!detail || detail.playerId !== playerId) {
          return;
        }
        const targetTime = Number(detail.time);
        applySeek(targetTime, Boolean(detail.autoplay));
      },
      { signal },
    );

    audio.addEventListener(
      'loadedmetadata',
      () => {
        updateProgress();
        dispatchTimeEvent();
      },
      { signal },
    );

    let lastTimeUpdate = 0;

    audio.addEventListener(
      'timeupdate',
      () => {
        const now = performance.now();
        if (now - lastTimeUpdate < AUDIO_CONFIG.TIME_UPDATE_THROTTLE_MS) {
          return;
        }
        lastTimeUpdate = now;
        updateProgress();
        dispatchTimeEvent();
      },
      { signal },
    );

    audio.addEventListener(
      'waiting',
      () => {
        setStatus(`Buffering ${title}...`);
      },
      { signal },
    );

    audio.addEventListener(
      'error',
      () => {
        const errorInfo = audio.error
          ? `${audio.error.message || audio.error.code}`
          : 'Unknown error';
        setStatus(`Could not load ${title}. Click retry to try again.`);
        logError(errorInfo, `audio player: ${title}`);
        if (retryButton instanceof HTMLButtonElement) {
          retryButton.hidden = false;
        }
      },
      { signal },
    );

    retryButton?.addEventListener(
      'click',
      () => {
        audio.load();
        if (retryButton instanceof HTMLButtonElement) {
          retryButton.hidden = true;
        }
        setStatus(`Loading ${title}...`);
      },
      { signal },
    );

    audio.addEventListener(
      'playing',
      () => {
        isPlaying = true;
        updateToggleButton();
        setStatus(`Now playing: ${title}`);
        dispatchTimeEvent();
      },
      { signal },
    );

    audio.addEventListener(
      'pause',
      () => {
        if (audio.ended) {
          return;
        }
        isPlaying = false;
        updateToggleButton();
        setStatus(`Paused: ${title}`);
        dispatchTimeEvent();
      },
      { signal },
    );

    audio.addEventListener(
      'ended',
      () => {
        isPlaying = false;
        updateToggleButton();
        if (progressFill instanceof HTMLElement) {
          progressFill.style.width = '0%';
        }
        updateProgress();
        setStatus(`Finished: ${title}`);
        dispatchTimeEvent();
      },
      { signal },
    );

    rewindButton?.addEventListener('click', () => {
      audio.currentTime = Math.max(0, audio.currentTime - AUDIO_CONFIG.SKIP_SECONDS);
      updateProgress();
      dispatchTimeEvent();
    });

    forwardButton?.addEventListener('click', () => {
      if (Number.isFinite(audio.duration)) {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + AUDIO_CONFIG.SKIP_SECONDS);
        updateProgress();
        dispatchTimeEvent();
      }
    });

    progress?.addEventListener('click', (event) => {
      if (event instanceof MouseEvent) {
        seekToPosition(event.clientX);
        updateProgress();
        dispatchTimeEvent();
      }
    });

    progress?.addEventListener('keydown', (event) => {
      if (!(event instanceof KeyboardEvent)) {
        return;
      }
      if (!Number.isFinite(audio.duration)) {
        return;
      }

      if (['ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) {
        event.preventDefault();
        switch (event.key) {
          case 'ArrowLeft':
            audio.currentTime = Math.max(0, audio.currentTime - AUDIO_CONFIG.SKIP_SECONDS);
            break;
          case 'ArrowRight':
            audio.currentTime = Math.min(
              audio.duration,
              audio.currentTime + AUDIO_CONFIG.SKIP_SECONDS,
            );
            break;
          case 'Home':
            audio.currentTime = 0;
            break;
          case 'End':
            audio.currentTime = audio.duration;
            break;
          case 'PageUp':
            audio.currentTime = Math.min(
              audio.duration,
              audio.currentTime + AUDIO_CONFIG.SKIP_LARGE_SECONDS,
            );
            break;
          case 'PageDown':
            audio.currentTime = Math.max(0, audio.currentTime - AUDIO_CONFIG.SKIP_LARGE_SECONDS);
            break;
        }
        updateProgress();
        dispatchTimeEvent();
      }
    });

    player.addEventListener('keydown', (event) => {
      if (!(event instanceof KeyboardEvent)) {
        return;
      }
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      if (target.classList.contains('episode-player__progress')) {
        return;
      }
      if (['BUTTON', 'A', 'INPUT', 'TEXTAREA'].includes(target.tagName)) {
        return;
      }

      if (event.code === 'Space') {
        event.preventDefault();
        if (toggleButton instanceof HTMLButtonElement) {
          toggleButton.click();
        }
      } else if (event.code === 'ArrowLeft') {
        if (rewindButton instanceof HTMLButtonElement) {
          rewindButton.click();
        }
      } else if (event.code === 'ArrowRight') {
        if (forwardButton instanceof HTMLButtonElement) {
          forwardButton.click();
        }
      } else if (event.key === '?') {
        event.preventDefault();
        if (hint instanceof HTMLElement) {
          hint.classList.toggle('episode-player__shortcut-hint--hidden');
        }
      }
    });

    // Listen for transcript cue jumps.
    window.addEventListener('transcript:seek', (event) => {
      if (!(event instanceof CustomEvent)) {
        return;
      }
      const detail = event.detail;
      if (!detail || detail.playerId !== playerId) {
        return;
      }
      const targetTime = Number(detail.time);
      applySeek(targetTime, Boolean(detail.autoplay));
    });

    setStatus(`Paused: ${title}`);
    updateProgress();
    updateToggleButton();

    cleanupFunctions.push(() => controller.abort());
  });

  return () => cleanupFunctions.forEach((fn) => fn());
};

// Initialize using shared utility
createInitializer('AudioPlayer', initAudioPlayers)();
