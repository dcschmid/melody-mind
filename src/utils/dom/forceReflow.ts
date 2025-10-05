/**
 * forceReflow
 * ---------------------------------------------------------------------------
 * Minimal, centralized utility to intentionally trigger a browser layout
 * reflow. This is used sparingly as an accessibility assist to ensure
 * screen reader live regions announce updated text when simple textContent
 * changes are sometimes ignored by assistive tech (notably in Safari / VO).
 *
 * Rationale:
 *  - Some SR / browser combinations cache the live region node if only its
 *    textContent changes rapidly; forcing reflow before re‑setting text can
 *    improve announcement reliability.
 *  - Keeps the low-level "touch a layout property" hack in one place rather
 *    than distributing `el.offsetHeight` across multiple inline scripts.
 *  - Abstracted so we can later adjust the strategy (e.g., measure, scroll,
 *    or requestAnimationFrame wrapper) without editing every caller.
 *
 * Guardrails:
 *  - No-op for null/undefined inputs.
 *  - Intentionally silent on errors to avoid user-facing disruption.
 *  - Should only be used for a11y live-region refresh patterns – NOT as a
 *    generic animation tool (avoid layout thrash).
 *
 * Example:
 *  const region = document.getElementById('app-live-region');
 *  forceReflow(region);
 *  region.textContent = 'Score updated: 500';
 *
 * @param {HTMLElement | null | undefined} el Target element whose layout box
 *        will be read to force the reflow side-effect.
 */
export function forceReflow(el: HTMLElement | null | undefined): void {
  if (!el) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  el.offsetHeight; // Accessing layout property triggers reflow
}
