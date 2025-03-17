import { toString } from "mdast-util-to-string";

export function remarkReadingTime() {
  return function (tree, { data }) {
    const textContent = toString(tree);
    const wordCount = textContent.split(/\s+/g).length;
    const readingTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute reading speed

    // Add reading time to frontmatter data
    data.astro.frontmatter.readingTime = readingTime;
  };
}
