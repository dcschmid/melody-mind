import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const violations = [];

const layout = readFileSync("src/layouts/Layout.astro", "utf8");
if (layout.includes("../styles/global.css")) {
  violations.push("Layout.astro still imports global.css");
}

const disallowedClasses = ["sr-only", "heading-anchor"]; // enforce BEM replacements

const walk = (dir) => {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist") continue;
      walk(fullPath);
      continue;
    }
    if (!fullPath.endsWith(".astro") && !fullPath.endsWith(".mdx")) continue;
    const contents = readFileSync(fullPath, "utf8");
    for (const klass of disallowedClasses) {
      if (contents.includes(`\"${klass}\"`) || contents.includes(`'${klass}'`)) {
        violations.push(`${fullPath} contains class '${klass}'`);
      }
    }
  }
};

walk("src");

if (violations.length) {
  console.error("Scoped CSS check failed:\n" + violations.map((v) => `- ${v}`).join("\n"));
  process.exit(1);
}

console.log("Scoped CSS check passed");
