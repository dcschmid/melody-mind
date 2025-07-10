# Comprehensive Accessibility Review Guide (WCAG 2.2 AAA)

Your goal is to perform a thorough accessibility review of MelodyMind code to ensure compliance with
the latest WCAG 2.2 AAA standards, which represent the highest level of accessibility. This guide
focuses specifically on Astro.js components and implementation.

**Important**: All documentation must be written in English, regardless of the user interface
language. This includes code comments, JSDoc, Markdown files, and any other form of documentation.

## Review Focus Areas

If a specific file isn't provided, ask for:

- The component or page to review
- Any specific accessibility concerns to address
- The target audience and their potential needs
- Primary input methods (touchscreen, keyboard, assistive technology)

## WCAG 2.2 AAA Requirements

### Perceivable Content

- Color contrast: 7:1 for normal text, 4.5:1 for large text (≥18pt or ≥14pt bold)
- Text spacing: Support for 2x letter spacing, 1.5x line height, 2x paragraph spacing
- No content restriction based on orientation (portrait/landscape)
- Text alternatives for all non-text content (with contextual descriptions)
- Text resizing up to 400% without loss of content or functionality
- Audio descriptions for all video content
- Sign language interpretation for all audio content
- Support for text adaptation and personalization (2.2)
- Enhanced image descriptions for complex images (2.2)

### Operable Interface

- Keyboard navigation: all functionality accessible via keyboard without specific timings
- No keyboard traps or focus order issues
- Timeout warnings with option to extend session (minimum 20 seconds)
- Content that moves, blinks or scrolls automatically must be able to be paused
- Touch targets minimum size of 44x44 pixels with proper spacing
- Multiple ways to locate content (search, site map, navigation menus)
- Section headings to organize content
- Ability to disable motion animation triggered by interaction
- Target size minimum of 44x44 pixels (WCAG 2.2)
- Dragging movements can be accomplished with a single pointer without dragging (WCAG 2.2)
- Enhanced focus appearance with minimum contrast ratio of 4.5:1 (2.2)
- Fixed reference points across multiple presentations of content (2.2)
- Authentication methods without reliance on cognitive tests (2.2)
- Accessible authentication without time limits (2.2)

### Understandable Design

- Consistent identification of components with similar functionality
- Predictable changes in context (no unexpected actions)
- Visible focus indicators (3px solid border minimum)
- Context-sensitive help available
- Error prevention for all user submissions (reversible, checked, or confirmed)
- Consistent navigation and component identification
- Clear identification of required input fields (2.2)

### Robust Implementation

- Clean, valid HTML with proper element nesting
- Name, role, and value available for all UI components
- Status messages can be programmatically determined (WCAG 2.2)
- UI component state changes are announced to assistive technologies
- Accessible authentication across assistive technologies (2.2)

## Advanced Review Structure

1. **Content Structure Analysis**
   - Semantic HTML evaluation
   - Document outline and heading hierarchy
   - Content organization and predictability
   - Astro component structure assessment

2. **Interface Interaction Assessment**
   - Keyboard navigation testing
   - Touch/pointer interaction evaluation
   - Gesture alternatives
   - Timing controls and adjustments
   - Astro client-side hydration assessment

3. **Information Conveyance Review**
   - Text alternatives quality
   - ARIA implementation correctness
   - State and property communication
   - Error identification and suggestions
   - Astro island accessibility assessment

4. **Sensory Adaptability Check**
   - Visual presentation flexibility
   - Audio/video alternatives
   - Contrast and color independence
   - Reduced motion support
   - Media query implementation for preferences

5. **Technical Robustness Verification**
   - HTML validity
   - Compatibility with assistive technologies
   - Responsive adaptation
   - Cross-device functionality
   - Astro build output assessment

6. **Detailed Recommendations**
   - Prioritized improvement suggestions
   - Implementation examples
   - Progressive enhancement approach
   - Astro-specific best practices

## Documentation Requirements

After completing the accessibility review, you MUST create a Markdown documentation file with the
following characteristics:

1. **File Location**: Always save the report in the `docs/accessibility/` directory
2. **File Naming**: Use the format `ComponentName-Accessibility-Review-YYYYMMDD.md` (e.g.,
   `QuestionCard-Accessibility-Review-20250512.md`)
3. **Language**: The documentation MUST be written in English, regardless of the user interface
   language
4. **Content Structure**: The Markdown file should include:
   - Title with component name and review date
   - Executive summary with key findings
   - Compliance level assessment (e.g., "85% WCAG 2.2 AAA compliant")
   - Detailed findings for each review category
   - Prioritized recommendations for improvements
   - Code examples demonstrating fixes
   - Date and reviewer information

### Markdown Template

