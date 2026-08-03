---
title: TypeScript Generics for React Developers
slug: typescript-generics-for-react
description: A practical introduction to generics in TypeScript, focused on real patterns you'll use in React components and hooks.
author: Subhajit Sarkar
date: 2026-01-18
category: Frontend
tags: [TypeScript, React, Generics]
coverImage: /blog-covers/typescript-generics-for-react.jpg
keywords: [typescript generics, react typescript, generic components, generic hooks]
featured: false
---

# Introduction

Generics feel abstract until you see them solve a real problem: a reusable `<Select>` component that stays type-safe no matter what data you pass it, or a `useFetch` hook that knows exactly what shape of data it returns. This guide skips the theory and goes straight to patterns you'll actually use.

## What You'll Learn

- The core syntax of generics
- Generic React components
- Generic custom hooks
- Constraining generics with `extends`

## Main Content

### The Basic Idea

A generic is a placeholder type filled in at usage time.

```ts
function firstItem<T>(items: T[]): T {
  return items[0];
}

const num = firstItem([1, 2, 3]); // T = number
const str = firstItem(["a", "b"]); // T = string
```

### Generic Components

A reusable list component shouldn't be locked into one data shape:

```tsx
type ListProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
};

function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map((item, i) => <li key={i}>{renderItem(item)}</li>)}</ul>;
}

// Usage — T is inferred automatically
<List items={users} renderItem={(u) => <span>{u.name}</span>} />;
```

### Generic Hooks

```ts
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((json: T) => setData(json));
  }, [url]);
  return data;
}

// Usage
const user = useFetch<User>("/api/user");
```

### Constraining Generics

Sometimes you need to guarantee the generic type has certain properties:

```ts
function getId<T extends { id: string }>(item: T): string {
  return item.id;
}
```

Without `extends { id: string }`, TypeScript wouldn't know that `item.id` exists.

## Best Practices

- Let TypeScript infer generics from arguments when possible — don't over-annotate
- Use `extends` to constrain generics instead of using `any`
- Name generics meaningfully (`TItem`, `TData`) in complex components instead of just `T`
- Avoid generics when a union type or simple prop type would do the job

## Conclusion

Generics are what let a component or hook stay reusable without sacrificing type safety. Once you recognize the pattern — "this shape stays the same, but the data type changes" — reaching for a generic becomes second nature.
