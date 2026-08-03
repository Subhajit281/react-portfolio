---
title: Caching Strategies with Redis
slug: caching-strategies-with-redis
description: Learn the core caching patterns used with Redis, including cache-aside, write-through, and cache invalidation.
author: Subhajit Sarkar
date: 2026-01-29
category: Backend
tags: [Redis, Caching, Backend Performance]
coverImage: /blog-covers/caching-strategies-with-redis.jpg
keywords: [redis caching, cache aside, write-through cache, cache invalidation]
featured: false
---

# Introduction

Caching is often the single highest-leverage performance change you can make to a backend — but done carelessly, it introduces stale data bugs that are far harder to debug than a slow query ever was. Redis is the go-to tool, but the strategy matters more than the tool.

## What You'll Learn

- Cache-aside vs write-through patterns
- TTL and invalidation strategies
- Avoiding cache stampedes

## Main Content

### Cache-Aside (Lazy Loading)

The application checks the cache first; on a miss, it reads from the database and populates the cache. This is the most common pattern.

```js
async function getUser(id) {
  const cached = await redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached);

  const user = await db.user.findUnique({ where: { id } });
  await redis.set(`user:${id}`, JSON.stringify(user), "EX", 3600);
  return user;
}
```

### Write-Through

The cache is updated at the same time as the database, so reads are always fresh at the cost of slightly slower writes.

```js
async function updateUser(id, data) {
  const user = await db.user.update({ where: { id }, data });
  await redis.set(`user:${id}`, JSON.stringify(user), "EX", 3600);
  return user;
}
```

### Cache Invalidation

The classic hard problem. On any mutation, explicitly delete the relevant keys rather than trying to update them in place for complex objects:

```js
async function deleteUser(id) {
  await db.user.delete({ where: { id } });
  await redis.del(`user:${id}`);
}
```

### Avoiding Cache Stampedes

When a popular key expires, many concurrent requests can hit the database simultaneously. A lock or "probabilistic early expiration" prevents this:

```js
async function getUserSafe(id) {
  const lockKey = `lock:user:${id}`;
  const cached = await redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached);

  const gotLock = await redis.set(lockKey, "1", "NX", "EX", 5);
  if (!gotLock) {
    await sleep(50);
    return getUserSafe(id); // retry shortly
  }

  const user = await db.user.findUnique({ where: { id } });
  await redis.set(`user:${id}`, JSON.stringify(user), "EX", 3600);
  await redis.del(lockKey);
  return user;
}
```

## Best Practices

- Set a TTL on every cached key — never cache indefinitely by default
- Use cache-aside for read-heavy, infrequently-updated data
- Explicitly invalidate on writes rather than relying on TTL alone for correctness-sensitive data
- Namespace your keys clearly (`user:42`, `order:117`) to make invalidation predictable

## Conclusion

Redis makes caching easy to implement but easy to get subtly wrong. Choose a pattern deliberately, always set expiration, and treat invalidation as a first-class part of your write path, not an afterthought.
