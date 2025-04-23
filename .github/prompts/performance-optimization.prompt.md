# Performance Optimization Review

Your goal is to analyze and provide optimization recommendations for MelodyMind code to ensure fast loading and smooth gameplay.

## Analysis Focus

If not specified, ask for:

- The specific component, page, or feature to analyze
- Current performance metrics or pain points
- Target devices and browsers to optimize for
- Any specific performance goals

## Areas to Examine

- **Astro Rendering**: Proper use of SSR vs. SSG vs. client islands
- **Client-side JavaScript**: Bundle size, minimal interactivity, execution time
- **Asset Optimization**: Images, fonts, audio files
- **Network Performance**: API calls, data loading, caching
- **Animation Performance**: Frame rates, GPU acceleration
- **Resource Usage**: Memory leaks, CPU usage
- **Tailwind Optimization**: Utility class usage, PurgeCSS configuration
- **Island Architecture**: Proper use of client directives (client:load, client:visible, etc.)

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

### Identified Bottlenecks

1. Large uncompressed images for genre backgrounds
2. Excessive script execution for quiz timer updates
3. All questions loaded at once rather than progressively
4. Unused Tailwind utilities increasing CSS bundle size
5. Unoptimized animations causing jank on mobile devices

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
--- import {Image} from 'astro:assets'; import rockBackground from '../assets/rock-background.png';
---

<Image
  src={rockBackground}
  widths={[400, 800]}
  sizes="(max-width: 800px) 400px, 800px"
  formats={["webp", "jpg"]}
  alt="Rock Music"
  loading="lazy"
/>
```
````

#### 2. Optimize Script Execution

- Use efficient timer implementations
- Implement partial hydration with client directives
- Use requestAnimationFrame for smooth animations

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

<script>
  const timerEl = document.getElementById("quiz-timer");
  let time = 30;
  let lastTimestamp = 0;
  let animationId: number;

  function updateTimer(timestamp: number) {
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

  function endQuiz() {
    // Quiz ending logic
  }
</script>
```

#### 3. Progressive Data Loading

- Use Astro's partial hydration to load initial content statically
- Load first 5 questions with page, fetch remaining in background
- Implement data prefetching for the next question

```typescript
// utils/questionLoader.ts
export async function loadQuestions(genre: string, difficulty: string) {
  // Initial load for first 5 questions (server-side or static)
  const initialQuestions = await fetch(
    `/api/questions/${genre}/${difficulty}?limit=5`,
  ).then((r) => r.json());

  // Background fetch for remaining questions
  let remainingQuestions: Question[] = [];

  const loadRemaining = async () => {
    remainingQuestions = await fetch(
      `/api/questions/${genre}/${difficulty}?skip=5`,
    ).then((r) => r.json());
  };

  // Start loading in background after component mounts
  if (typeof window !== "undefined") {
    // Use requestIdleCallback where available, or setTimeout as fallback
    const requestIdleCallback =
      window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

    requestIdleCallback(() => {
      loadRemaining();
    });
  }

  // Function to get a question by index (combines both arrays)
  const getQuestion = (index: number) => {
    if (index < initialQuestions.length) {
      return initialQuestions[index];
    } else {
      return remainingQuestions[index - initialQuestions.length] || null;
    }
  };

  return { initialQuestions, getQuestion };
}
```

#### 4. Tailwind Optimization

- Configure PurgeCSS content paths correctly in tailwind.config.mjs
- Use JIT mode in development
- Extract common utility patterns into components

```js
// tailwind.config.mjs - optimized configuration
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    // Theme customizations
  },
  plugins: [],
};
```

#### 5. Animation Optimization

- Use CSS transforms instead of position/size properties
- Enable GPU acceleration with will-change for critical animations
- Use reduced motion media query for accessibility

```css
/* Before */
.card-enter {
  opacity: 0;
  left: -100px;
}

/* After */
.card-enter {
  opacity: 0;
  transform: translateX(-100px);
  will-change: transform, opacity;
}

@media (prefers-reduced-motion: reduce) {
  .card-enter {
    transition-duration: 0.01ms !important;
  }
}
```

#### 6. Astro-Specific Optimizations

- Use appropriate rendering strategies (SSG for static content)
- Implement View Transitions API for smooth page transitions
- Use client directives strategically:
  - `client:idle` for non-critical interactive elements
  - `client:visible` for below-fold interactive elements
  - `client:media` for device-specific interactions

```astro
---
// Select optimal rendering mode based on content type
export const prerender = true; // For static pages
---

<!-- Non-critical UI with deferred hydration -->
<GameStats client:idle />

<!-- Below-fold content that hydrates when visible -->
<LeaderBoard client:visible />

<!-- Different experiences for mobile vs. desktop -->
<MobileControls client:media="(max-width: 768px)" />
<DesktopControls client:media="(min-width: 769px)" />
```

### Expected Improvements

- First contentful paint: 1.8s → 0.9s
- Time to interactive: 3.2s → 1.6s
- Bundle size: 428KB → 275KB
- Smooth 60fps animations on mobile devices
- 40% reduction in total page weight
