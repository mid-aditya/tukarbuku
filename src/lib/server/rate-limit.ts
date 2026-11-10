/**
 * Simple in-memory fixed-window rate limiter.
 *
 * Good enough for the single-node adapter-node deployment; swap the Map for a
 * shared store (e.g. Redis) if the app ever runs multiple instances.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export type RateLimitResult = { ok: boolean; remaining: number; resetInSec: number };

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
	const now = Date.now();
	const bucket = buckets.get(key);

	if (!bucket || bucket.resetAt <= now) {
		buckets.set(key, { count: 1, resetAt: now + windowMs });
		if (buckets.size > 10_000) prune(now);
		return { ok: true, remaining: limit - 1, resetInSec: 0 };
	}

	if (bucket.count >= limit) {
		return {
			ok: false,
			remaining: 0,
			resetInSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))
		};
	}

	bucket.count += 1;
	return { ok: true, remaining: limit - bucket.count, resetInSec: 0 };
}

function prune(now: number) {
	for (const [key, bucket] of buckets) {
		if (bucket.resetAt <= now) buckets.delete(key);
	}
}
