# MusicButtons Integration Examples

## Overview

This document provides comprehensive integration examples for the MusicButtons component, demonstrating how to use it effectively within the MelodyMind ecosystem and with various other components.

## Basic Integration Examples

### 1. Simple Category Integration

```astro
---
// src/pages/category/[genre].astro
import MusicButtons from "@components/MusicButtons.astro";
import { getQuestionCategories } from "@utils/game/categories";

export async function getStaticPaths() {
  const categories = await getQuestionCategories();
  return categories.map((category) => ({
    params: { genre: category.slug },
    props: { category }
  }));
}

const { category } = Astro.props;
---

<main>
  <h1>{category.name}</h1>
  <p>{category.description}</p>
  
  <!-- Music platform buttons for this category -->
  <MusicButtons 
    category={category} 
    title={`${category.name} Playlist`} 
  />
</main>
```

### 2. Dynamic Content Integration

```astro
---
// src/components/CategoryCard.astro
import MusicButtons from "./MusicButtons.astro";
import { getLangFromUrl, useTranslations } from "@utils/i18n";

interface Props {
  category: {
    name: string;
    description: string;
    spotifyPlaylist?: string;
    deezerPlaylist?: string;
    appleMusicPlaylist?: string;
  };
  showMusicButtons?: boolean;
}

const { category, showMusicButtons = true } = Astro.props;
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(String(lang));
---

<article class="category-card">
  <div class="category-content">
    <h3>{category.name}</h3>
    <p>{category.description}</p>
  </div>
  
  {showMusicButtons && (
    <div class="category-actions">
      <MusicButtons 
        category={category} 
        title={`${category.name} - ${t('game.playlist')}`} 
      />
    </div>
  )}
</article>

<style>
  .category-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    padding: var(--space-lg);
    border-radius: var(--radius-lg);
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-primary);
  }
  
  .category-content {
    flex: 1;
  }
  
  .category-actions {
    margin-top: auto;
    padding-top: var(--space-md);
    border-top: 1px solid var(--border-secondary);
  }
</style>
```

## Advanced Integration Patterns

### 3. Modal/Overlay Integration

```astro
---
// src/components/CategoryModal.astro
import MusicButtons from "./MusicButtons.astro";
import Modal from "./Overlays/Modal.astro";
import { getLangFromUrl, useTranslations } from "@utils/i18n";

interface Props {
  category: CategoryWithPlaylists;
  isOpen: boolean;
  onClose: () => void;
}

const { category, isOpen, onClose } = Astro.props;
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(String(lang));
---

<Modal 
  isOpen={isOpen} 
  onClose={onClose}
  title={category.name}
  size="medium"
>
  <div class="modal-content">
    <div class="category-info">
      <h2>{category.name}</h2>
      <p>{category.description}</p>
    </div>
    
    <div class="music-section">
      <h3>{t('musicPlatforms.availableOn')}</h3>
      <MusicButtons 
        category={category} 
        title={category.name} 
      />
    </div>
    
    <div class="modal-actions">
      <button type="button" onclick={onClose}>
        {t('common.close')}
      </button>
    </div>
  </div>
</Modal>

<style>
  .modal-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
    padding: var(--space-lg);
  }
  
  .music-section {
    padding: var(--space-md);
    background-color: var(--bg-tertiary);
    border-radius: var(--radius-md);
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-md);
    padding-top: var(--space-md);
    border-top: 1px solid var(--border-secondary);
  }
</style>
```

### 4. Game Result Integration

```astro
---
// src/components/Game/GameResultOverlay.astro
import MusicButtons from "../MusicButtons.astro";
import { getLangFromUrl, useTranslations } from "@utils/i18n";

interface Props {
  gameResults: {
    score: number;
    category: CategoryWithPlaylists;
    correctAnswers: number;
    totalQuestions: number;
  };
}

const { gameResults } = Astro.props;
const { score, category, correctAnswers, totalQuestions } = gameResults;
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(String(lang));
---

<div class="game-result-overlay">
  <div class="result-content">
    <h2>{t('game.results.title')}</h2>
    
    <div class="score-display">
      <div class="score-value">{score}</div>
      <div class="score-details">
        {t('game.results.correctAnswers', { correct: correctAnswers, total: totalQuestions })}
      </div>
    </div>
    
    <div class="music-suggestion">
      <h3>{t('game.results.continueListening')}</h3>
      <p>{t('game.results.explorePlaylist', { category: category.name })}</p>
      
      <MusicButtons 
        category={category} 
        title={`${category.name} - ${t('game.results.playlistTitle')}`} 
      />
    </div>
    
    <div class="result-actions">
      <button type="button" class="btn-primary">
        {t('game.playAgain')}
      </button>
      <button type="button" class="btn-secondary">
        {t('game.selectNewCategory')}
      </button>
    </div>
  </div>
</div>

<style>
  .game-result-overlay {
    position: fixed;
    inset: 0;
    background-color: var(--overlay-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal);
  }
  
  .result-content {
    background-color: var(--bg-primary);
    border-radius: var(--radius-xl);
    padding: var(--space-2xl);
    max-width: 500px;
    width: 90%;
    box-shadow: var(--shadow-xl);
  }
  
  .music-suggestion {
    margin: var(--space-xl) 0;
    padding: var(--space-lg);
    background-color: var(--bg-tertiary);
    border-radius: var(--radius-lg);
    text-align: center;
  }
  
  .result-actions {
    display: flex;
    gap: var(--space-md);
    justify-content: center;
    margin-top: var(--space-xl);
  }
</style>
```

