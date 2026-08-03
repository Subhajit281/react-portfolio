---
title: Load Balancing Algorithms Explained
slug: load-balancing-algorithms-explained
description: A tour of the most common load balancing algorithms and when each one is the right fit for your system.
author: Subhajit Sarkar
date: 2026-02-10
category: System Design
tags: [System Design, Load Balancing, Scalability]
coverImage: /blog-covers/load-balancing-algorithms-explained.jpg
keywords: [load balancing, round robin, least connections, consistent hashing]
featured: false
---

# Introduction

A load balancer's job sounds simple — spread traffic across servers — but the algorithm it uses has real consequences for latency, fairness, and cache efficiency. Here's a practical tour of the main strategies.

## What You'll Learn

- Round robin and its weighted variant
- Least connections
- Consistent hashing
- When to use each

## Main Content

### Round Robin

Requests are distributed to servers in sequential order, cycling back to the start.

```
Request 1 → Server A
Request 2 → Server B
Request 3 → Server C
Request 4 → Server A
```

Simple and effective when all servers have equal capacity and requests are roughly uniform in cost. It breaks down when servers have different capacities or requests vary wildly in processing time.

### Weighted Round Robin

Assigns more traffic to higher-capacity servers by giving each a weight.

```
Server A (weight 3): gets 3 requests per cycle
Server B (weight 1): gets 1 request per cycle
```

Useful during gradual rollouts (e.g., a new server gets a lower weight until it's proven stable) or when servers have genuinely different hardware specs.

### Least Connections

Routes each new request to the server currently handling the fewest active connections.

```python
def pick_server(servers):
    return min(servers, key=lambda s: s.active_connections)
```

Better than round robin when request processing time varies significantly — a server stuck on a slow request won't keep getting piled on.

### Consistent Hashing

Used when you need the *same* client (or key) to consistently route to the *same* server — critical for caching layers and stateful services.

```python
import hashlib

def get_server(key, servers):
    ring_position = int(hashlib.md5(key.encode()).hexdigest(), 16) % ring_size
    return find_closest_server_on_ring(ring_position, servers)
```

The key property: when a server is added or removed, only a small fraction of keys need to be remapped, unlike simple `hash(key) % num_servers`, which remaps almost everything.

### Layer 4 vs Layer 7

Layer 4 (transport) load balancers route based on IP/port without inspecting content — fast but blind to application context. Layer 7 (application) load balancers can route based on URL path, headers, or cookies — slower but far more flexible (e.g., routing `/api/*` to one service and `/static/*` to another).

## Best Practices

- Use round robin as a sane default for stateless, uniform-cost services
- Use least connections when request duration varies significantly
- Use consistent hashing for caching layers and sticky sessions
- Combine health checks with any algorithm — never route to a server that's failing

## Conclusion

There's no universally "best" algorithm — round robin is simple, least connections adapts to load, and consistent hashing solves the stickiness problem. Match the algorithm to your traffic pattern, not the other way around.
