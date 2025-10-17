#!/bin/bash

# Podcast Migration Script for MelodyMind
# This script helps migrate podcast functionality to a separate subdomain

set -e

echo "🎵 MelodyMind Podcast Migration Tool"
echo "======================================"

# Configuration
MAIN_REPO="melody-mind"
PODCAST_REPO="melody-mind-podcasts"
SUPPORTED_LANGUAGES="en de es fr it pt"

# Functions
create_new_repo() {
    echo "📁 Creating new podcast repository..."
    
    if [ -d "../$PODCAST_REPO" ]; then
        echo "⚠️  Repository $PODCAST_REPO already exists!"
        read -p "Do you want to continue? (y/N): " confirm
        if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
            exit 0
        fi
    fi
    
    cd ..
    
    # Create directory and basic structure manually
    mkdir -p $PODCAST_REPO
    cd $PODCAST_REPO
    
    # Initialize npm/yarn project
    echo '{}' > package.json
    
    # Install Astro and dependencies
    echo "📦 Installing Astro and dependencies..."
    npm init -y
    npm install astro@latest @astrojs/node @astrojs/sitemap typescript
    
    # Create basic package.json scripts
    cat > package.json << 'EOF'
{
  "name": "melody-mind-podcasts",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "astro": "^4.13.2",
    "@astrojs/node": "^8.3.0",
    "@astrojs/sitemap": "^3.1.0",
    "typescript": "^5.5.0"
  }
}
EOF
    
    # Install dependencies
    npm install
    
    echo "✅ Base Astro project created"
}

setup_directories() {
    echo "📂 Setting up directory structure..."
    
    mkdir -p src/{data/podcasts,components,layouts,i18n/locales,types,utils}
    mkdir -p public/{audio,images,subtitles}
    mkdir -p scripts
    
    echo "✅ Directory structure created"
}

