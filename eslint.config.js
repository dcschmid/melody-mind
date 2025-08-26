import eslint from "@eslint/js";
import eslintPluginAstro from "eslint-plugin-astro";
import importPlugin from "eslint-plugin-import";
import jsdocPlugin from "eslint-plugin-jsdoc";
import promisePlugin from "eslint-plugin-promise";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["node_modules/**", "dist/**", ".astro/**", "public/**", "*.d.ts"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,

  // Konfiguration für alle TypeScript-Dateien
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      import: importPlugin,
      jsdoc: jsdocPlugin,
      promise: promisePlugin,
    },
    rules: {
      // TypeScript-spezifische Regeln
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "interface",
          format: ["PascalCase"],
        },
        {
          selector: "typeAlias",
          format: ["PascalCase"],
        },
        {
          selector: "enum",
          format: ["PascalCase"],
        },
      ],

      // Import-Regeln
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      // JSDoc-Regeln - entsprechend der Anforderungen in den Anweisungen
      "jsdoc/require-jsdoc": [
        "warn",
        {
          publicOnly: true,
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
          },
        },
      ],
      "jsdoc/require-description": "warn",
      "jsdoc/require-param-type": "warn",
      "jsdoc/require-returns-type": "warn",

      // Promise-Regeln
      "promise/always-return": "warn",
      "promise/no-return-wrap": "error",
      "promise/param-names": "error",
      "promise/catch-or-return": "error",
      "promise/no-nesting": "warn",
    },
  },

  // Konfiguration für alle JavaScript-Dateien
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      import: importPlugin,
      jsdoc: jsdocPlugin,
      promise: promisePlugin,
    },
    rules: {
      // Import-Regeln
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      // JSDoc-Regeln
      "jsdoc/require-jsdoc": [
        "warn",
        {
          publicOnly: true,
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
          },
        },
      ],

      // Promise-Regeln
      "promise/always-return": "warn",
      "promise/no-return-wrap": "error",
      "promise/param-names": "error",
      "promise/catch-or-return": "error",
      "promise/no-nesting": "warn",
    },
  },

  // Spezielle Konfiguration für Astro-Dateien
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      // Deaktiviere ALLE TypeScript-Regeln für Astro-Dateien
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      // Erlaube unbenutzte Variablen in catch blocks (häufig in error handling)
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^(err|error)$",
        },
      ],
    },
  },

  // Allgemeine Regeln für alle Dateien
  {
    files: ["**/*.{js,ts,jsx,tsx,astro}"],
    rules: {
      // Allgemeine Code-Qualitätsregeln
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "prefer-const": "error",
      curly: "error",
      eqeqeq: "error",
      "no-var": "error",
      "no-throw-literal": "error",
      "prefer-template": "warn",

      // Formatierung und Stilregeln
      "max-lines-per-function": ["warn", { max: 100, skipBlankLines: true, skipComments: true }],
      "max-depth": ["warn", 4],
      complexity: ["warn", 15],
    },
  },

  // Spezielle Konfiguration für Node.js ES Module Script-Dateien (muss nach allgemeinen Regeln kommen)
  {
    files: ["scripts/**/*.js"],
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        Buffer: "readonly",
        global: "readonly",
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "no-console": "off", // Allow all console methods for scripts
      "max-depth": ["warn", 5], // Allow one extra level for scripts
      "max-lines-per-function": ["warn", { max: 150, skipBlankLines: true, skipComments: true }],
    },
  },

  // Spezielle Konfiguration für Node.js CommonJS Script-Dateien
  {
    files: ["scripts/**/*.cjs"],
    languageOptions: {
      globals: {
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        Buffer: "readonly",
        global: "readonly",
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "commonjs",
      },
    },
    rules: {
      "no-console": "off", // Allow all console methods for scripts
      "max-depth": ["warn", 5], // Allow one extra level for scripts
      "max-lines-per-function": ["warn", { max: 150, skipBlankLines: true, skipComments: true }],
      "@typescript-eslint/no-require-imports": "off", // Allow require() in CommonJS
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];
