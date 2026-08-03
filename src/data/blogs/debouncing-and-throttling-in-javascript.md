---
title: Debouncing and Throttling in JavaScript
slug: debouncing-and-throttling-in-javascript
description: Learn the difference between debouncing and throttling, with practical implementations and real use cases for each.
author: Subhajit Sarkar
date: 2026-01-20
category: Frontend
tags: [JavaScript, Performance, Events]
coverImage: /blog-covers/debouncing-and-throttling-in-javascript.jpg
keywords: [debounce, throttle, javascript performance, event handling]
featured: false
---

# Introduction

Search boxes that fire an API call on every keystroke, scroll handlers that fire hundreds of times a second — these are classic performance problems with a well-known fix: debouncing and throttling. They sound similar but solve different problems.

## What You'll Learn

- The difference between debounce and throttle
- How to implement both from scratch
- When to use each one

## Main Content

### Debounce: Wait for a Pause

Debouncing delays execution until a certain amount of time has passed *without* the event firing again. Ideal for search-as-you-type or resize handlers where you only care about the final state.

```js
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const search = debounce((query) => fetchResults(query), 300);
input.addEventListener("input", (e) => search(e.target.value));
```

Every keystroke resets the timer — the API call only fires 300ms after the user stops typing.

### Throttle: Limit the Rate

Throttling ensures a function runs at most once every N milliseconds, regardless of how often the event fires. Ideal for scroll or mouse-move handlers where you need periodic updates, not just the final one.

```js
function throttle(fn, limit) {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

const onScroll = throttle(() => updateScrollProgress(), 100);
window.addEventListener("scroll", onScroll);
```

### Choosing Between Them

- **Debounce**: search input, form validation, window resize final state
- **Throttle**: scroll position tracking, infinite scroll triggers, drag events, mouse-move-based UI

## Best Practices

- Use a well-tested library (like lodash's `debounce`/`throttle`) in production instead of hand-rolling unless bundle size is critical
- Always clean up timers in `useEffect` cleanup functions in React
- Pick a delay based on user perception — 200-300ms feels responsive for debounce, 100ms is common for throttled scroll handlers
- Don't debounce things that need immediate feedback, like button clicks

## Conclusion

Debounce waits for silence; throttle enforces a steady pace. Both exist to protect your app from firing expensive work too often — the trick is matching the right one to the right event.
