# ESLint Configuration for MelodyMind

This document describes the ESLint configuration for the MelodyMind project and provides instructions for using and customizing the linting rules.

## Overview

The MelodyMind project uses ESLint with the new Flat Config structure (eslint.config.js), which makes the configuration clearer and more modular. The configuration includes special rules for:

- TypeScript files (_.ts, _.tsx)
- JavaScript files (_.js, _.jsx)
- Astro components (\*.astro)
- Accessibility according to WCAG standards

## Installed Plugins

The following ESLint plugins are used for the MelodyMind project:

1. **eslint-plugin-astro**: Special rules for Astro files
2. **eslint-plugin-import**: Rules for better import ordering and organization
3. **eslint-plugin-jsdoc**: Enforces standardized JSDoc comments
4. **eslint-plugin-promise**: Best practices for working with Promises
5. **typescript-eslint**: Specialized TypeScript rules
6. **eslint-plugin-jsx-a11y**: Comprehensive accessibility checks according to WCAG standards

## Usage

The following NPM scripts are available for linting:

```bash
# Lint and format all files (with Prettier and ESLint)
yarn lint

# ESLint check of all files only (without fix)
yarn lint:check

# Specifically check Astro files
yarn lint:astro

# Specifically check TypeScript files
yarn lint:ts

# Check accessibility rules
yarn lint:a11y

# Check WCAG-specific rules for components
yarn lint:wcag

# Run automated WCAG AAA tests with axe-core
yarn test:a11y
```

## Important Rules

### TypeScript Rules

- Explicit function return types
- Avoidance of `any`
- Consistent naming patterns (PascalCase for interfaces, etc.)
- No unused variables

### Import Rules

- Organized import order
- Grouping of imports by origin
- Alphabetical sorting

### JSDoc Rules

- Complete documentation for public functions, methods, and classes
- Types for all parameters and return values

### Promise Rules

- Correct Promise chaining
- Error handling in Promises
- Avoidance of unnecessary Promise nesting

### Accessibility Rules (WCAG)

- Strict application of WCAG standards for maximum accessibility
- Over 30 specific accessibility rules from the jsx-a11y plugin
- Extended automated tests with axe-core (see `docs/automated-wcag-aaa-testing.md`)

The most important accessibility rules include:

- Alternative texts for images and media
- Correct ARIA attributes
- Keyboard operability of all interactive elements
- Semantically correct heading structure
- Sufficient color contrast (7:1 for WCAG AAA)
- Avoidance of distractions and flickering

### General Rules

- No `console.log` statements (except `console.warn` and `console.error`)
- No debugger code
- Use of `const` instead of `let` where possible
- Limitation of function complexity and length

## VS Code Integration

The ESLint configuration is integrated with Visual Studio Code. Make sure the ESLint extension is installed and the following settings are present in your `.vscode/settings.json`:

```json
{
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "astro",
    "typescript",
    "typescriptreact"
  ],
  "eslint.useFlatConfig": true,
  "eslint.options": {
    "overrideConfigFile": "eslint.config.js"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

## Known Issues and Solutions

1. **Astro Linting**: If you encounter problems with linting Astro files, you can alternatively use the `astro check` command.

2. **WCAG AAA Standards**: The WCAG AAA standards are very strict. If certain rules are too restrictive, they can be disabled in special cases:

   ```js
   // eslint-disable-next-line jsx-a11y/no-autofocus
   <input type="text" autoFocus />
   ```

3. **Accessibility Checks**: For more comprehensive accessibility checks according to WCAG AAA standards, we use axe-core in addition to ESLint (see `docs/automated-wcag-aaa-testing.md`).

## Customizing Rules

To customize the ESLint rules, edit the `eslint.config.js` file. The configuration is divided into logical sections:

- General rules for all files
- TypeScript-specific rules
- JavaScript-specific rules
- Astro-specific rules

## Improving Code Based on ESLint Results

The most common issues in the codebase and how to fix them:

1. **Missing JSDoc Comments**: Add detailed JSDoc comments with type information to all public functions and methods.

2. **any Type Usage**: Replace all `any` types with more specific types or `unknown`.

3. **Import Order**: Organize imports so that they come after types and are sorted alphabetically.

4. **String Concatenation**: Use template strings (`${variable} text`) instead of string concatenation (`variable + " text"`).

5. **Unused Variables**: Remove unused variables or rename them with an underscore prefix if they are intentionally unused.

6. **Missing Curly Braces**: Add curly braces to all if/else statements, even if they only encompass one line.

7. **Too Long Functions**: Split functions with more than 100 lines into smaller, better-named subfunctions.
