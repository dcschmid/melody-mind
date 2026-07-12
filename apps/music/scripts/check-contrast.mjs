#!/usr/bin/env node
/**
 * WCAG AAA contrast gate for the design tokens in src/styles/master-theme.css.
 *
 * Parses the base :root token definitions (first definition wins, so the
 * high-contrast/forced-colors overrides further down are ignored), resolves
 * var() references and srgb color-mix() derivations, converts OKLCH to sRGB,
 * and checks every text/background pair the UI actually uses.
 *
 * Exits non-zero when any pair falls below its required ratio:
 *   7:1  normal text (AAA)
 *   4.5: large text / bold ≥18.66px (AAA)
 *   3:1  non-text UI (borders, focus ring)
 *
 * Usage: node scripts/check-contrast.mjs
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const cssPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/styles/master-theme.css"
);
const css = readFileSync(cssPath, "utf8");

/* ---------------------------------------------------------------- tokens */

const tokens = new Map();
const tokenRe = /(--[\w-]+)\s*:\s*([^;]+);/g;

for (const [, name, value] of css.matchAll(tokenRe)) {
  // First definition wins: base :root blocks precede the media overrides.
  if (!tokens.has(name)) {
    tokens.set(name, value.replace(/\s+/g, " ").trim());
  }
}

function resolve(value, depth = 0) {
  if (depth > 12) {
    throw new Error(`var() resolution too deep: ${value}`);
  }

  const varRe = /var\((--[\w-]+)(?:\s*,\s*([^)]+))?\)/;
  let out = value;
  let match;

  while ((match = out.match(varRe))) {
    const replacement = tokens.get(match[1]) ?? match[2];
    if (replacement === undefined) {
      throw new Error(`unresolvable var ${match[1]} in: ${value}`);
    }
    out = out.replace(match[0], replacement);
  }

  return out.trim();
}

/* ----------------------------------------------------------- color math */

/** OKLCH -> gamma-encoded sRGB [0..1] + alpha. */
function oklchToSrgb(L, C, H, alpha = 1) {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  const linear = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];

  const channel = (c) => {
    const clamped = Math.min(1, Math.max(0, c));
    return clamped <= 0.0031308
      ? 12.92 * clamped
      : 1.055 * clamped ** (1 / 2.4) - 0.055;
  };

  return { rgb: linear.map(channel), alpha };
}

function parseColor(raw) {
  const value = resolve(raw);

  const oklch = value.match(
    /^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)deg\s*(?:\/\s*([\d.]+%?)\s*)?\)$/
  );
  if (oklch) {
    let alpha = 1;
    if (oklch[4]) {
      alpha = oklch[4].endsWith("%")
        ? parseFloat(oklch[4]) / 100
        : parseFloat(oklch[4]);
    }
    return oklchToSrgb(
      parseFloat(oklch[1]) / 100,
      parseFloat(oklch[2]),
      parseFloat(oklch[3]),
      alpha
    );
  }

  const hex = value.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return {
      rgb: [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => c / 255),
      alpha: 1,
    };
  }

  // color-mix(in srgb, <colorA> <p>%?, <colorB> <p>%?) — split on the top-level comma.
  const mix = value.match(/^color-mix\(\s*in srgb\s*,(.+)\)$/);
  if (mix) {
    const parts = splitTopLevel(mix[1]);
    if (parts.length !== 2) {
      throw new Error(`unsupported color-mix arity: ${value}`);
    }
    const [colorA, pctA] = splitColorAndPct(parts[0]);
    const [colorB, pctB] = splitColorAndPct(parts[1]);
    let a = pctA;
    let b = pctB;
    if (a === null && b === null) {
      a = 50;
      b = 50;
    } else if (a === null) {
      a = 100 - b;
    } else if (b === null) {
      b = 100 - a;
    }
    const ca = colorA === "transparent" ? { rgb: [0, 0, 0], alpha: 0 } : parseColor(colorA);
    const cb = colorB === "transparent" ? { rgb: [0, 0, 0], alpha: 0 } : parseColor(colorB);
    const wa = a / (a + b);
    const wb = b / (a + b);
    // CSS color-mix in srgb operates on premultiplied gamma-encoded channels.
    const alpha = ca.alpha * wa + cb.alpha * wb;
    const rgb =
      alpha === 0
        ? [0, 0, 0]
        : ca.rgb.map(
            (c, i) => (c * ca.alpha * wa + cb.rgb[i] * cb.alpha * wb) / alpha
          );
    return { rgb, alpha };
  }

  throw new Error(`unparseable color: ${raw} -> ${value}`);
}

