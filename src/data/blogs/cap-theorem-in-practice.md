---
title: CAP Theorem in Practice
slug: cap-theorem-in-practice
description: What the CAP theorem actually means for real distributed systems, beyond the textbook definition.
author: Subhajit Sarkar
date: 2026-02-12
category: System Design
tags: [System Design, Distributed Systems, CAP Theorem]
coverImage: /blog-covers/cap-theorem-in-practice.jpg
keywords: [cap theorem, consistency, availability, partition tolerance]
featured: false
---

# Introduction

CAP theorem gets reduced to "pick two out of three," which is technically correct but practically unhelpful. In real systems, network partitions *will* happen, so the real question isn't which two you pick — it's what your system does during a partition.

## What You'll Learn

- What C, A, and P actually mean
- Why "pick two of three" is a simplification
- Real examples of CP and AP systems

## Main Content

### The Three Properties

- **Consistency**: every read receives the most recent write, or an error
- **Availability**: every request receives a response (not necessarily the latest data)
- **Partition Tolerance**: the system keeps operating despite network failures between nodes

### Why It's Really "P is Mandatory"

Network partitions are a fact of distributed systems — nodes *will* lose contact with each other eventually. So partition tolerance isn't really a choice; it's a given. The real tradeoff during a partition is between consistency and availability.

```
During a network partition between Node A and Node B:

Option 1 (CP): Reject writes/reads on the minority side
              until the partition heals → consistent, but unavailable
              on that side.

Option 2 (AP): Keep serving reads/writes on both sides,
              reconcile later → available, but temporarily
              inconsistent.
```

### CP Systems in Practice

Systems like **etcd**, **ZooKeeper**, and traditional relational databases in synchronous replication mode prioritize consistency. If a node can't confirm with a quorum, it refuses the write rather than risk serving stale data.

```
etcd write request → must reach quorum of nodes → 
  if quorum unreachable: request fails (unavailable, but never inconsistent)
```

### AP Systems in Practice

Systems like **Cassandra** and **DynamoDB** (in their default configurations) prioritize availability. They'll accept writes on any reachable node and reconcile conflicts later using techniques like last-write-wins or vector clocks.

```
Cassandra write with QUORUM=ONE →
  accepted immediately on one node → replicated asynchronously →
  temporarily inconsistent, but always available
```

### It's a Spectrum, Not a Binary

Most real systems let you tune this per-operation. Cassandra's tunable consistency lets you choose `ONE`, `QUORUM`, or `ALL` per query — trading consistency for availability on a request-by-request basis rather than system-wide.

## Best Practices

- Design for "what happens during a partition," not just "which two letters do I pick"
- Use CP systems for things like leader election, config, and financial transactions
- Use AP systems for things like activity feeds, product catalogs, and analytics where staleness is tolerable
- Look for tunable consistency systems when your workload has mixed requirements

## Conclusion

CAP theorem isn't a menu you pick once — it's a lens for reasoning about tradeoffs your system already makes during network failures. The real design work is deciding, per use case, whether staleness or unavailability is the lesser evil.
