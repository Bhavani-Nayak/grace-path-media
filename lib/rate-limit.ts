/**
 * Simple in-memory rate limiter using sliding window.
 * For production, use Redis or a proper rate-limiting service.
 */

const windowMs = 60 * 1000; // 1 minute window
const maxRequests = 10; // max requests per window

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

export function checkRateLimit(key: string): {
  allowed: boolean;
  remaining: number;
} {
  const now = Date.now();
  const entry = store.get(key) ?? { timestamps: [] };

  // Remove expired timestamps
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= maxRequests) {
    store.set(key, entry);
    return { allowed: false, remaining: 0 };
  }

  entry.timestamps.push(now);
  store.set(key, entry);

  return {
    allowed: true,
    remaining: maxRequests - entry.timestamps.length,
  };
}

/**
 * Get a rate-limit key from a request.
 * Uses x-forwarded-for header or falls back to a generic key.
 */
export function getRateLimitKey(request: Request, prefix: string): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  return `${prefix}:${ip}`;
}
