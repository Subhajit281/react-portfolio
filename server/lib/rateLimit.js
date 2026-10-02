// api/lib/rateLimit.js
// In-memory sliding window rate limiter for abuse prevention

const rateLimits = new Map();
const CLEANUP_INTERVAL_MS = 60 * 1000;

const timer = setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimits.entries()) {
    if (now - record.resetTime > 0) {
      rateLimits.delete(key);
    }
  }
}, CLEANUP_INTERVAL_MS);

if (timer && typeof timer.unref === "function") {
  timer.unref();
}

/**
 * Checks whether an action by a specific key has exceeded the allowed limit within a window.
 * Returns true if allowed, false if rate limited.
 */
export function isAllowed(key, maxRequests = 20, windowMs = 60000) {
  const now = Date.now();
  const record = rateLimits.get(key);

  if (!record || now > record.resetTime) {
    rateLimits.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count += 1;
  return true;
}
