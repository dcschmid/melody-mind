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
    {
      files: "*.{md,mdx}",
      options: {
        proseWrap: "always",
        embeddedLanguageFormatting: "auto",
      },
    },
  ],
};
