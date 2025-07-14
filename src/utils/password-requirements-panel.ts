/**
 * WCAG 2.2 AAA Compliant Password Requirements Panel
 * Enhanced keyboard navigation and accessibility features for password validation UI
 *
 * @fileoverview Provides accessibility-compliant interaction handling for password requirements
 * @module utils/password-requirements-panel
 * @since 1.0.0
 */

/**
 * Initialize the password requirements panel with enhanced accessibility features
 * Implements WCAG 2.2 AAA compliant keyboard navigation and screen reader support
 *
 * @param {string} positionText - Translation template for position announcements (e.g., "{{current}} of {{total}}")
 * @param {string} progressText - Translation template for progress announcements (e.g., "{{met}} of {{total}} requirements met")
 *
 * @example
 * ```typescript
 * import { initPasswordRequirementsPanel } from '@utils/password-requirements-panel';
 *
 * // Initialize with translation templates
 * initPasswordRequirementsPanel(
 *   "{{current}} of {{total}}",
 *   "{{met}} of {{total}} requirements met. {{percentage}}% complete."
 * );
 * ```
 */
export const initPasswordRequirementsPanel = (positionText: string, progressText: string): void => {
  const requirementsList = document.querySelector<HTMLElement>('[data-keyboard-nav="true"]');
  const statusElement = document.getElementById("password-requirements-status");

  if (!requirementsList) {
    return;
  }

  let currentIndex = 0;
  const requirements = Array.from(
    requirementsList.querySelectorAll<HTMLElement>(".password-requirements__item")
  );
  let isActive = false;

  /**
   * Handle keyboard navigation events for accessibility compliance
   * Supports arrow keys, Home/End, Escape, Space, and 'P' for progress announcement
   *
   * @param {KeyboardEvent} event - The keyboard event to handle
   */
  const handleKeyDown = (event: KeyboardEvent): void => {
    if (!isActive) {
      return;
    }

    const keyActions: Record<string, () => void> = {
      ArrowDown: () => {
        event.preventDefault();
        currentIndex = (currentIndex + 1) % requirements.length;
        focusCurrentRequirement();
        announceNavigation();
      },
      ArrowUp: () => {
        event.preventDefault();
        currentIndex = (currentIndex - 1 + requirements.length) % requirements.length;
        focusCurrentRequirement();
        announceNavigation();
      },
      Home: () => {
        event.preventDefault();
        currentIndex = 0;
        focusCurrentRequirement();
        announceNavigation();
      },
      End: () => {
        event.preventDefault();
        currentIndex = requirements.length - 1;
        focusCurrentRequirement();
        announceNavigation();
      },
      Escape: () => {
        event.preventDefault();
        exitKeyboardNavigation();
      },
      " ": () => {
        event.preventDefault();
        announceRequirementDetails(currentIndex);
      },
      Space: () => {
        event.preventDefault();
        announceRequirementDetails(currentIndex);
      },
      p: () => {
        event.preventDefault();
        announceProgress();
      },
      P: () => {
        event.preventDefault();
        announceProgress();
      },
    };

    const action = keyActions[event.key];
    if (action) {
      action();
    }
  };

  /**
   * Focus the current requirement item and update tabindex attributes
   * Ensures proper keyboard navigation flow
   */
  const focusCurrentRequirement = (): void => {
    requirements.forEach((req, index) => {
      req.setAttribute("tabindex", index === currentIndex ? "0" : "-1");
    });

    const currentRequirement = requirements[currentIndex];
    if (currentRequirement) {
      currentRequirement.focus();
    }
  };

  /**
   * Announce the current navigation position to screen readers
   * Provides context about which requirement is currently focused
   */
  const announceNavigation = (): void => {
    const current = requirements[currentIndex];
    if (!current || !statusElement) {
      return;
    }

    const reqTextElement = current.querySelector(".password-requirements__text");
    const reqText = reqTextElement?.textContent || "";
    const statusText = current.querySelector(".password-requirements__status");
    const status = statusText?.textContent || "";
    const currentPositionText = positionText
      .replace("{{current}}", String(currentIndex + 1))
      .replace("{{total}}", String(requirements.length));

    statusElement.textContent = `${reqText}, ${status}. ${currentPositionText}`;
  };

  /**
   * Announce the overall progress to screen readers
   * Provides summary of completed requirements and percentage
   */
  const announceProgress = (): void => {
    const metCount = requirements.filter((req) =>
      req.classList.contains("password-requirements__item--valid")
    ).length;
    const percentage = Math.round((metCount / requirements.length) * 100);

    if (!statusElement) {
      return;
    }

    const progressMessage = progressText
      .replace("{{met}}", String(metCount))
      .replace("{{total}}", String(requirements.length))
      .replace("{{percentage}}", String(percentage));
    statusElement.textContent = progressMessage;
  };

  /**
   * Announce detailed information about a specific requirement
   * Provides comprehensive description and status for screen readers
   *
   * @param {number} index - Index of the requirement to announce details for
   */
  const announceRequirementDetails = (index: number): void => {
    const requirement = requirements[index];
    if (!requirement || !statusElement) {
      return;
    }

    const reqTextElement = requirement.querySelector(".password-requirements__text");
    const reqText = reqTextElement?.textContent || "";
    const descriptionElement = requirement.querySelector('[id^="desc-"]');
    const description = descriptionElement?.textContent || "";
    const statusTextElement = requirement.querySelector(".password-requirements__status");
    const status = statusTextElement?.textContent || "";

    statusElement.textContent = `${reqText}. ${description}. ${status}`;
  };

  /**
   * Enter keyboard navigation mode
   * Activates enhanced keyboard interaction
   */
  const enterKeyboardNavigation = (): void => {
    isActive = true;
    currentIndex = 0;
    focusCurrentRequirement();
  };

  /**
   * Exit keyboard navigation mode
   * Returns focus to the main requirements list
   */
  const exitKeyboardNavigation = (): void => {
    isActive = false;
    requirements.forEach((req) => {
      req.setAttribute("tabindex", "-1");
    });

    if (requirementsList) {
      requirementsList.setAttribute("tabindex", "0");
      requirementsList.focus();
    }
  };

  // Event listeners for focus management with arrow functions
  requirementsList.addEventListener("focus", () => {
    if (!isActive) {
      enterKeyboardNavigation();
    }
  });

  requirementsList.addEventListener("blur", (event: FocusEvent) => {
    const { relatedTarget } = event;
    if (!requirementsList.contains(relatedTarget as Node)) {
      exitKeyboardNavigation();
    }
  });

  document.addEventListener("keydown", handleKeyDown);

  // Initialize component state
  if (requirementsList) {
    requirementsList.setAttribute("tabindex", "0");
    requirements.forEach((req) => {
      req.setAttribute("tabindex", "-1");
    });
  }
};