````markdown
# Accessibility Review: [Component Name] - [YYYY-MM-DD]

## Executive Summary

This accessibility review evaluates the [Component Name] component against WCAG 2.2 AAA standards.
The component [brief assessment of compliance level and major issues/strengths].

**Compliance Level**: [X]% WCAG 2.2 AAA compliant

**Key Strengths**:

- [Strength 1]
- [Strength 2]
- [Strength 3]

**Critical Issues**:

- [Issue 1]
- [Issue 2]
- [Issue 3]

## Detailed Findings

### Content Structure Analysis

[List of findings with ✅ for compliant items and ❌ for issues]

### Interface Interaction Assessment

[List of findings with ✅ for compliant items and ❌ for issues]

### Information Conveyance Review

[List of findings with ✅ for compliant items and ❌ for issues]

### Sensory Adaptability Check

[List of findings with ✅ for compliant items and ❌ for issues]

### Technical Robustness Verification

[List of findings with ✅ for compliant items and ❌ for issues]

## Prioritized Recommendations

1. [High Priority] [Recommendation 1]:
   ```astro
   // Code example showing implementation
   ```
````

2. [Medium Priority] [Recommendation 2]:

   ```astro
   // Code example showing implementation
   ```

3. [Low Priority] [Recommendation 3]:
   ```astro
   // Code example showing implementation
   ```

## Implementation Timeline

- **Immediate (1-2 days)**: Address critical issues that block access for users with disabilities
- **Short-term (1-2 weeks)**: Implement high-priority recommendations
- **Medium-term (2-4 weeks)**: Address medium-priority items
- **Long-term (1-3 months)**: Complete all remaining improvements

## Review Information

- **Review Date**: [YYYY-MM-DD]
- **Reviewer**: [Reviewer Name/System]
- **WCAG Version**: 2.2 AAA
- **Testing Methods**: [Methods used for testing]

```

After completing your review, you MUST create this Markdown documentation file in addition to providing your findings to the user. This documentation will be part of the project's accessibility compliance records.

### Documentation Creation Process

1. After completing your review and sharing the results with the user, create the Markdown documentation file using the following process:

2. **Generate File Path**:
   - Use the component name and current date to create the filename
   - Format: `docs/accessibility/ComponentName-Accessibility-Review.md`
   - Example: `docs/accessibility/QuestionCard-Accessibility-Review.md`

3. **Format Content**:
   - Use the Markdown template provided above
   - Fill in all sections based on your review findings
   - Include code examples with proper syntax highlighting
   - Ensure all content is in English

4. **Save the File**:
   - Use the appropriate method to create and save the file in the workspace
   - For GitHub Copilot, use the `create_file` tool to save the documentation
   - Example usage:
```

