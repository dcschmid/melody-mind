# Comprehensive SEO Review Guide for Astro Pages and Components

Your goal is to perform a thorough SEO review of MelodyMind Astro pages and components to ensure
optimal search engine visibility and ranking. This guide focuses specifically on Astro.js
implementation and modern SEO best practices.

**Important**: All documentation must be written in English, regardless of the user interface
language. This includes code comments, JSDoc, Markdown files, and any other form of documentation.

## Review Focus Areas

If a specific file isn't provided, ask for:

- The page or component to review
- If reviewing a page:
  - The layout component used by the page (if applicable)
  - The target audience and keywords
  - The primary purpose of the page
  - Any specific SEO concerns to address
  - Current analytics data if available
- If reviewing a component:
  - The component type (content, UI, interactive, etc.)
  - Where and how the component is used on pages
  - The specific SEO role of this component
  - Any keywords or structured data this component should contain

## SEO Fundamentals for Astro

### Technical SEO

- Valid HTML structure with proper nesting
- Correct canonical URLs implementation
- Proper handling of dynamic routes
- Appropriate status codes (200, 404, 301, etc.)
- XML sitemap generation and configuration
- robots.txt configuration
- Secure HTTPS implementation
- Hreflang tags for multilingual content
- Proper URL structure (clean, descriptive URLs)
- No duplicate content issues
- Internal linking structure
- Crawl efficiency (no unnecessary redirects)
- Ensure SSR or SSG over client-side rendering when possible

### Content SEO

- Primary keyword in title, URL, and H1
- Appropriate keyword density (avoid keyword stuffing)
- Content matches search intent
- Appropriate content length for topic
- Use of related keywords and semantic variations
- Headers (H1-H6) with proper hierarchy and keywords
- Unique and compelling meta descriptions
- Image optimization (including alt text with keywords)
- Schema markup implementation where appropriate
- Content freshness and regular updates
- Quality, engaging content with appropriate reading level

### Meta Tags and Structured Data

- Complete `<head>` section with all necessary SEO tags
- Properly structured title tags (60-70 characters)
- Compelling meta descriptions (150-160 characters)
- Schema.org structured data implementation
- Open Graph tags for social sharing
- Twitter Card tags
- Article/page publication and modification dates
- Author information
- Rel tags (next, prev, nofollow, etc.) when appropriate
- JSON-LD implementation for rich results

### Performance Optimization

- Core Web Vitals metrics (LCP, FID, CLS)
- Page load speed (under 3 seconds ideal)
- Image optimization (WebP/AVIF formats, appropriate dimensions)
- Lazy loading of images and below-the-fold content
- Efficient CSS and JavaScript (minification, tree-shaking)
- Proper handling of render-blocking resources
- Font optimization
- Caching strategies
- Code splitting and dynamic imports
- Astro Islands architecture utilization for optimal performance

### Mobile Optimization

- Responsive design implementation
- Mobile-friendly navigation
- Touch-friendly elements (adequate size and spacing)
- Viewport configuration
- Font readability on mobile devices
- No intrusive interstitials
- Mobile page speed
- Accelerated Mobile Pages (AMP) if applicable

### Local SEO (if applicable)

- Google Business Profile optimization
- Local business schema markup
- NAP (Name, Address, Phone) consistency
- Local keywords in content
- Location pages
- Local backlink strategy

### User Experience Factors

- Clear call-to-action elements
- Intuitive navigation
- Minimal bounce rate strategies
- Effective above-the-fold content
- Internal search functionality
- Related content suggestions
- Accessibility considerations affecting SEO

## Astro-Specific SEO Considerations

### Component-Specific SEO Analysis

