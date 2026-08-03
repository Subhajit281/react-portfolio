---
title: Database Sharding Strategies
slug: database-sharding-strategies
description: How to split a database horizontally across multiple machines, and the tradeoffs of each sharding strategy.
author: Subhajit Sarkar
date: 2026-02-18
category: System Design
tags: [System Design, Database, Sharding, Scalability]
coverImage: /blog-covers/database-sharding-strategies.jpg
keywords: [database sharding, horizontal partitioning, shard key, resharding]
featured: false
---

# Introduction

When a single database instance can no longer handle your write throughput or data volume, vertical scaling (bigger machine) hits a ceiling. Sharding — splitting data horizontally across multiple database instances — is how systems scale past that ceiling, at the cost of significant new complexity.

## What You'll Learn

- The difference between sharding and simple replication
- Common sharding strategies and their tradeoffs
- The resharding problem

## Main Content

### Sharding vs Replication

Replication copies the *same* data across multiple machines for redundancy and read scaling. Sharding splits *different* data across machines — each shard holds a subset of the total dataset. Most large systems use both together.

### Range-Based Sharding

Data is split by ranges of the shard key (e.g., user IDs 1-1,000,000 on shard A, 1,000,001-2,000,000 on shard B).

```
Shard A: user_id 1 - 1,000,000
Shard B: user_id 1,000,001 - 2,000,000
Shard C: user_id 2,000,001 - 3,000,000
```

Easy to implement and great for range queries, but prone to hotspots — if new users always get sequential IDs, all new traffic hits the newest shard.

### Hash-Based Sharding

The shard key is hashed, and the hash determines which shard a row belongs to.

```python
def get_shard(user_id, num_shards):
    return hash(user_id) % num_shards
```

Distributes load evenly, avoiding hotspots, but makes range queries ("all users created this week") expensive since matching rows are scattered across every shard.

### Directory-Based Sharding

A lookup service maps each key to its shard explicitly, stored in a separate mapping table or service.

```
Lookup Table:
user_id 42   → shard_3
user_id 917  → shard_1
```

Most flexible — you can rebalance individual keys without a rehashing algorithm — but the lookup service itself becomes a critical dependency and potential bottleneck.

### The Resharding Problem

Adding shards later is the hardest part. With naive `hash(key) % N`, adding one shard changes almost every key's target shard, requiring a massive data migration. Consistent hashing (see the load balancing article) minimizes this by only remapping a fraction of keys when a shard is added or removed.

### Cross-Shard Queries

Joins and transactions across shards are expensive or impossible in the general case. Good sharding key selection (e.g., sharding by `tenant_id` in a multi-tenant SaaS app) keeps most queries within a single shard.

## Best Practices

- Choose a shard key that keeps related data together (e.g., shard by `user_id` so a user's orders live on the same shard as the user)
- Prefer hash-based sharding to avoid hotspots unless range queries are a primary access pattern
- Plan for resharding from day one — retrofitting consistent hashing after launch is painful
- Avoid cross-shard transactions in your data model wherever possible

## Conclusion

Sharding solves a real scaling problem but introduces real complexity — application code has to know (or be told) which shard to query, and cross-shard operations lose the guarantees a single database gives you for free. Shard only once replication and vertical scaling are genuinely exhausted.