### 5. Carousel/Slider Integration

```astro
---
// src/components/CategoryCarousel.astro
import MusicButtons from "./MusicButtons.astro";
import { getQuestionCategories } from "@utils/game/categories";

const categories = await getQuestionCategories();
const featuredCategories = categories.filter(cat => cat.featured);
---

<div class="category-carousel">
  <h2>Featured Music Categories</h2>
  
  <div class="carousel-container">
    <div class="carousel-track" id="categoryCarousel">
      {featuredCategories.map((category, index) => (
        <div class="carousel-slide" data-index={index}>
          <div class="category-slide">
            <div class="slide-content">
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </div>
            
            <div class="slide-music">
              <MusicButtons 
                category={category} 
                title={`${category.name} Featured Playlist`} 
              />
            </div>
          </div>
        </div>
      ))}
    </div>
    
    <div class="carousel-controls">
      <button class="carousel-btn carousel-prev" aria-label="Previous category">
        ←
      </button>
      <button class="carousel-btn carousel-next" aria-label="Next category">
        →
      </button>
    </div>
  </div>
</div>

<style>
  .category-carousel {
    padding: var(--space-xl) 0;
  }
  
  .carousel-container {
    position: relative;
    overflow: hidden;
    border-radius: var(--radius-lg);
  }
  
  .carousel-track {
    display: flex;
    transition: transform var(--transition-normal);
  }
  
  .carousel-slide {
    min-width: 100%;
    padding: var(--space-lg);
  }
  
  .category-slide {
    background-color: var(--bg-secondary);
    border-radius: var(--radius-md);
    padding: var(--space-xl);
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
    min-height: 300px;
  }
  
  .slide-content {
    flex: 1;
  }
  
  .slide-music {
    margin-top: auto;
  }
  
  .carousel-controls {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    pointer-events: none;
    padding: 0 var(--space-md);
  }
  
  .carousel-btn {
    pointer-events: auto;
    background-color: var(--bg-primary);
    border: 2px solid var(--border-primary);
    border-radius: var(--radius-full);
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-xl);
    cursor: pointer;
    transition: var(--transition-normal);
  }
  
  .carousel-btn:hover {
    background-color: var(--interactive-primary);
    color: var(--text-inverse);
  }
</style>

<script>
  // Carousel functionality
  const track = document.getElementById('categoryCarousel');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  
  let currentIndex = 0;
  const totalSlides = track?.children.length || 0;
  
  function updateCarousel() {
    if (track) {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }
  
  prevBtn?.addEventListener('click', () => {
    currentIndex = Math.max(0, currentIndex - 1);
    updateCarousel();
  });
  
  nextBtn?.addEventListener('click', () => {
    currentIndex = Math.min(totalSlides - 1, currentIndex + 1);
    updateCarousel();
  });
</script>
```

## Conditional Rendering Patterns

### 6. Platform Availability Check

```astro
---
// src/components/CategoryDetails.astro
import MusicButtons from "./MusicButtons.astro";
import { getAvailablePlatforms } from "@types/MusicButtons";

interface Props {
  category: CategoryWithPlaylists;
}

const { category } = Astro.props;
const availablePlatforms = getAvailablePlatforms(category);
const hasAnyPlatforms = availablePlatforms.length > 0;
---

<div class="category-details">
  <h2>{category.name}</h2>
  <p>{category.description}</p>
  
  {hasAnyPlatforms ? (
    <div class="music-platforms-section">
      <h3>Available on {availablePlatforms.length} platform{availablePlatforms.length !== 1 ? 's' : ''}</h3>
      <MusicButtons 
        category={category} 
        title={category.name} 
      />
    </div>
  ) : (
    <div class="no-platforms-notice">
      <p>Music playlists for this category are coming soon!</p>
    </div>
  )}
</div>
```

### 7. Progressive Enhancement

```astro
---
// src/components/EnhancedCategoryCard.astro
import MusicButtons from "./MusicButtons.astro";

interface Props {
  category: CategoryWithPlaylists;
  enhancementLevel?: 'basic' | 'standard' | 'premium';
}

const { category, enhancementLevel = 'standard' } = Astro.props;
---

<article class="enhanced-category-card">
  <!-- Basic content always shown -->
  <div class="basic-content">
    <h3>{category.name}</h3>
    <p>{category.description}</p>
  </div>
  
  <!-- Standard enhancement: music buttons -->
  {enhancementLevel !== 'basic' && (
    <div class="standard-enhancements">
      <MusicButtons 
        category={category} 
        title={category.name} 
      />
    </div>
  )}
  
  <!-- Premium enhancement: additional features -->
  {enhancementLevel === 'premium' && (
    <div class="premium-enhancements">
      <button class="preview-btn">
        Preview Playlist
      </button>
      <button class="share-btn">
        Share Category
      </button>
    </div>
  )}
</article>
```

