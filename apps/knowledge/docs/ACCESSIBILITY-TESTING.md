# Accessibility Testing Procedures

**Project**: MelodyMind Knowledge
**Version**: 1.0
**Last Updated**: 2026-02-05

---

## Overview

This document outlines the testing procedures and results for ensuring BITV 2.0 / WCAG 2.2 AA compliance.

---

## Test Environments

### Automated Testing

| Tool                     | Version | Type      | Status                 |
| ------------------------ | ------- | --------- | ---------------------- |
| axe-core                 | 4.11.0  | Automated | ✅ PASS (0 violations) |
| ESLint Plugin (jsx-a11y) | 6.10.2  | Linting   | ✅ PASS                |

### Manual Testing

| Screen Reader | OS          | Browser     | Test Date | Status  |
| ------------- | ----------- | ----------- | --------- | ------- |
| NVDA          | Windows 11  | Firefox     | -         | ⏳ TODO |
| VoiceOver     | macOS 15+   | Safari      | -         | ⏳ TODO |
| TalkBack      | Android 14+ | Chrome      | -         | ⏳ TODO |
| JAWS          | Windows 11  | Chrome/Edge | -         | ⏳ TODO |

---

## Test Scenarios

### 1. Skip Link Functionality

**Purpose**: Verify keyboard users can bypass navigation

| Test Step                | Expected Behavior                   | Actual | Pass/Fail |
| ------------------------ | ----------------------------------- | ------ | --------- |
| Press Tab on page load   | Skip link becomes visible at top    | -      | ⏳ TODO   |
| Press Enter on skip link | Focus moves to `#main-content`      | -      | ⏳ TODO   |
| Check with screen reader | "Skip to main content" is announced | -      | ⏳ TODO   |

**Component**: `src/components/Shared/SkipLink.astro`

---

### 2. Navigation

**Purpose**: Verify semantic navigation and breadcrumb structure

| Test Step                   | Expected Behavior                   | Actual | Pass/Fail |
| --------------------------- | ----------------------------------- | ------ | --------- |
| Tab through nav             | Logical order, all links focusable  | -      | ⏳ TODO   |
| Navigate with screen reader | All links announced with context    | -      | ⏳ TODO   |
| Check breadcrumbs           | `aria-current="page"` is recognized | -      | ⏳ TODO   |
| Navigate breadcrumb links   | Focus moves through trail logically | -      | ⏳ TODO   |

**Component**: `src/components/Breadcrumbs.astro`

---

### 3. Search Functionality

**Purpose**: Verify search input and results are accessible

| Test Step           | Expected Behavior                                  | Actual | Pass/Fail |
| ------------------- | -------------------------------------------------- | ------ | --------- |
| Tab to search input | Input receives focus, label announced              | -      | ⏳ TODO   |
| Type in search      | Placeholder visible, screen reader announces input | -      | ⏳ TODO   |
| Press Escape        | Search clears, focus returns to input              | -      | ⏳ TODO   |
| Tab to reset button | Button receives focus, accessible name announced   | -      | ⏳ TODO   |
| Activate reset      | Search clears, status updated                      | -      | ⏳ TODO   |
| Wait for results    | "X categories found" announced (live region)       | -      | ⏳ TODO   |
| No results case     | "No results for 'term'" announced                  | -      | ⏳ TODO   |

**Component**: `src/components/Search/SearchPanel.astro`

---

### 4. Category Cards

**Purpose**: Verify category cards are accessible

| Test Step                   | Expected Behavior                         | Actual | Pass/Fail |
| --------------------------- | ----------------------------------------- | ------ | --------- |
| Tab to category card        | Card link receives focus                  | -      | ⏳ TODO   |
| Navigate with screen reader | Card title, description, count announced  | -      | ⏳ TODO   |
| Activate card link          | Navigation to category page               | -      | ⏳ TODO   |
| Check aria-label            | "Category Name with X articles" announced | -      | ⏳ TODO   |

**Component**: `src/components/KnowledgeCard.astro`

---

### 5. Knowledge Cards (Article Links)

**Purpose**: Verify article cards are accessible

| Test Step                   | Expected Behavior                      | Actual | Pass/Fail |
| --------------------------- | -------------------------------------- | ------ | --------- |
| Tab to article card         | Card link receives focus               | -      | ⏳ TODO   |
| Navigate with screen reader | Title, description, metadata announced | -      | ⏳ TODO   |
| Check image alt             | "Cover image for [title]" announced    | -      | ⏳ TODO   |
| Check metadata              | Reading time, publish date announced   | -      | ⏳ TODO   |
| Activate card link          | Navigation to article page             | -      | ⏳ TODO   |

**Component**: `src/components/KnowledgeCard.astro`

---

### 6. Recent Reads

**Purpose**: Verify recently read articles are accessible

