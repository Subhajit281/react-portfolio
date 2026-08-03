---
title: Designing a Scalable Chat Application
slug: designing-a-scalable-chat-application
description: A system design walkthrough for building a real-time chat application that scales to millions of users.
author: Subhajit Sarkar
date: 2026-02-08
category: System Design
tags: [System Design, WebSockets, Real-time, Scalability]
coverImage: /blog-covers/designing-a-scalable-chat-application.jpg
keywords: [chat system design, websockets, real-time messaging, scalable architecture]
featured: false
---

# Introduction

Chat applications look simple — send a message, deliver it — but scaling one to millions of concurrent users involves real-time delivery, persistence, presence tracking, and multi-device sync all at once. Let's design one from the ground up.

## What You'll Learn

- Core components of a chat system
- How to handle real-time delivery at scale
- Message persistence and ordering
- Handling presence and offline delivery

## Main Content

### Core Requirements

Functional: 1:1 and group messaging, message history, delivery/read receipts, online presence. Non-functional: low latency (under a few hundred ms), high availability, support for millions of concurrent connections.

### Connection Layer: WebSockets

HTTP polling doesn't scale for real-time delivery. Each client holds a persistent WebSocket connection to a **connection/gateway server**. Since a single server can only hold so many open connections, you run many gateway servers behind a load balancer with sticky routing.

```
Client ──WS──> Gateway Server (holds connection)
                     │
                     ▼
            Message Broker (Kafka/Redis Pub/Sub)
                     │
                     ▼
         Other Gateway Servers (deliver to recipients)
```

### Routing Messages Between Servers

Because a sender and recipient can be connected to different gateway servers, you need a registry mapping `userId → gatewayServerId`, typically stored in Redis. When a message arrives, the sending server looks up which gateway holds the recipient's connection and publishes to that server's channel via Kafka or Redis Pub/Sub.

```js
// Simplified message routing
async function routeMessage(message) {
  const recipientServer = await redis.get(`presence:${message.to}`);
  if (recipientServer) {
    await pubsub.publish(`gateway:${recipientServer}`, message);
  }
  await persistMessage(message); // always store, regardless of delivery
}
```

### Message Persistence and Ordering

Messages are written to a database (often Cassandra, chosen for high write throughput) partitioned by conversation ID, with a monotonically increasing sequence number or timestamp for ordering within that conversation.

```sql
-- Cassandra-style partition: fast writes/reads scoped per conversation
PRIMARY KEY (conversation_id, message_id)
```

### Offline Delivery

If a recipient is offline, the presence lookup returns nothing. The message is still persisted; when the user reconnects, the client fetches unread messages since their last synced message ID — a simple, reliable catch-up mechanism that doesn't depend on push delivery succeeding.

### Presence

Presence (`online`/`offline`/`last seen`) is tracked via a heartbeat: the gateway server updates a Redis key with a short TTL on every ping; if it expires, the user is marked offline.

## Best Practices

- Never treat WebSocket delivery as the only delivery guarantee — always persist first
- Partition message storage by conversation ID for both write throughput and fast history retrieval
- Use a pub/sub layer to decouple gateway servers from each other
- Design the client to reconcile via "sync since last message ID" rather than relying purely on push

## Conclusion

The hard part of chat system design isn't sending a message — it's guaranteeing delivery and ordering across a fleet of stateful connection servers. Persist first, deliver opportunistically, and let clients reconcile on reconnect.
