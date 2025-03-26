/**
 * Page-specific SEO utility functions for Melody Mind
 *
 * Provides helper functions to generate optimized SEO data for specific page types
 */
import { extractKeywords, generateMetaDescription } from "./seo";

/**
 * Interface for SEO metadata
 */
export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string;
  image?: string;
  type?: "website" | "article" | "music" | "game";
  publishDate?: Date;
  modifiedDate?: Date;
  section?: string;
  audioSrc?: string;
}

/**
 * Generates optimized SEO metadata for the home page
 *
 * @param title The page title from translations
 * @param description The page description from translations
 * @param fallbackKeywords Fallback keywords if extraction fails
 * @returns Optimized SEO metadata for the home page
 */
export function getHomePageSEO(
  title: string,
  description: string,
  fallbackKeywords: string,
): SEOMetadata {
  // Combine content for SEO analysis
  const pageContent = `${title} ${description} 
    Melody Mind is a musical quiz game where players test their knowledge across 
    various music genres. Choose between difficulty levels, earn points, and 
    compete in leaderboards to become a music legend.`;

  return {
    title,
    description: generateMetaDescription(pageContent) || description,
    keywords: extractKeywords(pageContent) || fallbackKeywords,
    image: "/social-share-home.jpg",
    type: "website",
    publishDate: new Date("2024-01-01"),
    modifiedDate: new Date(),
  };
}

/**
 * Generates optimized SEO metadata for a game category page
 *
 * @param categoryName The name of the music category/genre
 * @param description The category description
 * @param fallbackKeywords Fallback keywords if extraction fails
 * @returns Optimized SEO metadata for the category page
 */
export function getCategorySEO(
  categoryName: string,
  description: string,
  fallbackKeywords: string,
): SEOMetadata {
  // Combine content for SEO analysis
  const pageContent = `${categoryName} Music Quiz | Melody Mind
    Test your knowledge about ${categoryName} music in this interactive quiz game.
    ${description}`;

  return {
    title: `${categoryName} Quiz`,
    description: generateMetaDescription(pageContent) || description,
    keywords: extractKeywords(pageContent) || fallbackKeywords,
    image: `/genres/${categoryName.toLowerCase().replace(/\s+/g, "-")}.jpg`,
    type: "game",
    section: categoryName,
  };
}

/**
 * Generates optimized SEO metadata for a knowledge article page
 *
 * @param articleTitle The title of the article
 * @param articleContent The full article content
 * @param fallbackKeywords Fallback keywords if extraction fails
 * @returns Optimized SEO metadata for the article page
 */
export function getArticleSEO(
  articleTitle: string,
  articleContent: string,
  fallbackKeywords: string,
): SEOMetadata {
  return {
    title: articleTitle,
    description: generateMetaDescription(articleContent),
    keywords: extractKeywords(articleContent) || fallbackKeywords,
    image: "/social-share-knowledge.jpg",
    type: "article",
    publishDate: new Date(),
    modifiedDate: new Date(),
    section: "Knowledge",
  };
}