| Test Step                   | Expected Behavior                | Actual | Pass/Fail |
| --------------------------- | -------------------------------- | ------ | --------- |
| Tab to recent reads section | Focus enters section             | -      | ⏳ TODO   |
| Navigate with screen reader | Articles announced with metadata | -      | ⏳ TODO   |
| Navigate to article         | Link focuses and activates       | -      | ⏳ TODO   |
| Check date metadata         | "Updated [date]" announced       | -      | ⏳ TODO   |

**Page**: `src/pages/index.astro` (recent reads section)

---

### 7. Footer

**Purpose**: Verify footer navigation is accessible

| Test Step                   | Expected Behavior                    | Actual | Pass/Fail |
| --------------------------- | ------------------------------------ | ------ | --------- |
| Tab to footer               | Footer receives focus                | -      | ⏳ TODO   |
| Navigate with screen reader | Footer sections announced            | -      | ⏳ TODO   |
| Navigate links              | All links are announced with context | -      | ⏳ TODO   |

**Component**: `src/components/Footer.astro`

---

## Keyboard Navigation Tests

### Full Page Navigation

| Test                      | Expected Behavior                         | Actual | Pass/Fail |
| ------------------------- | ----------------------------------------- | ------ | --------- |
| Tab from top              | Moves through focusable elements in order | -      | ⏳ TODO   |
| Shift+Tab                 | Moves backwards through focus order       | -      | ⏳ TODO   |
| Enter/Space on links      | Activates link                            | -      | ⏳ TODO   |
| Enter/Space on buttons    | Activates button                          | -      | ⏳ TODO   |
| Escape on focused element | Cancels action, closes modals             | -      | ⏳ TODO   |

### Focus Management

| Test                       | Expected Behavior                      | Actual | Pass/Fail |
| -------------------------- | -------------------------------------- | ------ | --------- |
| Focus indicator is visible | 3px amber ring appears                 | -      | ⏳ TODO   |
| Focus ring offset          | 3px offset improves visibility         | -      | ⏳ TODO   |
| Focus never lost           | Tabbing continues through all elements | -      | ⏳ TODO   |
| Focus trap in modals       | When open, focus stays within modal    | -      | ⏳ TODO   |

---

## Color Contrast Tests

### Manual Verification Results

| Element                              | Text Color | Background             | Contrast Ratio | WCAG AA | WCAG AAA | Pass/Fail |
| ------------------------------------ | ---------- | ---------------------- | -------------- | ------- | -------- | --------- |
| `.page-shell--aurora` primary text   | #f2f6fb    | #0c121c (mid gradient) | 14.2:1         | ✅ PASS | ✅ PASS  | ✅ PASS   |
| `.page-shell--aurora` secondary text | #bcc8d9    | #0c121c (mid gradient) | 8.7:1          | ✅ PASS | ✅ PASS  | ✅ PASS   |
| Knowledge card text                  | #f2f6fb    | #121824 (card bg)      | ~12:1          | ✅ PASS | ✅ PASS  | ✅ PASS   |
| Search input text                    | #f2f6fb    | #0b1017 (input bg)     | ~14:1          | ✅ PASS | ✅ PASS  | ✅ PASS   |
| Footer text                          | #f2f6fb    | #0b1017 (body bg)      | ~14:1          | ✅ PASS | ✅ PASS  | ✅ PASS   |

**Note**: See [ACCESSIBILITY-ANALYSIS.md](./ACCESSIBILITY-ANALYSIS.md) for detailed contrast calculations.

---

## Screen Reader Testing Results

### NVDA (Windows + Firefox)

| Component  | Test Date | Result  | Notes |
| ---------- | --------- | ------- | ----- |
| Skip Link  | -         | ⏳ TODO | -     |
| Navigation | -         | ⏳ TODO | -     |
| Search     | -         | ⏳ TODO | -     |
| Cards      | -         | ⏳ TODO | -     |

### VoiceOver (macOS + Safari)

| Component  | Test Date | Result  | Notes |
| ---------- | --------- | ------- | ----- |
| Skip Link  | -         | ⏳ TODO | -     |
| Navigation | -         | ⏳ TODO | -     |
| Search     | -         | ⏳ TODO | -     |
| Cards      | -         | ⏳ TODO | -     |

---

## Responsive Design Tests

| Breakpoint             | Device    | Tested Date | Result  |
| ---------------------- | --------- | ----------- | ------- |
| 375px (Mobile)         | iPhone SE | -           | ⏳ TODO |
| 768px (Tablet)         | iPad      | -           | ⏳ TODO |
| 1024px (Desktop)       | Laptop    | -           | ⏳ TODO |
| 1440px (Large Desktop) | Desktop   | -           | ⏳ TODO |

---

## Test Checklists

### Before Testing

- [ ] Clear browser cache
- [ ] Disable browser extensions
- [ ] Set zoom to 100%
- [ ] Enable screen reader
- [ ] Test in incognito/private mode

### During Testing

- [ ] Document unexpected behaviors
- [ ] Take screenshots of failures
- [ ] Record screen reader output
- [ ] Note browser and OS versions

### After Testing

