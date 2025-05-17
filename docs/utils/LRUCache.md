# LRUCache Utility

## Overview

The `LRUCache` is a high-performance, generic caching utility that implements the Least Recently
Used (LRU) caching algorithm. This cache has a fixed maximum size and automatically evicts the least
recently accessed items when the size limit is reached, making it ideal for memory-constrained
environments or when caching expensive computations and network responses.

![LRU Cache Diagram](../assets/lru-cache-diagram.png)

## Features

- **Generic Implementation**: Works with any key and value types
- **O(1) Operations**: Constant time complexity for get, set, and has operations
- **Memory Bounded**: Configurable maximum size with automatic eviction
- **Type Safe**: Full TypeScript support with generic type parameters
- **Method Chaining**: Supports fluent API pattern for method calls
- **Zero Dependencies**: Implemented using native JavaScript Map

## Type Definition

```typescript
/**
 * LRU (Least Recently Used) Cache implementation
 */
class LRUCache<K, V> {
  constructor(maxSize: number);

  // Core operations
  get(key: K): V | undefined;
  set(key: K, value: V): this;
  has(key: K): boolean;
  delete(key: K): boolean;
  clear(): this;

  // Utility properties
  get size(): number;
  get maxCapacity(): number;
}
```

## Usage Examples

### Basic Usage

```typescript
// Create a cache with maximum 50 items
const cache = new LRUCache<string, number>(50);

// Add items to the cache
cache.set("item1", 100);
cache.set("item2", 200);

// Retrieve an item (also marks it as recently used)
const value = cache.get("item1"); // 100

// Check if an item exists without affecting its "recently used" status
const exists = cache.has("item2"); // true

// Remove an item
cache.delete("item1");

// Clear the entire cache
cache.clear();
```

### Caching API Responses

```typescript
// Create a response cache
const responseCache = new LRUCache<string, Response>(100);

// Function that uses the cache
async function fetchWithCache(url: string): Promise<Response> {
  // Check if response is in cache
  const cachedResponse = responseCache.get(url);

  if (cachedResponse) {
    console.log(`Cache hit for ${url}`);
    return cachedResponse.clone(); // Clone to avoid consuming the response
  }

  // Not in cache, make the actual request
  console.log(`Cache miss for ${url}`);
  const response = await fetch(url);

  // Only cache successful responses
  if (response.ok) {
    responseCache.set(url, response.clone());
  }

  return response;
}
```

### Caching with Complex Keys

```typescript
// Define a query parameters type
interface QueryParams {
  endpoint: string;
  filters: Record<string, string>;
  page?: number;
  limit?: number;
}

// Create a cache for query results
const queryCache = new LRUCache<string, object>(50);

// Helper function to generate stable cache keys from complex objects
function createCacheKey(params: QueryParams): string {
  const { endpoint, filters, page = 1, limit = 20 } = params;

  // Create a sorted, stable representation of filters
  const sortedFilters = Object.entries(filters)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `${endpoint}?${sortedFilters}&page=${page}&limit=${limit}`;
}

// Usage
const params: QueryParams = {
  endpoint: "users",
  filters: { role: "admin", status: "active" },
  page: 2,
};

const cacheKey = createCacheKey(params);
const cachedData = queryCache.get(cacheKey);
```

## Implementation Notes

The `LRUCache` is built on JavaScript's `Map` object, which preserves insertion order of keys. This
property is leveraged to implement the LRU algorithm:

1. When a new item is added, it's placed at the end of the Map (most recently used)
2. When an existing item is accessed, it's removed and re-added to move it to the end
3. When the cache is full and a new item is added, the first item (least recently used) is removed

This approach is more efficient than traditional linked list implementations while maintaining O(1)
complexity for all operations.

## Performance Considerations

- **Serialization**: When using object keys, ensure proper serialization for consistent cache lookup
- **Memory Usage**: Monitor cache size for large value objects that may consume significant memory
- **Clone Objects**: Consider cloning mutable objects when caching to prevent unexpected
  modifications
- **Cache Invalidation**: Implement appropriate cache invalidation strategies for time-sensitive
  data

## Accessibility Considerations

The LRUCache utility doesn't directly impact accessibility as it's a non-UI utility. However, when
used to cache UI components or user preferences:

- Ensure cached content maintains proper accessibility attributes
- Don't cache personalized accessibility settings that may vary between users
- Consider cache lifetime for dynamic content that may include accessibility enhancements

## Security Considerations

- Don't cache sensitive user data (passwords, tokens, personal information)
- Implement cache partitioning if multiple users share the same session
- Consider encryption for cached data containing semi-sensitive information
- Clear cache appropriately during logout or session expiration

## Related Utilities

- [JsonResponseCache](./JsonResponseCache.md) - Specialized response caching for API endpoints
- [ApiClient](./ApiClient.md) - HTTP client with built-in caching capabilities
- [MemoryStorage](./MemoryStorage.md) - Generic in-memory storage with various eviction policies

## Changelog

- **v3.2.0** - Added `delete` method and size-related properties
- **v3.1.0** - Initial implementation with core LRU functionality
- **v3.0.0** - Planning and interface design

## Contributing

When enhancing the LRUCache implementation:

1. Maintain O(1) complexity for all public methods
2. Ensure proper TypeScript typing for generic parameters
3. Add comprehensive JSDoc comments for new methods
4. Update this documentation for significant changes
5. Add tests for new functionality
