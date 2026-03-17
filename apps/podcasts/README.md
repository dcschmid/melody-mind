# MelodyMind Podcasts

An accessible, SEO-focused podcast website built with Astro.js, with strong WCAG support and a custom listening experience.

## Features

### Audio Experience

- **Interactive Audio Player** with custom controls
- **Progress tracking** and time display
- **Keyboard shortcuts** (rewind/forward 10 seconds)
- **Accessible controls** with ARIA labels and screen reader support

### Accessibility

- **Skip-to-content links**
- **Enhanced focus indicators** and keyboard navigation
- **Screen reader optimization** with ARIA labels
- **High contrast mode support**
- **Reduced motion support** for users with vestibular disorders
- **Color contrast ratios** exceeding AAA standards

### Performance & SEO

- **Static Site Generation** with Astro.js
- **Comprehensive meta tags** (Open Graph, Twitter Cards)
- **Structured data** (JSON-LD) for rich snippets
- **Automatic sitemaps** and robots.txt
- **Optimized images** with proper aspect ratios
- **Core Web Vitals** optimization

### Design

- **Dark theme** with atmospheric gradient accents
- **Responsive design** for all device sizes
- **Scoped component styles** with BEM class naming
- **Custom animations** and hover effects
- **Professional typography** with Atkinson Hyperlegible font

### Streaming Integration

### Podcast Operations

- Automatic audio metadata (file size, duration, cache) via `update:audio-metadata` script
- Validate episode metadata (missing fields, image dimensions, future publish dates) via `validate:podcasts`
- Image normalization to square thumbnails (`normalize:images` with pad or crop)
- Podcasting 2.0 extensions: `<podcast:transcript>` and `<podcast:person>` tags
- **Multi-platform links**: RSS, Apple Podcasts, Spotify, Deezer, YouTube
- **Brand-accurate styling** with platform colors
- **Accessible buttons** with proper labels

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build/) v5.x
- **Styling**: Scoped `<style>` blocks in `.astro` components (BEM classes)
- **TypeScript**: Full typing
- **Node Version**: 22 (via `.nvmrc` and `nvm use`)
- **Package Manager**: npm
- **Deployment**: Netlify, Vercel, or any static hosting

## Installation

### Prerequisites

- Node.js 22 (or >= 18.20.8 minimum for Astro)
- Optional: nvm for version management

### Setup

```bash
# Clone the repository
git clone https://github.com/dcschmid/melody-mind-podcasts.git
cd melody-mind-podcasts

# Install dependencies
npm install

# Start dev server
npm run dev

# Build
npm run build

# Preview
npm run preview
```

## Project Structure

```
melody-mind-podcasts/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Headline.astro
│   │   ├── Paragraph.astro
│   │   └── Prose.astro
│   ├── content/
│   │   └── podcasts/        # Podcast episodes as MDX content entries
│   │       └── *.mdx
│   ├── data/
│   │   └── persons.json       # Podcast person metadata
│   ├── layouts/
│   │   └── PodcastLayout.astro  # Main layout with SEO
│   ├── pages/
│   │   ├── index.astro          # Homepage
│   │   └── [id].astro           # Episode detail pages
│   │       └── podcast.xml.ts   # RSS feed generation
│   ├── styles/
│   │   └── global.css           # Global styles & accessibility
│   ├── types/
│   │   └── podcast.ts           # TypeScript definitions
│   └── utils/
│       ├── helpers.ts           # Utility functions
│       └── rss.ts               # RSS generation utilities
├── public/
│   ├── images/                  # Episode artwork
│   ├── robots.txt               # SEO configuration
│   └── site.webmanifest         # PWA manifest
├── astro.config.mjs             # Astro configuration
└── tsconfig.json                # TypeScript configuration
```

## Content Management

### Adding New Episodes

1. **Add an episode file** to `src/content/podcasts/`
2. **Include episode artwork** in `public/images/`
3. **Set `isAvailable: true`** for episodes ready for publication
4. **Build and deploy** - new episodes will automatically appear

### Episode Frontmatter

```json
{
  "id": "unique-episode-id",
  "title": "Episode Title",
  "description": "Episode description...",
  "publishedAt": "2024-01-15",
  "imageUrl": "episode-image-filename",
  "audioUrl": "https://audio-hosting-url.com/episode.mp3",
  "showNotesHtml": "<h2>Show Notes</h2><p>Content...</p>",
  "isAvailable": true,
  "fileSizeBytes": 12345678,
  "durationSeconds": 3120,
  "subtitleUrl": "https://cdn.example.com/episode.vtt",
  "episodeNumber": 12
}
```

Fields such as `fileSizeBytes` and `durationSeconds` are best filled automatically with the scripts below. `subtitleUrl` enables `<podcast:transcript>` output.

### Persons (Podcasting 2.0)

Global file `src/data/persons.json` defines persons that appear in RSS as `<podcast:person>`:

```json
[
  {
    "name": "Daniel Schmid",
    "role": "host",
    "href": "https://melody-mind.de",
    "img": "https://melody-mind.de/images/daniel.jpg"
  }
]
```

Supported fields: `name` (required), `role`, `href`, `img`. Roles can be `host`, `producer`, `guest`, etc.

## Scripts & Tooling

### Update Audio Metadata

Fetches file size (Content-Length) and optional duration (via ffprobe, falling back to music-metadata). Uses `.cache/audio-metadata.json` to minimize repeated network calls.

```bash
yarn update:audio-metadata --duration --ffprobe
```

Flags:

