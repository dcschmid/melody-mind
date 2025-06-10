# Achievement Categorization Utilities

## Overview

The Achievement Categorization utilities (`src/utils/achievements/categorization.ts`) provide
high-performance functions for organizing and sorting achievements by category. These utilities are
essential for the achievements page display and filtering functionality.

## Functions

### `categorizeAchievements()`

Groups achievements by category ID with performance optimization.

**Signature:**

```typescript
function categorizeAchievements(
  achievements: LocalizedAchievement[]
): Record<string, LocalizedAchievement[]>;
```

**Parameters:**

- `achievements` - Array of localized achievements to categorize

**Returns:**

- Record mapping category IDs to arrays of achievements

**Performance Optimizations:**

- Uses `reduce()` for single-pass categorization
- Pre-allocated object structure for memory efficiency
- Minimal property access for faster execution

**Example:**

```typescript
import { categorizeAchievements } from "@utils/achievements/categorization";

const achievements = [
  { id: "1", categoryId: "bronze", name: "First Steps" /* ... */ },
  { id: "2", categoryId: "silver", name: "Getting Better" /* ... */ },
  { id: "3", categoryId: "bronze", name: "Second Try" /* ... */ },
];

const categorized = categorizeAchievements(achievements);
// Result:
// {
//   'bronze': [achievement1, achievement3],
//   'silver': [achievement2]
// }
```

### `sortAchievementCategories()`

Sorts categorized achievements by category sort order.

**Signature:**

```typescript
function sortAchievementCategories(
  achievementsByCategory: Record<string, LocalizedAchievement[]>
): [string, LocalizedAchievement[]][];
```

**Parameters:**

- `achievementsByCategory` - Record of categorized achievements

**Returns:**

- Array of [categoryId, achievements] entries sorted by sort order

**Sorting Logic:**

- Uses category `sortOrder` property for consistent display
- Handles missing sort order with default value of 0
- Maintains stable sort for deterministic results

**Example:**

```typescript
import { sortAchievementCategories } from "@utils/achievements/categorization";

const categorized = {
  gold: [
    /* achievements with sortOrder: 3 */
  ],
  bronze: [
    /* achievements with sortOrder: 1 */
  ],
  silver: [
    /* achievements with sortOrder: 2 */
  ],
};

const sorted = sortAchievementCategories(categorized);
// Result: [['bronze', [...]], ['silver', [...]], ['gold', [...]]]
```

### `processAchievements()`

Complete achievement processing pipeline that categorizes and sorts achievements.

**Signature:**

```typescript
function processAchievements(
  achievements: LocalizedAchievement[]
): [string, LocalizedAchievement[]][];
```

**Parameters:**

- `achievements` - Array of localized achievements

**Returns:**

- Sorted array of [categoryId, achievements] entries

**Pipeline:**

1. Categorizes achievements by category ID
2. Sorts categories by sort order
3. Returns ready-to-render structure

**Example:**

```typescript
import { processAchievements } from "@utils/achievements/categorization";

const achievements = [
  /* mixed category achievements */
];
const processed = processAchievements(achievements);

// Ready for rendering:
processed.forEach(([categoryId, categoryAchievements]) => {
  console.log(`Category: ${categoryId}, Count: ${categoryAchievements.length}`);
});
```

### `calculateAchievementStats()`

Calculate achievement statistics for summary display.

**Signature:**

```typescript
function calculateAchievementStats(achievements: LocalizedAchievement[]): {
  total: number;
  unlocked: number;
  progress: number;
};
```

**Parameters:**

- `achievements` - Array of achievements to analyze

**Returns:**

- Statistics object with total, unlocked count, and progress percentage

**Calculations:**

- `total` - Total number of achievements
- `unlocked` - Count of achievements with status "unlocked"
- `progress` - Percentage of unlocked achievements (0-100)

**Example:**

```typescript
import { calculateAchievementStats } from "@utils/achievements/categorization";

const achievements = [
  { status: "unlocked" /* ... */ },
  { status: "in-progress" /* ... */ },
  { status: "unlocked" /* ... */ },
  { status: "locked" /* ... */ },
];

const stats = calculateAchievementStats(achievements);
// Result: { total: 4, unlocked: 2, progress: 50 }
```

## Performance Considerations

### Memory Efficiency