- **Content Components SEO Optimization**:
  - Use semantic HTML elements appropriate for the content type
  - Ensure proper heading hierarchy within the component (without skipping levels)
  - Include appropriate Schema.org attributes for the component's specific content type
  - Optimize images with descriptive alt text containing relevant keywords
  - Ensure component doesn't contain duplicate content when used in multiple places
  - Use proper list structures (ul/ol/li) for list content
  - Example of SEO-optimized content component:

  ```astro
  ---
  // ArticleCard.astro - An SEO-optimized article card component
  interface Props {
    title: string;
    excerpt: string;
    url: string;
    publishDate: Date;
    author: string;
    image: string;
    imageAlt: string;
    category: string;
  }

  const { title, excerpt, url, publishDate, author, image, imageAlt, category } = Astro.props;

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(publishDate);
  ---

  <article class="article-card" itemscope itemtype="https://schema.org/Article">
    <a href={url} itemprop="url" aria-label={`Read article: ${title}`}>
      <div class="article-image">
        <img src={image} alt={imageAlt} loading="lazy" width="400" height="225" itemprop="image" />
      </div>

      <div class="article-content">
        <span class="category" itemprop="articleSection">{category}</span>

        <h2 itemprop="headline">{title}</h2>

        <p itemprop="abstract">{excerpt}</p>

        <div class="article-meta">
          <time datetime={publishDate.toISOString()} itemprop="datePublished">
            {formattedDate}
          </time>
          <span itemprop="author" itemscope itemtype="https://schema.org/Person">
            <span itemprop="name">{author}</span>
          </span>
        </div>
      </div>
    </a>
  </article>
  ```

- **Navigation Components SEO Optimization**:
  - Implement proper ARIA landmarks for navigation elements
  - Use descriptive link text with relevant keywords
  - Avoid keyword stuffing in navigation items
  - Include structured breadcrumb data for breadcrumb components
  - Example of SEO-optimized navigation component:

  ```astro
  ---
  // Breadcrumbs.astro - SEO-optimized breadcrumbs component
  interface BreadcrumbItem {
    label: string;
    url: string;
  }

  interface Props {
    items: BreadcrumbItem[];
    currentPageTitle: string;
  }

  const { items, currentPageTitle } = Astro.props;
  ---

  <nav aria-label="Breadcrumb" class="breadcrumbs">
    <ol itemscope itemtype="https://schema.org/BreadcrumbList">
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <a itemprop="item" href="/">
          <span itemprop="name">Home</span>
        </a>
        <meta itemprop="position" content="1" />
      </li>

      {
        items.map((item, index) => (
          <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <a itemprop="item" href={item.url}>
              <span itemprop="name">{item.label}</span>
            </a>
            <meta itemprop="position" content={`${index + 2}`} />
          </li>
        ))
      }

      <li
        itemprop="itemListElement"
        itemscope
        itemtype="https://schema.org/ListItem"
        aria-current="page"
      >
        <span itemprop="name">{currentPageTitle}</span>
        <meta itemprop="position" content={`${items.length + 2}`} />
      </li>
    </ol>
  </nav>
  ```

- **Interactive Components SEO Considerations**:
  - Use progressive enhancement to ensure content is accessible without JavaScript
  - Implement proper fallbacks for search engine crawlers
  - Minimize Cumulative Layout Shift for SEO ranking factors
  - Ensure client-side hydration doesn't remove important SEO elements
  - Example of SEO-friendly interactive component:

  ```astro
  ---
  // SearchBox.astro - SEO-optimized search component
  ---

  <div class="search-container">
    <!-- SSR-rendered fallback for search engines and no-JS environments -->
    <noscript>
      <form action="/search" method="get" role="search">
        <label for="noscript-search">Search the site:</label>
        <input type="search" id="noscript-search" name="q" placeholder="Enter keywords..." />
        <button type="submit">Search</button>
      </form>
    </noscript>

    <!-- Enhanced client-side version -->
    <div class="enhanced-search" data-search-component>
      <label for="search-input" class="sr-only">Search the site</label>
      <input
        type="search"
        id="search-input"
        placeholder="Enter keywords..."
        aria-label="Search the site"
        data-search-input
      />
      <!-- Interactive elements added via client-side JavaScript -->
    </div>
  </div>

  <script>
    // Only execute if JavaScript is enabled
    document.addEventListener("DOMContentLoaded", () => {
      const searchContainer = document.querySelector("[data-search-component]");
      const searchInput = document.querySelector("[data-search-input]");

      // Init enhanced search functionality
      // ...
    });
  </script>
  ```

