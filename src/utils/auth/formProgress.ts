/**
 * Form Progress Management Utility
 *
 * Manages visual and accessible form completion progress indicators.
 * Updates progress bars, field completion status, and screen reader announcements
 * in real-time as users fill out forms.
 *
 * @accessibility Provides live region announcements for screen readers
 * @i18n Uses translated strings for progress status messages
 */

import { useTranslations } from "../i18n";

export interface FormField {
  id: string;
  indicator: string;
  required: boolean;
}

export interface FormProgressConfig {
  login: FormField[];
  register: FormField[];
}

/**
 * Initializes form progress tracking for authentication forms
 */
export function initializeFormProgress(): void {
  const currentLang = document.documentElement.lang || "en";
  const t = useTranslations(currentLang);

  // Form progress elements
  const progressBar = document.querySelector(".auth-form__progress-fill") as HTMLElement;
  const progressStatus = document.getElementById("progressStatus") as HTMLElement;
  const loginIndicators = document.getElementById("loginFieldIndicators") as HTMLElement;
  const registerIndicators = document.getElementById("registerFieldIndicators") as HTMLElement;

  // Form field mappings
  const formFields: FormProgressConfig = {
    login: [
      { id: "loginEmail", indicator: "loginEmail", required: true },
      { id: "loginPassword", indicator: "loginPassword", required: true },
    ],
    register: [
      { id: "registerEmail", indicator: "registerEmail", required: true },
      { id: "registerUsername", indicator: "registerUsername", required: false },
      { id: "registerPassword", indicator: "registerPassword", required: true },
      { id: "registerPasswordConfirm", indicator: "registerPasswordConfirm", required: true },
    ],
  };

  let currentMode: "login" | "register" = "login";

  /**
   * Updates progress indicators for the current form
   */
  function updateFormProgress(): void {
    const fields = formFields[currentMode];
    let completedRequired = 0;
    let totalRequired = 0;
    let completedOptional = 0;
    let totalOptional = 0;

    fields.forEach((field) => {
      const input = document.getElementById(field.id) as HTMLInputElement;
      const indicator = document.querySelector(`[data-field="${field.indicator}"]`) as HTMLElement;

      if (input && indicator) {
        const isCompleted = input.value.trim().length > 0;

        // Update indicator visual state
        indicator.classList.toggle("auth-form__indicator--completed", isCompleted);
        const icon = indicator.querySelector(".auth-form__indicator-icon") as HTMLElement;
        if (icon) {
          icon.textContent = isCompleted ? "●" : "○";
        }

        // Count completion
        if (field.required) {
          totalRequired++;
          if (isCompleted) {
            completedRequired++;
          }
        } else {
          totalOptional++;
          if (isCompleted) {
            completedOptional++;
          }
        }
      }
    });

    const totalCompleted = completedRequired + completedOptional;
    const totalFields = totalRequired + totalOptional;
    const progressPercentage =
      totalFields > 0 ? Math.round((totalCompleted / totalFields) * 100) : 0;

    // Update progress bar
    if (progressBar) {
      progressBar.style.width = `${progressPercentage}%`;
      const progressBarContainer = progressBar.closest('[role="progressbar"]') as HTMLElement;
      if (progressBarContainer) {
        progressBarContainer.setAttribute("aria-valuenow", progressPercentage.toString());
      }
    }

    // Update status text with screen reader announcement
    if (progressStatus) {
      const statusKey =
        currentMode === "login"
          ? "auth.form.progress.login_status"
          : "auth.form.progress.register_status";
      const statusText = t(statusKey, {
        completed: totalCompleted.toString(),
        total: totalFields.toString(),
      });
      progressStatus.textContent = statusText;

      // Additional completion announcement for screen readers
      if (progressPercentage === 100) {
        const completionText = t("auth.form.progress.completion_announced");
        progressStatus.setAttribute("aria-label", `${statusText} ${completionText}`);
      } else {
        progressStatus.removeAttribute("aria-label");
      }
    }
  }

  /**
   * Switches progress indicators between login and register modes
   */
  function switchProgressMode(mode: "login" | "register"): void {
    currentMode = mode;

    // Hide all indicators
    if (loginIndicators) {
      loginIndicators.classList.remove("auth-form__indicators--active");
    }
    if (registerIndicators) {
      registerIndicators.classList.remove("auth-form__indicators--active");
    }

    // Show current mode indicators
    const activeIndicators = mode === "login" ? loginIndicators : registerIndicators;
    if (activeIndicators) {
      activeIndicators.classList.add("auth-form__indicators--active");
    }

    // Update progress immediately
    updateFormProgress();
  }

  /**
   * Sets up event listeners for all form fields
   */
  function setupFieldListeners(): void {
    const allFields = [...formFields.login, ...formFields.register];

    allFields.forEach((field) => {
      const input = document.getElementById(field.id) as HTMLInputElement;
      if (input) {
        // Listen for input changes
        input.addEventListener("input", updateFormProgress);
        input.addEventListener("blur", updateFormProgress);
        input.addEventListener("change", updateFormProgress);
      }
    });
  }

  /**
   * Sets up tab switching event listeners for progress mode changes
   */
  function setupTabListeners(): void {
    const loginTab = document.getElementById("loginTab") as HTMLElement;
    const registerTab = document.getElementById("registerTab") as HTMLElement;

    if (loginTab) {
      loginTab.addEventListener("click", () => {
        switchProgressMode("login");
      });
    }

    if (registerTab) {
      registerTab.addEventListener("click", () => {
        switchProgressMode("register");
      });
    }
  }

  // Initialize progress indicators
  setupFieldListeners();
  setupTabListeners();

  // Set initial mode based on active tab
  const activeTab = document.querySelector(".auth-form__tab--active") as HTMLElement;
  if (activeTab && activeTab.id === "registerTab") {
    switchProgressMode("register");
  } else {
    switchProgressMode("login");
  }
}