create_file({ filePath:
"/path/to/docs/accessibility/ComponentName-Accessibility-Review-YYYYMMDD.md", content: "#
Accessibility Review: ComponentName - YYYY-MM-DD\n\n..." })

```

5. **Confirm to User**:
- After creating the documentation file, inform the user that the accessibility review report has been saved
- Provide the path to the saved file

This documentation process must be followed for every accessibility review to maintain a consistent record of accessibility assessments and improvements throughout the project's development lifecycle.

## Example Review for an Astro Component

```

## Accessibility Review: QuestionCard.astro

### Content Structure Analysis

✅ Uses proper semantic elements with h2 for questions and ul/li for options ✅ Maintains logical
reading order matching visual presentation ❌ Missing document landmark (should be wrapped in <main>
or <section> with appropriate role) ✅ Proper heading hierarchy with no skipped levels ❌ Missing
page title update to reflect current question number

### Interface Interaction Assessment

✅ All interactive elements accessible via keyboard with tab order matching visual flow ✅ Focus is
visibly indicated with high contrast outline (3px solid #f0abfc) ❌ Timer lacks ability to be paused
or extended when needed ❌ Answer selection can't be activated with both Space and Enter keys ❌ No
way to operate via single-key shortcuts with ability to remap/disable ✅ Touch target size adequate
at 48x48px minimum ❌ Client-side hydration lacks a fallback for non-JavaScript environments

### Information Conveyance Review

✅ Uses aria-current="true" for selected answer ❌ Missing aria-live regions for timer and score
updates ❌ Missing aria-describedby to link error messages with inputs ❌ Input error suggestions
not programmatically associated ❌ Status changes not properly announced to screen readers ✅ All
text has sufficient color contrast (12:1 for question text) ❌ Astro island script not communicating
state changes to assistive technologies

### Sensory Adaptability Check

❌ Option hover state has insufficient contrast (3.8:1, needs 7:1) ❌ No support for 400% text zoom
without horizontal scrolling ❌ Animation of timer lacks reduced motion alternative ✅ Color not
used as the only means of conveying information ✅ Audio feedback has visual alternative ❌ Missing
prefers-reduced-data media query support

### Technical Robustness Verification

❌ Uses div for clickable elements instead of semantic buttons ❌ Missing role="timer" for countdown
element ❌ Focus not properly managed when modal dialogs appear/close ✅ HTML structure validates
without errors ✅ Works across different device sizes ❌ Client-side interactive elements not fully
accessible when partially hydrated

### Detailed Recommendations

1. Replace non-semantic clickable divs with proper button elements:

```astro
---
// Before
---

<div onClick={selectAnswer} class="answer-option">
  {option}
</div>

--- // After ---
<button
  onClick={selectAnswer}
  class="answer-option"
  aria-pressed={selectedAnswer === index ? "true" : "false"}
>
  {option}
</button>
```

2. Add proper ARIA live regions for dynamic content with appropriate politeness levels:

```astro
---
// Add import for necessary utilities
import { getLangFromUrl, useTranslations } from "@utils/i18n";

// Get language and translations
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);

// Component props and setup
---

{/* For critical time updates */}
<div aria-live="assertive" aria-atomic="true" class="visually-hidden">
  {timeRemaining < 10 ? `${t("timer.warning", { time: timeRemaining })}` : ""}
</div>

{/* For score updates */}
<div
  aria-live="polite"
  aria-atomic="true"
  class="timer-display"
  role="timer"
  aria-label={t("timer.label")}
>
  {t("timer.display", { time: timer })}
</div>
```

3. Improve contrast for interactive states while maintaining design aesthetics:

```astro
<style>
  /* Before */
  .answer-option:hover {
    background-color: #6b46c1; /* 3.8:1 contrast ratio */
  }

  /* After */
  .answer-option:hover {
    background-color: #4c1d95; /* 8.1:1 contrast ratio */
    box-shadow: 0 0 0 2px var(--color-purple-400); /* Additional visual indicator */
  }

  /* Focus state */
  .answer-option:focus-visible {
    outline: 3px solid var(--color-purple-300);
    outline-offset: 2px;
    box-shadow: 0 0 0 2px rgba(var(--color-purple-300-rgb), 0.5);
  }

  /* High Contrast Mode Support */
  @media (forced-colors: active) {
    .answer-option {
      border: 2px solid ButtonText;
      forced-color-adjust: none;
    }

    .answer-option:focus-visible {
      outline: 3px solid Highlight;
    }
  }
</style>
```

4. Implement comprehensive focus management system for modals in Astro:

```astro
---
// FocusManager.astro component
export interface Props {
  dialogId: string;
  initialFocusId?: string;
}

const { dialogId, initialFocusId } = Astro.props;
---

<script define:vars={{ dialogId, initialFocusId }}>
  // Focus management utility for Astro components
  class FocusManagerUtil {
    dialogEl;
    lastFocus = null;
    focusableElements = [];

    constructor(dialogId, initialFocusId) {
      document.addEventListener("DOMContentLoaded", () => {
        this.dialogEl = document.getElementById(dialogId);
        if (!this.dialogEl) return;

        this.setupTrapFocus();

        // Watch for dialog open/close
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.attributeName === "open" || mutation.attributeName === "aria-hidden") {
              const isVisible =
                this.dialogEl.hasAttribute("open") ||
                this.dialogEl.getAttribute("aria-hidden") === "false";

              if (isVisible) {
                this.saveCurrentFocus();
                this.trapFocus();
              } else {
                this.restoreFocus();
              }
            }
          });
        });

        observer.observe(this.dialogEl, { attributes: true });
      });
    }

    saveCurrentFocus() {
      this.lastFocus = document.activeElement;
    }

    setupTrapFocus() {
      this.focusableElements = Array.from(
        this.dialogEl.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      );
    }

    trapFocus() {
      if (this.focusableElements.length === 0) return;

      const firstElement = this.focusableElements[0];
      const lastElement = this.focusableElements[this.focusableElements.length - 1];

      // Focus on specified element or first focusable element
      const initialElement = initialFocusId
        ? document.getElementById(initialFocusId)
        : firstElement;

      if (initialElement) {
        setTimeout(() => initialElement.focus(), 50);
      }

      // Set up event listener for tab key
      this.dialogEl.addEventListener("keydown", (e) => {
        if (e.key !== "Tab") return;

        // Shift+Tab on first element circles to last
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
        // Tab on last element circles to first
        else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      });

      // Handle Escape key
      this.dialogEl.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          // Find and trigger close button if available
          const closeBtn = this.dialogEl.querySelector("[data-close-dialog]");
          if (closeBtn) closeBtn.click();
        }
      });
    }

    restoreFocus() {
      if (this.lastFocus) {
        setTimeout(() => this.lastFocus.focus(), 50);
      }
    }
  }

  // Initialize the focus manager
  new FocusManagerUtil(dialogId, initialFocusId);
</script>
```

5. Add pause/resume functionality for the timer with keyboard shortcuts:

```astro
---
// QuestionTimer.astro
interface Props {
  time: number;
  initialIsPaused?: boolean;
}

const { time, initialIsPaused = false } = Astro.props;
const timerId = `timer-${Math.random().toString(36).substring(2, 8)}`;
---

<div class="timer-container">
  <div
    id={timerId}
    role="timer"
    aria-label={`Time remaining: ${time} seconds${initialIsPaused ? ", paused" : ""}`}
    aria-live="polite"
    class="timer-display"
    data-time={time}
    data-paused={initialIsPaused}
  >
    {time}s {initialIsPaused && "(Paused)"}
  </div>

  <button
    id={`${timerId}-control`}
    class="timer-control"
    aria-pressed={initialIsPaused}
    aria-controls={timerId}
  >
    {initialIsPaused ? "Resume Timer" : "Pause Timer"}
  </button>

  <div class="visually-hidden">Press P to pause or resume the timer</div>
</div>

<script define:vars={{ timerId, initialIsPaused }}>
  document.addEventListener("DOMContentLoaded", () => {
    const timerEl = document.getElementById(timerId);
    const controlBtn = document.getElementById(`${timerId}-control`);
    let isPaused = initialIsPaused;
    let timeRemaining = parseInt(timerEl.dataset.time || "0");
    let intervalId = null;

    function updateTimerDisplay() {
      timerEl.textContent = `${timeRemaining}s${isPaused ? " (Paused)" : ""}`;
      timerEl.setAttribute(
        "aria-label",
        `Time remaining: ${timeRemaining} seconds${isPaused ? ", paused" : ""}`
      );
    }

    function togglePause() {
      isPaused = !isPaused;

      if (isPaused) {
        clearInterval(intervalId);
        intervalId = null;
      } else {
        startTimer();
      }

      controlBtn.textContent = isPaused ? "Resume Timer" : "Pause Timer";
      controlBtn.setAttribute("aria-pressed", isPaused.toString());
      updateTimerDisplay();
    }

    function startTimer() {
      if (intervalId) clearInterval(intervalId);

      intervalId = setInterval(() => {
        if (isPaused) return;

        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
          clearInterval(intervalId);
          // Dispatch event for time expired
          timerEl.dispatchEvent(new CustomEvent("timerExpired"));
        }
      }, 1000);
    }

    // Initialize timer if not paused
    if (!isPaused) {
      startTimer();
    }

    // Set up button control
    controlBtn.addEventListener("click", togglePause);

    // Set up keyboard shortcut
    document.addEventListener("keydown", (e) => {
      if (
        e.key.toLowerCase() === "p" &&
        !e.ctrlKey &&
        !e.altKey &&
        !e.metaKey &&
        !e.target.matches('input, textarea, select, [contenteditable="true"]')
      ) {
        togglePause();
      }
    });
  });
</script>

<style>
  /* Base styles */
  .timer-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .timer-display {
    font-weight: bold;
    min-width: 4rem;
  }

  .timer-control {
    padding: 0.5rem 1rem;
    min-height: 44px;
    min-width: 44px;
    border-radius: 0.25rem;
    background-color: var(--color-gray-200);
    color: var(--color-gray-900);
    font-weight: 500;
  }

  .timer-control:hover {
    background-color: var(--color-gray-300);
  }

  .timer-control:focus-visible {
    outline: 3px solid var(--color-purple-300);
    outline-offset: 2px;
  }

  /* Visually hidden content - screen reader only */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Reduced Motion Support */
  @media (prefers-reduced-motion: reduce) {
    /* Remove transitions and animations */
    .timer-display,
    .timer-control {
      transition: none !important;
    }
  }
</style>
```

6. Implement responsive design that supports 400% zoom:

```astro
<style>
  /* Responsive container that works with extreme zoom levels */
  .question-card {
    max-width: 100%;
    overflow-x: auto; /* Allow horizontal scroll only when needed */
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
  }

  /* Ensure text wraps properly */
  .question-text,
  .answer-option {
    overflow-wrap: break-word;
    word-break: break-word;
    hyphens: auto;
  }

  /* Make sure controls stay usable at any zoom level */
  @media screen and (max-width: 400px), (forced-colors: active), (min-resolution: 3dppx) {
    .question-controls {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .answer-option {
      min-height: 44px; /* Maintain touch target size */
      width: 100%;
      margin: 0.5rem 0;
    }
  }

  /* Support for prefers-reduced-data */
  @media (prefers-reduced-data: reduce) {
    /* Use lower-resolution images or hide non-essential media */
    .decorative-image {
      display: none;
    }

    /* Use system fonts instead of custom web fonts */
    body {
      font-family: system-ui, sans-serif;
    }
  }
</style>
```

7. Add support for WCAG 2.2 Focus Appearance (Enhanced) requirements:

```astro
<style>
  /* WCAG 2.2 AAA compliant focus styles */
  :global(:focus-visible) {
    outline: 3px solid var(--color-purple-300); /* High visibility color */
    outline-offset: 3px; /* Creates larger effective focus area */
    /* For Windows High Contrast Mode & additional visual indicator */
    box-shadow: 0 0 0 3px rgba(var(--color-purple-300-rgb), 0.5);
  }

  /* Ensuring contrast between focused and unfocused states */
  .btn {
    background-color: var(--color-purple-800); /* Purple base color */
    color: var(--color-white);
    transition: background-color 0.2s;
  }

  .btn:focus-visible {
    background-color: var(
      --color-purple-600
    ); /* Lighter purple for 4.5:1 contrast ratio with base */
    outline: 3px solid var(--color-purple-300);
    outline-offset: 3px;
  }

  /* Ensure minimum area for focus indicators */
  .small-control:focus-visible {
    /* Min area of 8px x 8px with at least 2px solid border */
    outline-width: 2px;
    min-width: 8px;
    min-height: 8px;
  }
</style>
```

8. Implement Fixed Reference Points for content with multiple versions:

```astro
---
// StableContent.astro - For content that must maintain reference points
interface Props {
  contentId: string;
}

const { contentId } = Astro.props;
---

<div id={contentId} class="stable-content">
  <slot />
</div>

<script>
  // Add unique permanent ID anchors to all sections
  document.addEventListener("DOMContentLoaded", () => {
    document
      .querySelectorAll(".stable-content h2, .stable-content h3, .stable-content h4")
      .forEach((heading) => {
        if (!heading.id) {
          // Create stable hash from heading text
          const slug = heading.textContent
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

          // Add data attribute to track generated IDs
          heading.setAttribute("data-generated-id", "true");

          // Set the ID
          heading.id = slug;

          // Add accessible permalink
          const permalink = document.createElement("a");
          permalink.className = "permalink";
          permalink.href = `#${heading.id}`;
          permalink.setAttribute("aria-label", `Permalink to "${heading.textContent}"`);
          permalink.innerHTML = '<span class="permalink-icon" aria-hidden="true">#</span>';
          heading.appendChild(permalink);
        }
      });
  });
