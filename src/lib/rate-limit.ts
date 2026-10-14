type RateLimitEntry = { count: number; resetAt: number };

const store = new Map<string, RateLimitEntry>();
const MAX_RATE_LIMIT_KEYS = 10_000;

function pruneStore(now: number) {
  if (store.size < MAX_RATE_LIMIT_KEYS) return;
  for (const [key, value] of store) {
    if (now > value.resetAt) store.delete(key);
  }
  while (store.size >= MAX_RATE_LIMIT_KEYS) {
    const oldestKey = store.keys().next().value as string | undefined;
    if (!oldestKey) break;
    store.delete(oldestKey);
  }
}

export function rateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    pruneStore(now);
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= maxAttempts) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  return { allowed: true };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
