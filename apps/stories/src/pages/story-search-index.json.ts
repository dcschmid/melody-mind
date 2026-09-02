import type { APIRoute } from "astro";
import { getImage } from "astro:assets";

import { getPublishedStories } from "@utils/archive";
import type { StorySearchRecord } from "@utils/storySearch";

export const GET: APIRoute = async () => {
  const stories = await getPublishedStories();
  const records: StorySearchRecord[] = await Promise.all(
    stories.map(async (story) => ({
      id: story.id,
      url: `/${story.id}/`,
      title: story.data.title,
      dek: story.data.dek,
      format: story.data.format,
      topics: story.data.topics,
      publishedAt: story.data.publishedAt.toISOString(),
      imageSrc: (await getImage({ src: story.data.hero.image, width: 800 })).src,
    }))
  );

  return new Response(JSON.stringify(records), {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