</script>

<style>
  /* Permalink styling */
  .permalink {
    opacity: 0;
    display: inline-block;
    margin-left: 0.5rem;
    text-decoration: none;
    color: inherit;
    transition: opacity 0.2s;
  }

  .permalink-icon {
    font-size: 0.8em;
  }

  h2:hover .permalink,
  h3:hover .permalink,
  h4:hover .permalink,
  .permalink:focus {
    opacity: 1;
  }

  /* Make permalinks work with reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    .permalink {
      opacity: 0.7;
      transition: none;
    }
  }
</style>
```

9. Add alternatives to dragging interactions:

```astro
---
// DraggableItem.astro
interface Props {
  id: string;
  title: string;
  defaultPosition?: number;
  totalItems?: number;
}

const { id, title, defaultPosition = 0, totalItems = 0 } = Astro.props;
const itemId = `draggable-${id}`;
---

<div
  id={itemId}
  class="draggable-item"
  draggable="true"
  aria-grabbed="false"
  data-position={defaultPosition}
  data-draggable
>
  {/* Draggable content */}
  <div class="draggable-item__content">
    <h3>{title}</h3>
    <slot />
  </div>

  {/* Non-dragging alternative */}
  <div class="draggable-item__controls" aria-label="Position controls">
    {/* Up/down buttons as alternative to drag */}
    <button
      class="draggable-item__btn draggable-item__btn--up"
      aria-label={`Move ${title} up`}
      data-move="up"
      disabled={defaultPosition <= 0}
    >
      <span aria-hidden="true">↑</span>
    </button>

    <button
      class="draggable-item__btn draggable-item__btn--down"
      aria-label={`Move ${title} down`}
      data-move="down"
      disabled={defaultPosition >= totalItems - 1}
    >
      <span aria-hidden="true">↓</span>
    </button>

    {/* Direct position selector as another alternative */}
    <label class="visually-hidden" for={`${itemId}-position`}> Move to position </label>
    <select
      id={`${itemId}-position`}
      aria-label={`Move ${title} to position`}
      class="draggable-item__select"
      data-position-select
    >
      {
        Array.from({ length: totalItems }, (_, i) => (
          <option value={i} selected={i === defaultPosition}>
            Position {i + 1}
          </option>
        ))
      }
    </select>
  </div>