- **Media Components SEO Best Practices**:
  - Optimize image components with proper alt text, dimensions and lazy loading
  - Implement structured data for video components
  - Use captions and transcripts for multimedia accessibility and SEO
  - Specify image and video dimensions to prevent layout shifts
  - Example of SEO-optimized media component:

  ```astro
  ---
  // VideoPlayer.astro - SEO-optimized video component
  interface Props {
    videoId: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    duration: string; // ISO 8601 duration format
    uploadDate: Date;
  }

  const { videoId, title, description, thumbnailUrl, duration, uploadDate } = Astro.props;
  ---

  <div class="video-container" itemscope itemtype="https://schema.org/VideoObject">
    <meta itemprop="name" content={title} />
    <meta itemprop="description" content={description} />
    <meta itemprop="thumbnailUrl" content={thumbnailUrl} />
    <meta itemprop="uploadDate" content={uploadDate.toISOString()} />
    <meta itemprop="duration" content={duration} />
    <meta itemprop="contentUrl" content={`https://example.com/videos/${videoId}`} />

    <!-- Video thumbnail with play button for SEO and better UX -->
    <div class="video-thumbnail">
      <img
        src={thumbnailUrl}
        alt={`Thumbnail for video: ${title}`}
        width="640"
        height="360"
        loading="lazy"
      />
      <button class="play-button" aria-label={`Play video: ${title}`} data-video-id={videoId}>
        Play Video
      </button>
    </div>

    <!-- Noscript fallback with direct video link -->
    <noscript>
      <a href={`https://example.com/videos/${videoId}`}>
        Watch Video: {title}
      </a>
    </noscript>

    <div class="video-details">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  </div>

  <script define:vars={{ videoId }}>
    // Video player initialization code
    document.querySelector(`[data-video-id="${videoId}"]`).addEventListener("click", () => {
      // Initialize video player
    });
  </script>
  ```

### Layout Component Analysis

- Understand how the layout component manages SEO elements
- Analyze how metadata is passed from pages to the layout
- Check for consistent implementation across all pages
- Verify that all required SEO tags are included in the layout
- Ensure proper i18n handling for SEO metadata
- Review how the layout handles dynamic content

### Layout Component Structure Review

- Check for proper implementation of the SEO-critical `<head>` section:

  ```astro
  ---
  // MainLayout.astro
  interface Props {
    title: string;
    description: string;
    image?: string;
    canonicalURL?: URL;
    // Other SEO-related props
  }

  const {
    title,
    description,
    image = "/default-og.jpg",
    canonicalURL = new URL(Astro.url.pathname, Astro.site),
  } = Astro.props;
  ---

  <html lang={lang}>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalURL} />

      <!-- SEO metadata handled by layout component -->
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalURL} />
      <meta property="og:image" content={new URL(image, Astro.site)} />

      <!-- More SEO tags -->
    </head>
    <body>
      <slot />
    </body>
  </html>
  ```

- Review how pages pass metadata to layouts:

  ```astro
  ---
  // ExamplePage.astro
  import MainLayout from "@layouts/MainLayout.astro";
  import { getLocalizedContent } from "@utils/i18n";

  const content = await getLocalizedContent("example-page");
  ---

  <MainLayout title={content.title} description={content.description} image={content.coverImage}>
    <!-- Page content -->
  </MainLayout>
  ```

### Configuration Optimizations

- Set proper site configuration in `astro.config.mjs`:
  ```js
  export default defineConfig({
    site: "https://example.com",
    trailingSlash: "always", // or 'never' for consistent URLs
    // other config options
  });
  ```

### Head Component Implementation

- Create a robust SEO head component:

  ```astro
  ---
  // SEO.astro
  interface Props {
    title: string;
    description: string;
    ogImage?: string;
    canonical?: string;
    type?: "website" | "article";
    publishedDate?: Date;
    modifiedDate?: Date;
  }

  const {
    title,
    description,
    ogImage = "/default-og.jpg",
    canonical,
    type = "website",
    publishedDate,
    modifiedDate,
  } = Astro.props;

  const siteUrl = import.meta.env.SITE;
  const currentUrl = canonical || new URL(Astro.url.pathname, siteUrl).href;
  const ogImageUrl = new URL(ogImage, siteUrl).href;
  ---

  <!-- Primary Meta Tags -->
  <title>{title}</title>
  <meta name="title" content={title} />
  <meta name="description" content={description} />
  <link rel="canonical" href={currentUrl} />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content={type} />
  <meta property="og:url" content={currentUrl} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImageUrl} />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={currentUrl} />
  <meta property="twitter:title" content={title} />
  <meta property="twitter:description" content={description} />
  <meta property="twitter:image" content={ogImageUrl} />

  {
    publishedDate && (
      <meta property="article:published_time" content={publishedDate.toISOString()} />
    )
  }
  {modifiedDate && <meta property="article:modified_time" content={modifiedDate.toISOString()} />}
  ```

### Dynamic Routes Optimization

- Implement `getStaticPaths()` correctly with all SEO metadata:

  ```astro
  ---
  // [slug].astro
  export async function getStaticPaths() {
    const posts = await getPosts();

    return posts.map((post) => ({
      params: { slug: post.slug },
      props: {
        title: post.title,
        description: post.excerpt,
        publishedDate: post.publishedDate,
        modifiedDate: post.modifiedDate,
        ogImage: post.ogImage || "/default-og.jpg",
        // other SEO-relevant props
      },
    }));
  }

  const { title, description, publishedDate, modifiedDate, ogImage } = Astro.props;
  ---
  ```

### Image Optimization

- Use Astro's built-in image optimization:

  ```astro
  ---
  import { Image } from "astro:assets";
  import myImage from "../assets/my-image.jpg";
  ---

  <Image
    src={myImage}
    alt="Descriptive alt text with keywords"
    width={800}
    height={600}
    loading="eager"
    Use
    "eager"
    for
    above-the-fold
    images,
    "lazy"
    for
    others
    format="webp"
    Optimal
    modern
    format
  />
  ```

### Sitemap Configuration

- Configure automatic sitemap generation:

  ```js
  // astro.config.mjs
  import { defineConfig } from "astro";
  import sitemap from "@astrojs/sitemap";

  export default defineConfig({
    site: "https://example.com",
    integrations: [
      sitemap({
        filter: (page) => !page.includes("/admin/"), // exclude pages
        changefreq: "weekly",
        priority: 0.7,
        lastmod: new Date(),
        customPages: ["https://example.com/important-page"],
      }),
    ],
  });
  ```

### JSON-LD Implementation

- Implement JSON-LD structured data:
  ```astro
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "{title}",
      "image": ["{ogImageUrl}"],
      "datePublished": "{publishedDate}",
      "dateModified": "{modifiedDate}",
      "author": {
        "@type": "Person",
        "name": "Author Name"
      },
      "publisher": {
        "@type": "Organization",
        "name": "MelodyMind",
        "logo": {
          "@type": "ImageObject",
          "url": "https://example.com/logo.png"
        }
      },
      "description": "{description}"
    }
  </script>
  ```

## Advanced Review Structure

1. **Technical Foundation Analysis**
   - Code structure and validation
   - URL structure and canonicalization
   - Server-side rendering implementation
   - Sitemap and robots.txt configuration
   - Status codes and redirect handling
   - Astro configuration assessment
   - **Layout component implementation review**
   - **Semantic structure of individual components**

2. **Metadata Evaluation**
   - Title tag quality and structure
   - Meta description effectiveness
   - OpenGraph and Twitter Cards implementation
   - Structured data implementation
   - Heading structure and hierarchy
   - Astro components meta tag handling
   - **Relationship between page and layout metadata**
   - **Component-specific structured data and semantic attributes**

3. **Content Assessment**
   - Keyword strategy and implementation
   - Content quality and relevance
   - Content structure and readability
   - Internal linking strategy
   - E-A-T signals (Expertise, Authoritativeness, Trustworthiness)
   - Multi-language content handling

4. **Performance Review**
   - Core Web Vitals metrics
   - Page load speed optimization
   - Resource optimization (images, scripts, styles)
   - Hydration strategy effectiveness
   - Astro Islands implementation efficiency
   - Mobile performance optimization

5. **User Experience Evaluation**
   - Mobile-friendliness
   - Navigation structure
   - User engagement elements
   - Conversion optimization
   - Accessibility factors affecting SEO
   - Content layout shifts prevention

6. **Detailed Recommendations**
   - Prioritized improvement suggestions
   - Implementation examples
   - Technical solutions specific to Astro
   - Content enhancement strategies
   - Structured data opportunities
   - Performance optimization techniques

## Documentation Requirements

After completing the SEO review, you MUST create a Markdown documentation file with the following
characteristics:

1. **File Location**: Always save the report in the `docs/seo/` directory
2. **File Naming**: Use the format `PageName-SEO-Review-YYYYMMDD.md` (e.g.,
   `HomePage-SEO-Review-20250520.md`)
3. **Language**: The documentation MUST be written in English, regardless of the user interface
   language
4. **Content Structure**: The Markdown file should include:
   - Title with page name and review date
   - Executive summary with key findings
   - SEO score assessment (e.g., "78/100 SEO score")
   - Detailed findings for each review category
   - Prioritized recommendations for improvements
   - Code examples demonstrating fixes
   - Date and reviewer information

### Markdown Template

````markdown
# SEO Review: [Page Name] - [YYYY-MM-DD]

## Executive Summary

This SEO review evaluates the [Page Name] against current search engine optimization best practices.
The page [brief assessment of compliance level and major issues/strengths].

**SEO Score**: [X]/100

**Key Strengths**:

- [Strength 1]
- [Strength 2]
- [Strength 3]

**Critical Issues**:

- [Issue 1]
- [Issue 2]
- [Issue 3]

## Detailed Findings

### Technical Foundation Analysis

[List of findings with ✅ for compliant items and ❌ for issues]

### Metadata Evaluation

[List of findings with ✅ for compliant items and ❌ for issues]

### Content Assessment

[List of findings with ✅ for compliant items and ❌ for issues]

### Performance Review

[List of findings with ✅ for compliant items and ❌ for issues]

### User Experience Evaluation

[List of findings with ✅ for compliant items and ❌ for issues]

## Prioritized Recommendations

1. [High Priority] [Recommendation 1]:
   ```astro
   // Code example showing implementation
   ```
````

2. [Medium Priority] [Recommendation 2]:

   ```astro
   // Code example showing implementation
   ```

3. [Low Priority] [Recommendation 3]:
   ```astro
   // Code example showing implementation
   ```

## Implementation Timeline

- **Immediate (1-2 days)**: Address critical issues affecting indexing and ranking
- **Short-term (1-2 weeks)**: Implement high-priority metadata and content recommendations
- **Medium-term (2-4 weeks)**: Address medium-priority items and performance optimizations
- **Long-term (1-3 months)**: Complete all remaining improvements and advanced structured data

## Review Information

- **Review Date**: [YYYY-MM-DD]
- **Reviewer**: [Reviewer Name/System]
- **Target Keywords**: [Primary and secondary keywords]
- **Testing Tools**: [Tools used for testing]

```

