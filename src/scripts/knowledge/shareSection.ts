/**
 * Share Section Client Script
 *
 * Handles copy-to-clipboard and native share functionality for article sharing.
 * Extracted from [...slug].astro for caching and maintainability.
 */

export function initShareSection(): void {
  const shareSection = document.getElementById("share-section");
  if (!shareSection) return;

  const shareUrl = shareSection.dataset.shareUrl || "";
  const shareTitle = shareSection.dataset.shareTitle || "";
  const shareText = shareSection.dataset.shareText || "";
  const copySuccessMessage = shareSection.dataset.shareSuccess || "";
  const copyErrorMessage = shareSection.dataset.shareError || "";
  const nativeShareUnavailable = shareSection.dataset.shareFallback || "";
  const statusEl = shareSection.querySelector("[data-share-status]");
  const defaultStatus = statusEl?.textContent || "";
  let resetTimer: number | undefined;

  const setStatus = (message: string | null): void => {
    if (!statusEl) return;
    statusEl.textContent = message;
    if (resetTimer) window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      statusEl.textContent = defaultStatus;
    }, 4500);
  };

  const copyLink = async (): Promise<void> => {
    try {
      if (!navigator.clipboard) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(shareUrl);
      setStatus(copySuccessMessage);
    } catch {
      setStatus(copyErrorMessage);
    }
  };

  const copyButton = document.querySelector('[data-share="copy"]');
  copyButton?.addEventListener("click", () => copyLink());

  const nativeButton = document.querySelector('[data-share="native"]');
  nativeButton?.addEventListener("click", async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        setStatus(copySuccessMessage);
        return;
      } catch (error: unknown) {
        if ((error as Error)?.name === "AbortError") return;
      }
    }

    setStatus(nativeShareUnavailable);
    copyLink();
  });
}

// Auto-initialize when script loads
initShareSection();
