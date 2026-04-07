const hits = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_HITS = 20;

export function rateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = hits.get(key);

  if (!record || now > record.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_HITS - 1 };
  }

  record.count++;
  if (record.count > MAX_HITS) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: MAX_HITS - record.count };
}

export function getRateLimitHeaders(key: string): Record<string, string> {
  const record = hits.get(key);
  if (!record) return {};
  return {
    "X-RateLimit-Limit": MAX_HITS.toString(),
    "X-RateLimit-Remaining": Math.max(0, MAX_HITS - record.count).toString(),
    "X-RateLimit-Reset": record.resetAt.toString(),
  };
}