function splitTopLevel(input) {
  const parts = [];
  let depth = 0;
  let current = "";
  for (const char of input) {
    if (char === "(") depth++;
    if (char === ")") depth--;
    if (char === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  parts.push(current.trim());
  return parts;
}

function splitColorAndPct(part) {
  const match = part.match(/^(.*?)\s+([\d.]+)%$/);
  return match ? [match[1].trim(), parseFloat(match[2])] : [part.trim(), null];
}

/** Composite a possibly-translucent color over an opaque backdrop. */
function over(fg, backdrop) {
  if (fg.alpha >= 1) return fg.rgb;
  return fg.rgb.map((c, i) => c * fg.alpha + backdrop[i] * (1 - fg.alpha));
}

function luminance(rgb) {
  const [r, g, b] = rgb.map((c) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(fgRgb, bgRgb) {
  const l1 = luminance(fgRgb);
  const l2 = luminance(bgRgb);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const toHex = (rgb) =>
  "#" +
  rgb
    .map((c) => Math.round(Math.min(1, Math.max(0, c)) * 255).toString(16).padStart(2, "0"))
    .join("");

/* ---------------------------------------------------------------- pairs */

const TEXT_BACKDROPS = [
  "--bg-primary",
  "--surface-1",
  "--surface-2",
  "--surface-3",
  "--surface-panel-bg",
  "--surface-panel-raised",
  "--surface-pill-bg",
  "--surface-chip-bg",
  "--section-surface-bg",
  "--section-surface-accent-bg",
  "--section-surface-spotlight-bg",
  "--surface-card-hover",
];

const checks = [];
const addChecks = (fgs, bgs, min, note = "") => {
  for (const fg of fgs) for (const bg of bgs) checks.push({ fg, bg, min, note });
};

addChecks(["--text-primary", "--text-secondary", "--text-tertiary"], TEXT_BACKDROPS, 7);
addChecks(["--link-default", "--link-hover", "--link-visited"], TEXT_BACKDROPS, 7);
addChecks(
  ["--accent-primary", "--accent-strong", "--accent-primary-hover"],
  TEXT_BACKDROPS,
  7,
  "accent used as text (eyebrows, titles)"
);
addChecks(
  ["--color-success", "--color-warning", "--color-error", "--color-info"],
  ["--bg-primary", "--surface-1", "--surface-2"],
  7,
  "status text"
);
addChecks(["--accent-contrast"], ["--accent-primary", "--accent-primary-hover"], 7, "button text on accent");
addChecks(
  ["--border-strong", "--focus-ring-color"],
  ["--bg-primary", "--surface-1", "--surface-2", "--surface-3"],
  3,
  "non-text UI"
);
addChecks(
  ["--accent-muted"],
  ["--bg-primary", "--surface-1"],
  4.5,
  "decorative/large accent"
);

/* ------------------------------------------------------------------ run */

let failures = 0;
const rows = [];

for (const { fg, bg, min, note } of checks) {
  const bgColor = parseColor(tokens.get(bg));
  const bgOpaque = over(bgColor, parseColor(tokens.get("--bg-primary")).rgb);
  const fgColor = parseColor(tokens.get(fg));
  const fgOpaque = over(fgColor, bgOpaque);
  const r = ratio(fgOpaque, bgOpaque);
  const pass = r >= min;
  if (!pass) failures++;
  rows.push({
    pair: `${fg} on ${bg}`,
    ratio: r.toFixed(2),
    min,
    result: pass ? "pass" : "FAIL",
    note,
  });
}

const failed = rows.filter((r) => r.result === "FAIL");
console.log(`Checked ${rows.length} token pairs from master-theme.css`);
for (const row of rows) {
  if (row.result === "FAIL" || process.argv.includes("--verbose")) {
    console.log(
      `${row.result.padEnd(4)} ${row.ratio.padStart(6)} (min ${row.min})  ${row.pair}${row.note ? `  [${row.note}]` : ""}`
    );
  }
}

if (process.argv.includes("--hex")) {
  for (const name of [
    "--bg-primary",
    "--bg-secondary",
    "--surface-1",
    "--surface-2",
    "--surface-3",
    "--text-primary",
    "--accent-primary",
  ]) {
    console.log(name, toHex(over(parseColor(tokens.get(name)), [0, 0, 0])));
  }
}

console.log(failures === 0 ? "All pairs pass." : `${failed.length} pair(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
