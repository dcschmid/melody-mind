# Performance Optimization Review

Your goal is to analyze and provide optimization recommendations for MelodyMind code to ensure fast loading and smooth gameplay.

## Analysis Focus

If not specified, ask for:

- The specific component, page, or feature to analyze
- Current performance metrics or pain points
- Target devices and browsers to optimize for
- Any specific performance goals

## Areas to Examine

- **Astro Rendering**: Optimal use of SSR vs. SSG rendering strategies
- **Vanilla JavaScript**: Script optimization, minimal bundle size, efficient execution
- **Asset Optimization**: Images, fonts, audio files
- **Network Performance**: API calls, data loading, caching, HTTP/2, preloading
- **Animation Performance**: Frame rates, GPU acceleration, CSS optimizations
- **Resource Usage**: Memory management, CPU usage, event listeners
- **Tailwind Optimization**: Utility class usage, PurgeCSS configuration
- **Web Vitals**: LCP, FID, CLS, INP optimization strategies

## Analysis Structure

1. Initial performance assessment
2. Identified bottlenecks
3. Optimization recommendations
4. Implementation examples
5. Expected improvements

## Example Analysis

````markdown
## Performance Analysis: Quiz Game Screen

### Initial Assessment

- First paint: 1.2s
- First contentful paint: 1.8s
- Time to interactive: 3.2s
- Largest contentful paint: 2.4s
- Main bundle size: 428KB
- Image assets: 1.2MB total
- INP (Interaction to Next Paint): 180ms

### Identified Bottlenecks

1. Large uncompressed images for genre backgrounds
2. Inefficient timer implementation using setInterval
3. All questions loaded at once rather than progressively
4. Unused Tailwind utilities increasing CSS bundle size
5. Unoptimized animations causing jank on mobile devices
6. Blocking script execution affecting initial page load

### Optimization Recommendations

#### 1. Image Optimization

- Convert PNG background images to WebP with fallbacks
- Implement responsive images with srcset
- Lazy load below-the-fold images
- Use Astro's built-in image optimization

```astro
<!-- Before -->
<img src="/images/rock-background.png" alt="Rock Music" />

<!-- After -->
---
import { Image } from 'astro:assets';
import rockBackground from '../assets/rock-background.png';
---

<Image
  src={rockBackground}
  widths={[400, 800]}
  sizes="(max-width: 800px) 400px, 800px"
  formats={["webp", "avif", "jpg"]} 
  alt="Rock Music"
  loading="lazy"
/>
```

#### 2. Optimize Script Execution

- Use efficient timer implementations with requestAnimationFrame
- Add type="module" to scripts for better optimization
- Apply proper event cleanup to prevent memory leaks
- Implement passive event listeners for touch events

```astro
<!-- Before -->
<div class="timer" id="quiz-timer">30s</div>

<script>
  const timerEl = document.getElementById("quiz-timer");
  let time = 30;

  setInterval(() => {
    time--;
    timerEl.textContent = time + "s";
    if (time <= 0) endQuiz();
  }, 1000);
</script>

<!-- After -->
<div class="timer" id="quiz-timer">30s</div>

<script type="module">
  const timerEl = document.getElementById("quiz-timer");
  let time = 30;
  let lastTimestamp = 0;
  let animationId;

  function updateTimer(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;

    const elapsed = timestamp - lastTimestamp;

    // Update once per second
    if (elapsed >= 1000) {
      time--;
      timerEl.textContent = time + "s";
      lastTimestamp = timestamp;

      if (time <= 0) {
        cancelAnimationFrame(animationId);
        endQuiz();
        return;
      }
    }

    animationId = requestAnimationFrame(updateTimer);
  }

  // Start the timer with RAF
  animationId = requestAnimationFrame(updateTimer);

  // Clean up on page navigation
  document.addEventListener("astro:page-load", () => {
    cancelAnimationFrame(animationId);
  });
  
  // Cleanup when component unmounts
  document.addEventListener("astro:before-swap", () => {
    cancelAnimationFrame(animationId);
  });

  function endQuiz() {
    // Quiz ending logic
  }
</script>
```

#### 3. Progressive Data Loading

- Implement dynamic imports for code splitting
- Use native fetch with priority hints
- Load initial questions statically, fetch remaining in background
- Implement data prefetching for the next question