After completing your review, you MUST create this Markdown documentation file in addition to providing your findings to the user. This documentation will be part of the project's SEO optimization records.

### Documentation Creation Process

1. After completing your review and sharing the results with the user, create the Markdown documentation file using the following process:

2. **Generate File Path**:
   - Use the page name and current date to create the filename
   - Format: `docs/seo/PageName-SEO-Review-YYYYMMDD.md`
   - Example: `docs/seo/HomePage-SEO-Review-20250520.md`

3. **Format Content**:
   - Use the Markdown template provided above
   - Fill in all sections based on your review findings
   - Include code examples with proper syntax highlighting
   - Ensure all content is in English

4. **Save the File**:
   - Use the appropriate method to create and save the file in the workspace
   - For GitHub Copilot, use the `create_file` tool to save the documentation

5. **Confirm to User**:
   - After creating the documentation file, inform the user that the SEO review report has been saved
   - Provide the path to the saved file

This documentation process must be followed for every SEO review to maintain a consistent record of SEO assessments and improvements throughout the project's development lifecycle.

## Example Review for an Astro Page

```

# SEO Review: HomePage - 2025-05-15

## Executive Summary

This SEO review evaluates the HomePage against current search engine optimization best practices.
The page has several strengths in its technical implementation but lacks important metadata and
structured data elements that would enhance its visibility in search engines.

**SEO Score**: 68/100

**Key Strengths**:

- Clean, semantic HTML structure
- Fast page load speed (LCP: 1.8s)
- Mobile-responsive design
- Proper implementation of hreflang tags for multilingual support
- Well-structured MainLayout component handling core SEO metadata

**Critical Issues**:

- Missing meta description (not passed from page to layout)
- Primary keyword not present in title tag
- No structured data implementation
- Multiple H1 tags present on page
- Core Web Vitals issues with Cumulative Layout Shift (CLS: 0.25)

## Detailed Findings

### Technical Foundation Analysis

✅ Clean URL structure (https://melodymind.com/) ✅ Proper canonical tag implementation in
MainLayout ✅ Correct HTTP status code (200) ✅ Included in sitemap.xml ✅ No render-blocking
resources ❌ Incomplete robots.txt directives ❌ Missing language attributes on HTML tag (not set in
layout) ✅ Server-side rendering properly implemented ❌ No 404 page optimization ✅ Layout
component correctly imports and structures metadata

### Metadata Evaluation

❌ Title tag missing primary keyword: "MelodyMind - Music Trivia Game" ❌ Meta description missing
completely (HomePage doesn't pass to layout) ❌ OpenGraph tags incomplete (missing og:type and
og:image:alt in layout) ❌ Twitter card tags missing (not implemented in layout) ❌ Multiple H1 tags
detected (should be only one) ✅ Proper heading hierarchy (H1 → H2 → H3) ❌ No JSON-LD structured
data implementation ❌ Page doesn't pass all required SEO metadata to layout component

### Content Assessment

✅ Appropriate content length for homepage (520 words) ❌ Primary keyword density too low (0.5%, aim
for 1-2%) ❌ Missing related keywords in content ✅ Natural language writing style ✅ Content
matches user search intent ❌ No FAQ section for capturing featured snippets ✅ Internal linking to
key sections of the site ❌ Missing alt text on 3 images

### Performance Review

✅ Good Largest Contentful Paint (LCP): 1.8s ✅ Good First Input Delay (FID): 75ms ❌ Poor
Cumulative Layout Shift (CLS): 0.25 (should be < 0.1) ✅ Appropriate use of Astro Islands for
interactive components ❌ Unoptimized hero image (2.1MB, should be < 200KB) ✅ Efficient CSS with
minimal unused styles ❌ No responsive image srcset implementation

### User Experience Evaluation

✅ Mobile-friendly design (passes Google Mobile-Friendly Test) ✅ Intuitive navigation structure ✅
Clear call-to-action above the fold ❌ Low contrast text in footer (fails accessibility standards)
✅ No intrusive interstitials ❌ Layout shifts during page load ✅ Engaging visual elements properly
optimized

## Prioritized Recommendations

1. [High Priority] Ensure HomePage passes meta description to layout:

   ```astro
   ---
   // HomePage.astro
   import MainLayout from "@layouts/MainLayout.astro";
   import { getLocalizedContent } from "@utils/i18n";

   const content = await getLocalizedContent("home");
   ---

   <MainLayout
     title="MelodyMind - Ultimate Music Trivia Game for Music Lovers"
     description="Challenge your music knowledge with MelodyMind - the ultimate trivia game featuring multiple genres, difficulty levels, and achievements. Test your skills today!"
     image="/og-images/home.jpg"
   >
     <!-- Page content -->
   </MainLayout>
   ```

2. [High Priority] Fix title tag structure in the layout component:

   ```astro
   ---
   // MainLayout.astro
   const {
     title,
     description,
     // other props
   } = Astro.props;
   ---

   <title>{title}</title>
   ```

3. [High Priority] Add missing OpenGraph and Twitter tags to layout:

   ```astro
   <!-- Add to MainLayout.astro head section -->
   <meta property="og:type" content="website" />
   <meta property="og:image:alt" content={altTextForImage || title} />

   <!-- Twitter Card tags -->
   <meta name="twitter:card" content="summary_large_image" />
   <meta name="twitter:title" content={title} />
   <meta name="twitter:description" content={description} />
   <meta name="twitter:image" content={new URL(image, Astro.site)} />
   ```

4. [High Priority] Implement JSON-LD structured data in layout:

   ```astro
   <script
     type="application/ld+json"
     set:html={JSON.stringify({
       "@context": "https://schema.org",
       "@type": "WebApplication",
       name: "MelodyMind",
       description: description,
       url: Astro.site?.toString(),
       applicationCategory: "GameApplication",
       genre: "Music Trivia",
       image: new URL(image, Astro.site).toString(),
       offers: {
         "@type": "Offer",
         price: "0",
         priceCurrency: "USD",
       },
       aggregateRating: {
         "@type": "AggregateRating",
         ratingValue: "4.8",
         ratingCount: "1024",
       },
     })}
   />
   ```

5. [Medium Priority] Fix multiple H1 tags issue in HomePage:

   ```astro
   <!-- Before -->
   <h1>Welcome to MelodyMind</h1>
   <h1>How to Play</h1>

   <!-- After -->
   <h1>Welcome to MelodyMind - The Ultimate Music Trivia Challenge</h1>
   <h2>How to Play</h2>
   ```

6. [Medium Priority] Add language attribute to HTML tag in layout:

   ```astro
   ---
   // MainLayout.astro
   import { getLangFromUrl } from "../utils/i18n";

   const lang = getLangFromUrl(Astro.url);
   // other props
   ---

   <html lang={lang}></html>
   ```

7. [Medium Priority] Optimize hero image in HomePage:

   ```astro
   <Image
     src={import("../assets/hero.jpg")}
     alt="MelodyMind Music Trivia Game with various music genres and instruments"
     width={1200}
     height={630}
     loading="eager"
     format="webp"
     quality={80}
   />
   ```

8. [Low Priority] Create FAQ section for featured snippets:
   ```astro
   <section aria-labelledby="faq-heading">
     <h2 id="faq-heading">Frequently Asked Questions</h2>
     <div itemscope itemtype="https://schema.org/FAQPage">
       <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
         <h3 itemprop="name">How do I earn points in MelodyMind?</h3>
         <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
           <div itemprop="text">
             <p>
               You earn 50 points for each correct answer in MelodyMind. Additionally, answering
               quickly gives you bonus points: +50 points for answering within 10 seconds, and +25
               points for answering within 15 seconds.
             </p>
           </div>
         </div>
       </div>
       <!-- More FAQ items -->
     </div>
   </section>
   ```

## Implementation Timeline

- **Immediate (1-2 days)**: Fix metadata passing from HomePage to layout
- **Short-term (1-2 weeks)**: Update layout component with missing SEO tags and structured data
- **Medium-term (2-4 weeks)**: Fix heading structure and optimize images
- **Long-term (1-3 months)**: Implement FAQ section and enhance structured data

## Review Information

- **Review Date**: 2025-05-15
- **Reviewer**: SEO Optimization System
- **Target Keywords**: music trivia game, online music quiz, music knowledge test
- **Testing Tools**: Lighthouse, PageSpeed Insights, Schema Validator, Mobile-Friendly Test

```

