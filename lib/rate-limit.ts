/**
 * Rate Limiting Service
 * Prevents abuse by limiting requests per client
 * Uses in-memory store with configurable time windows
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  windowMs: number; // Time window in ms
  maxRequests: number; // Max requests per window
  keyPrefix?: string; // Prefix for storage keys
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      keyPrefix: 'rate-limit:',
      ...config,
    };

    // Cleanup expired entries every minute
    this.startCleanupInterval();
  }

  /**
   * Check if client has exceeded rate limit
   */
  isLimited(identifier: string): boolean {
    const key = `${this.config.keyPrefix}${identifier}`;
    const entry = this.store.get(key);
    const now = Date.now();

    if (!entry || now > entry.resetTime) {
      // Create new entry
      this.store.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      return false;
    }

    if (entry.count >= this.config.maxRequests) {
      return true;
    }

    entry.count++;
    return false;
  }

  /**
   * Get remaining requests for identifier
   */
  getRemaining(identifier: string): number {
    const key = `${this.config.keyPrefix}${identifier}`;
    const entry = this.store.get(key);
    const now = Date.now();

    if (!entry || now > entry.resetTime) {
      return this.config.maxRequests;
    }

    return Math.max(0, this.config.maxRequests - entry.count);
  }

  /**
   * Get reset time for identifier
   */
  getResetTime(identifier: string): number {
    const key = `${this.config.keyPrefix}${identifier}`;
    const entry = this.store.get(key);

    if (!entry) {
      return Date.now() + this.config.windowMs;
    }

    return entry.resetTime;
  }

  /**
   * Reset rate limit for identifier
   */
  reset(identifier: string): void {
    const key = `${this.config.keyPrefix}${identifier}`;
    this.store.delete(key);
  }

  /**
   * Clear all entries
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Get stats
   */
  getStats() {
    return {
      totalEntries: this.store.size,
      windowMs: this.config.windowMs,
      maxRequests: this.config.maxRequests,
    };
  }

  /**
   * Start cleanup interval to remove expired entries
   */
  private startCleanupInterval(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.store.entries()) {
        if (now > entry.resetTime) {
          this.store.delete(key);
        }
      }
    }, 60000); // Cleanup every minute
  }
}

// Create rate limiters for different endpoints
export const adminEndpointLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
  keyPrefix: 'admin:',
});

export const authEndpointLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes
  keyPrefix: 'auth:',
});

export const apiEndpointLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
  keyPrefix: 'api:',
});

/**
 * Extract client identifier from request
 */
export function getClientIdentifier(
  request: Request,
  prefix: string = ''
): string {
  const headers = request.headers;
  const forwardedFor = headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
  const userId = headers.get('x-user-id') || 'anonymous';

  return `${prefix}${ip}:${userId}`;
}

export default RateLimiter;
