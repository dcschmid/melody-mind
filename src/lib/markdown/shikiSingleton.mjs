#!/usr/bin/env node
/**
 * shikiSingleton.mjs
 * Provides a cached single Shiki highlighter instance.
 */
import { getHighlighter } from 'shiki';

let _highlighterPromise;

export async function getSingletonHighlighter() {
  if (!_highlighterPromise) {
    _highlighterPromise = getHighlighter({ themes: ['github-dark'], langs: ['ts','js','json','bash','markdown'] })
      .catch((e) => {
        globalThis.console?.warn?.('[shiki] failed to init highlighter', e?.message || e);
        // Provide minimal shim
        return {
          codeToHtml(code) {
            return `<pre><code>${escapeHtml(code)}</code></pre>`;
          }
        };
      });
  }
  return _highlighterPromise;
}

function escapeHtml(str) {
  return str.replace(/[&<>"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}
