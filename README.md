# MelodyMind Knowledge

Music knowledge articles and education content for MelodyMind - A standalone static site serving content at `knowledge.melody-mind.de`.

## Features

- 🌍 **English-only**: streamlined single-language experience
- 📚 **600+ Music Articles**: Comprehensive knowledge base about music genres, artists, and history
- ⚡ **Static Site Generation**: Fast loading with pre-rendered pages
- 🔍 **Full-text Search**: Client-side search functionality
- 📖 **Table of Contents**: Auto-generated navigation for long articles
- 🎨 **Responsive Design**: Mobile-first Tailwind CSS styling

## Tech Stack

- **Framework**: [Astro](https://astro.build/) v5+ with SSG
- **Content**: Markdown with Frontmatter (Content Collections)
- **Styling**: Tailwind CSS v4
- **Fonts**: Atkinson Hyperlegible (accessible font)
- **Search**: Client-side JavaScript search
- **Runtime**: Node.js 18.19.0+
- **Package Manager**: Yarn

## Getting Started

### Prerequisites

- Node.js >= 18.19.0
- Yarn

### Installation

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

## Project Structure

```
melody-mind-knowledge/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Search/       # Search panel component
│   │   └── Shared/       # Shared components (BackToTop, etc.)
│   ├── constants/        # App constants
│   ├── content/          # Knowledge articles (Markdown)
│   │   ├── knowledge-en/ # English articles (active)
│   │   └── config.ts     # Content collection schema
│   ├── i18n/             # Translations
│   │   └── locales/      # Language-specific translations
│   ├── layouts/          # Page layouts
│   ├── pages/            # Astro pages (routes)
│   │   ├── knowledge/    # Knowledge listing & detail pages
│   │   │   ├── index.astro
│   │   │   └── [...slug].astro
│   │   └── index.astro   # Root redirect to /knowledge
│   ├── styles/           # Global styles
│   └── utils/            # Utility functions
│       ├── content/      # Content utilities
│       ├── dates/        # Date formatting
│       ├── i18n/         # i18n utilities
│       └── seo/          # SEO helpers
├── public/               # Static assets
└── astro.config.mjs      # Astro configuration
```

## Content Collections

Knowledge articles are organized as Astro Content Collections:

- `knowledge-en`: English articles (canonical and only active collection)

Legacy folders for other locales may exist but are no longer part of the build.

Each article includes:
- Title, description, keywords
- Created/updated dates
- Reading time estimation
- Optional category metadata (Spotify/Deezer/Apple Music links)
- Rich markdown content

## Development

```bash
# Run development server with hot reload
yarn dev

# Lint code
yarn lint

# Format code
yarn format

# Type check
astro check
```

## Deployment

### Static Site Generation

The site is built as a static site (SSG):

```bash
# Build static files
yarn build:production
```

Output will be in `dist/` directory, ready to deploy to any static hosting.

### Subdomain Setup

1. Configure DNS to point `knowledge.melody-mind.de` to your server
2. Set up web server (nginx/Apache/Caddy) to serve the `dist/` directory
3. Enable gzip/brotli compression for better performance

### Example nginx config

```nginx
server {
    listen 443 ssl http2;
    server_name knowledge.melody-mind.de;
    
    root /var/www/melody-mind-knowledge/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Search Functionality

The site includes a client-side search feature that:
- Searches article titles, descriptions, and keywords
- Provides instant results without page reload
- Supports multiple languages
- Highlights search results

## License

MIT

## Related Projects

- [MelodyMind](https://github.com/dcschmid/melody-mind) - Main application
- [MelodyMind Podcasts](https://github.com/dcschmid/melody-mind-podcasts) - Podcast subdomain

---

Built with ❤️ for music lovers
