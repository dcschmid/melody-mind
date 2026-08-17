import { getPublishedStories } from "@utils/archive";

export async function GET({ site }: { site?: URL }) {
  const origin = site?.origin ?? "https://stories.melody-mind.de";
  const stories = await getPublishedStories();

  const storyLines = stories
    .map((story) => `- [${story.data.title}](${origin}/${story.id}/): ${story.data.dek}`)
    .join("\n");

  const text = `# MelodyMind Stories

> AI-assisted, human-reviewed English-language long-form music journalism from MelodyMind.

- [Home](${origin}/): ${stories.length}-story reading room and featured stories
${storyLines}
- [AI transparency](${origin}/about/#ai-transparency): Editorial method, human review, AI disclosure, and privacy
- [RSS](${origin}/rss.xml): Story feed

Each article includes numbered sources, image rights, an editorial disclosure, and
Article JSON-LD. MelodyMind Stories has no accounts, analytics, cookies, external
embeds, or browser storage.
`;

  return new Response(text, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