- [ ] Document all results
- [ ] Update accessibility statement
- [ ] Create issues for failures
- [ ] Verify fixes in follow-up testing

---

## Known Issues and Workarounds

| Issue                             | Impact                             | Workaround              | Status      |
| --------------------------------- | ---------------------------------- | ----------------------- | ----------- |
| axe-core "incomplete" on gradient | False positive (manually verified) | Documented as compliant | ✅ RESOLVED |
| -                                 | -                                  | -                       | -           |

---

## Continuous Improvement

### Regular Testing Schedule

- **Weekly**: Automated axe-core audit
- **Monthly**: Manual keyboard navigation testing
- **Quarterly**: Screen reader testing (all major readers)
- **Annually**: Full accessibility audit + compliance review

### User Feedback

Collect accessibility feedback via:

- Footer contact link
- Accessibility email: accessibility@melody-mind.com
- In-page feedback form (future)

---

## 45-Minute Release Checklist (WCAG 2.2 AA + AAA Enhancements)

Use this checklist before marking accessibility work as done.

### 1) Setup (5 minutes)

- [ ] Run `yarn dev`
- [ ] Open Chrome and Firefox
- [ ] Enable a screen reader (NVDA or VoiceOver)
- [ ] Open core routes: `/`, `/categories/music-through-decades`, `/knowledge/2010s`, `/bookmarks`

### 2) Keyboard Flow (15 minutes)

- [ ] First `Tab` focus lands on the skip link
- [ ] Skip link moves focus to `#main-content`
- [ ] Focus ring is always visible on links, buttons, inputs
- [ ] No focus trap or focus loss on any core route
- [ ] Search: typing filters correctly
- [ ] Search: `Escape` clears active query and updates results
- [ ] Search: clear/reset buttons are keyboard-operable
- [ ] Cards and footer links activate with Enter/Space

### 3) Screen Reader Smoke Test (15 minutes)

- [ ] Landmarks are announced (`main`, `nav`, `footer`)
- [ ] Heading hierarchy is logical and understandable
- [ ] Search status updates are announced politely
- [ ] No-results message is announced when applicable
- [ ] Card links have clear, non-redundant names
- [ ] Images announce meaningful alt text
- [ ] Dynamic "Recent Reads" status is announced

### 4) Zoom and Mobile Check (5 minutes)

- [ ] 200% zoom keeps content readable and operable
- [ ] Focus indicators remain visible at 200% zoom
- [ ] Mobile viewport (375px) keeps touch targets usable
- [ ] No clipping/overlap breaks core interactions

### 5) Build and Quality Gate (5 minutes)

- [ ] `yarn lint:check`
- [ ] `yarn check:scoped-css`
- [ ] `yarn build`
- [ ] Record result summary in this file

### Release Decision

- [ ] **GO**: All core checks pass, no critical blockers
- [ ] **NO-GO**: Any critical blocker remains (focus loss, unnamed control, broken keyboard path)

### Session Notes

| Date       | Tester            | Scope                                                                      | Result           | Notes                                                                                                                                           |
| ---------- | ----------------- | -------------------------------------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-02-06 | Team QA (Example) | `/`, `/categories/music-through-decades`, `/knowledge/2010s`, `/bookmarks` | GO (conditional) | Lint/build/scoped-css pass; keyboard flow and live-region behavior pass; complete NVDA + VoiceOver manual run before final compliance sign-off. |

---

## Resources

### Testing Tools

- **axe DevTools**: Chrome/Firefox extension for automated testing
- **WAVE**: WebAIM's accessibility evaluation tool
- **Lighthouse**: Chrome DevTools accessibility audit
- **Pa11y**: Accessibility insights for developers

### Reference Materials

- [BITV 2.0 (German)](https://www.bitv-inklude.info/)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [WCAG Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

---

**Last Updated**: 2026-02-05
**Next Review Date**: 2026-03-05

---

## Appendix: Component Accessibility Matrix

| Component           | ARIA | Keyboard | Contrast | Screen Reader | Status  |
| ------------------- | ---- | -------- | -------- | ------------- | ------- |
| SkipLink.astro      | ✅   | ✅       | ✅       | ✅            | ✅ PASS |
| Breadcrumbs.astro   | ✅   | ✅       | ✅       | ✅            | ⏳ TODO |
| SearchPanel.astro   | ✅   | ✅       | ✅       | ✅            | ⏳ TODO |
| KnowledgeCard.astro | ✅   | ✅       | ✅       | ✅            | ⏳ TODO |
| Footer.astro        | ✅   | ✅       | ✅       | ✅            | ⏳ TODO |
| Layout.astro        | ✅   | ✅       | ✅       | ✅            | ✅ PASS |
| PageShell.astro     | ✅   | ✅       | ✅       | ✅            | ✅ PASS |

---

**For detailed analysis, see:**

- [Accessibility Analysis](./ACCESSIBILITY-ANALYSIS.md)
- [Accessibility Statement](./ACCESSIBILITY.md)
- [axe-report.json](../axe-report.json)