```typescript
// utils/questionLoader.ts
export async function loadQuestions(genre, difficulty) {
  // Initial load for first 5 questions (server-side or static)
  const initialQuestionsResponse = await fetch(
    `/api/questions/${genre}/${difficulty}?limit=5`,
    { priority: "high" } // Prioritize this request
  );
  
  const initialQuestions = await initialQuestionsResponse.json();

  // Background fetch for remaining questions
  let remainingQuestions = [];
  let remainingQuestionsLoaded = false;

  const loadRemaining = async () => {
    try {
      const response = await fetch(
        `/api/questions/${genre}/${difficulty}?skip=5`,
        { priority: "low" } // Deprioritize this request
      );
      
      remainingQuestions = await response.json();
      remainingQuestionsLoaded = true;
      
      // Notify any listeners that remaining questions are available
      document.dispatchEvent(new CustomEvent('questions-loaded'));
    } catch (error) {
      console.error('Failed to load remaining questions:', error);
    }
  };

  // Start loading in background after component mounts
  if (typeof window !== "undefined") {
    // Try to use modern browser APIs for performance
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => loadRemaining(), { timeout: 2000 });
    } else if ('requestAnimationFrame' in window) {
      // Fallback to RAF for older browsers
      setTimeout(() => {
        requestAnimationFrame(loadRemaining);
      }, 100);
    } else {
      // Ultimate fallback
      setTimeout(loadRemaining, 200);
    }
  }

  // Function to get a question by index (combines both arrays)
  const getQuestion = (index) => {
    if (index < initialQuestions.length) {
      return initialQuestions[index];
    } else {
      return remainingQuestions[index - initialQuestions.length] || null;
    }
  };

  // Check if all questions are loaded
  const areAllQuestionsLoaded = () => remainingQuestionsLoaded;

  return { 
    initialQuestions, 
    getQuestion, 
    areAllQuestionsLoaded,
    // Returns a promise that resolves when all questions are loaded
    waitForAllQuestions: () => {
      return new Promise(resolve => {
        if (remainingQuestionsLoaded) {
          resolve();
        } else {
          document.addEventListener('questions-loaded', () => resolve(), { once: true });
        }
      });
    }
  };
}
```

#### 4. Tailwind Optimization

- Configure PurgeCSS content paths correctly in tailwind.config.mjs
- Use modern plugins for responsive typography 
- Extract common utility patterns into CSS variables for consistency

```js
// tailwind.config.mjs - optimized configuration
export default {
  content: ["./src/**/*.{astro,html,js,ts}"],
  theme: {
    extend: {
      // Use modern color science
      colors: {
        // Using modern oklch color space for better visuals across displays
        'brand': {
          DEFAULT: 'oklch(65% 0.2 250)',
          'light': 'oklch(85% 0.2 250)',
          'dark': 'oklch(45% 0.2 250)',
        }
      },
    }
  },
  future: {
    hoverOnlyWhenSupported: true, // Better touch device support
  },
  plugins: [
    // Add only plugins you actually use
  ],
};
```

#### 5. Animation Optimization

- Use modern CSS animations with transforms 
- Enable GPU acceleration with will-change for critical animations
- Use reduced motion media query for accessibility
- Implement progressive enhancement for animations

```css
/* Before */
.card-enter {
  opacity: 0;
  left: -100px;
}

/* After */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.card-enter {
  animation: slideIn 0.3s ease-out forwards;
  will-change: transform, opacity;
}

/* Only animate if the user doesn't prefer reduced motion */
@media (prefers-reduced-motion: no-preference) {
  .card-enter {
    animation-duration: 0.3s;
  }
}

@media (prefers-reduced-motion: reduce) {
  .card-enter {
    animation-duration: 0.01ms;
  }
}
```

#### 6. Astro-Specific Optimizations

- Use appropriate rendering strategies (SSG for static content)
- Implement View Transitions API for smooth page transitions
- Use script type="module" for better code optimizations
- Add preload hints for critical assets

```astro
---
// Select optimal rendering mode based on content type
export const prerender = true; // For static pages

// Preload critical resources
const criticalAssets = [
  {
    rel: 'preload',
    href: '/fonts/game-font.woff2',
    as: 'font',
    type: 'font/woff2',
    crossorigin: 'anonymous'
  },
  {
    rel: 'preload',
    href: '/images/logo.webp',
    as: 'image',
    type: 'image/webp'
  }
];
---

<html lang="en">
  <head>
    <!-- Add preload hints for critical assets -->
    {criticalAssets.map(asset => (
      <link {...asset} />
    ))}
    
    <!-- Modern JS module -->
    <script type="module" src="/scripts/critical.js"></script>
  </head>
  <body>
    <!-- View transitions for smooth page transitions -->
    <main transition:animate="slide">
      <!-- Page content -->
    </main>
    
    <!-- Defer non-critical scripts -->
    <script type="module" src="/scripts/non-critical.js" defer></script>
  </body>
</html>
```

#### 7. Modern Web API Optimizations

- Use Intersection Observer for lazy loading
- Implement Content-Visibility for off-screen content 
- Add priority hints to fetch requests
- Take advantage of browser caching with proper cache headers

```astro
<div class="game-grid">
  {gameItems.map((item, index) => (
    <div 
      class="game-item" 
      style={index > 10 ? "content-visibility: auto;" : ""}
      data-index={index}
    >
      <!-- Item content -->
    </div>
  ))}
</div>

<script type="module">
  // Use Intersection Observer for lazy loading
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const item = entry.target;
        // Load data or images
        loadItemContent(item.dataset.index);
        // Stop observing once loaded
        observer.unobserve(item);
      }
    });
  }, {
    rootMargin: '200px', // Load items before they come into view
    threshold: 0.01
  });

  // Observe all game items
  document.querySelectorAll('.game-item').forEach(item => {
    observer.observe(item);
  });

  // Cleanup
  document.addEventListener('astro:before-swap', () => {
    observer.disconnect();
  });

  async function loadItemContent(index) {
    // Implementation details...
  }
</script>
```

### Expected Improvements

- First contentful paint: 1.8s → 0.8s 
- Time to interactive: 3.2s → 1.4s
- Bundle size: 428KB → 240KB
- INP (Interaction to Next Paint): 180ms → 80ms
- Smooth 60fps animations on mobile devices
- 45% reduction in total page weight
- 70% improvement in Core Web Vitals scores
````
