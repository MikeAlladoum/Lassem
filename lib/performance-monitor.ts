/**
 * Performance Monitoring System
 * Tracks metrics and performance indicators
 */

interface PerformanceMetric {
  name: string;
  duration: number; // milliseconds
  timestamp: string;
  tags?: Record<string, string>;
}

interface EndpointMetrics {
  endpoint: string;
  method: string;
  totalRequests: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  errorCount: number;
  lastUpdated: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private endpointStats: Map<string, EndpointMetrics> = new Map();
  private maxMetrics: number = 10000;

  /**
   * Record a performance metric
   */
  recordMetric(metric: Omit<PerformanceMetric, 'timestamp'>): void {
    const fullMetric: PerformanceMetric = {
      ...metric,
      timestamp: new Date().toISOString(),
    };

    this.metrics.push(fullMetric);

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Update endpoint stats
    this.updateEndpointStats(metric.name, metric.duration);
  }

  /**
   * Update endpoint statistics
   */
  private updateEndpointStats(endpoint: string, duration: number): void {
    const [method, path] = endpoint.split(' ');
    const key = endpoint;

    if (!this.endpointStats.has(key)) {
      this.endpointStats.set(key, {
        endpoint: path || endpoint,
        method: method || 'UNKNOWN',
        totalRequests: 0,
        averageResponseTime: 0,
        minResponseTime: duration,
        maxResponseTime: duration,
        errorCount: 0,
        lastUpdated: new Date().toISOString(),
      });
    }

    const stats = this.endpointStats.get(key)!;
    const totalTime = stats.averageResponseTime * stats.totalRequests + duration;
    stats.totalRequests += 1;
    stats.averageResponseTime = totalTime / stats.totalRequests;
    stats.minResponseTime = Math.min(stats.minResponseTime, duration);
    stats.maxResponseTime = Math.max(stats.maxResponseTime, duration);
    stats.lastUpdated = new Date().toISOString();
  }

  /**
   * Get endpoint metrics
   */
  getEndpointMetrics(endpoint?: string): EndpointMetrics | EndpointMetrics[] | null {
    if (endpoint) {
      return this.endpointStats.get(endpoint) || null;
    }
    return Array.from(this.endpointStats.values());
  }

  /**
   * Get metrics by tag
   */
  getMetricsByTag(tagKey: string, tagValue: string): PerformanceMetric[] {
    return this.metrics.filter((m) => m.tags?.[tagKey] === tagValue);
  }

  /**
   * Get recent metrics
   */
  getRecentMetrics(limit: number = 100): PerformanceMetric[] {
    return this.metrics.slice(-limit);
  }

  /**
   * Get slow queries (above threshold)
   */
  getSlowQueries(thresholdMs: number = 1000, limit: number = 100): PerformanceMetric[] {
    return this.metrics.filter((m) => m.duration > thresholdMs).slice(-limit);
  }

  /**
   * Get average response time for endpoint
   */
  getAverageResponseTime(endpoint: string): number {
    const stats = this.endpointStats.get(endpoint);
    return stats?.averageResponseTime || 0;
  }

  /**
   * Get performance report
   */
  getReport() {
    const endpoints = Array.from(this.endpointStats.values());
    const avgResponseTime =
      endpoints.reduce((sum, e) => sum + e.averageResponseTime, 0) / endpoints.length || 0;
    const totalRequests = endpoints.reduce((sum, e) => sum + e.totalRequests, 0);
    const totalErrors = endpoints.reduce((sum, e) => sum + e.errorCount, 0);

    return {
      summary: {
        totalEndpoints: endpoints.length,
        totalRequests,
        totalErrors,
        averageResponseTime: Math.round(avgResponseTime),
        p95ResponseTime: this.getPercentile(95),
        p99ResponseTime: this.getPercentile(99),
        generatedAt: new Date().toISOString(),
      },
      endpoints: endpoints.sort((a, b) => b.averageResponseTime - a.averageResponseTime),
      slowestEndpoints: endpoints
        .sort((a, b) => b.maxResponseTime - a.maxResponseTime)
        .slice(0, 10),
    };
  }

  /**
   * Calculate percentile response time
   */
  private getPercentile(percentile: number): number {
    if (this.metrics.length === 0) return 0;

    const sorted = [...this.metrics].sort((a, b) => a.duration - b.duration);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index]?.duration || 0;
  }

  /**
   * Clear metrics
   */
  clear(): void {
    this.metrics = [];
    this.endpointStats.clear();
  }

  /**
   * Get stats
   */
  getStats() {
    return {
      totalMetrics: this.metrics.length,
      totalEndpoints: this.endpointStats.size,
      memoryUsage: this.estimateMemoryUsage(),
    };
  }

  /**
   * Estimate memory usage
   */
  private estimateMemoryUsage(): string {
    const metricsSize = this.metrics.length * 200; // Rough estimate per metric
    const endpointSize = this.endpointStats.size * 500; // Rough estimate per endpoint
    const totalBytes = metricsSize + endpointSize;

    if (totalBytes > 1024 * 1024) {
      return `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    if (totalBytes > 1024) {
      return `${(totalBytes / 1024).toFixed(2)} KB`;
    }
    return `${totalBytes} B`;
  }
}

/**
 * Measure async function execution time
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>,
  monitor?: PerformanceMonitor,
  tags?: Record<string, string>
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    if (monitor) {
      monitor.recordMetric({ name, duration, tags });
    }
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    if (monitor) {
      monitor.recordMetric({ name: `${name} (error)`, duration, tags });
    }
    throw error;
  }
}

/**
 * Measure sync function execution time
 */
export function measureSync<T>(
  name: string,
  fn: () => T,
  monitor?: PerformanceMonitor,
  tags?: Record<string, string>
): T {
  const start = performance.now();
  try {
    const result = fn();
    const duration = performance.now() - start;
    if (monitor) {
      monitor.recordMetric({ name, duration, tags });
    }
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    if (monitor) {
      monitor.recordMetric({ name: `${name} (error)`, duration, tags });
    }
    throw error;
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

export default PerformanceMonitor;