- **Single-pass categorization**: Uses `reduce()` to avoid multiple array iterations
- **Minimal object creation**: Reuses existing category arrays when possible
- **Efficient property access**: Minimizes deep property lookups

### Algorithmic Complexity

- `categorizeAchievements()`: O(n) time complexity, O(k) space complexity where k is number of
  categories
- `sortAchievementCategories()`: O(k log k) time complexity where k is number of categories
- `processAchievements()`: O(n + k log k) overall complexity
- `calculateAchievementStats()`: O(n) time complexity, O(1) space complexity

### Cache Considerations

These functions are pure and stateless, making them ideal for memoization:

```typescript
import { memoize } from "lodash-es";

// Cache categorization results for identical input
const memoizedCategorize = memoize(categorizeAchievements);
const memoizedProcess = memoize(processAchievements);
```

## Usage in Components

### Achievements Page Implementation

```astro
---
import { processAchievements, calculateAchievementStats } from "@utils/achievements/categorization";

// Process achievements for display
const sortedCategories = processAchievements(achievements);
const stats = calculateAchievementStats(achievements);
---

<!-- Display statistics -->
<div class="achievements__summary-stats">
  <span>Total: {stats.total}</span>
  <span>Unlocked: {stats.unlocked}</span>
  <span>Progress: {stats.progress}%</span>
</div>

<!-- Display categorized achievements -->
{
  sortedCategories.map(([categoryId, categoryAchievements]) => (
    <section data-category-id={categoryId}>
      <h3>{getCategoryTitle(categoryId)}</h3>
      {categoryAchievements.map((achievement) => (
        <AchievementCard achievement={achievement} />
      ))}
    </section>
  ))
}
```

### Filter Component Integration

```typescript
// Filter achievements while maintaining categorization
const filteredAchievements = achievements.filter(
  (achievement) => achievement.status === selectedStatus
);

const categorized = processAchievements(filteredAchievements);
```

## Type Safety

### Input Validation

```typescript
function validateAchievements(achievements: unknown): LocalizedAchievement[] {
  if (!Array.isArray(achievements)) {
    throw new Error("Expected array of achievements");
  }

  return achievements.filter(
    (item): item is LocalizedAchievement =>
      typeof item === "object" &&
      item !== null &&
      "id" in item &&
      "categoryId" in item &&
      "status" in item
  );
}
```

### Error Handling

```typescript
import { categorizeAchievements } from "@utils/achievements/categorization";

try {
  const validAchievements = validateAchievements(rawData);
  const categorized = categorizeAchievements(validAchievements);
  return categorized;
} catch (error) {
  console.error("Achievement categorization failed:", error);
  return {};
}
```

## Testing

### Unit Tests

```typescript
import { describe, it, expect } from "vitest";
import { categorizeAchievements, calculateAchievementStats } from "./categorization";

describe("Achievement Categorization", () => {
  it("should categorize achievements correctly", () => {
    const achievements = [
      { id: "1", categoryId: "bronze", status: "unlocked" },
      { id: "2", categoryId: "silver", status: "locked" },
    ];

    const result = categorizeAchievements(achievements);

    expect(result.bronze).toHaveLength(1);
    expect(result.silver).toHaveLength(1);
  });

  it("should calculate stats correctly", () => {
    const achievements = [
      { status: "unlocked" },
      { status: "unlocked" },
      { status: "locked" },
      { status: "in-progress" },
    ];

    const stats = calculateAchievementStats(achievements);

    expect(stats.total).toBe(4);
    expect(stats.unlocked).toBe(2);
    expect(stats.progress).toBe(50);
  });
});
```

## Related Documentation

- **[Achievements Page](../pages/AchievementsPage.md)** - Main page implementation
- **[Achievement Types](../types/Achievements.md)** - TypeScript interfaces
- **[Achievement Filter Component](../components/AchievementFilter.md)** - Filtering functionality
- **[Achievement Service](../services/AchievementService.md)** - Data fetching service

## Changelog

- **v2.1.0** - Added `calculateAchievementStats()` function for summary display
- **v2.0.0** - Performance optimizations with single-pass categorization
- **v1.5.0** - Added `processAchievements()` pipeline function
- **v1.0.0** - Initial implementation with basic categorization

---

**Last Updated**: May 29, 2025  
**Module Version**: 2.1.0  
**Language**: English (as per project documentation standards)
