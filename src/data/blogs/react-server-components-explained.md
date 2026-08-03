---
title: React Server Components Explained
slug: react-server-components-explained
description: Understand what React Server Components actually are, how they differ from client components, and when to use each.
author: Subhajit Sarkar
date: 2026-01-08
category: Frontend
tags: [React, Server Components, Next.js]
coverImage: /blog-covers/react-server-components-explained.jpg
keywords: [react server components, RSC, next.js, client components]
featured: false
---

# Introduction

React Server Components (RSC) changed how we think about rendering. They're not just "SSR again" — they introduce a genuinely new mental model where components can run exclusively on the server, never shipping their code to the browser at all.

## What You'll Learn

- What Server Components actually are
- The difference between Server and Client Components
- When to use `"use client"`
- Common pitfalls when adopting RSC

## Main Content

### What's Actually New

Traditional SSR renders your whole app on the server, then hydrates it fully on the client — every component's JavaScript still ships to the browser. Server Components go further: their code and dependencies never reach the client bundle at all. Only the rendered output does.

```jsx
// app/posts/page.jsx (Server Component by default)
async function PostsPage() {
  const posts = await db.post.findMany();
  return (
    <ul>
      {posts.map((p) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  );
}

export default PostsPage;
```

Notice there's no `useEffect`, no loading state, no client-side fetch. The component talks directly to the database because it runs only on the server.

### Client Components

Anything interactive — state, event handlers, browser APIs — still needs to be a Client Component, marked explicitly:

```jsx
"use client";

import { useState } from "react";

export default function LikeButton() {
  const [liked, setLiked] = useState(false);
  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? "Liked" : "Like"}
    </button>
  );
}
```

### Composing Them Together

Server Components can render Client Components, but not the reverse. A common pattern is a Server Component fetching data and passing it as props into a Client Component that handles interactivity.

## Best Practices

- Keep data fetching in Server Components; keep interactivity in Client Components
- Push `"use client"` boundaries as deep (leaf-level) as possible to minimize client JS
- Don't pass non-serializable values (functions, class instances) from Server to Client Components
- Use Suspense boundaries around slow Server Components for streaming

## Conclusion

Server Components aren't a replacement for Client Components — they're a new tool that shrinks your JavaScript bundle by keeping data-heavy, non-interactive logic entirely on the server. Understanding the boundary between the two is the key skill for building fast, modern React apps.
