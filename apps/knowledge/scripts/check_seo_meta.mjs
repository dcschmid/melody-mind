import fs from "node:fs/promises";
import path from "node:path";

const DIST_DIR = path.resolve("dist");
const HTML_EXTENSION = ".html";
const TITLE_MIN = 20;
const TITLE_MAX = 65;
const DESCRIPTION_MIN = 70;
const DESCRIPTION_MAX = 160;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return walk(fullPath);
      }
      return entry.isFile() && entry.name.endsWith(HTML_EXTENSION) ? [fullPath] : [];
    })
  );
  return files.flat();
}

function extractTag(html, pattern) {
  const match = html.match(pattern);
  return match?.[1]?.trim() || "";
}

function parseAttributes(tagSource) {
  const attributes = {};
  const attrPattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let match;
  while ((match = attrPattern.exec(tagSource)) !== null) {
    const [, rawName, doubleQuoted, singleQuoted, bareValue] = match;
    if (!rawName) continue;
    const name = rawName.toLowerCase();
    if (name.startsWith("<")) continue;
    attributes[name] = doubleQuoted ?? singleQuoted ?? bareValue ?? "";
  }
  return attributes;
}

function findMetaContent(html, metaName) {
  const metaPattern = /<meta\b[^>]*>/gi;
  let match;
  while ((match = metaPattern.exec(html)) !== null) {
    const attrs = parseAttributes(match[0]);
    if ((attrs.name || "").toLowerCase() === metaName.toLowerCase()) {
      return attrs.content || "";
    }
  }
  return "";
}

function findCanonicalHref(html) {
  const linkPattern = /<link\b[^>]*>/gi;
  let match;
  while ((match = linkPattern.exec(html)) !== null) {
    const attrs = parseAttributes(match[0]);
    const rel = (attrs.rel || "").toLowerCase();
    if (rel.split(/\s+/).includes("canonical")) {
      return attrs.href || "";
    }
  }
  return "";
}

function hasRedirectMeta(html) {
  return /<meta\b[^>]*http-equiv\s*=\s*["']?refresh["']?[^>]*>/i.test(html);
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function routeFromFile(filePath) {
  const relative = path.relative(DIST_DIR, filePath);
  if (relative === "index.html") {
    return "/";
  }
  return `/${relative.replace(/index\.html$/, "").replace(/\\/g, "/")}`;
}

function addIssue(collection, severity, route, message) {
  collection.push({ severity, route, message });
}

function addDuplicateIssues(collection, label, values) {
  for (const [value, routes] of values.entries()) {
    if (routes.length < 2) continue;
    const uniqueRoutes = [...new Set(routes)];
    if (uniqueRoutes.length < 2) continue;
    collection.push({
      severity: "warn",
      route: uniqueRoutes.join(", "),
      message: `Duplicate ${label}: ${value}`,
    });
  }
}

async function main() {
  try {
    await fs.access(DIST_DIR);
  } catch {
    console.error("SEO meta check requires an existing dist/ directory. Run `yarn build` first.");
    process.exit(1);
  }

  const htmlFiles = await walk(DIST_DIR);
  const issues = [];
  const indexableTitles = new Map();
  const indexableDescriptions = new Map();
  const canonicals = new Map();

  for (const filePath of htmlFiles) {
    const html = await fs.readFile(filePath, "utf8");
    const route = routeFromFile(filePath);
    if (hasRedirectMeta(html)) {
      continue;
    }
    const title = normalizeWhitespace(
      extractTag(html, /<title>([\s\S]*?)<\/title>/i)
    );
    const description = normalizeWhitespace(findMetaContent(html, "description"));
    const canonical = normalizeWhitespace(findCanonicalHref(html));
    const robots = normalizeWhitespace(findMetaContent(html, "robots")).toLowerCase();
    const isNoindex = robots.includes("noindex");

    if (!title) {
      addIssue(issues, "error", route, "Missing <title>.");
    } else {
      if (!isNoindex && title.length < TITLE_MIN) {
        addIssue(issues, "warn", route, `Title is short (${title.length} chars).`);
      }
      if (!isNoindex && title.length > TITLE_MAX) {
        addIssue(issues, "warn", route, `Title is long (${title.length} chars).`);
      }
      if (!isNoindex) {
        const routes = indexableTitles.get(title) || [];
        routes.push(route);
        indexableTitles.set(title, routes);
      }
    }

    if (!description) {
      addIssue(issues, "error", route, "Missing meta description.");
    } else {
      if (!isNoindex && description.length < DESCRIPTION_MIN) {
        addIssue(
          issues,
          "warn",
          route,
          `Meta description is short (${description.length} chars).`
        );
      }
      if (!isNoindex && description.length > DESCRIPTION_MAX) {
        addIssue(
          issues,
          "warn",
          route,
          `Meta description is long (${description.length} chars).`
        );
      }
      if (!isNoindex) {
        const routes = indexableDescriptions.get(description) || [];
        routes.push(route);
        indexableDescriptions.set(description, routes);
      }
    }

    if (!canonical) {
      addIssue(issues, "error", route, "Missing canonical URL.");
    } else if (!isNoindex) {
      const routes = canonicals.get(canonical) || [];
      routes.push(route);
      canonicals.set(canonical, routes);
    }
  }

  addDuplicateIssues(issues, "title", indexableTitles);
  addDuplicateIssues(issues, "meta description", indexableDescriptions);
  addDuplicateIssues(issues, "canonical URL", canonicals);

  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warn");

  console.log(`SEO meta audit scanned ${htmlFiles.length} HTML files.`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);

  if (issues.length > 0) {
    for (const issue of issues) {
      const prefix = issue.severity === "error" ? "ERROR" : "WARN";
      console.log(`${prefix} ${issue.route} - ${issue.message}`);
    }
  } else {
    console.log("No SEO meta issues found.");
  }

  if (errors.length > 0) {
    process.exit(1);
  }
}

await main();
