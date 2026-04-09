/**
 * Script to fill empty imageAlt="" attributes in knowledge MDX files.
 *
 * Usage:
 *   pnpm tsx scripts/fillImageAlts.ts        # Dry run (shows what would change)
 *   pnpm tsx scripts/fillImageAlts.ts --write  # Actually write changes
 *
 * Strategy:
 *   For each SubsectionFigure with imageAlt="", generates a descriptive alt text
 *   from the heading text and image filename.
 *
 *   Example:
 *     heading="CBGB and the Downtown Network Around It"
 *     imageSrc="/knowledge/from-punk-to-indie/from-punk-to-indie-2.jpg"
 *   → imageAlt="Photo accompanying the section: CBGB and the Downtown Network Around It"
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const KNOWLEDGE_DIR = join(
  import.meta.dirname || new URL(".", import.meta.url).pathname.replace(/^\w:/, ""),
  "..",
  "apps",
  "knowledge",
  "src",
  "content",
  "knowledge-en"
);

const DRY_RUN = !process.argv.includes("--write");

/**
 * Generates a descriptive alt text from heading and image source.
 */
function generateAltText(heading: string, imageSrc: string): string {
  // Extract just the filename without extension for context
  const filename = imageSrc.split("/").pop()?.replace(/\.[^.]+$/, "") || "";

  // Clean heading: remove leading/trailing whitespace, normalize spaces
  const cleanHeading = heading.replace(/\s+/g, " ").trim();

  return `Illustration for the section: ${cleanHeading}`;
}

/**
 * Process a single MDx file, filling empty imageAlt="" attributes.
 */
function processFile(filePath: string): { changed: boolean; content: string; count: number } {
  const content = readFileSync(filePath, "utf-8");
  let count = 0;

  // Match SubsectionFigure components with imageAlt=""
  // We need to handle multi-line component invocations
  const pattern = /(<SubsectionFigure[\s\S]*?imageAlt=)"([^"]*)"([\s\S]*?heading=)"([^"]+)"([\s\S]*?imageSrc=)"([^"]+)"[\s\S]*?\/>)/g;

  const newContent = content.replace(pattern, (match, preAlt, _emptyAlt, preHeading, heading, preSrc, src) => {
    count++;
    const altText = generateAltText(heading, src);
    return match.replace(/imageAlt="[^"]*"/, `imageAlt="${altText}"`);
  });

  return { changed: count > 0, content: newContent, count };
}

/**
 * Main: iterate all MDX files and process them.
 */
function main() {
  const files = readdirSync(KNOWLEDGE_DIR).filter((f) => f.endsWith(".mdx"));

  if (files.length === 0) {
    console.error("No MDX files found in", KNOWLEDGE_DIR);
    process.exit(1);
  }

  let totalFiles = 0;
  let totalAlts = 0;

  for (const file of files) {
    const filePath = join(KNOWLEDGE_DIR, file);
    const result = processFile(filePath);

    if (result.changed) {
      totalFiles++;
      totalAlts += result.count;

      if (DRY_RUN) {
        console.log(`[DRY RUN] ${file}: would fill ${result.count} alt text(s)`);
      } else {
        writeFileSync(filePath, result.content, "utf-8");
        console.log(`[WRITTEN] ${file}: filled ${result.count} alt text(s)`);
      }
    }
  }

  console.log(`\nTotal: ${totalAlts} alt text(s) in ${totalFiles} file(s)`);
  if (DRY_RUN) {
    console.log("\nRun with --write to apply changes.");
  }
}

main();
