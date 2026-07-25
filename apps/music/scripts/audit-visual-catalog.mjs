import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import * as yaml from "js-yaml";

const albumsDirectory = path.resolve(process.cwd(), "src/content/albums");
const fileNames = (await fs.readdir(albumsDirectory))
  .filter((fileName) => fileName.endsWith(".mdx"))
  .sort((left, right) => left.localeCompare(right));

let tracks = 0;
const errors = [];

for (const fileName of fileNames) {
  const source = await fs.readFile(path.join(albumsDirectory, fileName), "utf8");
  const match = source.match(/^---\n([\s\S]*?)\n---/u);
  const album = match?.[1] ? yaml.load(match[1]) : null;
  if (!album || !Array.isArray(album.songs)) {
    errors.push(`${fileName}: invalid album frontmatter`);
    continue;
  }

  const orderedSongs = [...album.songs].sort(
    (left, right) => left.trackNumber - right.trackNumber
  );
  orderedSongs.forEach((song, index) => {
    tracks += 1;
    const location = `${fileName} track ${song.trackNumber}`;
    if (song.trackNumber !== index + 1) {
      errors.push(`${location}: track numbers must be contiguous and sorted`);
    }
    if (!song.audioUrl) {
      errors.push(`${location}: audioUrl is missing`);
    }
  });
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Visual catalog audit passed for ${tracks} tracks in ${fileNames.length} albums.`);
}
