/* eslint-disable jsdoc/require-jsdoc, max-lines-per-function, curly */

export function createShareOverlay(container: HTMLElement): void {
  const status = container.querySelector<HTMLElement>("#share-status-announcer");
  const fallback = container.querySelector<HTMLElement>("#share-fallback-content");
  const retryButton = container.querySelector<HTMLButtonElement>("#retry-share-button");
  const manualCopyButton = container.querySelector<HTMLButtonElement>("#manual-copy-button");
  const copyButton = container.querySelector<HTMLButtonElement>("#copy-share-button");
  const copyButtonText = container.querySelector<HTMLElement>("#copy-button-text");
  const nativeShareButton = container.querySelector<HTMLButtonElement>("#native-share-button");
  const shareButtons = Array.from(
    container.querySelectorAll<HTMLButtonElement>("#share-buttons-container [data-share]")
  );

  const translationsAttr = container.getAttribute("data-share-translations");
  const translations = translationsAttr ? (JSON.parse(translationsAttr) as Record<string, string>) : {};

  let currentData = readGameData();

  function announce(message: string): void {
    if (!status || !message) return;
    status.textContent = "";
    status.textContent = message;
  }

  function readGameData(): ShareData | null {
    try {
      const attr = container.getAttribute("data-game-data");
      if (!attr) return null;
      const parsed = JSON.parse(attr) as ShareData;
      return validateShareData(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  function validateShareData(data: unknown): data is ShareData {
    if (!data || typeof data !== "object") return false;
    const candidate = data as ShareData;
    return (
      typeof candidate.score === "number" &&
      typeof candidate.category === "string" && candidate.category.trim().length > 0 &&
      typeof candidate.difficulty === "string" && candidate.difficulty.trim().length > 0
    );
  }

  function buildShareText(data: ShareData): string {
    const { score, category, difficulty, mode = "" } = data;
    const achievement = resolveAchievement(score);
    const difficultyLabel = getTranslation(`share.difficulty.${difficulty.toLowerCase()}`, difficulty);
    const pieces = [
      getTranslation("share.challenge", "MelodyMind"),
      getTranslation("share.score_line", ""),
      `Score: ${score}`,
      `Category: ${category}`,
      `Difficulty: ${difficultyLabel}`,
      achievement ? `Achievement: ${achievement}` : "",
      mode ? `Mode: ${mode}` : "",
      window.location.href,
    ];
    return pieces.filter(Boolean).join(" • ");
  }

  function getTranslation(key: string, fallback = ""): string {
    const value = translations[key];
    return typeof value === "string" ? value : fallback;
  }

  function resolveAchievement(score: number): string {
    try {
      const resolver = (window as unknown as { __resolveAchievement?: (value: number) => { id: string } })
        .__resolveAchievement;
      if (typeof resolver === "function") {
        const tier = resolver(score);
        const key = `share.achievement.${tier?.id ?? "explorer"}`;
        return getTranslation(key, tier?.id ?? "");
      }
    } catch {
      /* ignore */
    }
    if (score >= 800) return getTranslation("share.achievement.genius", "Genius");
    if (score >= 600) return getTranslation("share.achievement.pro", "Pro");
    if (score >= 400) return getTranslation("share.achievement.enthusiast", "Enthusiast");
    if (score >= 200) return getTranslation("share.achievement.lover", "Lover");
    return getTranslation("share.achievement.explorer", "Explorer");
  }

  function showFallback(message: string): void {
    if (fallback) {
      fallback.style.display = "block";
    }
    announce(message);
  }

  function hideFallback(): void {
    if (fallback) {
      fallback.style.display = "none";
    }
  }

  function notifyCopySuccess(): void {
    announce(getTranslation("share.accessibility.score_copied", "Link copied"));
    if (copyButtonText) {
      const original = getTranslation("share.copy.label", "Copy");
      copyButtonText.textContent = `${getTranslation("share.copy.copied_prefix", "✓")} ${original}`;
      window.setTimeout(() => {
        copyButtonText.textContent = original;
      }, 2000);
    }
  }

  async function copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      notifyCopySuccess();
    } catch {
      showFallback(getTranslation("share.accessibility.copy_failed_manual", "Copy failed"));
    }
  }

  async function handleShare(target: "twitter" | "whatsapp" | "email"): Promise<void> {
    if (!currentData) {
      showFallback(getTranslation("share.accessibility.data_unavailable", "No data"));
      return;
    }

    const shareText = buildShareText(currentData);

    try {
      if (target === "twitter") {
        const url = new URL("https://twitter.com/intent/tweet");
        url.searchParams.set("text", shareText);
        window.open(url.toString(), "_blank");
      } else if (target === "whatsapp") {
        const url = new URL("https://api.whatsapp.com/send");
        url.searchParams.set("text", shareText);
        window.open(url.toString(), "_blank");
      } else if (target === "email") {
        const subject = getTranslation("share.email.subject", "My MelodyMind score");
        const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(shareText)}`;
        window.open(mailto, "_blank");
      }
      announce(getTranslation("share.accessibility.score_shared", "Shared"));
    } catch {
      announce(getTranslation("share.accessibility.platform_share_failed", "Share failed"));
    }
  }

  const tryNativeShare = async (): Promise<void> => {
    if (!currentData || !navigator.share) {
      return;
    }
    try {
      await navigator.share({
        title: getTranslation("share.native.title", "MelodyMind"),
        text: buildShareText(currentData),
        url: window.location.href,
      });
      announce(getTranslation("share.accessibility.score_shared", "Shared"));
    } catch (error) {
      if (error && typeof (error as DOMException).name === "string" && (error as DOMException).name === "AbortError") {
        announce(getTranslation("share.accessibility.sharing_cancelled", "Share cancelled"));
      } else {
        announce(getTranslation("share.accessibility.native_share_failed", "Share failed"));
      }
    }
  };

  shareButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-share");
      if (target === "twitter" || target === "whatsapp" || target === "email") {
        void handleShare(target);
      }
    });
  });

  copyButton?.addEventListener("click", () => {
    if (!currentData) {
      showFallback(getTranslation("share.accessibility.data_unavailable", "No data"));
      return;
    }
    void copyToClipboard(buildShareText(currentData));
  });

  nativeShareButton?.addEventListener("click", () => {
    if (!navigator.share) {
      announce(getTranslation("share.accessibility.native_share_failed", "Share unsupported"));
      return;
    }
    void tryNativeShare();
  });

  retryButton?.addEventListener("click", () => {
    currentData = readGameData();
    if (currentData) {
      hideFallback();
      announce(getTranslation("share.accessibility.data_found", "Data ready"));
    } else {
      announce(getTranslation("share.accessibility.data_still_unavailable", "Still unavailable"));
    }
  });

  manualCopyButton?.addEventListener("click", () => {
    if (!currentData) {
      announce(getTranslation("share.accessibility.data_unavailable", "No data"));
      return;
    }
    const manualText = buildShareText(currentData);
    window.prompt(getTranslation("share.manual.prompt", "Copy the score"), manualText);
  });

  container.addEventListener("share-data-change", (event) => {
    const detail = (event as CustomEvent<ShareData>).detail;
    if (validateShareData(detail)) {
      currentData = detail;
      hideFallback();
    }
  });

  if (navigator.share) {
    nativeShareButton?.classList.remove("share-overlay__button--hidden");
  }

  if (!currentData) {
    announce(getTranslation("share.accessibility.data_unavailable", "No data"));
  }
}

export type ShareData = {
  score: number;
  category: string;
  difficulty: string;
  mode?: string;
};
