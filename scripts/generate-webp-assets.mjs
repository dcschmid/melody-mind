#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const sharp = require(
  require.resolve("sharp", { paths: [path.join(repoRoot, "apps/knowledge")] })
);
const WEBP_SOURCE_PATTERN = /\.(jpg|jpeg|png|avif|webp)$/iu;
const DEFAULT_WEBP_QUALITY = 82;
const DEFAULT_EFFORT = 6;
const DEFAULT_MAX_WIDTH = 900;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const force = args.includes("--force");
const deleteSources = args.includes("--delete-sources");
const qualityArg = args.find((arg) => arg.startsWith("--quality="));
const effortArg = args.find((arg) => arg.startsWith("--effort="));
const webpQuality =
  Number.parseInt(qualityArg?.split("=")[1] ?? "", 10) || DEFAULT_WEBP_QUALITY;
const effort = Number.parseInt(effortArg?.split("=")[1] ?? "", 10) || DEFAULT_EFFORT;
const tasks = [
  {
    name: "webp",
    directories: [
      "apps/knowledge/src/assets",
      "apps/quiz/src/assets",
      "apps/podcasts/src/assets",
    ],
    sourcePattern: WEBP_SOURCE_PATTERN,
    sourcePreference: ["jpg", "jpeg", "png", "avif", "webp"],
    toOutputPath: (filePath) =>
      getSourceExtension(filePath) === "webp"
        ? filePath
        : filePath.replace(WEBP_SOURCE_PATTERN, ".webp"),
    encode: (pipeline, outputPath) =>
      pipeline
        .rotate()
        .resize({
          width: DEFAULT_MAX_WIDTH,
          withoutEnlargement: true,
        })
        .webp({
          quality: webpQuality,
          effort,
        })
        .toFile(outputPath),
  },
];

const getSourceExtension = (filePath) =>
  path.extname(filePath).replace(".", "").toLowerCase();

const listRasterFiles = async (directoryPath, sourcePattern) => {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  const nestedFileLists = await Promise.all(
    entries.map(async (entry) => {
      const resolvedPath = path.join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        return listRasterFiles(resolvedPath, sourcePattern);
      }

      if (!entry.isFile() || !sourcePattern.test(entry.name)) {
        return [];
      }

      return [resolvedPath];
    })
  );

  return nestedFileLists.flat();
};

const dedupeSourceFiles = (sourceFiles, toOutputPath, sourcePreference) =>
  Array.from(
    sourceFiles.reduce((map, sourceFile) => {
      const outputPath = toOutputPath(sourceFile);
      const existingSourceFile = map.get(outputPath);

      if (!existingSourceFile) {
        map.set(outputPath, sourceFile);
        return map;
      }

      const existingIndex = sourcePreference.indexOf(
        getSourceExtension(existingSourceFile)
      );
      const nextIndex = sourcePreference.indexOf(getSourceExtension(sourceFile));
      const normalizedExistingIndex =
        existingIndex === -1 ? sourcePreference.length : existingIndex;
      const normalizedNextIndex = nextIndex === -1 ? sourcePreference.length : nextIndex;

      if (normalizedNextIndex < normalizedExistingIndex) {
        map.set(outputPath, sourceFile);
      }

      return map;
    }, new Map())
  ).map(([, sourceFile]) => sourceFile);

const ensureOutputVariant = async (task, inputPath) => {
  const outputPath = task.toOutputPath(inputPath);
  const [inputStats, outputStats] = await Promise.all([
    fs.stat(inputPath),
    fs.stat(outputPath).catch(() => null),
  ]);
  const shouldRefreshOversizedOutput = outputStats
    ? await sharp(outputPath)
        .metadata()
        .then((metadata) => (metadata.width ?? 0) > DEFAULT_MAX_WIDTH)
        .catch(() => false)
    : false;

  if (
    !force &&
    outputStats &&
    outputStats.mtimeMs >= inputStats.mtimeMs &&
    !shouldRefreshOversizedOutput
  ) {
    return { status: "skipped", inputPath, outputPath };
  }

  if (dryRun) {
    return { status: "planned", inputPath, outputPath };
  }

  if (inputPath === outputPath) {
    const tempOutputPath = `${outputPath}.tmp-${process.pid}`;
    await task.encode(sharp(inputPath), tempOutputPath);
    await fs.rename(tempOutputPath, outputPath);
  } else {
    await task.encode(sharp(inputPath), outputPath);
  }

  return { status: outputStats ? "updated" : "created", inputPath, outputPath };
};

const main = async () => {
  let created = 0;
  let updated = 0;
  let skipped = 0;
  let planned = 0;

  for (const task of tasks) {
    const resolvedDirectories = task.directories.map((directory) =>
      path.join(repoRoot, directory)
    );
    const sourceFiles = dedupeSourceFiles(
      (
        await Promise.all(
          resolvedDirectories.map((directory) =>
            listRasterFiles(directory, task.sourcePattern)
          )
        )
      ).flat(),
      task.toOutputPath,
      task.sourcePreference
    );

    for (const sourceFile of sourceFiles) {
      const result = await ensureOutputVariant(task, sourceFile);
      const relativeInputPath = path.relative(repoRoot, result.inputPath);
      const relativeOutputPath = path.relative(repoRoot, result.outputPath);

      if (result.status === "created") {
        created += 1;
        console.log(`created ${relativeOutputPath} from ${relativeInputPath}`);
      } else if (result.status === "updated") {
        updated += 1;
        console.log(`updated ${relativeOutputPath} from ${relativeInputPath}`);
      } else if (result.status === "planned") {
        planned += 1;
        console.log(`planned ${relativeOutputPath} from ${relativeInputPath}`);
      } else {
        skipped += 1;
      }

      if (!deleteSources || result.inputPath === result.outputPath) {
        continue;
      }

      if (dryRun) {
        console.log(`planned delete ${relativeInputPath}`);
        continue;
      }

      if (
        result.status === "skipped" ||
        result.status === "created" ||
        result.status === "updated"
      ) {
        await fs.unlink(result.inputPath);
        console.log(`deleted ${relativeInputPath}`);
      }
    }
  }

  console.log(
    dryRun
      ? `dry-run complete: ${planned} conversions planned, ${skipped} up-to-date`
      : `done: ${created} created, ${updated} updated, ${skipped} up-to-date`
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
