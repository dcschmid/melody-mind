module.exports = {
  "**/*.{js,ts,astro}": ["eslint --fix"],
  "**/*.{astro,css,md,json}": ["prettier --write"],
  "**/*.{astro,css}": ["stylelint --fix"],
};