</div>

<script define:vars={{ itemId, totalItems }}>
  document.addEventListener("DOMContentLoaded", () => {
    const itemEl = document.getElementById(itemId);
    if (!itemEl) return;

    // Set up drag and drop
    itemEl.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", itemId);
      itemEl.setAttribute("aria-grabbed", "true");
      itemEl.classList.add("draggable-item--dragging");

      // Announce to screen readers
      const liveRegion = document.querySelector('[aria-live="assertive"]');
      if (liveRegion) {
        liveRegion.textContent = `Dragging ${itemEl.querySelector("h3").textContent}`;
      }
    });

    itemEl.addEventListener("dragend", () => {
      itemEl.setAttribute("aria-grabbed", "false");
      itemEl.classList.remove("draggable-item--dragging");

      // Clear announcement
      const liveRegion = document.querySelector('[aria-live="assertive"]');
      if (liveRegion) {
        liveRegion.textContent = "";
      }
    });

    // Non-drag alternatives
    const upBtn = itemEl.querySelector('[data-move="up"]');
    const downBtn = itemEl.querySelector('[data-move="down"]');
    const positionSelect = itemEl.querySelector("[data-position-select]");

    upBtn?.addEventListener("click", () => moveItem("up"));
    downBtn?.addEventListener("click", () => moveItem("down"));
    positionSelect?.addEventListener("change", (e) => {
      const newPosition = parseInt(e.target.value);
      moveToPosition(newPosition);
    });

    function moveItem(direction) {
      const container = itemEl.parentNode;
      const items = Array.from(container.querySelectorAll("[data-draggable]"));
      const currentIndex = items.indexOf(itemEl);
      let newIndex;

      if (direction === "up" && currentIndex > 0) {
        newIndex = currentIndex - 1;
      } else if (direction === "down" && currentIndex < items.length - 1) {
        newIndex = currentIndex + 1;
      } else {
        return; // Can't move in this direction
      }

      // Reorder in the DOM
      const targetItem = items[newIndex];
      if (direction === "up") {
        container.insertBefore(itemEl, targetItem);
      } else {
        container.insertBefore(itemEl, targetItem.nextSibling);
      }

      // Update positions and controls states
      updatePositionsAfterMove();
    }

    function moveToPosition(newPosition) {
      const container = itemEl.parentNode;
      const items = Array.from(container.querySelectorAll("[data-draggable]"));
      const currentPosition = parseInt(itemEl.dataset.position);

      if (newPosition === currentPosition) return;

      // Find target item to insert before or after
      const targetItem = items.find((item) => parseInt(item.dataset.position) === newPosition);

      if (targetItem) {
        if (newPosition < currentPosition) {
          container.insertBefore(itemEl, targetItem);
        } else {
          container.insertBefore(itemEl, targetItem.nextSibling);
        }
      }

      // Update positions
      updatePositionsAfterMove();
    }

    function updatePositionsAfterMove() {
      const container = itemEl.parentNode;
      const items = Array.from(container.querySelectorAll("[data-draggable]"));

      // Update all position data and selects
      items.forEach((item, index) => {
        item.dataset.position = index;

        // Update move buttons
        const upBtn = item.querySelector('[data-move="up"]');
        const downBtn = item.querySelector('[data-move="down"]');

        if (upBtn) upBtn.disabled = index === 0;
        if (downBtn) downBtn.disabled = index === items.length - 1;

        // Update position selects
        const select = item.querySelector("[data-position-select]");
        if (select) select.value = index;
      });

      // Announce change to screen readers
      const liveRegion = document.querySelector('[aria-live="polite"]');
      if (liveRegion) {
        liveRegion.textContent = `${itemEl.querySelector("h3").textContent} moved to position ${parseInt(itemEl.dataset.position) + 1} of ${items.length}`;
      }
    }
  });
