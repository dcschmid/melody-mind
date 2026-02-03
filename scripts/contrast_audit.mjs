import fs from "node:fs";
import path from "node:path";

const layoutPath = path.join(process.cwd(), "src/layouts/Layout.astro");
const content = fs.readFileSync(layoutPath, "utf8");

const tokenRegex = /--([a-z0-9-]+)\s*:\s*([^;]+);/gi;
const tokens = new Map();

let match;
while ((match = tokenRegex.exec(content))) {
  const name = `--${match[1].trim()}`;
  const value = match[2].trim();
  tokens.set(name, value);
}

const resolveVar = (value, stack = []) => {
  if (!value) return value;
  const varMatch = value.match(/var\((--[a-z0-9-]+)\)/i);
  if (!varMatch) return value;
  const varName = varMatch[1];
  if (stack.includes(varName)) return value;
  const next = tokens.get(varName);
  if (!next) return value;
  return resolveVar(next, [...stack, varName]);
};

const parseHex = (hex) => {
  const normalized = hex.replace("#", "");
  if (normalized.length === 3) {
    const r = normalized[0];
    const g = normalized[1];
    const b = normalized[2];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return `#${normalized}`;
};

const hexToRgb = (hex) => {
  const normalized = parseHex(hex).replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;
  return [r, g, b];
};

const srgbToLin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

const luminance = (hex) => {
  const [r, g, b] = hexToRgb(hex);
  const [rl, gl, bl] = [srgbToLin(r), srgbToLin(g), srgbToLin(b)];
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
};

const contrast = (fg, bg) => {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  const [bright, dark] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (bright + 0.05) / (dark + 0.05);
};

const isColor = (value) => /^#([a-f0-9]{3}|[a-f0-9]{6})$/i.test(value);

const resolveColor = (value) => {
  const raw = resolveVar(value);
  if (!raw) return { value: raw, resolved: null };
  if (raw.includes("color-mix")) {
    return { value: raw, resolved: null };
  }
  if (isColor(raw)) {
    return { value: raw, resolved: raw };
  }
  return { value: raw, resolved: null };
};

const pairs = [
  ["--gn-ink", "--gn-bg"],
  ["--gn-ink-muted", "--gn-bg"],
  ["--text-secondary", "--gn-bg"],
  ["--link-default", "--gn-bg"],
  ["--prose-body", "--gn-bg"],
  ["--prose-links", "--gn-bg"],
  ["--prose-captions", "--gn-bg"],
  ["--gn-ink", "--gn-bg-muted"],
  ["--gn-ink-muted", "--gn-bg-muted"],
  ["--link-default", "--gn-bg-muted"],
  ["--prose-links", "--gn-bg-muted"],
  ["--focus-ring-color", "--gn-bg"],
];

const report = pairs.map(([fgVar, bgVar]) => {
  const fg = resolveColor(tokens.get(fgVar) || fgVar);
  const bg = resolveColor(tokens.get(bgVar) || bgVar);
  if (!fg.resolved || !bg.resolved) {
    return {
      fgVar,
      bgVar,
      fg: fg.value,
      bg: bg.value,
      ratio: null,
      note: "manual",
    };
  }
  return {
    fgVar,
    bgVar,
    fg: fg.resolved,
    bg: bg.resolved,
    ratio: contrast(fg.resolved, bg.resolved),
    note: "computed",
  };
});

const formatRatio = (ratio) => (ratio ? ratio.toFixed(2) : "—");

console.log("WCAG Contrast Audit (tokens)");
console.log(`Source: ${layoutPath}`);
console.log("");
report.forEach((item) => {
  const status = item.ratio
    ? item.ratio >= 7
      ? "PASS AAA"
      : item.ratio >= 4.5
        ? "PASS AA (large only)"
        : "FAIL"
    : "MANUAL";
  console.log(`${item.fgVar} on ${item.bgVar}: ${formatRatio(item.ratio)} (${status})`);
  console.log(`  fg=${item.fg} bg=${item.bg}`);
});
