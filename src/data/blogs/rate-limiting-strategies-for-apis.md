---
title: Rate Limiting Strategies for APIs
slug: rate-limiting-strategies-for-apis
description: A comparison of the most common rate limiting algorithms, with implementation examples for protecting your API.
author: Subhajit Sarkar
date: 2026-01-27
category: Backend
tags: [API, Rate Limiting, Backend]
coverImage: /blog-covers/rate-limiting-strategies-for-apis.jpg
keywords: [rate limiting, token bucket, sliding window, api protection]
featured: false
---

# Introduction

Without rate limiting, a single misbehaving client — or a deliberate attacker — can take down your API for everyone. Rate limiting isn't one algorithm; it's a family of tradeoffs between accuracy, memory usage, and burst tolerance.

## What You'll Learn

- Fixed window vs sliding window vs token bucket
- Implementing rate limiting with Redis
- Choosing limits per endpoint

## Main Content

### Fixed Window

Count requests in fixed time buckets (e.g., per minute). Simple but allows bursts at window boundaries — a client could send double the limit right at the edge of two windows.

```js
// Redis-based fixed window
async function isAllowed(userId, limit = 100) {
  const key = `rate:${userId}:${Math.floor(Date.now() / 60000)}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, 60);
  return count <= limit;
}
```

### Sliding Window

Smooths out the boundary problem by weighting the previous window's count.

```js
async function isAllowedSliding(userId, limit = 100) {
  const now = Date.now();
  const currentWindow = Math.floor(now / 60000);
  const elapsed = (now % 60000) / 60000;

  const currCount = await redis.get(`rate:${userId}:${currentWindow}`) || 0;
  const prevCount = await redis.get(`rate:${userId}:${currentWindow - 1}`) || 0;

  const estimated = prevCount * (1 - elapsed) + Number(currCount);
  return estimated <= limit;
}
```

### Token Bucket

Each user has a bucket that refills at a steady rate and drains per request — allows short bursts while enforcing a long-term average rate. This is what most production APIs (Stripe, GitHub) actually use.

```js
async function tokenBucket(userId, capacity = 20, refillRate = 1) {
  const bucketKey = `bucket:${userId}`;
  const now = Date.now();

  const data = await redis.hgetall(bucketKey);
  let tokens = data.tokens ? Number(data.tokens) : capacity;
  const lastRefill = data.lastRefill ? Number(data.lastRefill) : now;

  const elapsedSeconds = (now - lastRefill) / 1000;
  tokens = Math.min(capacity, tokens + elapsedSeconds * refillRate);

  if (tokens < 1) return false;

  await redis.hset(bucketKey, { tokens: tokens - 1, lastRefill: now });
  return true;
}
```

## Best Practices

- Use token bucket for APIs that need to tolerate short bursts
- Return `429 Too Many Requests` with a `Retry-After` header when limiting
- Apply different limits per endpoint — auth routes need tighter limits than read-only ones
- Rate limit by API key or user ID, not just IP, to avoid punishing shared networks

## Conclusion

There's no single "correct" rate limiting algorithm — fixed window is simplest, sliding window is more accurate, and token bucket handles bursts gracefully. Pick based on how strict your traffic shaping needs to be.