</script>

<style>
  .draggable-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    margin: 0.5rem 0;
    border: 1px solid var(--color-gray-200);
    border-radius: 0.5rem;
    background: var(--color-white);
    cursor: grab;
  }

  .draggable-item--dragging {
    opacity: 0.6;
    cursor: grabbing;
  }

  .draggable-item__content {
    flex: 1;
  }

  .draggable-item__controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .draggable-item__btn {
    min-width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-gray-100);
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  .draggable-item__btn:hover:not(:disabled) {
    background: var(--color-gray-200);
  }

  .draggable-item__btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .draggable-item__select {
    min-height: 44px;
    padding: 0.5rem;
    border-radius: 0.25rem;
  }

  /* Accessibility helpers */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>
```

10. Support accessible authentication methods:

```astro
---
// AccessibleAuth.astro - A component for accessible login/registration
interface Props {
  mode: "login" | "register";
  redirectUrl?: string;
}

const { mode, redirectUrl = "/" } = Astro.props;
---

<form class="auth-form" method="post" action={`/api/auth/${mode}`} aria-labelledby="auth-heading">
  <h2 id="auth-heading">{mode === "login" ? "Sign In" : "Create Account"}</h2>

  <div class="form-group">
    <label for="username" class="form-group__label">Username</label>
    <input
      type="text"
      id="username"
      name="username"
      class="form-group__input"
      autocomplete={mode === "login" ? "username" : "new-username"}
      required
      aria-required="true"
    />
    <p class="form-group__hint" id="username-hint">
      Choose a username with letters and numbers only
    </p>
  </div>

  <div class="form-group">
    <label for="password" class="form-group__label">Password</label>
    <input
      type="password"
      id="password"
      name="password"
      class="form-group__input"
      autocomplete={mode === "login" ? "current-password" : "new-password"}
      aria-describedby="password-hint password-meter"
      required
      aria-required="true"
      minlength="8"
    />

    <div class="password-strength" id="password-meter" aria-live="polite">
      <div class="password-strength__meter" aria-hidden="true">
        <div class="password-strength__bar"></div>
      </div>
      <p class="form-group__hint" id="password-hint">
        {
          mode === "login"
            ? "Enter your password to sign in"
            : "Use 8+ characters with at least one number and one special character"
        }
      </p>
    </div>
  </div>

  {
    mode === "login" && (
      <div class="form-group">
        <div class="checkbox-container">
          <input type="checkbox" id="remember" name="remember" class="form-checkbox" />
          <label for="remember" class="checkbox-label">
            Remember me
          </label>
        </div>

        <a href="/forgot-password" class="forgot-link">
          Forgot password?
        </a>
      </div>
    )
  }

  <div class="form-actions">
    <button type="submit" class="submit-btn">
      {mode === "login" ? "Sign In" : "Create Account"}
    </button>

    <div class="alternative-options">
      {
        mode === "login" ? (
          <p>
            Don't have an account? <a href="/register">Sign up</a>
          </p>
        ) : (
          <p>
            Already have an account? <a href="/login">Sign in</a>
          </p>
        )
      }
    </div>

    <div class="accessibility-options">
      <p>
        <a href="/webauthn" class="alt-auth-link"> Sign in with passkey/biometrics </a>
      </p>
      <p>
        <a href="/auth/magic-link" class="alt-auth-link"> Sign in with email link </a>
      </p>
    </div>
  </div>

  <input type="hidden" name="redirectUrl" value={redirectUrl} />
