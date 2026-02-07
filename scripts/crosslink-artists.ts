#!/usr/bin/env node

/**
 * Crosslinking Script: Links Artists and Knowledge pages bidirectionally
 *
 * Features:
 * - Knowledge → Artists: Adds markdown links in content when artist name is found
 * - Artist → Knowledge: Adds knowledge articles to relatedArticles array
 * - Dry-run mode: Preview changes without modifying files
 * - Backup: Creates .backup files before modifications
 * - Smart matching: Whole-word matching with word boundaries
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Types
interface Artist {
  id: string;
  slug: string;
  name: string;
  filePath: string;
  frontmatter: Record<string, unknown>;
}

interface Knowledge {
  id: string;
  slug: string;
  title: string;
  filePath: string;
  content: string;
  frontmatter: Record<string, unknown>;
}

interface CrosslinkResult {
  artistPath: string;
  knowledgePath: string;
  matchCount: number;
  linksAdded: string[];
}

interface UpdateResult {
  filePath: string;
  changes: string[];
  originalContent: string;
  newContent: string;
}

// Configuration
const CONFIG = {
  ARTISTS_DIR: path.join(process.cwd(), "src/content/artists"),
  KNOWLEDGE_DIR: path.join(process.cwd(), "src/content/knowledge-en"),
  DRY_RUN: process.argv.includes("--dry-run"),
  BACKUP: !process.argv.includes("--no-backup"),
  FORCE: process.argv.includes("--force"),
};

// Utility: Pure function to read file safely
const readFile = (
  filePath: string
): { success: true; content: string } | { success: false; error: string } => {
  try {
    return { success: true, content: fs.readFileSync(filePath, "utf-8") };
  } catch (error) {
    return {
      success: false,
      error: `Failed to read ${filePath}: ${(error as Error).message}`,
    };
  }
};

// Utility: Pure function to write file safely
const writeFile = (
  filePath: string,
  content: string
): { success: true } | { success: false; error: string } => {
  try {
    fs.writeFileSync(filePath, content, "utf-8");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: `Failed to write ${filePath}: ${(error as Error).message}`,
    };
  }
};

// Utility: Atomic file write (write to temp, then rename)
const writeFileAtomic = (
  filePath: string,
  content: string
): { success: true } | { success: false; error: string } => {
  try {
    const tempPath = `${filePath}.tmp`;
    const writeResult = writeFile(tempPath, content);
    if (!writeResult.success) {
      return writeResult;
    }

    fs.renameSync(tempPath, filePath);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: `Failed to write ${filePath}: ${(error as Error).message}`,
    };
  }
};

// Utility: Create backup
const createBackup = (
  filePath: string,
  force = false
): { success: true; backupPath: string } | { success: false; error: string } => {
  try {
    const backupPath = `${filePath}.backup`;

    // Check if backup already exists
    if (!force && fs.existsSync(backupPath)) {
      return {
        success: false,
        error: `Backup file already exists at ${backupPath} (use --force to overwrite)`,
      };
    }

    const result = readFile(filePath);
    if (!result.success) {
      return { success: false, error: result.error };
    }
    const writeResult = writeFile(backupPath, result.content);
    if (!writeResult.success) {
      return { success: false, error: writeResult.error };
    }
    return { success: true, backupPath };
  } catch (error) {
    return {
      success: false,
      error: `Failed to create backup: ${(error as Error).message}`,
    };
  }
};

// Pure function: Extract YAML frontmatter from markdown
const parseFrontmatter = (
  markdown: string
): { frontmatter: Record<string, unknown>; content: string } => {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, content: markdown };
  }

  // Simple YAML parsing (for basic key-value pairs and arrays)
  const yamlLines = match[1].split("\n");
  const frontmatter: Record<string, unknown> = {};
  let inArray = false;
  let currentArray: string[] = [];
  let currentKey = "";
  let expectingValueOnNextLine = false;

  yamlLines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      // Skip empty lines and comments
      return;
    }

    // Handle array items
    if (trimmed.startsWith("- ")) {
      inArray = true;
      currentArray.push(trimmed.slice(2).replace(/^["']|["']$/g, ""));
      return;
    }

    // Handle key-value pairs
    if (trimmed.includes(":")) {
      // If we were expecting a value on next line, save it first
      if (expectingValueOnNextLine && currentKey) {
        // Value was on previous lines (array)
        frontmatter[currentKey] = currentArray;
        inArray = false;
        currentArray = [];
      }

      const [key, ...valueParts] = trimmed.split(":");
      if (key) {
        currentKey = key.trim();

        // Check if value is on the same line
        if (valueParts.length > 0) {
          const value = valueParts
            .join(":")
            .trim()
            .replace(/^["']|["']$/g, "");
          frontmatter[currentKey] = value;
          expectingValueOnNextLine = false;
        } else {
          // Value is on next line(s)
          expectingValueOnNextLine = true;
          inArray = false;
          currentArray = [];
        }
      }
    } else if (expectingValueOnNextLine && currentKey) {
      // Value line for block scalar
      const value = trimmed.replace(/^["']|["']$/g, "");
      frontmatter[currentKey] = value;
      expectingValueOnNextLine = false;
    }
  });

  // Don't forget the last array
  if (inArray && currentKey) {
    frontmatter[currentKey] = currentArray;
  }

  return { frontmatter, content: match[2] || "" };
};

// Pure function: Serialize object to YAML
const toYaml = (obj: Record<string, unknown>, indent = 0): string => {
  const indentStr = "  ".repeat(indent);
  let yaml = "";

  Object.entries(obj).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      yaml += `${indentStr}${key}:\n`;
      value.forEach((item) => {
        yaml += `${indentStr}  - "${item}"\n`;
      });
    } else if (value === null || value === undefined) {
      yaml += `${indentStr}${key}: null\n`;
    } else if (typeof value === "string") {
      yaml += `${indentStr}${key}: "${value}"\n`;
    } else {
      yaml += `${indentStr}${key}: ${String(value)}\n`;
    }
  });

  return yaml;
};

// Pure function: Rebuild markdown with updated frontmatter
const rebuildMarkdown = (
  frontmatter: Record<string, unknown>,
  content: string
): string => {
  return `---\n${toYaml(frontmatter)}---\n${content}`;
};

// Pure function: Scan artists directory
const scanArtists = (): Artist[] => {
  const files = fs.readdirSync(CONFIG.ARTISTS_DIR).filter((f) => f.endsWith(".md"));

  return files
    .map((file) => {
      const filePath = path.join(CONFIG.ARTISTS_DIR, file);
      const result = readFile(filePath);
      const { frontmatter } = result.success
        ? parseFrontmatter(result.content)
        : { frontmatter: {} };

      const name = (frontmatter as Record<string, unknown>).name as string;

      // Validate required fields
      if (!name || typeof name !== "string") {
        console.warn(`⚠️  Missing or invalid 'name' field in ${file}`);
      }

      return {
        id: file.replace(".md", ""),
        slug: file.replace(".md", ""),
        name: name || "",
        filePath,
        frontmatter,
      };
    })
    .filter((artist) => artist.name.length > 0); // Filter out invalid artists
};

// Pure function: Scan knowledge directory
const scanKnowledge = (): Knowledge[] => {
  const files = fs
    .readdirSync(CONFIG.KNOWLEDGE_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  return files
    .map((file) => {
      const filePath = path.join(CONFIG.KNOWLEDGE_DIR, file);
      const result = readFile(filePath);
      const { frontmatter, content } = result.success
        ? parseFrontmatter(result.content)
        : { frontmatter: {}, content: "" };

      const title = (frontmatter as Record<string, unknown>).title as string;

      // Validate required fields
      if (!title || typeof title !== "string") {
        console.warn(`⚠️  Missing or invalid 'title' field in ${file}`);
      }

      return {
        id: file,
        slug: file.replace(/\.(md|mdx)$/, ""),
        title: title || "",
        filePath,
        content,
        frontmatter,
      };
    })
    .filter((knowledge) => knowledge.title.length > 0); // Filter out invalid knowledge pages
};

// Pure function: Check if artist name exists in knowledge content
const findArtistMatches = (artist: Artist, knowledge: Knowledge): string[] => {
  const matches: string[] = [];
  const name = artist.name;
  const content = knowledge.content;

  // Create regex pattern with word boundaries
  const pattern = new RegExp(`\\b${escapeRegex(name)}\\b`, "g");

  let match;
  while ((match = pattern.exec(content)) !== null) {
    // Check if this is already a markdown link
    const before = content.substring(Math.max(0, match.index - 1), match.index);
    const after = content.substring(
      match.index + match[0].length,
      match.index + match[0].length + 1
    );

    if (before !== "[" && after !== ")") {
      matches.push(match[0]);
    }
  }

  return matches;
};

// Helper: Escape regex special characters
const escapeRegex = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Pure function: Add markdown links for artist mentions
const addArtistLinksToKnowledge = (
  artist: Artist,
  knowledge: Knowledge
): { content: string; linksAdded: number } => {
  let content = knowledge.content;
  let linksAdded = 0;
  const name = artist.name;
  const url = `/artists/${artist.slug}`;

  // Replace whole-word matches that are not already links
  // Note: We use a simpler pattern without lookbehind for better compatibility
  const pattern = new RegExp(`\\b${escapeRegex(name)}\\b`, "g");

  content = content.replace(pattern, (match, offset) => {
    // Check if this is already part of a markdown link
    const before = content.substring(Math.max(0, offset - 1), offset);
    const after = content.substring(offset + match.length, offset + match.length + 1);

    if (before !== "[" && after !== ")") {
      linksAdded++;
      return `[${match}](${url})`;
    }
    return match;
  });

  return { content, linksAdded };
};

// Pure function: Check if knowledge already exists in artist's relatedArticles
const hasRelatedArticle = (artist: Artist, knowledgeSlug: string): boolean => {
  const relatedArticles = (artist.frontmatter.relatedArticles as string[]) || [];
  return relatedArticles.includes(knowledgeSlug);
};

// Pure function: Add knowledge to artist's relatedArticles
const addKnowledgeToArtist = (artist: Artist, knowledgeSlug: string): Artist => {
  const relatedArticles = (artist.frontmatter.relatedArticles as string[]) || [];

  return {
    ...artist,
    frontmatter: {
      ...artist.frontmatter,
      relatedArticles: [...relatedArticles, knowledgeSlug],
    },
  };
};

// Main crosslinking logic
const runCrosslinking = (): {
  knowledgeUpdates: UpdateResult[];
  artistUpdates: UpdateResult[];
  summary: { knowledgeLinksAdded: number; artistLinksAdded: number };
} => {
  const artists = scanArtists();
  const knowledgePages = scanKnowledge();
  const knowledgeUpdates: UpdateResult[] = [];
  const artistUpdates: UpdateResult[] = [];

  console.log(
    `\n🔍 Scanning ${artists.length} artists and ${knowledgePages.length} knowledge pages...\n`
  );

  // Knowledge → Artists: Add markdown links
  knowledgePages.forEach((knowledge) => {
    let updatedContent = knowledge.content;
    const changes: string[] = [];

    artists.forEach((artist) => {
      const result = addArtistLinksToKnowledge(artist, {
        ...knowledge,
        content: updatedContent,
      });
      if (result.linksAdded > 0) {
        updatedContent = result.content;
        changes.push(`Added ${result.linksAdded} link(s) to ${artist.name}`);
      }
    });

    if (changes.length > 0) {
      const originalReadResult = readFile(knowledge.filePath);
      knowledgeUpdates.push({
        filePath: knowledge.filePath,
        changes,
        originalContent: originalReadResult.success ? originalReadResult.content : "",
        newContent: rebuildMarkdown(knowledge.frontmatter, updatedContent),
      });
    }
  });

  // Artist → Knowledge: Add to relatedArticles
  artists.forEach((artist) => {
    const changes: string[] = [];
    const content = readFile(artist.filePath);

    if (!content.success) {
      console.warn(`⚠️  Skipping ${artist.filePath}: ${content.error}`);
      return;
    }

    const { frontmatter, content: markdownContent } = parseFrontmatter(content.content);
    let relatedArticles = (frontmatter.relatedArticles as string[]) || [];

    knowledgePages.forEach((knowledge) => {
      if (!hasRelatedArticle(artist, knowledge.slug)) {
        // Check if artist is mentioned in knowledge
        const matches = findArtistMatches(artist, knowledge);
        if (matches.length > 0) {
          relatedArticles.push(knowledge.slug);
          changes.push(`Added related article: ${knowledge.title}`);
        }
      }
    });

    if (changes.length > 0) {
      artistUpdates.push({
        filePath: artist.filePath,
        changes,
        originalContent: content.content,
        newContent: rebuildMarkdown({ ...frontmatter, relatedArticles }, markdownContent),
      });
    }
  });

  const summary = {
    knowledgeLinksAdded: knowledgeUpdates.reduce((sum, u) => sum + u.changes.length, 0),
    artistLinksAdded: artistUpdates.reduce((sum, u) => sum + u.changes.length, 0),
  };

  return { knowledgeUpdates, artistUpdates, summary };
};

// Apply updates to files
const applyUpdates = (updates: UpdateResult[], type: string): void => {
  updates.forEach((update) => {
    console.log(`\n📄 ${type}: ${path.basename(update.filePath)}`);
    update.changes.forEach((change) => {
      console.log(`   ✅ ${change}`);
    });

    if (CONFIG.DRY_RUN) {
      console.log(`   ℹ️  (Dry-run: Not modifying file)`);
      return;
    }

    if (CONFIG.BACKUP) {
      const backupResult = createBackup(update.filePath, CONFIG.FORCE);
      if (!backupResult.success) {
        console.log(`   ❌ Backup failed: ${backupResult.error}`);
        return;
      }
      console.log(`   💾 Backup created: ${path.basename(backupResult.backupPath)}`);
    }

    // Use atomic write for better safety
    const writeResult = writeFileAtomic(update.filePath, update.newContent);
    if (writeResult.success) {
      console.log(`   ✍️  File updated`);
    } else {
      console.log(`   ❌ Failed: ${writeResult.error}`);
    }
  });
};

// Main execution
const main = (): void => {
  console.log("\n🔗 Crosslinking Script: Artists ↔ Knowledge");
  console.log("=".repeat(50));
  console.log(`Mode: ${CONFIG.DRY_RUN ? "DRY-RUN" : "LIVE"}`);
  console.log(`Backup: ${CONFIG.BACKUP ? "enabled" : "disabled"}`);
  console.log(`Force backup overwrite: ${CONFIG.FORCE ? "enabled" : "disabled"}\n`);

  const { knowledgeUpdates, artistUpdates, summary } = runCrosslinking();

  console.log("\n" + "=".repeat(50));
  console.log("📊 SUMMARY");
  console.log("=".repeat(50));
  console.log(`Knowledge pages to update: ${knowledgeUpdates.length}`);
  console.log(`Artist pages to update: ${artistUpdates.length}`);
  console.log(`Total artist links to add: ${summary.knowledgeLinksAdded}`);
  console.log(`Total related articles to add: ${summary.artistLinksAdded}`);

  if (knowledgeUpdates.length > 0 || artistUpdates.length > 0) {
    console.log("\n" + "=".repeat(50));
    console.log("📝 CHANGES");
    console.log("=".repeat(50));
    applyUpdates(knowledgeUpdates, "Knowledge");
    applyUpdates(artistUpdates, "Artist");
  } else {
    console.log("\n✨ No changes needed - everything is already crosslinked!");
  }

  console.log("\n" + "=".repeat(50));
  console.log("✅ Done!\n");
};

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as crosslink };
