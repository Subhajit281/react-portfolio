---
title: Database Indexing Explained
slug: database-indexing-explained
description: How database indexes actually work under the hood, and how to use them to make slow queries fast.
author: Subhajit Sarkar
date: 2026-01-25
category: Backend
tags: [Database, SQL, Performance]
coverImage: /blog-covers/database-indexing-explained.jpg
keywords: [database index, sql performance, b-tree, query optimization]
featured: false
---

# Introduction

"Just add an index" is common advice for slow queries, but indexes aren't free — they speed up reads at the cost of writes and storage. Understanding how they actually work lets you use them deliberately instead of sprinkling them everywhere.

## What You'll Learn

- How a B-tree index works conceptually
- When an index helps vs when it doesn't
- Composite indexes and column order
- How to check if your query is actually using an index

## Main Content

### The Core Idea

Without an index, a database scans every row to find matches — a full table scan. An index is a separate, sorted data structure (usually a B-tree) that lets the database jump directly to matching rows, similar to a book's index pointing you to a page instead of reading cover to cover.

```sql
CREATE INDEX idx_users_email ON users(email);
```

Now `SELECT * FROM users WHERE email = 'x@example.com'` can use a fast lookup instead of scanning the whole table.

### Composite Indexes and Column Order

```sql
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
```

Column order matters. This index efficiently serves queries filtering on `user_id` alone, or on `user_id` and `status` together — but not queries filtering on `status` alone, since the index is sorted by `user_id` first.

### When Indexes Don't Help

```sql
-- Wrapping a column in a function usually defeats the index
SELECT * FROM users WHERE LOWER(email) = 'x@example.com';
```

Unless you create a functional index on `LOWER(email)`, this query still does a full scan. Leading wildcard searches (`LIKE '%term'`) also can't use a standard B-tree index.

### Checking Index Usage

```sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 42;
```

Look for `Index Scan` in the output instead of `Seq Scan` to confirm the index is being used.

### The Write Cost

Every `INSERT`, `UPDATE`, or `DELETE` also has to update every index on that table. A table with ten indexes on it has notably slower writes than one with two.

## Best Practices

- Index columns used in `WHERE`, `JOIN`, and `ORDER BY` clauses
- Put the most selective column first in composite indexes
- Don't index columns with low cardinality (like a boolean `is_active`) on their own
- Regularly review and drop unused indexes — check `pg_stat_user_indexes` in Postgres

## Conclusion

Indexes trade write performance and storage for read speed. Use `EXPLAIN ANALYZE` to confirm your queries actually benefit before adding one, and revisit your indexing strategy as query patterns change.
