---
title: Designing a Notification System
slug: designing-a-notification-system
description: A system design walkthrough for a multi-channel notification system supporting push, email, and SMS at scale.
author: Subhajit Sarkar
date: 2026-02-20
category: System Design
tags: [System Design, Notifications, Distributed Systems]
coverImage: /blog-covers/designing-a-notification-system.jpg
keywords: [notification system design, push notifications, event-driven architecture]
featured: false
---

# Introduction

Notification systems look like a simple "send message" feature until you factor in multiple channels (push, email, SMS), user preferences, rate limiting, retries, and the sheer volume of a large user base. Let's design one properly.

## What You'll Learn

- Core architecture for a multi-channel notification system
- Handling user preferences and channel fallback
- Reliability: retries, dead letter queues, and idempotency

## Main Content

### Requirements

Any part of the system (order service, chat service, marketing) should be able to trigger a notification. Users have per-channel preferences (push on, email off). Delivery should be reliable, and duplicate notifications should not spam the user.

### High-Level Architecture

```
Producing Services → Notification Service (API) → Message Queue
                                                         │
                          ┌──────────────────────────────┼──────────────────────┐
                          ▼                               ▼                      ▼
                  Push Worker                      Email Worker            SMS Worker
                          │                               │                      │
                          ▼                               ▼                      ▼
                     FCM / APNs                    SendGrid / SES            Twilio
```

Decoupling the triggering event from actual delivery via a queue is the key design choice — it lets each channel scale, retry, and fail independently without blocking the service that triggered the notification.

### The Notification Service API

```
POST /notifications
{
  "userId": "42",
  "type": "order_shipped",
  "data": { "orderId": "117", "trackingUrl": "..." }
}
```

Internally, this looks up a **template** for `order_shipped`, checks the user's **preferences** for which channels are enabled, and publishes one message per enabled channel to the queue.

### User Preferences and Fallback

```js
async function getEnabledChannels(userId, notificationType) {
  const prefs = await db.notificationPreference.findUnique({
    where: { userId_type: { userId, type: notificationType } },
  });
  return prefs?.channels ?? ["push", "email"]; // sane defaults
}
```

A common pattern: try push first; if the user hasn't opened the app in N days or push delivery fails, fall back to email.

### Reliability

Each channel worker retries with exponential backoff on transient failures (e.g., a provider's API being briefly down). Permanently failed messages go to a **dead letter queue** for investigation rather than being silently dropped.

```js
async function processNotification(job) {
  try {
    await sendPush(job);
  } catch (err) {
    if (job.attempts < 5) {
      await requeue(job, { delay: backoff(job.attempts) });
    } else {
      await deadLetterQueue.add(job);
    }
  }
}
```

### Avoiding Duplicate Sends

Use an idempotency key (e.g., `userId:type:orderId`) so retries or duplicate events from the producing service don't result in the user receiving the same notification twice.

## Best Practices

- Decouple triggering from delivery with a message queue — never call push/email/SMS providers synchronously from the triggering service
- Respect user channel preferences and support fallback chains
- Use idempotency keys to prevent duplicate notifications from retries
- Route permanently failed deliveries to a dead letter queue instead of dropping them silently

## Conclusion

A notification system is really an event-driven pipeline: producers emit events, a central service resolves preferences and templates, and independent workers handle the messy reality of third-party delivery providers. Decoupling and idempotency are what keep it reliable at scale.
