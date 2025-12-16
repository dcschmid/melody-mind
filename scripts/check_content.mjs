import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const files = process.argv.slice(2);
if (!files.length) {
  process.exit(0);
}

const requiredFrontmatter = ["title", "description", "keywords"];

const errors = [];

const fileExists = async (target) => {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
};

const normalizeLinkTarget = (raw) => {
  if (!raw) return "";
  return raw.split("#")[0].split("?")[0];
};

for (const relativePath of files) {
  const absPath = path.resolve(projectRoot, relativePath);
  const isContentFile = /src\/content\/knowledge-en\/.+\.(md|mdx)$/i.test(
    relativePath
  );
  const isMarkdown = /\.(md|mdx)$/i.test(relativePath);

  let rawContent = "";
  try {
    rawContent = await fs.readFile(absPath, "utf8");
  } catch (error) {
    errors.push(`${relativePath}: cannot read file (${error.message})`);
    continue;
  }

  let body = rawContent;
  let data = {};

  if (isMarkdown) {
    try {
      const parsed = matter(rawContent);
      body = parsed.content;
      data = parsed.data || {};
    } catch (error) {
      errors.push(`${relativePath}: frontmatter parse error (${error.message})`);
      continue;
    }
  }

  if (isContentFile) {
    for (const key of requiredFrontmatter) {
      if (key === "keywords") {
        if (!Array.isArray(data[key]) || data[key].length === 0) {
          errors.push(`${relativePath}: frontmatter "${key}" must be a non-empty array`);
        }
        continue;
      }
      if (!data[key] || `${data[key]}`.trim().length === 0) {
        errors.push(`${relativePath}: missing required frontmatter "${key}"`);
      }
    }

    const dateFields = ["createdAt", "updatedAt"];
    for (const field of dateFields) {
      if (data[field]) {
        const parsedDate = new Date(data[field]);
        if (Number.isNaN(parsedDate.valueOf())) {
          errors.push(`${relativePath}: "${field}" is not a valid date`);
        }
      }
    }
  }

  if (isMarkdown) {
    const linkPattern = /\[[^\]]*?\]\((.*?)\)/g;
    let match;
    while ((match = linkPattern.exec(body)) !== null) {
      const link = match[1];
      if (!link || link.startsWith("#")) continue;
      if (/^(https?:)?\/\//i.test(link)) continue;
      if (link.startsWith("mailto:")) continue;

      const target = normalizeLinkTarget(link);
      if (!target) continue;

      let resolvedPath;
      if (target.startsWith("/")) {
        const publicPath = path.join(projectRoot, "public", target);
        const srcPath = path.join(projectRoot, "src", target.replace(/^\/+/, ""));
        const existsInPublic = await fileExists(publicPath);
        const existsInSrc = await fileExists(srcPath);
        if (!existsInPublic && !existsInSrc) {
          errors.push(`${relativePath}: broken absolute link "${link}"`);
        }
        continue;
      }

      resolvedPath = path.resolve(path.dirname(absPath), target);
      const existsRelative = await fileExists(resolvedPath);
      if (!existsRelative) {
        errors.push(`${relativePath}: broken relative link "${link}"`);
      }
    }
  }
}

if (errors.length) {
  console.error("Content checks failed:");
  for (const err of errors) {
    console.error(`- ${err}`);
  }
  process.exit(1);
}

console.log("Content checks passed for staged files.");
