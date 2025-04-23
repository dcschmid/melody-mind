# Accessibility Review

Your goal is to perform a thorough accessibility review of MelodyMind code to ensure WCAG AAA compliance.

## Review Focus Areas

If a specific file isn't provided, ask for:

- The component or page to review
- Any specific accessibility concerns to address
- The target audience and their potential needs

## Accessibility Requirements

- Color contrast: 7:1 for normal text, 4.5:1 for large text
- Keyboard navigation: all interactive elements must be accessible
- Screen reader compatibility: proper ARIA attributes and semantic HTML
- Focus management: visible focus indicators for all interactive elements
- Touch targets: minimum size of 44x44 pixels
- Text alternatives: all non-text content must have text alternatives
- Heading hierarchy: proper heading structure
- Form labels: all form controls must have associated labels

## Review Structure

1. Semantic HTML analysis
2. ARIA attributes check
3. Color contrast verification
4. Keyboard navigation testing
5. Touch target size evaluation
6. Screen reader experience assessment
7. Focus management review
8. Suggested improvements

## Example Review

For a "QuestionCard" component:

````
## Accessibility Review: QuestionCard Component

### Semantic HTML Analysis
✅ Uses proper heading structure with h2 for questions
✅ Uses button elements for interactive options
❌ Uses div for clickable elements - should be buttons

### ARIA Attributes
✅ Uses aria-current for selected answer
❌ Missing aria-live for announcing time remaining
❌ Missing aria-describedby for linking error messages

### Color Contrast
✅ Question text: 12:1 ratio (white on dark)
❌ Option hover state: 3.8:1 ratio - needs improvement to meet 7:1 AAA standard

### Keyboard Navigation
✅ Tab order follows logical sequence
❌ Focus skip when timer expires - needs focus management
✅ Joker button properly focusable

### Touch Targets
✅ Answer options are large enough (min 48px height)
❌ Close button is only 32x32px - should be at least 44x44px

### Screen Reader Experience
❌ Timer updates not announced to screen readers
❌ Missing status announcements for correct/incorrect answers
✅ Questions and options are properly readable

### Focus Management
❌ Focus not returned to appropriate element after modal closes
✅ Focus visibly indicates current selection

### Suggested Improvements

1. Replace div with button elements for all clickable items:
```jsx
// Before
<div onClick={selectAnswer} class="answer-option">
  {option}
</div>

// After
<button onClick={selectAnswer} class="answer-option">
  {option}
</button>
````

2. Add appropriate ARIA for dynamic content:

```jsx
<div aria-live="polite" aria-atomic="true">
  Time remaining: {timer}s
</div>
```

3. Improve color contrast for option hover states:

```css
/* Before */
.answer-option:hover {
  background-color: #6b46c1;
}

/* After */
.answer-option:hover {
  background-color: #553c9a; /* Darker purple with better contrast */
}
```

4. Implement proper focus management:

```js
// Store last focused element before opening modal
const lastFocus = document.activeElement;

// When closing modal
lastFocus.focus();
```

5. Increase touch target size:

```css
.close-button {
  min-width: 44px;
  min-height: 44px;
  padding: 10px;
}
```

```

```
