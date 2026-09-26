type RateBucket = { count: number; resetAt: number };
type RateLimitOptions = { namespace: string; maxRequests: number; windowMs: number };
type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

const globalForRateLimit = globalThis as typeof globalThis & {
  thinkZoneRequestBuckets?: Map<string, RateBucket>;
};
const buckets = globalForRateLimit.thinkZoneRequestBuckets ??= new Map();
const MAX_BUCKETS = 10_000;

/** Best-effort per-process rate limiting for deployments without a shared cache. */
export function checkRequestRateLimit(request: Request, options: RateLimitOptions): RateLimitResult {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwarded || request.headers.get("x-real-ip") || "unknown";
  const key = `${options.namespace}:${address}`;
  const now = Date.now();

  for (const [bucketKey, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(bucketKey);
  }

  const bucket = buckets.get(key);
  if (bucket && bucket.count >= options.maxRequests && bucket.resetAt > now) {
    return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size >= MAX_BUCKETS) buckets.delete(buckets.keys().next().value!);
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
  } else {
    buckets.set(key, { ...bucket, count: bucket.count + 1 });
  }

  return { allowed: true };
}
