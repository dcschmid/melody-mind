const MOOD_NAVIGATOR_SELECTOR = "[data-mood-navigator]";

interface MoodFilters {
  mood: string;
  energy: string;
  language: string;
  voice: string;
  time: string;
}

const FILTER_KEYS: Array<keyof MoodFilters> = [
  "mood",
  "energy",
  "language",
  "voice",
  "time",
];

const capitalize = (value: string): string =>
  value ? `${value.charAt(0).toLocaleUpperCase("en")}${value.slice(1)}` : value;

const humanize = (value: string): string => capitalize(value.replaceAll("-", " ").trim());

const parseMoods = (item: HTMLElement): string[] => {
  try {
    return JSON.parse(item.dataset.albumMoods || "[]") as string[];
  } catch {
    return [];
  }
};

const getFilters = (form: HTMLFormElement): MoodFilters => {
  const data = new FormData(form);

  return {
    mood: String(data.get("mood") || ""),
    energy: String(data.get("energy") || ""),
    language: String(data.get("language") || ""),
    voice: String(data.get("voice") || ""),
    time: String(data.get("time") || ""),
  };
};

const hasActiveFilters = (filters: MoodFilters): boolean =>
  FILTER_KEYS.some((key) => Boolean(filters[key]));

const itemMatches = (item: HTMLElement, filters: MoodFilters): boolean => {
  const moodFamilies = (item.dataset.moodFamilies || "").split(" ").filter(Boolean);
  const energy = item.dataset.albumEnergy || "";
  const language = item.dataset.albumLanguage || "";
  const voice = item.dataset.albumVoice || "";
  const durationSeconds = Number(item.dataset.albumDuration || 0);
  const maxDurationSeconds = Number(filters.time || 0) * 60;

  return (
    (!filters.mood || moodFamilies.includes(filters.mood)) &&
    (!filters.energy || energy === filters.energy) &&
    (!filters.language ||
      (filters.language === "non-english"
        ? language.toLocaleLowerCase("en") !== "english"
        : language === filters.language)) &&
    (!filters.voice ||
      voice === filters.voice ||
      (filters.voice === "vocal" && voice === "mixed")) &&
    (!maxDurationSeconds || durationSeconds <= maxDurationSeconds)
  );
};

const buildReason = (item: HTMLElement, filters: MoodFilters): string => {
  const rawMoods = parseMoods(item);
  const moodLabel = filters.mood
    ? `${humanize(filters.mood)} mood`
    : rawMoods.slice(0, 2).map(humanize).filter(Boolean).join(" and ");
  const energy = `${humanize(item.dataset.albumEnergy || "medium")} energy`;
  const language = item.dataset.albumLanguage || "";
  const voice = item.dataset.albumVoice || "vocal";
  const vocalLabel =
    voice === "instrumental"
      ? "Instrumental"
      : language && language !== "Instrumental"
        ? `${language} vocals`
        : "Vocal";
  const minutes = Math.max(1, Math.round(Number(item.dataset.albumDuration || 0) / 60));

  return [moodLabel, energy, vocalLabel, `${minutes} min`].filter(Boolean).join(" · ");
};

const buildSummary = (filters: MoodFilters, moodLabels: Map<string, string>): string => {
  if (!hasActiveFilters(filters)) {
    return "The full catalog is open.";
  }

  const parts = [
    filters.mood ? `${moodLabels.get(filters.mood) || humanize(filters.mood)} music` : "",
    filters.time ? `${filters.time} minutes or less` : "",
    filters.language === "non-english"
      ? "not in English"
      : filters.language
        ? `in ${filters.language}`
        : "",
    filters.energy ? `${filters.energy} energy` : "",
    filters.voice === "instrumental"
      ? "instrumental"
      : filters.voice === "vocal"
        ? "with vocals"
        : "",
  ].filter(Boolean);

  return `${capitalize(parts.join(", "))}.`;
};

const updateUrl = (filters: MoodFilters): void => {
  const url = new URL(window.location.href);

  FILTER_KEYS.forEach((key) => {
    if (filters[key]) {
      url.searchParams.set(key, filters[key]);
    } else {
      url.searchParams.delete(key);
    }
  });

  window.history.replaceState(window.history.state, "", url);
};

const restoreFormFromUrl = (form: HTMLFormElement): void => {
  const params = new URL(window.location.href).searchParams;

  FILTER_KEYS.forEach((key) => {
    const value = params.get(key) || "";
    const controls = Array.from(
      form.querySelectorAll<HTMLInputElement | HTMLSelectElement>(`[name="${key}"]`)
    );

    controls.forEach((control) => {
      if (control instanceof HTMLInputElement && control.type === "radio") {
        control.checked = control.value === value;
      } else if (
        control instanceof HTMLSelectElement &&
        Array.from(control.options).some((option) => option.value === value)
      ) {
        control.value = value;
      }
    });

    if (
      controls.some(
        (control) =>
          control instanceof HTMLInputElement &&
          control.type === "radio" &&
          control.checked
      )
    ) {
      return;
    }

    const defaultRadio = controls.find(
      (control) =>
        control instanceof HTMLInputElement &&
        control.type === "radio" &&
        control.value === ""
    );
    if (defaultRadio instanceof HTMLInputElement) {
      defaultRadio.checked = true;
    }
  });
};

const randomIndex = (length: number): number => {
  const values = new Uint32Array(1);
  window.crypto.getRandomValues(values);
  return Math.floor(((values[0] || 0) / 0x1_0000_0000) * length);
};

