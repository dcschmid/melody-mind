/**
 * Client-only load-more behavior for the homepage list.
 * Uses shared initialization utility for consistent setup.
 */
import { createInitializer } from "./utils/init";
import { PAGINATION_CONFIG } from "../constants";
import { EpisodeArraySchema, type EpisodeEntry } from "../schemas/episode";
import { logError } from "../utils/error-handler";
import { isHTMLElement, isHTMLButtonElement } from "../utils/type-guards";

const initEpisodes = () => {
  const dataEl = document.querySelector("#episodes-data");
  const encoded = dataEl?.getAttribute("data-episodes") || "";

  let episodes: EpisodeEntry[] = [];
  try {
    const decoded = encoded
      ? new TextDecoder().decode(
          Uint8Array.from(atob(encoded), (char) => char.charCodeAt(0))
        )
      : "[]";
    const parsed = EpisodeArraySchema.parse(JSON.parse(decoded));
    episodes = parsed;
  } catch (error) {
    logError(error, "parsing episode data");
    episodes = [];
  }

  const list = document.querySelector("#episodes-list");
  const templateWrapper = document.querySelector("#episode-template");
  const loadMore = document.querySelector("#episodes-load-more");
  const loadMoreStatus = document.querySelector("#episodes-load-more-status");
  const loadMoreButton = document.querySelector("#episodes-load-more-button");

  if (
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

  let visibleCount = list.children.length || PAGINATION_CONFIG.EPISODES_PER_PAGE;

  const buildEpisode = (episode: EpisodeEntry) => {
    const source = templateWrapper.firstElementChild;
    if (!(source instanceof HTMLElement)) {
      return null;
    }
    const node = source.cloneNode(true);
    if (!(node instanceof HTMLElement)) {
      return null;
    }

    node.setAttribute("data-search", episode.searchText || "");

    const image = node.querySelector(".episode-card__image");
    if (image instanceof HTMLImageElement) {
      // Update all sources (AVIF, WebP) and img fallback
      const picture = image.closest("picture");
      if (picture) {
        const sources = picture.querySelectorAll("source");
        sources.forEach((source) => {
          const type = source.getAttribute("type");
          if (type === "image/avif") {
            source.srcset = `/images/${episode.imageUrl}.avif`;
          } else if (type === "image/webp") {
            source.srcset = `/images/${episode.imageUrl}.webp`;
          }
        });
      }
      image.src = `/images/${episode.imageUrl}.jpg`;
      image.alt = `Cover art for the podcast episode ${episode.title}`;
    }

    const time = node.querySelector(".episode-card__date");
    if (time instanceof HTMLTimeElement) {
      time.dateTime = episode.publishedAt;
      time.textContent = episode.publishedLabel;
    }

    const badge = node.querySelector(".episode-card__badge");
    if (!episode.isLatest && badge) {
      badge.remove();
    }

    const duration = node.querySelector(".episode-card__duration");
    if (duration instanceof HTMLElement) {
      if (typeof episode.durationSeconds === "number" && episode.durationSeconds > 0) {
        duration.textContent = `${Math.floor(episode.durationSeconds / 60)} min`;
      } else {
        duration.remove();
      }
    }

    const title = node.querySelector(".episode-card__title");
    if (title instanceof HTMLElement) {
      title.textContent = episode.title;
    }

    const description = node.querySelector(".episode-card__description");
    if (description instanceof HTMLElement) {
      description.textContent = episode.description;
    }

    const link = node.querySelector(".episode-card__link");
    if (link instanceof HTMLAnchorElement) {
      link.href = `/${episode.id}`;
      link.setAttribute("aria-label", `View the episode ${episode.title}`);
    }

    return node;
  };

  const render = () => {
    const total = episodes.length;
    const visible = episodes.slice(0, visibleCount);
    const currentCount = list.children.length;

    if (currentCount > visible.length) {
      list.innerHTML = "";
    }

    visible.slice(currentCount).forEach((episode) => {
      const node = buildEpisode(episode);
      if (node) {
        list.appendChild(node);
      }
    });

    const showing = Math.min(visible.length, total);
    loadMoreStatus.textContent = `Showing ${showing} of ${total} episodes.`;
    loadMore.hidden = total <= PAGINATION_CONFIG.EPISODES_PER_PAGE;
    loadMoreButton.disabled = showing >= total;
  };

  loadMoreButton.addEventListener(
    "click",
    () => {
      visibleCount += PAGINATION_CONFIG.EPISODES_PER_PAGE;
      render();
    },
    { signal }
  );

  render();
};

// Initialize using shared utility
createInitializer("Episodes", initEpisodes)();
