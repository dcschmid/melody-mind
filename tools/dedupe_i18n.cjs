#!/usr/bin/env node

/**
 * dedupe_i18n.js
 *
 * Deduplicate duplicate keys in a JS locale file that exports a single object via:
 *   export default { ... };
 *
 * Keeps the last occurrence of duplicated keys and removes earlier ones.
 *
 * Usage:
 *   node tools/dedupe_i18n.js            # runs on default es.ts path
 *   FILE=path/to/locale.ts node tools/dedupe_i18n.js
 *
 * Note: This script makes a backup copy (same filename + .bak.TIMESTAMP) before writing.
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_REL = path.join('src', 'i18n', 'locales', 'es.ts');
const filePath = process.env.FILE || path.resolve(__dirname, '..', DEFAULT_REL);

function die(msg) {
  console.error('ERROR:', msg);
  process.exit(1);
}

if (!fs.existsSync(filePath)) die(`Locale file not found: ${filePath}`);

const raw = fs.readFileSync(filePath, 'utf8');

// Find export default { ... };
const startToken = 'export default {';
const startIdx = raw.indexOf(startToken);
if (startIdx === -1) die('Could not find "export default {" in file.');

let endIdx = raw.lastIndexOf('\n};');
if (endIdx === -1) endIdx = raw.lastIndexOf('};');
if (endIdx === -1) die('Could not find trailing "};" in file.');

const header = raw.slice(0, startIdx + startToken.length);
const body = raw.slice(startIdx + startToken.length, endIdx);
const footer = raw.slice(endIdx);

// Helper: find next unescaped double quote starting at pos
function findClosingQuote(str, pos) {
  let i = pos;
  while (i < str.length) {
    const ch = str[i];
    if (ch === '"') {
      // Count number of preceding backslashes
      let bs = 0;
      let j = i - 1;
      while (j >= 0 && str[j] === '\\') {
        bs++;
        j--;
      }
      if (bs % 2 === 0) {
        // not escaped
        return i;
      }
      // else escaped, keep scanning
    }
    i++;
  }
  return -1;
}

// Parse body to find key occurrences and their blocks
const lines = body.split(/\r?\n/);
const keyRegex = /^\s*"([^"]+)":/;

let occurrences = []; // { key, startLine, endLineExclusive }
let curKey = null;
let curKeyLine = null;

// We'll scan line by line. When we detect a line starting a key, we determine the end line by parsing the value.
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const m = line.match(keyRegex);
  if (m) {
    // Found a key start
    const key = m[1];
    const keyStartLine = i;

    // Compute where this property's value ends.
    // We'll examine from the colon position in the full body string for robust multi-line string handling.
    // Compute the absolute index in the body string for the colon after the key.
    // To do that, compute the char index of this line's start within body.
    let charIndex = 0;
    for (let li = 0; li < i; li++) charIndex += lines[li].length + 1; // +1 for newline removed by split

    // within this line, find the colon after the key
    const colonIdxInLine = line.indexOf(':', m.index + m[0].length - (m[0].endsWith(':') ? 1 : 0));
    // Fallback: find first colon
    const colonIdx = colonIdxInLine >= 0 ? colonIdxInLine : line.indexOf(':');

    let valueStartIdx = charIndex + colonIdx + 1; // after colon
    // skip whitespace
    while (valueStartIdx < body.length && /\s/.test(body[valueStartIdx])) valueStartIdx++;

    let valueEndIdx = valueStartIdx;

    if (body[valueStartIdx] === '"') {
      // String value: find closing quote
      const closingQuote = findClosingQuote(body, valueStartIdx + 1);
      if (closingQuote === -1) {
        // Could be malformed; fall back to searching for line-based end (next line that starts with a key)
        // We'll set endLine to next key-or-end
        let endLine = i + 1;
        while (endLine < lines.length && !keyRegex.test(lines[endLine])) endLine++;
        occurrences.push({ key, startLine: keyStartLine, endLine });
        i = endLine - 1;
        continue;
      }
      valueEndIdx = closingQuote + 1;
      // consume trailing whitespace and optional comma
      while (valueEndIdx < body.length && /\s/.test(body[valueEndIdx])) valueEndIdx++;
      if (body[valueEndIdx] === ',') valueEndIdx++;
      // compute endLineExclusive by counting newlines until valueEndIdx
      let acc = 0;
      let endLine = 0;
      for (endLine = 0; endLine < lines.length; endLine++) {
        acc += lines[endLine].length + 1;
        if (acc > valueEndIdx - 1) break;
      }
      // endLine is index of line that contains the endChar; we want exclusive -> +1
      occurrences.push({ key, startLine: keyStartLine, endLine: Math.min(endLine + 1, lines.length) });
      i = Math.min(endLine, lines.length - 1);
    } else {
      // Not a starting quote. Could be a nested object/array or literal or template etc.
      // We'll find the next line that starts a new key (or end) and use that as end.
      let endLine = i + 1;
      while (endLine < lines.length && !keyRegex.test(lines[endLine])) endLine++;
      occurrences.push({ key, startLine: keyStartLine, endLine });
      i = endLine - 1;
    }
  }
}

// If no occurrences found, nothing to do
if (occurrences.length === 0) {
  console.log('No top-level key occurrences found in body. Nothing to do.');
  process.exit(0);
}

// Compute last occurrence per key
const lastMap = new Map();
for (let idx = 0; idx < occurrences.length; idx++) {
  const o = occurrences[idx];
  lastMap.set(o.key, idx);
}

// Build new blocks: keep only the occurrences that are the last occurrence for the key.
// We'll preserve the order of these last occurrences in the order they appear (their occurrence index).
const blocks = [];
const addedKeys = new Set();
for (let idx = 0; idx < occurrences.length; idx++) {
  const o = occurrences[idx];
  const lastIdx = lastMap.get(o.key);
  if (lastIdx === idx) {
    // This is the last occurrence: include it
    // Extract the original block text from lines
    const blockLines = lines.slice(o.startLine, o.endLine);
    blocks.push(blockLines.join('\n'));
    addedKeys.add(o.key);
  } else {
    // skip earlier occurrence
  }
}

// Preserve leading non-key lines before the first occurrence line
let firstKeyLine = occurrences.length > 0 ? occurrences[0].startLine : 0;
let leadingLines = [];
for (let li = 0; li < firstKeyLine; li++) leadingLines.push(lines[li]);

// Compose new body
const newBodyLines = [];
if (leadingLines.length > 0) newBodyLines.push(leadingLines.join('\n'));
newBodyLines.push(blocks.join('\n'));

// Trim potential excess blank lines
const newBody = newBodyLines.join('\n').replace(/\n{3,}/g, '\n\n');

// Backup original file
const stat = fs.statSync(filePath);
const bakPath = filePath + `.bak.${Date.now()}`;
fs.copyFileSync(filePath, bakPath);
console.log(`Backup written to: ${bakPath}`);

// Write new content
const newContent = header + '\n' + newBody + '\n' + footer;
fs.writeFileSync(filePath, newContent, 'utf8');

const totalKeys = occurrences.length;
const uniqueKeys = lastMap.size;
const removed = totalKeys - uniqueKeys;

console.log(`Deduplication complete for ${filePath}`);
console.log(`  total key occurrences: ${totalKeys}`);
console.log(`  unique keys kept:      ${uniqueKeys}`);
console.log(`  duplicate entries removed: ${removed}`);
console.log('Done.');
