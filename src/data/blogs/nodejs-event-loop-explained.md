---
title: The Node.js Event Loop Explained
slug: nodejs-event-loop-explained
description: A clear mental model of how the Node.js event loop actually processes callbacks, promises, and timers.
author: Subhajit Sarkar
date: 2026-02-05
category: Backend
tags: [Node.js, Event Loop, JavaScript]
coverImage: /blog-covers/nodejs-event-loop-explained.jpg
keywords: [node event loop, microtasks, macrotasks, javascript concurrency]
featured: false
---

# Introduction

"Node.js is single-threaded" is technically true and also misleading — it's what lets Node handle thousands of concurrent connections without spinning up a thread per request. Understanding the event loop is what separates developers who guess at async bugs from those who can reason about them.

## What You'll Learn

- The phases of the event loop
- Microtasks vs macrotasks
- Why `setTimeout(fn, 0)` doesn't run immediately

## Main Content

### The Single Thread, Many Callbacks Model

JavaScript executes on one thread, but I/O operations (file reads, network requests, timers) are handed off to the system (via libuv in Node's case) and their callbacks are queued to run later, without blocking the main thread.

```js
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");

// Output: 1, 4, 3, 2
```

### Microtasks vs Macrotasks

Promises (`.then`, `async/await`) go into the **microtask queue**, which is fully drained after every synchronous block, before the event loop moves to the next phase. `setTimeout`, `setInterval`, and I/O callbacks go into **macrotask** queues, processed in specific phases.

```js
setTimeout(() => console.log("timeout"), 0);
Promise.resolve().then(() => console.log("promise 1"));
Promise.resolve().then(() => console.log("promise 2"));

// Output: promise 1, promise 2, timeout
// All microtasks run before the next macrotask, regardless of order
```

### The Event Loop Phases

Node's event loop cycles through phases each tick: timers → pending callbacks → poll (I/O) → check (`setImmediate`) → close callbacks. Microtasks run between every single phase transition, not just once per loop.

```js
setImmediate(() => console.log("immediate"));
setTimeout(() => console.log("timeout"), 0);
```

The order between these two is not guaranteed when called from the main module — it depends on system timing — but inside an I/O callback, `setImmediate` always fires before `setTimeout(fn, 0)`.

### Why This Matters for Blocking Code

```js
// BAD: blocks the event loop for everyone
function heavySync() {
  let sum = 0;
  for (let i = 0; i < 10_000_000_000; i++) sum += i;
  return sum;
}
```

Any synchronous CPU-heavy work blocks the single thread entirely — no other request can be processed until it finishes. This is why CPU-bound work belongs in worker threads or a separate service, not the main event loop.

## Best Practices

- Never run long synchronous loops on the main thread in a server context
- Understand that all pending microtasks always run before the next macrotask
- Use worker threads (`worker_threads` module) for CPU-intensive tasks
- Don't assume `setTimeout(fn, 0)` means "immediately" — it means "as soon as possible after the current phase"

## Conclusion

The event loop is what makes Node.js fast for I/O-bound work and dangerous for CPU-bound work. Once you can predict execution order between promises and timers, a huge class of "why did this run in the wrong order" bugs disappears.