## API Integration Examples

### 8. Dynamic Data Loading

```astro
---
// src/components/LiveCategoryData.astro
import MusicButtons from "./MusicButtons.astro";

interface Props {
  categoryId: string;
}

const { categoryId } = Astro.props;

// Fetch category data from API
const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/categories/${categoryId}`);
const category = await response.json();
---

{category ? (
  <div class="live-category">
    <h2>{category.name}</h2>
    <p>{category.description}</p>
    
    <!-- Only show music buttons if playlist data is available -->
    {(category.spotifyPlaylist || category.deezerPlaylist || category.appleMusicPlaylist) && (
      <div class="live-music-section">
        <h3>Listen Now</h3>
        <MusicButtons 
          category={category} 
          title={category.name} 
        />
      </div>
    )}
  </div>
) : (
  <div class="category-error">
    <p>Category not found</p>
  </div>
)}
```

### 9. User Preference Integration

```astro
---
// src/components/PersonalizedMusicButtons.astro
import MusicButtons from "./MusicButtons.astro";

interface Props {
  category: CategoryWithPlaylists;
  userPreferences?: {
    preferredPlatforms?: string[];
    hideExternalLinks?: boolean;
  };
}

const { category, userPreferences } = Astro.props;

// Filter category based on user preferences
const filteredCategory = userPreferences?.preferredPlatforms ? {
  ...category,
  spotifyPlaylist: userPreferences.preferredPlatforms.includes('spotify') ? category.spotifyPlaylist : undefined,
  deezerPlaylist: userPreferences.preferredPlatforms.includes('deezer') ? category.deezerPlaylist : undefined,
  appleMusicPlaylist: userPreferences.preferredPlatforms.includes('apple') ? category.appleMusicPlaylist : undefined,
} : category;
---

{!userPreferences?.hideExternalLinks && (
  <div class="personalized-music">
    <MusicButtons 
      category={filteredCategory} 
      title={`${category.name} - Your Preferred Platforms`} 
    />
  </div>
)}
```

## Testing Integration Examples

### 10. Component Testing Setup

```typescript
// tests/components/MusicButtons.test.ts
import { test, expect } from '@playwright/test';

test.describe('MusicButtons Integration', () => {
  test('renders correctly in CategoryCard', async ({ page }) => {
    await page.goto('/category/rock');
    
    // Check if MusicButtons is present
    const musicButtons = page.locator('.music-buttons');
    await expect(musicButtons).toBeVisible();
    
    // Check for platform buttons
    const spotifyButton = page.locator('.music-button--spotify');
    const deezerButton = page.locator('.music-button--deezer');
    const appleButton = page.locator('.music-button--apple');
    
    // At least one platform should be available
    const visibleButtons = [spotifyButton, deezerButton, appleButton];
    const visibleCount = await Promise.all(
      visibleButtons.map(btn => btn.isVisible())
    ).then(results => results.filter(Boolean).length);
    
    expect(visibleCount).toBeGreaterThan(0);
  });
  
  test('works correctly in modal context', async ({ page }) => {
    await page.goto('/categories');
    
    // Open category modal
    await page.click('[data-category="rock"]');
    
    // Wait for modal to appear
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    
    // Check MusicButtons in modal
    const musicButtons = modal.locator('.music-buttons');
    await expect(musicButtons).toBeVisible();
    
    // Test keyboard navigation within modal
    await page.keyboard.press('Tab');
    const focusedButton = page.locator('.music-button:focus');
    await expect(focusedButton).toBeVisible();
  });
});
```

## Performance Optimization Examples

### 11. Lazy Loading Integration

```astro
---
// src/components/LazyMusicButtons.astro
import MusicButtons from "./MusicButtons.astro";

interface Props {
  category: CategoryWithPlaylists;
  lazy?: boolean;
}

const { category, lazy = false } = Astro.props;
---

{lazy ? (
  <div class="lazy-music-container" data-lazy-music>
    <div class="music-placeholder">
      <p>Loading music platforms...</p>
    </div>
    <template data-music-template>
      <MusicButtons 
        category={category} 
        title={category.name} 
      />
    </template>
  </div>
) : (
  <MusicButtons 
    category={category} 
    title={category.name} 
  />
)}

<script>
  // Intersection Observer for lazy loading
  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const container = entry.target;
        const template = container.querySelector('[data-music-template]');
        const placeholder = container.querySelector('.music-placeholder');
        
        if (template && placeholder) {
          const content = template.content.cloneNode(true);
          placeholder.replaceWith(content);
          observer.unobserve(container);
        }
      }
    });
  };
  
  const observer = new IntersectionObserver(observerCallback, {
    rootMargin: '50px'
  });
  
  document.querySelectorAll('[data-lazy-music]').forEach(el => {
    observer.observe(el);
  });
</script>
```

These integration examples demonstrate the flexibility and power of the MusicButtons component when used throughout the MelodyMind application. Each pattern addresses specific use cases while maintaining accessibility, performance, and user experience standards.
