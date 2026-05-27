/**
 * Caching Layer
 * Reduces database load by caching frequently accessed data
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
}

class Cache {
  private store: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutes default

  /**
   * Set a value in cache
   */
  set<T>(key: string, value: T, options?: CacheOptions): void {
    const ttl = options?.ttl ?? this.defaultTTL;
    const expiresAt = Date.now() + ttl;

    this.store.set(key, { value, expiresAt });
  }

  /**
   * Get a value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  /**
   * Delete a key from cache
   */
  delete(key: string): boolean {
    return this.store.delete(key);
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    return Array.from(this.store.keys());
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.store.size;
  }

  /**
   * Get stats
   */
  getStats() {
    const totalSize = this.store.size;
    const expiredCount = Array.from(this.store.values()).filter((e) => Date.now() > e.expiresAt).length;

    return {
      totalEntries: totalSize,
      expiredEntries: expiredCount,
      validEntries: totalSize - expiredCount,
    };
  }

  /**
   * Cleanup expired entries
   */
  cleanup(): number {
    let removed = 0;
    const now = Date.now();

    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
        removed++;
      }
    }

    return removed;
  }
}

/**
 * Create cache instances for different data types
 */
export const userCache = new Cache();
export const campaignCache = new Cache();
export const categoryCache = new Cache();

/**
 * Cache key generators for consistency
 */
export const cacheKeys = {
  // User cache keys
  userList: (page: number, limit: number) => `users:list:${page}:${limit}`,
  userById: (id: number) => `user:${id}`,
  userByWallet: (wallet: string) => `user:wallet:${wallet}`,
  userSearch: (search: string, page: number) => `user:search:${search}:${page}`,
  usersByRole: (role: string, page: number) => `users:role:${role}:${page}`,

  // Campaign cache keys
  campaignList: (page: number, limit: number) => `campaigns:list:${page}:${limit}`,
  campaignById: (id: number) => `campaign:${id}`,
  campaignsByStatus: (status: string, page: number) => `campaigns:status:${status}:${page}`,
  campaignSearch: (search: string, page: number) => `campaign:search:${search}:${page}`,
  campaignsByCreator: (creatorId: number, page: number) => `campaigns:creator:${creatorId}:${page}`,

  // Category cache keys
  categories: 'categories:all',
  categoryById: (id: number) => `category:${id}`,
};

/**
 * Cache invalidation helpers
 */
export const cacheInvalidation = {
  // Invalidate user-related caches
  invalidateUserCaches: () => {
    const keys = userCache.keys();
    keys.forEach((key) => {
      if (key.startsWith('user') || key.startsWith('users')) {
        userCache.delete(key);
      }
    });
  },

  // Invalidate campaign-related caches
  invalidateCampaignCaches: () => {
    const keys = campaignCache.keys();
    keys.forEach((key) => {
      if (key.startsWith('campaign')) {
        campaignCache.delete(key);
      }
    });
  },

  // Invalidate category caches
  invalidateCategoryCaches: () => {
    categoryCache.clear();
  },

  // Invalidate all caches
  invalidateAll: () => {
    userCache.clear();
    campaignCache.clear();
    categoryCache.clear();
  },
};

/**
 * Cache middleware for API responses
 */
export async function cacheableQuery<T>(
  key: string,
  cache: Cache,
  queryFn: () => Promise<T>,
  options?: CacheOptions
): Promise<T> {
  // Try to get from cache
  const cached = cache.get<T>(key);
  if (cached) {
    return cached;
  }

  // Execute query
  const result = await queryFn();

  // Store in cache
  cache.set(key, result, options);

  return result;
}

export default Cache;
