---
title: "System Design: Designing a Rate Limiter"
slug: designing-a-rate-limiter
description: A system design interview walkthrough for building a distributed rate limiter that scales across multiple servers.
author: Subhajit Sarkar
date: 2026-02-15
category: System Design
tags: [System Design, Rate Limiting, Distributed Systems]
coverImage: /blog-covers/designing-a-rate-limiter.jpg
keywords: [rate limiter system design, distributed rate limiting, sliding window log]
featured: false
---

# Introduction

"Design a rate limiter" is a classic system design interview question because it touches distributed state, algorithm tradeoffs, and scale all at once. Let's design one that works correctly across many application servers, not just one process.

## What You'll Learn

- Requirements gathering for a rate limiter
- Why a single-process solution doesn't scale
- A distributed design using Redis
- Algorithm tradeoffs (token bucket vs sliding window log)

## Main Content

### Requirements

Limit requests per user/API key to N per time window (e.g., 100/minute). Must work correctly across many app servers behind a load balancer — a per-process in-memory counter would let each server independently allow the full limit, multiplying the effective rate by the server count.

### High-Level Architecture

```
Client → Load Balancer → App Servers (many) → Shared Redis (rate limit state)
```

The key insight: rate limit state must be centralized (or at least synchronized) so all app servers agree on how many requests a client has made, regardless of which server handled each request.

### Algorithm Choice: Sliding Window Log

For precise accuracy, store a timestamp per request in a Redis sorted set, and count entries within the current window.

```js
async function isAllowed(userId, limit = 100, windowMs = 60000) {
  const key = `ratelimit:${userId}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  // Remove requests outside the window
  await redis.zremrangebyscore(key, 0, windowStart);

  const count = await redis.zcard(key);
  if (count >= limit) return false;

  await redis.zadd(key, now, `${now}-${Math.random()}`);
  await redis.expire(key, Math.ceil(windowMs / 1000));
  return true;
}
```

This is accurate but stores one entry per request — expensive at very high scale. For most production systems, the token bucket approach (see the rate limiting strategies article) trades a little precision for much lower memory use.

### Handling Redis as a Single Point of Failure

A single Redis instance becomes both a bottleneck and a SPOF at scale. Solutions: Redis Cluster for horizontal sharding by user ID, or accepting eventual consistency by using local caches with periodic sync for a "soft" limit, backed by a stricter centralized check for hard limits.

### Where to Enforce It

Two options: at the API gateway (before requests even reach app servers, saving compute) or within each service. Most production systems enforce broad, cheap limits at the gateway and finer, endpoint-specific limits within services.

## Best Practices

- Centralize rate limit state — never rely on per-server in-memory counters in a multi-server deployment
- Choose sliding window log for accuracy-critical limits, token bucket for high-throughput, burst-tolerant limits
- Enforce coarse limits at the gateway layer to protect backend services from ever seeing abusive traffic
- Always return `429` with a `Retry-After` header so well-behaved clients back off correctly

## Conclusion

The interesting part of this design problem isn't the algorithm — it's making the algorithm work correctly when state has to be shared across many servers. Centralized, fast, and slightly imprecise (token bucket) usually beats perfectly precise but expensive (sliding window log) in production.
