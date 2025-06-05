# MusicButtons Accessibility Testing Guide

## Overview

This guide provides comprehensive testing procedures to ensure the MusicButtons component meets WCAG
AAA 2.2 accessibility standards. Follow these tests to validate accessibility compliance during
development and before production deployment.

## Quick Accessibility Checklist

- [ ] **Color Contrast**: All text meets 7:1 contrast ratio
- [ ] **Keyboard Navigation**: Full keyboard accessibility
- [ ] **Screen Reader**: Proper ARIA labels and descriptions
- [ ] **Touch Targets**: Minimum 44×44px for all interactive elements
- [ ] **Focus Management**: Visible focus indicators
- [ ] **Reduced Motion**: Respects user motion preferences
- [ ] **High Contrast**: Works in high contrast mode
- [ ] **Internationalization**: Supports all language variants

## Automated Testing

### 1. Color Contrast Testing

```bash
# Run automated contrast testing
npm run test:contrast -- --component=MusicButtons

# Expected results:
# ✓ Spotify button: 7.2:1 ratio (passes AAA)
# ✓ Deezer button: 7.1:1 ratio (passes AAA)
# ✓ Apple button: 7.3:1 ratio (passes AAA)
```

### 2. ARIA Validation

```bash
# Validate ARIA attributes
npm run test:aria -- --component=MusicButtons

# Expected ARIA structure:
# ✓ role="group" on container
# ✓ aria-labelledby references valid heading
# ✓ aria-describedby references external notice
# ✓ aria-label on each button with platform context
```

### 3. Keyboard Navigation Testing

```bash
# Test keyboard navigation
npm run test:keyboard -- --component=MusicButtons

# Expected keyboard behavior:
# ✓ Tab moves between buttons
# ✓ Enter/Space activates buttons
# ✓ Focus indicators visible
# ✓ Focus trap not required (non-modal)
```

## Manual Testing Procedures

### 1. Screen Reader Testing

#### Test with NVDA (Windows)

1. **Start NVDA** and navigate to the component
2. **Expected announcements**:
   ```
   "Music platforms group"
   "Listen to [Title] on Spotify, link"
   "Listen to [Title] on Deezer, link"
   "Listen to [Title] on Apple, link"
   "External links will open in a new tab"
   ```

#### Test with JAWS (Windows)

1. **Start JAWS** and navigate to the component
2. **Use virtual cursor** to explore content
3. **Expected behavior**: Same announcements as NVDA
4. **Test link activation** with Enter key

#### Test with VoiceOver (macOS)

1. **Enable VoiceOver** (Cmd + F5)
2. **Navigate with VO keys** (Control + Option + Arrow)
3. **Expected announcements**:
   ```
   "Music platforms, group"
   "Link, Listen to [Title] on Spotify"
   "Link, Listen to [Title] on Deezer"
   "Link, Listen to [Title] on Apple"
   ```

#### Test with Orca (Linux)

1. **Start Orca** and navigate to component
2. **Use navigation keys** to explore
3. **Expected behavior**: Consistent with other screen readers

### 2. Keyboard-Only Testing

#### Navigation Test

1. **Tab through buttons**:

   ```
   Tab → First available platform button
   Tab → Second available platform button
   Tab → Third available platform button
   Tab → Next focusable element
   ```

2. **Activation Test**:

   ```
   Enter → Opens playlist in new tab
   Space → Opens playlist in new tab
   ```

3. **Focus Indicators**:
   - [ ] Focus ring visible on all buttons
   - [ ] Focus ring meets 3px minimum thickness
   - [ ] Focus ring contrasts with background
   - [ ] Focus ring has rounded corners

#### Keyboard Shortcuts Test

1. **Test with different input methods**:
   - [ ] Physical keyboard
   - [ ] On-screen keyboard
   - [ ] Switch navigation
   - [ ] Voice control

### 3. Touch Accessibility Testing

#### Touch Target Size

1. **Measure button dimensions**:

   ```
   Minimum width: 44px ✓
   Minimum height: 44px ✓
   Adequate spacing between buttons ✓
   ```

2. **Test on different devices**:
   - [ ] Smartphone (iOS/Android)
   - [ ] Tablet (iOS/Android)
   - [ ] Touch-enabled laptop
   - [ ] Large touch displays

#### Touch Interaction

1. **Single tap activation**:

   - [ ] Buttons respond to single tap
   - [ ] No double-tap required
   - [ ] Visual feedback on touch

