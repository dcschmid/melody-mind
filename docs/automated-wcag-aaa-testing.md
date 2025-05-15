# Automated WCAG AAA Testing with axe-core

This documentation describes how we conduct automated accessibility testing according to WCAG AAA
standards with axe-core in the MelodyMind project.

## Overview

Instead of custom ESLint rules, we use axe-core, a powerful tool for automated accessibility
testing. Axe-core offers:

- Comprehensive checks for all WCAG 2.1 levels (A, AA, AAA)
- Browser-based testing for dynamic components
- Detailed reports with severity levels, affected elements, and suggested fixes
- Integration into the development workflow

## Installation

The tool is already installed in the project:

```bash
yarn add -D @axe-core/cli
```

## Usage

### Testing the Running Application

To test the running application for WCAG AAA compliance:

1. Start the application in one terminal:

   ```bash
   yarn dev
   ```

2. Run the axe test in another terminal:
   ```bash
   yarn test:a11y
   ```

This automatically opens a browser window, tests the application, and provides a detailed report.

### Testing Specific Pages

To test specific pages:

```bash
npx axe http://localhost:3000/path/to/page --tags wcag2aaa --browser
```

### Report Options

The report can be output in various formats:

```bash
# JSON format (for CI/CD pipelines)
npx axe http://localhost:3000 --tags wcag2aaa --save report.json

# HTML report for better readability
npx axe http://localhost:3000 --tags wcag2aaa --save report.html --html
```

## WCAG AAA-Specific Tests

Axe-core supports numerous WCAG AAA-specific checks, including:

1. **Contrast Checks (1.4.6)** - Contrast ratio of at least 7:1 for normal text
2. **Audio Descriptions (1.2.7)** - Extended audio descriptions for videos
3. **Sign Language (1.2.6)** - Sign language for audio content
4. **Keyboard Control (2.1.3)** - All functions must be accessible via keyboard without time
   constraints
5. **Error Suggestions (3.3.3)** - Suggestions for error correction when input errors occur
6. **Context-Sensitive Help (3.3.5)** - Context-sensitive help for form elements

## Manual Tests

In addition to automated tests, the following manual tests should be performed:

1. **Keyboard Navigation Without Time Limits** - Test the entire application using only the keyboard
2. **Screen Reader Compatibility** - Check the application with NVDA, JAWS, or VoiceOver
3. **200% Zoom Test** - Ensure the application remains usable at 200% zoom
4. **Text and Line Spacing Changes** - Content should remain readable with increased spacing

## Integration into the Development Process

1. **With Pull Requests**: Run `yarn test:a11y` and resolve any issues found
2. **Continuous Integration**: Automatic verification in the CI/CD workflow
3. **Before Releases**: Complete WCAG AAA testing of all main pages
4. **After Component Changes**: Testing of all affected components

## Resources

- [Axe-core Documentation](https://github.com/dequelabs/axe-core)
- [WCAG 2.1 AAA Standards](https://www.w3.org/TR/WCAG21/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [The A11Y Project](https://www.a11yproject.com/)

## Best Practices for WCAG AAA

1. **Strict Contrast Requirements**: Use features like Tailwind's `text-gray-900` on `bg-white` for
   high-contrast text
2. **Detailed Alternative Texts**: Alt texts should include at least 20 characters and describe the
   content in detail
3. **Redundant Navigation Mechanisms**: Provide multiple ways to access content (navigation, search,
   sitemap)
4. **Advanced ARIA Attributes**: e.g., `aria-describedby` for additional contextual information
5. **Keyboard-Optimized Interactions**: All interactive elements should be operable with Tab, Enter,
   and arrow keys
