---
title: System Design 101: Building a URL Shortener
slug: system-design-url-shortener
description: A step-by-step walkthrough of designing a URL shortener like Bitly — covering encoding schemes, database design, caching, and scaling.
author: Subhajit Sarkar
date: 2026-02-20
category: System Design
tags: [System Design, Interview Preparation, Backend, Databases]
coverImage: /blog-covers/system-design-url-shortener.jpg
keywords: [system design interview, url shortener design, bitly design, distributed systems]
featured: false
---

# Introduction

The URL shortener is a classic system design interview question because it touches encoding, storage, and scaling in a small, self-contained problem.

> This is placeholder sample content included to demonstrate the blog system. Replace it with your own article.

## What You'll Learn

- Requirements gathering for a system design interview
- Choosing an encoding scheme for short codes
- A simple database schema
- Where caching and rate limiting fit in

## Main Content

### Core Requirements

- Given a long URL, return a short one.
- Given a short URL, redirect to the original.
- Short codes should be unique and hard to guess.

### Encoding Short Codes

```js
// Base62 encoding keeps codes short and URL-safe
const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function encodeBase62(num) {
  let str = "";
  while (num > 0) {
    str = CHARS[num % 62] + str;
    num = Math.floor(num / 62);
  }
  return str || "a";
}
```

### A Minimal Schema

```sql
CREATE TABLE links (
  id BIGSERIAL PRIMARY KEY,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  click_count BIGINT DEFAULT 0
);
```

### Where Caching Fits

Reads (redirects) vastly outnumber writes. A cache like Redis in front of the database, keyed by `short_code`, absorbs most read traffic and keeps redirect latency low.

## Best Practices

- Generate short codes from a counter/ID rather than random strings to avoid collisions.
- Cache aggressively on the read path — redirects should be fast.
- Rate-limit link creation to prevent abuse.
- Consider soft-deletes and expiry for link lifecycle management.

## Conclusion

A URL shortener looks simple on the surface, but it's a great vehicle for demonstrating encoding choices, schema design, and caching strategy in an interview setting.