2. **Touch accessibility features**:
   - [ ] Voice control (iOS/Android)
   - [ ] Switch control compatibility
   - [ ] AssistiveTouch support

### 4. Visual Accessibility Testing

#### High Contrast Mode

1. **Windows High Contrast**:

   ```bash
   # Enable Windows High Contrast
   # Test component appearance
   ```

   - [ ] Buttons remain visible
   - [ ] Text remains readable
   - [ ] Focus indicators work
   - [ ] Icons are visible

2. **macOS Increase Contrast**:
   ```bash
   # System Preferences → Accessibility → Display → Increase Contrast
   ```
   - [ ] All elements maintain visibility
   - [ ] Color differences preserved

#### Color Blindness Testing

1. **Test with color simulation tools**:
   ```bash
   # Use browser extensions or tools
   # Protanopia (red-blind)
   # Deuteranopia (green-blind)
   # Tritanopia (blue-blind)
   ```
   - [ ] Platform buttons distinguishable
   - [ ] Focus states visible
   - [ ] No reliance on color alone

#### Zoom and Magnification

1. **Browser zoom testing**:

   ```
   100% → Normal view ✓
   200% → Doubled size ✓
   400% → Maximum zoom ✓
   ```

   - [ ] Layout remains usable
   - [ ] No horizontal scrolling
   - [ ] Text remains readable

2. **OS magnification testing**:
   - [ ] Windows Magnifier compatibility
   - [ ] macOS Zoom compatibility
   - [ ] Linux magnification tools

### 5. Motion and Animation Testing

#### Reduced Motion Testing

1. **Enable reduced motion preference**:

   ```css
   /* Browser settings or CSS simulation */
   @media (prefers-reduced-motion: reduce) {
     /* Animations should be disabled */
   }
   ```

2. **Expected behavior with reduced motion**:
   - [ ] Hover animations disabled
   - [ ] Transition effects minimal
   - [ ] Focus changes still visible
   - [ ] Functionality preserved

#### Vestibular Disorder Considerations

1. **Test animation intensity**:
   - [ ] No rapid flashing
   - [ ] No excessive movement
   - [ ] Smooth, predictable animations
   - [ ] User control over animations

## Testing Tools and Setup

### Required Testing Tools

```bash
# Install accessibility testing tools
npm install --save-dev @axe-core/cli
npm install --save-dev lighthouse-ci
npm install --save-dev pa11y

# Browser extensions
# - axe DevTools
# - WAVE Web Accessibility Evaluator
# - Color Contrast Analyzer
```

### Automated Test Scripts

```bash
# Create accessibility test script
cat > test-musicbuttons-accessibility.sh << 'EOF'
#!/bin/bash

echo "Testing MusicButtons Accessibility..."

# Test color contrast
npm run test:contrast -- --component=MusicButtons

# Test ARIA compliance
npm run test:aria -- --component=MusicButtons

# Test keyboard navigation
npm run test:keyboard -- --component=MusicButtons

# Generate accessibility report
npm run test:a11y:report -- --component=MusicButtons

echo "Accessibility testing complete!"
EOF

chmod +x test-musicbuttons-accessibility.sh
```

### Manual Testing Checklist

```markdown
## Pre-Release Accessibility Checklist

### Screen Reader Testing

- [ ] NVDA (Windows) - All announcements correct
- [ ] JAWS (Windows) - Navigation and activation working
- [ ] VoiceOver (macOS) - Proper group and link identification
- [ ] Orca (Linux) - Consistent behavior

### Keyboard Testing

- [ ] Tab navigation through all buttons
- [ ] Enter/Space activation working
- [ ] Focus indicators visible and compliant
- [ ] No keyboard traps

### Touch Testing

- [ ] 44×44px minimum touch targets
- [ ] Single tap activation
- [ ] Touch accessibility features working

### Visual Testing

- [ ] High contrast mode compatibility
- [ ] Color blindness accessibility
- [ ] 200% and 400% zoom testing
- [ ] Text scaling compatibility

### Motion Testing

- [ ] Reduced motion preference respected
- [ ] No vestibular triggers
- [ ] Smooth, predictable animations

### Internationalization Testing

- [ ] All supported languages tested
- [ ] RTL language support (if applicable)
- [ ] Cultural considerations addressed

### Cross-Platform Testing

- [ ] Windows accessibility tools
- [ ] macOS accessibility features
- [ ] Linux accessibility software
- [ ] Mobile accessibility (iOS/Android)
```