- `--duration` extract duration
- `--ffprobe` prefer ffprobe if installed
- `--max-bytes=10485760` cap bytes for music-metadata fallback
- `--no-cache` skip reading cache
- `--refresh` ignore cache and refetch
- `--available-only` only episodes with `isAvailable=true`
- `--ids=a,b,c` only process these episode IDs (comma-separated)

Quick commands:

- All available episodes with duration and write-back:  
  `node scripts/update-audio-metadata.mjs --available-only --duration --ffprobe --write`
- Only specific IDs (e.g., 1950s/1960s):  
  `node scripts/update-audio-metadata.mjs --duration --ids=1950s,1960s --write`

### Validation

Checks metadata completeness and quality.

```bash
yarn validate:podcasts --strict
```

Flags: `--strict`, `--json`, `--no-network`

Additional checks: square derivative `*-square.jpg` when the source image is not square.

#### Content Style Guide (v2.0)

Episode metadata (title & short description) should follow consistent rules for branding, SEO, and platforms:

- Title: 55–65 characters (incl. spaces)
- Description: 250–300 characters
- Host phrase must appear: `Daniel and Annabelle guide you` (case-insensitive)
- CTA starts with: `Press play and ...`
- The validator enforces these; `--style-strict` turns style warnings into errors:

```bash
node scripts/validate-podcasts.mjs --style-strict --no-network
```

Typical warnings:

- `Style: title length 52 outside 55–65`
- `Style: missing host phrase`
- `Style: description contains emoji`

Recommended workflow when adding episodes:

1. Draft data
2. Check title/description lengths
3. Add host phrase + CTA
4. Remove emojis (if copied from sources)
5. Run `validate-podcasts.mjs --style-strict`
6. Fix and re-run

### Image Normalization

Creates square thumbnails using padding (contain) or center crop.

```bash
# Preview without writing
yarn normalize:images --dry-run

# Create with crop mode
yarn normalize:images --mode=crop

# Replace original & set transparent background
yarn normalize:images --replace --background=transparent
```

Flags: `--dry-run`, `--replace`, `--background=<hex|transparent>`, `--mode=<contain|crop>`

### Update Persons

Edit `src/data/persons.json`. Updated `<podcast:person>` entries are emitted automatically during build and RSS generation.

## RSS Extensions

- Namespace `xmlns:podcast="https://podcastindex.org/namespace/1.0"`
- `<podcast:transcript>` when `subtitleUrl` is present
- `<podcast:person>` for each person in `persons.json`
- Dynamic `<itunes:episode>` numbering (fallback to order)
- `<itunes:duration>` from `durationSeconds`
- `<enclosure length="fileSizeBytes">` for exact size

Generator version: `MelodyMind RSS Generator v1.1.0`

## Accessibility Features

### WCAG Support

- ✅ Strong contrast and visible focus treatment
- ✅ **Keyboard navigation** for all interactive elements
- ✅ **Screen reader support** with comprehensive ARIA labels
- ✅ **Focus management** with visible focus indicators
- ✅ **Skip links** for efficient navigation
- ✅ **Reduced motion** support for vestibular disorders

### Accessible Search

`SearchBar.astro` provides an accessible search:

- `role="search"` with clear `aria-label`
- Visually hidden label for screen readers
- Live region (`aria-live="polite"`) announces result count without focus loss
- Fully focusable input & clear button with visible focus rings (AAA contrast)
- High contrast support (`prefers-contrast: high`)
- Respects reduced motion (`prefers-reduced-motion`)
- Uses semantic articles; filtering toggles `hidden`

Usage: it filters episode titles and descriptions as you type; `Clear` resets the field. Server-side or fuzzy search can be added later if needed.

### Testing Accessibility

```bash
# Install accessibility testing tools
yarn global add @axe-core/cli lighthouse

# Run accessibility audit
axe http://localhost:4321/en/1950s
lighthouse http://localhost:4321/en/1950s --only-categories=accessibility
```

## Deployment

### Sitemap & SEO

- Generated via `@astrojs/sitemap`
- Discovery: `robots.txt` entry + `<link rel="sitemap" href="/sitemap-index.xml">` in `PodcastLayout.astro`
- Dynamic priority/changefreq via `serialize` in `astro.config.mjs`
- Namespaces excluded: `news`, `video`, `image` (only `xhtml` for alternate links)
- XSL stylesheet for readability: `public/sitemap.xsl` via `xslURL`

### Customization

- **Colors**: Update CSS variables in `src/layouts/PodcastLayout.astro`
- **Fonts**: Update the font family in `src/layouts/PodcastLayout.astro`
- **SEO**: Adjust meta tags in `PodcastLayout.astro`
- **Streaming platforms**: Add/remove platforms in homepage template

## Performance

- **Lighthouse Score**: 100/100 (Performance, Accessibility, Best Practices, SEO)
- **Core Web Vitals**: All green metrics
- **Bundle Size**: < 50kb gzipped
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 2.5s

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and formatting
- Add TypeScript types for new features
- Ensure accessibility compliance for UI changes
- Test across devices and browsers
- Update documentation for new features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Astro.js** team for the excellent static site generator
- **BEM methodology** for consistent CSS naming
- **Atkinson Hyperlegible** font for enhanced readability
- **WCAG** guidelines for accessibility standards

## Support

For questions, issues, or feature requests:

- **GitHub Issues**: [Create an issue](https://github.com/dcschmid/melody-mind/issues)
- **Documentation**: Check this README and inline code comments
- **Community**: Astro.js Discord for framework-related questions

---

**MelodyMind Podcasts** - Exploring music history through accessible, English-first storytelling.
