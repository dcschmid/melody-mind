import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  // Get all knowledge articles
  const knowledgeArticles = await getCollection('knowledge-en');
  
  // Filter out draft articles and sort by date (newest first)
  const publishedArticles = knowledgeArticles
    .filter((article) => !article.data.draft)
    .sort((a, b) => {
      const dateA = a.data.updatedAt || a.data.createdAt || new Date(0);
      const dateB = b.data.updatedAt || b.data.createdAt || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

  return rss({
    title: 'MelodyMind Knowledge',
    description: 'Deep dives into music history, genres, artists, and cultural movements that shaped the sound of each era.',
    site: context.site || 'https://melody-mind.de',
    items: publishedArticles.map((article) => {
      const slug = "slug" in article ? article.slug : article.id.replace(/\.md$/, '');
      return {
        title: article.data.title,
        description: article.data.description,
        link: `/knowledge/${slug}`,
        pubDate: article.data.updatedAt || article.data.createdAt || new Date(),
        author: article.data.author,
        categories: article.data.keywords,
      };
    }),
    customData: `<language>en-us</language>`,
    stylesheet: '/rss-styles.xsl',
  });
}
