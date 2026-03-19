module.exports = {
  customSyntax: "postcss-html",
  extends: [
    "stylelint-config-standard",
    "stylelint-config-recess-order",
  ],
  plugins: ["@double-great/stylelint-a11y"],
  rules: {
    "function-no-unknown": [true, { ignoreFunctions: ["color-mix", "clamp"] }],
    "property-no-unknown": [true, { ignoreProperties: ["text-wrap", "content-visibility"] }],
    "color-named": "never",
    "color-function-notation": null,
    "color-function-alias-notation": null,
    "alpha-value-notation": null,
    "max-nesting-depth": 2,
    "declaration-no-important": null,
    "a11y/font-size-is-readable": true,
    "a11y/line-height-is-vertical-rhythmed": null,
    "a11y/media-prefers-color-scheme": null,
    "a11y/media-prefers-reduced-motion": true,
    "a11y/no-display-none": null,
    "a11y/no-obsolete-attribute": true,
    "a11y/no-obsolete-element": true,
    "a11y/no-outline-none": true,
    "a11y/no-spread-text": true,
    "a11y/no-text-align-justify": true,
    "a11y/selector-pseudo-class-focus": true,
    "declaration-block-no-duplicate-properties": [
      true,
      {
        ignore: ["consecutive-duplicates-with-different-values"],
      },
    ],
    "selector-class-pattern":
      "^[a-z][a-z0-9-]*(?:__(?:[a-z0-9-]+))?(?:--(?:[a-z0-9-]+))?$",
    "a11y/content-property-no-static-value": [true, { severity: "warning" }],
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["global"],
      },
    ],
    "keyframes-name-pattern": null,
    "property-no-vendor-prefix": [
      true,
      {
        ignoreProperties: ["-webkit-background-clip"],
      },
    ],
  },
};