</form>

<script>
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".auth-form");
    const passwordInput = document.getElementById("password");
    const strengthBar = document.querySelector(".password-strength__bar");
    const strengthMeter = document.getElementById("password-meter");

    // Only add password strength for registration
    if (form.getAttribute("action").includes("register") && passwordInput) {
      passwordInput.addEventListener("input", updatePasswordStrength);

      function updatePasswordStrength() {
        const password = passwordInput.value;
        let strength = 0;
        let feedback = "";

        // Calculate password strength
        if (password.length >= 8) strength += 1;
        if (password.match(/[A-Z]/)) strength += 1;
        if (password.match(/[0-9]/)) strength += 1;
        if (password.match(/[^A-Za-z0-9]/)) strength += 1;

        // Update visual meter
        if (strengthBar) {
          strengthBar.style.width = `${strength * 25}%`;

          // Update classes for color
          strengthBar.className = "password-strength__bar";
          if (strength < 2) strengthBar.classList.add("password-strength__bar--weak");
          else if (strength < 4) strengthBar.classList.add("password-strength__bar--medium");
          else strengthBar.classList.add("password-strength__bar--strong");
        }

        // Update feedback text
        if (strength === 0) {
          feedback = "Enter a password";
        } else if (strength < 2) {
          feedback = "Password is weak";
        } else if (strength < 4) {
          feedback = "Password is medium strength";
        } else {
          feedback = "Password is strong";
        }

        // Update aria-live region
        const ariaFeedback = document.createElement("p");
        ariaFeedback.textContent = feedback;

        if (strengthMeter) {
          // Keep hint text but update strength feedback
          const hint = strengthMeter.querySelector("#password-hint");
          strengthMeter.innerHTML = "";

          if (hint) strengthMeter.appendChild(hint);

          // Add feedback about strength
          ariaFeedback.className = "password-feedback";
          strengthMeter.appendChild(ariaFeedback);

          // Re-add the visual meter
          if (strengthBar && strengthBar.parentElement) {
            strengthMeter.insertBefore(strengthBar.parentElement, strengthMeter.firstChild);
          }
        }
      }
    }

    // Add form validation with helpful error messages
    form.addEventListener("submit", (e) => {
      const username = document.getElementById("username");
      const password = document.getElementById("password");
      let isValid = true;

      // Clear previous error messages
      form.querySelectorAll(".error-message").forEach((el) => el.remove());

      // Validate username
      if (username && !username.value.trim()) {
        createErrorMessage(username, "Please enter a username");
        isValid = false;
      }

      // Validate password
      if (password && !password.value) {
        createErrorMessage(password, "Please enter a password");
        isValid = false;
      }

      if (!isValid) {
        e.preventDefault();

        // Focus the first invalid field
        form.querySelector(".form-group__input.error")?.focus();

        // Announce validation errors
        const liveRegion = document.createElement("div");
        liveRegion.setAttribute("aria-live", "assertive");
        liveRegion.className = "visually-hidden";
        liveRegion.textContent = "Form validation failed. Please check the highlighted fields.";
        form.appendChild(liveRegion);

        // Remove after announcement
        setTimeout(() => liveRegion.remove(), 5000);
      }
    });

    function createErrorMessage(inputEl, message) {
      inputEl.classList.add("error");
      inputEl.setAttribute("aria-invalid", "true");

      const errorId = `${inputEl.id}-error`;
      inputEl.setAttribute(
        "aria-describedby",
        `${inputEl.getAttribute("aria-describedby") || ""} ${errorId}`.trim()
      );

      const errorMsg = document.createElement("p");
      errorMsg.id = errorId;
      errorMsg.className = "error-message";
      errorMsg.textContent = message;

      inputEl.parentNode.appendChild(errorMsg);
    }
  });
