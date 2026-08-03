---
title: Building Idempotent APIs
slug: building-idempotent-apis
description: Why idempotency matters for reliable APIs, and how to implement idempotency keys for safe retries.
author: Subhajit Sarkar
date: 2026-02-03
category: Backend
tags: [API Design, Idempotency, Reliability]
coverImage: /blog-covers/building-idempotent-apis.jpg
keywords: [idempotency, idempotent api, retry safety, distributed systems]
featured: false
---

# Introduction

Networks fail. A client sends a payment request, the response never arrives, and the client — reasonably — retries. Without idempotency, that retry can charge the customer twice. Idempotent APIs make retries safe by design instead of hoping failures don't happen.

## What You'll Learn

- What idempotency actually means
- Which HTTP methods are idempotent by default
- Implementing idempotency keys for POST requests

## Main Content

### What Idempotent Means

An operation is idempotent if performing it multiple times has the same effect as performing it once. `GET`, `PUT`, and `DELETE` are idempotent by definition in HTTP — calling `DELETE /orders/117` five times still results in the order being deleted, not an error each time (ideally).

`POST` is **not** idempotent by default — each call is expected to create a new resource. This is exactly the problem for operations like payments.

### Idempotency Keys

The standard solution: the client generates a unique key per logical operation and sends it with the request. The server stores the result of the first request under that key and returns the cached result for any duplicate.

```js
app.post("/payments", async (req, res) => {
  const idempotencyKey = req.headers["idempotency-key"];
  if (!idempotencyKey) {
    return res.status(400).json({ error: "Idempotency-Key header required" });
  }

  const existing = await db.idempotencyRecord.findUnique({
    where: { key: idempotencyKey },
  });
  if (existing) {
    return res.status(existing.statusCode).json(existing.responseBody);
  }

  const payment = await processPayment(req.body);

  await db.idempotencyRecord.create({
    data: {
      key: idempotencyKey,
      statusCode: 201,
      responseBody: payment,
    },
  });

  res.status(201).json(payment);
});
```

Client side, the key is generated once per user action, not per network attempt:

```js
const idempotencyKey = crypto.randomUUID();

async function pay(amount) {
  return fetch("/payments", {
    method: "POST",
    headers: { "Idempotency-Key": idempotencyKey },
    body: JSON.stringify({ amount }),
  });
  // Safe to retry this exact call with the same key on network failure
}
```

### Handling Concurrent Duplicate Requests

A race condition can occur if two identical requests arrive before the first finishes processing. Use a unique constraint on the idempotency key column and handle the resulting conflict gracefully, or acquire a short-lived lock before processing.

## Best Practices

- Require idempotency keys on any `POST` endpoint that has side effects like charging money or sending irreversible actions
- Store idempotency records with a TTL (e.g., 24 hours) so the table doesn't grow forever
- Make the key generation the client's responsibility, tied to the user action, not the network request
- Return the exact same response for a duplicate key, including status code

## Conclusion

Idempotency turns "hope the network doesn't fail" into "safe to retry, guaranteed." It's a small amount of extra plumbing that eliminates an entire class of duplicate-charge, duplicate-order bugs.