### SEO Checklist Reference

Here's a quick checklist you can use for reviewing Astro pages:

### Technical SEO Checklist
- [ ] Valid HTML (no major errors)
- [ ] Proper URL structure
- [ ] Canonical tag implementation
- [ ] Correct HTTP status codes
- [ ] XML sitemap inclusion
- [ ] robots.txt configuration
- [ ] Mobile-friendly design
- [ ] Core Web Vitals compliance
- [ ] No render-blocking resources
- [ ] Proper implementation of hreflang tags
- [ ] Language declared in HTML tag
- [ ] Server-side rendering or static generation
- [ ] No orphaned pages

### Layout and Component SEO Checklist
- [ ] Layout component includes all essential SEO metadata tags
- [ ] Pages correctly pass metadata to layout
- [ ] Dynamic metadata generation for different page types
- [ ] Consistent implementation across page types
- [ ] Proper use of slots for SEO-critical elements
- [ ] SEO metadata adapts to language/locale
- [ ] Default fallbacks for missing metadata

### Content SEO Checklist
- [ ] Primary keyword in title, URL, and H1
- [ ] Appropriate keyword density (1-2%)
- [ ] Related keywords present
- [ ] Content length appropriate for topic
- [ ] Natural language and readability
- [ ] Single H1 tag
- [ ] Proper heading hierarchy
- [ ] Internal linking strategy
- [ ] External links to authoritative sources
- [ ] No duplicate content
- [ ] Content freshness/update date
- [ ] Use of engaging mixed media (images, videos)

### Metadata Checklist
- [ ] SEO-optimized title tag (50-60 characters)
- [ ] Compelling meta description (150-160 characters)
- [ ] Open Graph tags implementation
- [ ] Twitter Card tags implementation
- [ ] JSON-LD structured data
- [ ] Proper image alt text
- [ ] Proper video markup
- [ ] Product/service schema (if applicable)
- [ ] Article/blog schema (if applicable)
- [ ] Local business schema (if applicable)
- [ ] FAQ schema (if applicable)

### Performance Checklist
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Page load time < 3s
- [ ] Image optimization
- [ ] CSS/JS optimization
- [ ] Lazy loading implementation
- [ ] Font optimization
- [ ] Efficient Astro Islands implementation
- [ ] Browser caching implementation

This checklist should be used alongside the comprehensive review to ensure nothing is missed during the SEO evaluation of Astro pages and components.
```
