# ESLint and Prettier with VS Code for MelodyMind

This guide explains how to optimally configure ESLint and Prettier with Visual Studio Code to ensure
a consistent coding experience in the MelodyMind project.

## Prerequisites

1. VS Code Extensions:

   - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
   - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
   - [Astro](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode)
   - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

2. NPM Packages (already installed):
   - ESLint and related plugins
   - Prettier and related plugins (including `prettier-plugin-astro` and
     `prettier-plugin-tailwindcss`)

## Verifying Configuration

### 1. VS Code Settings (`.vscode/settings.json`)

The following settings should be present in your `.vscode/settings.json`:

```json
{
  "eslint.validate": ["javascript", "javascriptreact", "astro", "typescript", "typescriptreact"],
  "eslint.useFlatConfig": true,
  "eslint.options": {
    "overrideConfigFile": "eslint.config.js"
  },
  "prettier.documentSelectors": ["**/*.astro"],
  "[astro]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "files.associations": {
    "*.astro": "astro"
  }
}
```

### 2. Prettier Configuration (`.prettierrc.mjs`)

```js
/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: "es5",
  bracketSpacing: true,
  arrowParens: "always",
  endOfLine: "lf",
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
        astroAllowShorthand: true,
      },
    },
  ],
};
```

### 3. ESLint Configuration (`eslint.config.js`)

The ESLint configuration is already set up to work with JavaScript, TypeScript, and Astro files.

## Everyday Usage

### Format-On-Save

When "Format On Save" is enabled in VS Code (which is already the case in MelodyMind), your files
will be automatically formatted by Prettier and ESLint rules will be applied each time you save.

### Manual Formatting

If you want to format manually:

- Prettier: `Shift+Alt+F` or via the context menu ("Format Document")
- ESLint: Via the lightbulb icon when warnings/errors are displayed

### Via Command Line

The following npm scripts are set up in the project:

```bash
# Run Prettier formatting
npm run format

# Check Prettier formatting (without changes)
npm run format:check

# Run ESLint check with automatic fixes
npm run lint

# Only ESLint check without fixes
npm run lint:check

# Specific checks
npm run lint:ts      # Only TypeScript files
npm run lint:astro   # Only Astro files
npm run lint:a11y    # Focus on accessibility
```

## Sorting Tailwind CSS Classes

With `prettier-plugin-tailwindcss`, your Tailwind CSS classes are automatically sorted in a
consistent order. The plugin is already enabled in the Prettier configuration.

### Example:

Before formatting:

```html
<div class="bg-purple-500 p-4 text-center text-lg">Content</div>
```

After formatting:

```html
<div class="bg-purple-500 p-4 text-center text-lg">Content</div>
```

## Troubleshooting

### Problem: Formatting is not being applied

1. Check if all required extensions are installed:

   ```bash
   code --list-extensions | grep -E 'prettier|eslint|astro|tailwind'
   ```

2. Check VS Code settings:

   - Is `editor.formatOnSave` set to `true`?
   - Is `editor.defaultFormatter` set to `esbenp.prettier-vscode`?

3. Check if the Tailwind CSS plugin is correctly installed:

   ```bash
   npm ls prettier-plugin-tailwindcss
   ```

4. Syntax errors can block formatting. Check if there are errors in your files.

### Problem: ESLint rules are not being applied

1. Make sure `eslint.useFlatConfig` is set to `true`.
2. Check if `eslint.options.overrideConfigFile` correctly points to `eslint.config.js`.
3. Verify that `editor.codeActionsOnSave` is correctly configured.

## Best Practices

1. Save your files regularly to benefit from automatic formatting.
2. Run the `format` script before committing to format all files.
3. Use `npm run lint` for a comprehensive check and automatic fixing of ESLint issues.
4. Use VS Code's "Problems" panel to review ESLint messages.
5. Use Git hooks (Husky + lint-staged) that are already configured in the project to run automatic
   checks with each commit.
