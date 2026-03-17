/**
 * Client-only episode search + load-more behavior for the homepage list.
 * Uses shared initialization utility for consistent setup.
 */
import { createInitializer } from './utils/init';
import { PAGINATION_CONFIG, SEARCH_CONFIG } from '../constants';
import { EpisodeArraySchema, type EpisodeEntry } from '../schemas/episode';
import { logError } from '../utils/error-handler';
import { isHTMLInputElement, isHTMLElement, isHTMLButtonElement } from '../utils/type-guards';

const initEpisodes = () => {
  const dataEl = document.querySelector('#episodes-data');
  const encoded = dataEl?.getAttribute('data-episodes') || '';

  let episodes: EpisodeEntry[] = [];
  try {
    const decoded = encoded
      ? new TextDecoder().decode(Uint8Array.from(atob(encoded), (char) => char.charCodeAt(0)))
      : '[]';
    const parsed = EpisodeArraySchema.parse(JSON.parse(decoded));
    episodes = parsed;
  } catch (error) {
    logError(error, 'parsing episode data');
    episodes = [];
  }

  const form = document.querySelector('.search-bar');
  if (!form) {
    return;
  }

  const input = form.querySelector('.search-bar__input');
  const clearButton = form.querySelector('.search-bar__clear');
  const status = form.querySelector('#search-status');
  const empty = form.querySelector('#search-empty');
  const list = document.querySelector('#episodes-list');
  const templateWrapper = document.querySelector('#episode-template');
  const loadMore = document.querySelector('#episodes-load-more');
  const loadMoreStatus = document.querySelector('#episodes-load-more-status');
  const loadMoreButton = document.querySelector('#episodes-load-more-button');

  if (
    !isHTMLInputElement(input) ||
    !isHTMLElement(list) ||
    !isHTMLElement(templateWrapper) ||
    !isHTMLElement(loadMore) ||
    !isHTMLElement(loadMoreStatus) ||
    !isHTMLButtonElement(loadMoreButton)
  ) {
    return;
  }

  const controller = new AbortController();
  const { signal } = controller;

  let debounceId: number | undefined;
  let query = '';
  let visibleCount = PAGINATION_CONFIG.EPISODES_PER_PAGE;

  const normalize = (value: string) => value.trim().toLowerCase();

  const buildEpisode = (episode: EpisodeEntry) => {
    const source = templateWrapper.firstElementChild;
    if (!(source instanceof HTMLElement)) {
      return null;
    }
    const node = source.cloneNode(true);
    if (!(node instanceof HTMLElement)) {
      return null;
    }

    node.setAttribute('data-search', episode.searchText || '');

    const image = node.querySelector('.episode-card__image');
    if (image instanceof HTMLImageElement) {
      // Update all sources (AVIF, WebP) and img fallback
      const picture = image.closest('picture');
      if (picture) {
        const sources = picture.querySelectorAll('source');
        sources.forEach((source) => {
          const type = source.getAttribute('type');
          if (type === 'image/avif') {
            source.srcset = `/images/${episode.imageUrl}.avif`;
          } else if (type === 'image/webp') {
            source.srcset = `/images/${episode.imageUrl}.webp`;
          }
        });
      }
      image.src = `/images/${episode.imageUrl}.jpg`;
      image.alt = `Cover art for the podcast episode ${episode.title}`;
    }

    const time = node.querySelector('.episode-card__date');
    if (time instanceof HTMLTimeElement) {
      time.dateTime = episode.publishedAt;
      time.textContent = episode.publishedLabel;
    }

    const badge = node.querySelector('.episode-card__badge');
    if (!episode.isLatest && badge) {
      badge.remove();
    }

    const duration = node.querySelector('.episode-card__duration');
    if (duration instanceof HTMLElement) {
      if (typeof episode.durationSeconds === 'number' && episode.durationSeconds > 0) {
        duration.textContent = `${Math.floor(episode.durationSeconds / 60)} min`;
      } else {
        duration.remove();
      }
    }

    const title = node.querySelector('.episode-card__title');
    if (title instanceof HTMLElement) {
      title.textContent = episode.title;
    }

    const description = node.querySelector('.episode-card__description');
    if (description instanceof HTMLElement) {
      description.textContent = episode.description;
    }

    const link = node.querySelector('.episode-card__link');
    if (link instanceof HTMLAnchorElement) {
      link.href = `/${episode.id}`;
      link.setAttribute('aria-label', `View the episode ${episode.title}`);
    }

    return node;
  };

  const updateStatus = (found: number, total: number) => {
    if (!(status instanceof HTMLElement)) {
      return;
    }
    const word = found === 1 ? 'episode' : 'episodes';
    const showing = Math.min(visibleCount, found);
    status.textContent = `Showing ${showing} of ${found} matching ${word} out of ${total}.`;
  };

  // Keep the search query in the URL for shareable results.
  const updateUrl = (currentQuery: string) => {
    const params = new URLSearchParams();
    if (currentQuery) {
      params.set('q', currentQuery);
    }
    const queryString = params.toString();
    const nextUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ''}`;
    window.history.replaceState(null, '', nextUrl);
  };

  // Render the filtered list and update status + load-more state.
  const render = () => {
    const normalized = normalize(query);
    const filtered = normalized
      ? episodes.filter((episode) => (episode.searchText || '').includes(normalized))
      : episodes;
    const total = episodes.length;
    const found = filtered.length;
    const visible = filtered.slice(0, visibleCount);

    list.innerHTML = '';
    visible.forEach((episode) => {
      const node = buildEpisode(episode);
      if (node) {
        list.appendChild(node);
      }
    });

    updateStatus(found, total);
    updateUrl(query);

    const showing = Math.min(visibleCount, found);
    loadMoreStatus.textContent = `Showing ${showing} of ${found} matching episodes.`;
    loadMore.hidden = found <= PAGINATION_CONFIG.EPISODES_PER_PAGE;
    loadMoreButton.disabled = showing >= found;

    if (empty instanceof HTMLElement) {
      empty.hidden = found !== 0;
    }
  };

  const initFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    query = params.get('q') || '';
    input.value = query;
  };

  form.addEventListener('submit', (event) => event.preventDefault(), { signal });

  input.addEventListener(
    'input',
    (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }
      const value = target.value;
      window.clearTimeout(debounceId);
      debounceId = window.setTimeout(() => {
        query = value;
        visibleCount = PAGINATION_CONFIG.EPISODES_PER_PAGE;
        render();
      }, SEARCH_CONFIG.DEBOUNCE_MS);
    },
    { signal },
  );

  clearButton?.addEventListener(
    'click',
    () => {
      input.value = '';
      input.focus();
      query = '';
      visibleCount = PAGINATION_CONFIG.EPISODES_PER_PAGE;
      render();
    },
    { signal },
  );

  loadMoreButton.addEventListener(
    'click',
    () => {
      visibleCount += PAGINATION_CONFIG.EPISODES_PER_PAGE;
      render();
    },
    { signal },
  );

  initFromUrl();
  render();
};

// Initialize using shared utility
createInitializer('Episodes', initEpisodes)();