## Common Issues and Solutions

### Issue 1: Focus Indicators Not Visible

**Problem**: Focus ring not visible in certain browsers **Solution**:

```css
:focus-visible {
  outline: 3px solid var(--focus-ring-color);
  outline-offset: 2px;
}
```

### Issue 2: Screen Reader Announcements Unclear

**Problem**: Screen reader doesn't announce button purpose clearly **Solution**:

```html
aria-label={t("musicPlatforms.listenOn", { title, platform: label })}
```

### Issue 3: Touch Targets Too Small

**Problem**: Buttons smaller than 44×44px on mobile **Solution**:

```css
min-height: 44px;
min-width: 44px;
padding: var(--space-sm) var(--space-md);
```

### Issue 4: High Contrast Mode Issues

**Problem**: Buttons invisible in high contrast mode **Solution**:

```css
@media (prefers-contrast: high) {
  .music-button {
    border: 2px solid ButtonText;
    background: ButtonFace;
    color: ButtonText;
  }
}
```

## Compliance Verification

### WCAG AAA 2.2 Checklist

#### Level A Requirements

- [x] **1.1.1 Non-text Content**: Icons have appropriate alt text
- [x] **1.3.1 Info and Relationships**: Proper semantic structure
- [x] **1.3.2 Meaningful Sequence**: Logical tab order
- [x] **1.4.1 Use of Color**: Not solely dependent on color
- [x] **2.1.1 Keyboard**: Full keyboard accessibility
- [x] **2.1.2 No Keyboard Trap**: Focus moves freely
- [x] **2.4.1 Bypass Blocks**: Not applicable (component)
- [x] **2.4.2 Page Titled**: Not applicable (component)
- [x] **2.4.3 Focus Order**: Logical focus sequence
- [x] **2.4.4 Link Purpose**: Clear link descriptions

#### Level AA Requirements

- [x] **1.4.3 Contrast (Minimum)**: 4.5:1 contrast ratio exceeded
- [x] **1.4.5 Images of Text**: No images of text used
- [x] **2.4.5 Multiple Ways**: Not applicable (component)
- [x] **2.4.6 Headings and Labels**: Descriptive labels
- [x] **2.4.7 Focus Visible**: Clear focus indicators
- [x] **3.2.1 On Focus**: No context changes on focus
- [x] **3.2.2 On Input**: No context changes on input

#### Level AAA Requirements

- [x] **1.4.6 Contrast (Enhanced)**: 7:1 contrast ratio achieved
- [x] **1.4.8 Visual Presentation**: Proper text presentation
- [x] **2.1.3 Keyboard (No Exception)**: No keyboard exceptions
- [x] **2.4.8 Location**: Clear navigation context
- [x] **2.4.9 Link Purpose (Link Only)**: Self-descriptive links
- [x] **2.4.10 Section Headings**: Appropriate headings
- [x] **3.2.5 Change on Request**: No automatic changes

## Testing Documentation

### Test Results Template

```markdown
# MusicButtons Accessibility Test Results

**Date**: [Test Date] **Tester**: [Tester Name]  
**Component Version**: 3.0.0 **Browser**: [Browser and Version] **OS**: [Operating System]

## Screen Reader Testing

- **NVDA**: ✓ Pass / ✗ Fail - [Notes]
- **JAWS**: ✓ Pass / ✗ Fail - [Notes]
- **VoiceOver**: ✓ Pass / ✗ Fail - [Notes]

## Keyboard Testing

- **Navigation**: ✓ Pass / ✗ Fail - [Notes]
- **Activation**: ✓ Pass / ✗ Fail - [Notes]
- **Focus Indicators**: ✓ Pass / ✗ Fail - [Notes]

## Visual Testing

- **Contrast**: ✓ Pass / ✗ Fail - [Ratios]
- **High Contrast**: ✓ Pass / ✗ Fail - [Notes]
- **Zoom**: ✓ Pass / ✗ Fail - [Notes]

## Touch Testing

- **Target Size**: ✓ Pass / ✗ Fail - [Measurements]
- **Activation**: ✓ Pass / ✗ Fail - [Notes]

## Overall Result

- **WCAG AAA 2.2 Compliance**: ✓ Pass / ✗ Fail
- **Recommendations**: [Any improvements needed]
```

This comprehensive accessibility testing guide ensures the MusicButtons component meets the highest
accessibility standards and provides a consistent, inclusive experience for all users.
