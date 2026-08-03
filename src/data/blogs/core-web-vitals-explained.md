---
title: "Core Web Vitals Explained: LCP, INP, and CLS"
slug: core-web-vitals-explained
description: A clear breakdown of the three Core Web Vitals metrics and concrete techniques to improve each one.
author: Subhajit Sarkar
date: 2026-01-15
category: Frontend
tags: [Performance, Web Vitals, SEO]
coverImage: /blog-covers/core-web-vitals-explained.jpg
keywords: [core web vitals, LCP, INP, CLS, web performance]
featured: false
---

# Introduction

Core Web Vitals are Google's way of quantifying "does this page feel fast and stable to a real user?" They directly affect both user experience and search ranking, which makes them worth understanding beyond just running Lighthouse once.

## What You'll Learn

- What LCP, INP, and CLS actually measure
- Realistic thresholds for "good" scores
- Concrete fixes for each metric

## Main Content

### Largest Contentful Paint (LCP)

LCP measures how long it takes for the largest visible element (usually a hero image or heading) to render. Good is under 2.5 seconds.

```html
<!-- Preload the hero image so the browser fetches it immediately -->
<link rel="preload" as="image" href="/hero.webp" />
<img src="/hero.webp" fetchpriority="high" alt="Hero" />
```

Common fixes: compress and preload above-the-fold images, remove render-blocking CSS/JS, and use a CDN to cut network latency.

### Interaction to Next Paint (INP)

INP measures the delay between a user interaction (click, tap, key press) and the browser visually responding. Good is under 200ms.

```js
// Break up long tasks so the main thread stays responsive
function processLargeList(items) {
  let i = 0;
  function chunk() {
    const end = Math.min(i + 100, items.length);
    for (; i < end; i++) doWork(items[i]);
    if (i < items.length) requestIdleCallback(chunk);
  }
  chunk();
}
```

Common fixes: break up long JavaScript tasks, debounce expensive handlers, and avoid heavy synchronous work on click handlers.

### Cumulative Layout Shift (CLS)

CLS measures unexpected layout movement, like a button jumping down when an ad loads above it. Good is under 0.1.

```css
/* Reserve space before the image loads */
img {
  aspect-ratio: 16 / 9;
  width: 100%;
  height: auto;
}
```

Common fixes: always set width/height (or `aspect-ratio`) on images and embeds, and avoid injecting content above existing content without reserving space.

## Best Practices

- Measure with real user data (CrUX, RUM tools) not just lab tests
- Fix LCP first — it usually has the biggest ranking and perceived-speed impact
- Reserve layout space for anything that loads asynchronously
- Re-test after every fix; these metrics interact with each other

## Conclusion

Core Web Vitals turn "the site feels slow" into measurable, fixable numbers. Treat LCP, INP, and CLS as a checklist during development, not an afterthought before launch.
