module.exports = {
  customSyntax: "postcss-html",
  extends: ["stylelint-config-standard", "stylelint-config-recess-order"],
  plugins: [
    "@double-great/stylelint-a11y",
    "stylelint-order",
    "stylelint-no-unsupported-browser-features",
    "stylelint-high-performance-animation",
    "stylelint-plugin-logical-css",
  ],
  rules: {
    "function-no-unknown": [true, { ignoreFunctions: ["color-mix", "clamp"] }],
    "property-no-unknown": [
      true,
      { ignoreProperties: ["text-wrap", "content-visibility"] },
    ],
    "color-named": "never",
    "color-function-notation": null,
    "color-function-alias-notation": null,
    "alpha-value-notation": null,
    "max-nesting-depth": 2,
    "declaration-no-important": null,
    "plugin/no-unsupported-browser-features": [
      true,
      {
        ignore: [
          "color-mix",
          "content-visibility",
          "text-wrap",
          "css-clip-path",
          "css-marker-pseudo",
          "extended-system-fonts",
          "text-decoration",
          "intrinsic-width",
        ],
      },
    ],
    "selector-class-pattern":
      "^[a-z][a-z0-9-]*(?:__(?:[a-z0-9-]+))?(?:--(?:[a-z0-9-]+))?$",
    "a11y/content-property-no-static-value": [true, { severity: "warning" }],
    "a11y/font-size-is-readable": true,
    "a11y/line-height-is-vertical-rhythmed": [true, { severity: "warning" }],
    "a11y/media-prefers-color-scheme": null,
    "a11y/media-prefers-reduced-motion": true,
    "a11y/no-display-none": null,
    "a11y/no-obsolete-attribute": true,
    "a11y/no-obsolete-element": true,
    "a11y/no-outline-none": true,
    "a11y/no-spread-text": true,
    "a11y/no-text-align-justify": true,
    "a11y/selector-pseudo-class-focus": true,
    "plugin/use-logical-properties-and-values": true,
    "plugin/use-logical-units": true,
    "declaration-block-no-duplicate-properties": [
      true,
      {
        ignore: ["consecutive-duplicates-with-different-values"],
      },
    ],
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["global"],
      },
    ],
    "property-no-vendor-prefix": [
      true,
      {
        ignoreProperties: ["-webkit-background-clip"],
      },
    ],
  },
};