copy_podcast_data() {
    echo "📋 Copying podcast data from main repository..."
    
    # Ensure directories exist first
    mkdir -p src/data/podcasts
    mkdir -p src/types
    mkdir -p public/images
    
    # Copy existing data
    if [ -d "../$MAIN_REPO/src/data/podcasts" ]; then
        cp -r ../$MAIN_REPO/src/data/podcasts/* src/data/podcasts/ 2>/dev/null || echo "No podcast data files to copy"
    fi
    
    if [ -f "../$MAIN_REPO/src/types/podcast.ts" ]; then
        cp ../$MAIN_REPO/src/types/podcast.ts src/types/
    fi
    
    # Copy podcast images
    if [ -d "../$MAIN_REPO/public/podcast" ]; then
        echo "📸 Copying podcast images..."
        cp -r ../$MAIN_REPO/public/podcast/* public/images/ 2>/dev/null || echo "No podcast images to copy"
    fi
    
    # Copy favicon
    if [ -f "../$MAIN_REPO/public/favicon.svg" ]; then
        cp ../$MAIN_REPO/public/favicon.svg public/
    fi
    
    echo "✅ Podcast data and images copied"
}

create_multilang_structure() {
    echo "🌍 Creating multi-language data structure..."
    
    # Create language-specific podcast data files
    for lang in $SUPPORTED_LANGUAGES; do
        if [ "$lang" != "en" ]; then
            echo "Creating $lang.json template..."
            cat > "src/data/podcasts/$lang.json" << EOF
{
  "podcasts": [
    {
      "id": "1950s",
      "title": "[TO_TRANSLATE] The 1950s – The Birth of Rock & Roll",
      "description": "[TO_TRANSLATE] Neon nights, jukebox dreams...",
      "language": "$lang",
      "isAvailable": true,
      "publishedAt": "2025-04-04T10:00:00Z",
      "showNotesHtml": "[TO_TRANSLATE]",
      "audioUrl": "https://eu2.contabostorage.com/b2aeddb452b14863a944e9b2e80105bf:melody-mind/en/1950s.mp3",
      "subtitleUrl": "https://eu2.contabostorage.com/b2aeddb452b14863a944e9b2e80105bf:melody-mind/$lang/1950s.vtt",
      "imageUrl": "1950s"
    }
  ]
}
EOF
        fi
    done
    
    echo "✅ Multi-language structure created"
}

setup_astro_config() {
    echo "⚙️  Setting up Astro configuration..."
    
    cat > astro.config.mjs << 'EOF'
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://podcasts.melody-mind.de',
  output: 'static',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          de: 'de', 
          es: 'es',
          fr: 'fr',
          it: 'it',
          pt: 'pt'
        }
      }
    })
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'es', 'fr', 'it', 'pt'],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
EOF
    
    echo "✅ Astro configuration created"
}

create_basic_layout() {
    echo "🎨 Creating basic layout and components..."
    
    # Create basic layout
    cat > src/layouts/PodcastLayout.astro << 'EOF'
---
export interface Props {
  title: string;
  description: string;
  lang: string;
}

const { title, description, lang } = Astro.props;
---

<!DOCTYPE html>
<html lang={lang}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} | MelodyMind Podcasts</title>
  <meta name="description" content={description}>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
</head>
<body>
  <header>
    <nav>
      <a href={`/${lang}/`}>🎵 MelodyMind Podcasts</a>
    </nav>
  </header>
  
  <main>
    <slot />
  </main>
  
  <footer>
    <p>&copy; 2025 MelodyMind Podcasts</p>
  </footer>
</body>
</html>
EOF
    
    # Create index page
    cat > src/pages/index.astro << 'EOF'
---
// Redirect to English version
return Astro.redirect('/en');
---
EOF
    
    echo "✅ Basic layout created"
}

install_dependencies() {
    echo "📦 Dependencies already installed during repository creation..."
    
    echo "✅ Dependencies ready"
}

create_migration_summary() {
    echo "📋 Creating migration summary..."
    
    cat > MIGRATION_STATUS.md << 'EOF'
# Podcast Migration Status

## ✅ Completed
- [x] Repository setup
- [x] Basic Astro configuration
- [x] Directory structure
- [x] Data migration from main repo
- [x] Multi-language data templates

## 🔄 In Progress
- [ ] Component migration
- [ ] Route setup
- [ ] i18n implementation
- [ ] SEO optimization

## ⏳ Pending
- [ ] Translation of content
- [ ] Testing and validation
- [ ] Deployment configuration
- [ ] DNS setup
- [ ] 301 redirects from main site

## 📂 Repository Structure

```
podcasts-melody-mind/
├── src/
│   ├── data/podcasts/     # Multi-language podcast data
│   ├── components/        # Podcast-specific components
│   ├── layouts/          # Layout templates
│   ├── pages/            # Routes ([lang]/...)
│   ├── i18n/locales/     # Translation files
│   └── types/            # TypeScript definitions
├── public/               # Static assets
└── scripts/              # Migration utilities
```

## 🌍 Supported Languages

- English (en) - Complete
- German (de) - Template created
- Spanish (es) - Template created  
- French (fr) - Template created
- Italian (it) - Template created
- Portuguese (pt) - Template created

## 🔗 Next Steps

1. Copy and adapt components from main repository
2. Set up routing for all languages
3. Implement i18n system
4. Test build and deployment
5. Set up domain and redirects
EOF
    
    echo "✅ Migration summary created"
}

# Main execution
main() {
    echo "Starting podcast migration..."
    echo ""
    
    read -p "Create new repository? (y/N): " create_repo
    if [ "$create_repo" = "y" ] || [ "$create_repo" = "Y" ]; then
        create_new_repo
        setup_directories
        copy_podcast_data
        create_multilang_structure
        setup_astro_config
        create_basic_layout
        install_dependencies
        create_migration_summary
        
        echo ""
        echo "🎉 Podcast migration setup completed!"
        echo ""
        echo "📋 What was done:"
        echo "- ✅ New Astro repository created"
        echo "- ✅ Multi-language structure set up"
        echo "- ✅ Podcast data migrated"
        echo "- ✅ Basic configuration applied"
        echo ""
        echo "🔄 Next steps:"
        echo "1. Review MIGRATION_STATUS.md"
        echo "2. Adapt components from main repository"
        echo "3. Set up translation workflow"
        echo "4. Test and deploy"
        echo ""
        echo "📂 New repository location: ../$PODCAST_REPO"
    else
        echo "Migration cancelled."
    fi
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "src/data/podcasts" ]; then
    echo "❌ Please run this script from the melody-mind repository root directory"
    exit 1
fi

main