</script>

<style>
  .auth-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    background: var(--color-white);
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group__label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  .form-group__input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid var(--color-gray-200);
    border-radius: 0.25rem;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  .form-group__input:focus {
    outline: none;
    border-color: var(--color-purple-500);
    box-shadow: 0 0 0 3px rgba(var(--color-purple-500-rgb), 0.25);
  }

  .form-group__input.error {
    border-color: var(--color-red-600);
  }

  .form-group__hint {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    color: var(--color-gray-500);
  }

  .error-message {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    color: var(--color-red-600);
    font-weight: 500;
  }

  .submit-btn {
    width: 100%;
    padding: 0.75rem 1rem;
    background: var(--color-purple-500);
    color: var(--color-white);
    font-weight: 500;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 1rem;
    min-height: 44px;
  }

  .submit-btn:hover {
    background: var(--color-purple-600);
  }

  .submit-btn:focus-visible {
    outline: 3px solid var(--color-purple-300);
    outline-offset: 2px;
  }

  .alternative-options {
    margin-top: 1.5rem;
    text-align: center;
  }

  .accessibility-options {
    margin-top: 1.5rem;
    text-align: center;
    padding-top: 1rem;
    border-top: 1px solid var(--color-gray-200);
  }

  .checkbox-container {
    display: flex;
    align-items: center;
  }

  .form-checkbox {
    min-width: 20px;
    min-height: 20px;
    margin-right: 0.5rem;
  }

  .checkbox-label {
    margin-bottom: 0;
  }

  .password-strength__meter {
    height: 8px;
    background: var(--color-gray-200);
    border-radius: 4px;
    margin-top: 0.5rem;
    overflow: hidden;
  }

  .password-strength__bar {
    height: 100%;
    width: 0;
    background: var(--color-red-500);
    transition: width 0.3s;
  }

  .password-strength__bar--weak {
    background: var(--color-red-500);
  }

  .password-strength__bar--medium {
    background: var(--color-yellow-500);
  }

  .password-strength__bar--strong {
    background: var(--color-green-500);
  }

  .password-feedback {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .alt-auth-link {
    display: inline-block;
    padding: 0.5rem 0;
    color: var(--color-gray-500);
    font-size: 0.875rem;
    text-decoration: underline;
  }

  .forgot-link {
    display: block;
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--color-gray-500);
    text-decoration: underline;
  }

  /* For screen readers */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .form-group__input,
    .submit-btn,
    .password-strength__bar {
      transition: none;
    }
  }
</style>
```

Remember that while the MelodyMind user interface supports multiple languages, **all documentation
including this accessibility review must be written in English**. This ensures consistency across
all technical documentation and allows all team members to understand accessibility issues and
implementations regardless of their language preferences.

## Example Review for an Astro Component

```

```
