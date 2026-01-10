/** @type {import('prettier').Config} */
module.exports = {
  plugins: ["prettier-plugin-astro"],
  trailingComma: "es5",
  printWidth: 90,
  singleQuote: false,
  overrides: [
    {
      files: "*.mdx",
      options: {
        parser: "mdx",
        proseWrap: "always",
      },
    },
  ],
};
