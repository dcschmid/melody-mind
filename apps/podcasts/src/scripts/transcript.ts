/**
 * Transcript loader + cue navigation wired to the audio player events.
 * Uses shared utilities for time formatting and initialization.
 */
import { formatTime, parseTimeToSeconds } from '../utils/format-time';
import { logError } from '../utils/error-handler';
import { createInitializer } from './utils/init';

type TranscriptCue = {
  start: string;
  startSeconds: number;
  text: string;
};

const initTranscripts = () => {
  const roots = document.querySelectorAll('.transcript');
  const cleanupFunctions: (() => void)[] = [];

  roots.forEach((root) => {
    const subtitleUrl = root.getAttribute('data-subtitle-url');
    if (!subtitleUrl) {
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    const playerId = root.getAttribute('data-player-id') || '';
    const details = root.querySelector('.transcript__details');
    const hint = root.querySelector('.transcript__summary-hint');
    const loading = root.querySelector('.transcript__status--loading');
    const error = root.querySelector('.transcript__status--error');
    const content = root.querySelector('.transcript__content');

    if (!(details instanceof HTMLDetailsElement)) {
      return;
    }
    if (!(content instanceof HTMLElement)) {
      return;
    }
    if (!(loading instanceof HTMLElement)) {
      return;
    }
    if (!(error instanceof HTMLElement)) {
      return;
    }
    if (!(hint instanceof HTMLElement)) {
      return;
    }

    let loaded = false;
    let loadingInProgress = false;
    let cues: TranscriptCue[] = [];
    let cueButtons: HTMLButtonElement[] = [];
    let activeCueIndex = -1;
    let lastAudioTime: number | null = null;

    const updateHint = () => {
      hint.textContent = details.open ? 'Hide transcript' : 'Show transcript';
    };

    const parseVtt = (vttText: string) => {
      const lines = vttText.split('\n');
      const parsedCues: TranscriptCue[] = [];
      let i = 0;

      while (i < lines.length && !(lines[i] ?? '').includes('-->')) {
        i += 1;
      }

      while (i < lines.length) {
        const line = (lines[i] ?? '').trim();
        if (line.includes('-->')) {
          const [startStr = ''] = line.split('-->').map((part) => part.trim());
          i += 1;
          let cueText = '';

          while (
            i < lines.length &&
            (lines[i] ?? '').trim() !== '' &&
            !(lines[i] ?? '').includes('-->')
          ) {
            cueText += (cueText ? ' ' : '') + (lines[i] ?? '').trim();
            i += 1;
          }

          cueText = cueText.replace(/<[^>]*>/g, '').trim();
          if (cueText) {
            parsedCues.push({
              start: startStr,
              startSeconds: parseTimeToSeconds(startStr),
              text: cueText,
            });
          }
        } else {
          i += 1;
        }
      }

      return parsedCues;
    };

    const renderCues = (nextCues: TranscriptCue[]) => {
      content.innerHTML = '';
      cueButtons = [];
      activeCueIndex = -1;
      nextCues.forEach((cue) => {
        const cueRow = document.createElement('button');
        cueRow.type = 'button';
        cueRow.className = 'transcript__cue';
        cueRow.dataset.start = cue.startSeconds.toString();
        cueRow.setAttribute('aria-label', `Jump to ${formatTime(cue.startSeconds)}`);

        const time = document.createElement('span');
        time.className = 'transcript__time';
        time.textContent = formatTime(cue.startSeconds);

        const text = document.createElement('span');
        text.className = 'transcript__text';
        text.textContent = cue.text;

        cueRow.appendChild(time);
        cueRow.appendChild(text);
        content.appendChild(cueRow);
        cueButtons.push(cueRow);
      });
    };

    /**
     * Binary search to find the active cue index.
     * O(log n) instead of O(n) for large transcripts.
     */
    const getActiveCueIndex = (currentTime: number): number => {
      if (!Number.isFinite(currentTime) || cues.length === 0) {
        return -1;
      }

      // Early exit if before first cue
      if (currentTime < cues[0]!.startSeconds) {
        return -1;
      }

      // Binary search
      let lo = 0;
      let hi = cues.length - 1;

      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        if (cues[mid]!.startSeconds <= currentTime) {
          lo = mid;
        } else {
          hi = mid - 1;
        }
      }

      return lo;
    };

    const setActiveCue = (nextIndex: number) => {
      if (nextIndex === activeCueIndex) {
        return;
      }
      if (activeCueIndex >= 0) {
        const previousButton = cueButtons[activeCueIndex];
        if (previousButton) {
          previousButton.classList.remove('transcript__cue--active');
          previousButton.removeAttribute('aria-current');
        }
      }
      activeCueIndex = nextIndex;
      if (activeCueIndex >= 0) {
        const nextButton = cueButtons[activeCueIndex];
        if (nextButton) {
          nextButton.classList.add('transcript__cue--active');
          nextButton.setAttribute('aria-current', 'true');
          nextButton.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    };

    // Notify the audio player to seek.
    const dispatchSeekEvent = (timeSeconds: number) => {
      if (!playerId || !Number.isFinite(timeSeconds)) {
        return;
      }
      window.dispatchEvent(
        new CustomEvent('transcript:seek', {
          detail: {
            playerId,
            time: timeSeconds,
            autoplay: true,
          },
        }),
      );
    };

    const loadTranscript = async () => {
      if (loaded || loadingInProgress) {
        return;
      }
      loadingInProgress = true;
      loading.hidden = false;
      error.hidden = true;
      content.hidden = true;

      try {
        const response = await fetch(subtitleUrl);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const contentType = response.headers.get('content-type') || '';
        const isValidType = contentType.includes('text/vtt') || contentType.includes('text/plain');

        if (!isValidType) {
          throw new Error(`Invalid content-type: ${contentType}. Expected text/vtt or text/plain.`);
        }

        const vttText = await response.text();
        const parsedCues = parseVtt(vttText);

        if (parsedCues.length === 0) {
          throw new Error('No cues found.');
        }

        cues = parsedCues;
        renderCues(cues);
        if (Number.isFinite(lastAudioTime)) {
          setActiveCue(getActiveCueIndex(lastAudioTime ?? 0));
        }
        content.hidden = false;
        loaded = true;
      } catch (err) {
        error.hidden = false;
        logError(err, 'loading transcript');
      } finally {
        loading.hidden = true;
        loadingInProgress = false;
      }
    };

    content.addEventListener(
      'click',
      (event) => {
        if (!(event.target instanceof Element)) {
          return;
        }
        const cueButton = event.target.closest('.transcript__cue');
        if (!(cueButton instanceof HTMLButtonElement)) {
          return;
        }
        const startSeconds = Number(cueButton.dataset.start);
        dispatchSeekEvent(startSeconds);
      },
      { signal },
    );

    window.addEventListener(
      'audio:time',
      (event) => {
        if (!(event instanceof CustomEvent)) {
          return;
        }
        const detail = event.detail;
        if (!detail || detail.playerId !== playerId) {
          return;
        }
        const currentTime = Number(detail.currentTime);
        if (!Number.isFinite(currentTime)) {
          return;
        }
        lastAudioTime = currentTime;
        if (!loaded || content.hidden || !details.open) {
          return;
        }
        setActiveCue(getActiveCueIndex(currentTime));
      },
      { signal },
    );

    details.addEventListener(
      'toggle',
      () => {
        updateHint();
        if (details.open) {
          loadTranscript();
          if (loaded && Number.isFinite(lastAudioTime)) {
            setActiveCue(getActiveCueIndex(lastAudioTime ?? 0));
          }
        }
      },
      { signal },
    );

    updateHint();

    cleanupFunctions.push(() => controller.abort());
  });

  return () => cleanupFunctions.forEach((fn) => fn());
};

// Initialize using shared utility
createInitializer('Transcript', initTranscripts)();
