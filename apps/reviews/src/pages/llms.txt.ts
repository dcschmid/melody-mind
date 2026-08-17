import { getCollection } from "astro:content";

export async function GET({ site }: { site?: URL }) {
  const origin = site?.origin ?? "https://reviews.melody-mind.de";
  const reviews = await getCollection("reviews", ({ data }) => !data.draft);
  const authors = (await getCollection("authors")).toSorted((left, right) =>
    left.data.name.localeCompare(right.data.name)
  );

  const authorLines = authors
    .map(
      (author) =>
        `- [${author.data.name}](${origin}/authors/${author.id}/): Author profile and published reviews`
    )
    .join("\n");

  const text = `# MelodyMind Reviews

> AI-assisted, human-reviewed English-language rock and metal album criticism without numerical scores.

- [Home](${origin}/): Latest review and archive of ${reviews.length} full album reviews
${authorLines}
- [AI transparency](${origin}/editorial-standards/#ai-transparency): Sourcing, human review, authorship, independence, corrections, and AI disclosure
- [RSS](${origin}/rss.xml): Review feed

Each review includes a thesis, track-specific Review Map, strengths, limits, external
listening links, sources, a rights note, and Review JSON-LD. MelodyMind Reviews has no
accounts, analytics, cookies, comments, external embeds, or browser storage.
`;

  return new Response(text, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