const bindMoodNavigator = (): void => {
  document.querySelectorAll<HTMLElement>(MOOD_NAVIGATOR_SELECTOR).forEach((root) => {
    if (root.dataset.moodNavigatorBound === "true") {
      return;
    }

    const form = root.querySelector<HTMLFormElement>("[data-mood-filter-form]");
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-mood-result]"));
    const count = root.querySelector<HTMLElement>("[data-mood-result-count]");
    const summary = root.querySelector<HTMLElement>("[data-mood-filter-summary]");
    const empty = root.querySelector<HTMLElement>("[data-mood-empty]");
    const surpriseButton = root.querySelector<HTMLButtonElement>("[data-mood-surprise]");
    const resetButtons = Array.from(
      root.querySelectorAll<HTMLButtonElement>("[data-mood-reset]")
    );
    const copyButton = root.querySelector<HTMLButtonElement>("[data-mood-copy]");
    const radioLink = root.querySelector<HTMLAnchorElement>("[data-mood-radio]");
    const actionStatus = root.querySelector<HTMLElement>("[data-mood-action-status]");
    const advancedToggle = root.querySelector<HTMLButtonElement>(
      "[data-mood-advanced-toggle]"
    );
    const advancedFilters = root.querySelector<HTMLElement>("[data-mood-advanced]");
    const mobileFiltersQuery = window.matchMedia("(max-width: 700px)");

    if (!form || !count || !summary || !empty || !surpriseButton) {
      return;
    }

    root.dataset.moodNavigatorBound = "true";
    const moodLabels = new Map(
      Array.from(form.querySelectorAll<HTMLInputElement>("[data-mood-label]")).map(
        (input) => [input.value, input.dataset.moodLabel || humanize(input.value)]
      )
    );
    let matchingItems: HTMLElement[] = [];

    const setActionStatus = (message: string): void => {
      if (actionStatus) {
        actionStatus.textContent = message;
      }
    };

    const applyFilters = (shouldUpdateUrl = true): void => {
      const filters = getFilters(form);
      matchingItems = [];

      items.forEach((item) => {
        const matches = itemMatches(item, filters);
        item.hidden = !matches;
        item.removeAttribute("data-surprise");

        const reason = item.querySelector<HTMLElement>("[data-mood-result-reason]");
        if (reason) {
          reason.textContent = buildReason(item, filters);
        }

        if (matches) {
          matchingItems.push(item);
        }
      });

      const albumLabel = matchingItems.length === 1 ? "album matches" : "albums match";
      count.textContent = `${matchingItems.length} ${albumLabel}`;
      summary.textContent = buildSummary(filters, moodLabels);
      empty.hidden = matchingItems.length > 0;
      surpriseButton.disabled = matchingItems.length === 0;
      if (radioLink) {
        radioLink.hidden = !filters.mood;
        radioLink.href = filters.mood
          ? `/radio/?station=mood-${encodeURIComponent(filters.mood)}`
          : "/radio/";
      }
      resetButtons.forEach((button) => {
        button.disabled = !hasActiveFilters(filters);
      });
      setActionStatus("");

      if (shouldUpdateUrl) {
        updateUrl(filters);
      }
    };

    restoreFormFromUrl(form);
    const setAdvancedOpen = (open: boolean): void => {
      advancedToggle?.setAttribute("aria-expanded", String(open));
      advancedFilters?.toggleAttribute("hidden", !open);
    };
    const syncAdvancedFilters = (): void => {
      if (!mobileFiltersQuery.matches) {
        setAdvancedOpen(true);
        return;
      }
      const filters = getFilters(form);
      setAdvancedOpen(
        Boolean(filters.energy || filters.language || filters.voice || filters.time)
      );
    };
    syncAdvancedFilters();
    applyFilters(false);

    advancedToggle?.addEventListener("click", () => {
      setAdvancedOpen(advancedToggle.getAttribute("aria-expanded") !== "true");
    });
    mobileFiltersQuery.addEventListener("change", syncAdvancedFilters);

    form.addEventListener("change", () => applyFilters());
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      applyFilters();
    });

    resetButtons.forEach((button) => {
      button.addEventListener("click", () => {
        form.reset();
        applyFilters();
        if (mobileFiltersQuery.matches) {
          setAdvancedOpen(false);
        }
        form.querySelector<HTMLInputElement>('[name="mood"][value=""]')?.focus();
      });
    });

    surpriseButton.addEventListener("click", () => {
      if (matchingItems.length === 0) {
        return;
      }

      items.forEach((item) => item.removeAttribute("data-surprise"));
      const selected = matchingItems[randomIndex(matchingItems.length)];
      if (!selected) {
        return;
      }

      selected.dataset.surprise = "true";
      const link = selected.querySelector<HTMLAnchorElement>("[data-mood-result-link]");
      selected.scrollIntoView({
        block: "center",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
      link?.focus({ preventScroll: true });
      setActionStatus(
        `${selected.dataset.albumTitle || "An album"} is your surprise pick.`
      );
    });

    copyButton?.addEventListener("click", async () => {
      updateUrl(getFilters(form));
      try {
        await navigator.clipboard.writeText(window.location.href);
        setActionStatus("Selection link copied.");
      } catch {
        setActionStatus(
          "Copy the current URL from your browser to share this selection."
        );
      }
    });

    window.addEventListener("popstate", () => {
      restoreFormFromUrl(form);
      applyFilters(false);
    });
  });
};

bindMoodNavigator();
document.addEventListener("astro:page-load", bindMoodNavigator);
