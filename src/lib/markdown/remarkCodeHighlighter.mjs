#!/usr/bin/env node
/**
 * remarkCodeHighlighter.mjs
 *
 * Single Shiki highlighter instance for all markdown code fences.
 * Avoids spawning multiple instances (observed 10) which increase memory.
 */
import { getSingletonHighlighter } from './shikiSingleton.mjs';

/** @type {import('unified').Plugin<[], import('mdast').Root>} */
export function remarkCodeHighlighter() {
  return async (tree) => {
    const highlighter = await getSingletonHighlighter();
    const visit = (await import('unist-util-visit')).visit;
    visit(tree, 'code', (node) => {
      const lang = (node.lang || 'text').toLowerCase();
      try {
        const html = highlighter.codeToHtml(node.value, { lang });
        node.type = 'html';
        node.value = html;
        delete node.lang;
      } catch {
        // Fallback: keep raw code block (no crash)
      }
    });
  };
}
