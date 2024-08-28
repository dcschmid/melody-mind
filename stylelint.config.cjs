module.exports = {
  extends: [
    "stylelint-config-html",
    "@tinkoff/stylelint-config",
    "stylelint-config-standard-scss",
    "stylelint-config-prettier-scss",
    "stylelint-config-clean-order",
  ],
  plugins: ["stylelint-scss", "@double-great/stylelint-a11y"],
  overrides: [
    {
      files: ["**/*.{astro,html}"],
      customSyntax: "postcss-html",
    },
    {
      files: ["src/**/*.{scss,css}"],
      customSyntax: "postcss-scss",
    },
  ],
  rules: {
    "no-duplicate-selectors": true,
    "scss/at-mixin-pattern": [
      "^([-_]?[a-z][a-z0-9]*)(-[a-z0-9]+)*$",
      {
        message: "Expected mixin name to be kebab-case",
      },
    ],
    "selector-pseudo-class-no-unknown": [
      true,
      { ignorePseudoClasses: ["global", "export"] },
    ],

    "selector-class-pattern": null,
    "selector-id-pattern": null,
    "custom-property-pattern": null,
    "value-keyword-case": null,
    "a11y/no-outline-none": null,
    "no-descending-specificity": null,
  },
  ignoreFiles: ["node_modules/*"],
  defaultSeverity: "error",
};
