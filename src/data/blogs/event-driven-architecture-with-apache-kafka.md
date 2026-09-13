---
title: Event-Driven Architecture with Apache Kafka
slug: event-driven-architecture-with-apache-kafka
description: Demystifying Kafka topics, partitions, consumer groups, offsets, and building decoupled asynchronous distributed event backbones.
author: Subhajit Sarkar
date: 2026-05-08
category: System Design
tags: [Kafka, Event-Driven, Streaming, Distributed Systems]
coverImage: /blog-covers/kafka-architecture.jpg
keywords: [apache kafka, event driven architecture, kafka partitions, consumer groups, exactly once semantics, streaming data]
featured: true
---

# Introduction

Traditional point-to-point synchronous REST calls bind services tightly together. If the recommendation engine goes down, the checkout service slows down. If traffic spikes 10x, downstream databases crash.

**Apache Kafka** decouples systems completely by acting as a distributed, append-only commit log. Producers emit facts about what occurred, and consumers process those events at their own pace with fault-tolerant durability.

## What You'll Learn

- The core Kafka model: Topics, Partitions, Brokers, and Clusters
- How partitions enable horizontal scaling and strict message ordering
- Consumer groups and parallel offset coordination
- Avoiding data loss: `acks=all`, replication factors, and idempotent producers
- Real-world event-driven architecture patterns with Node.js and KafkaJS

## Main Content

### Anatomy of Topics & Partitions

A Kafka Topic is a logical stream category, split into one or more **Partitions**.

- **Partitions are append-only logs**: Messages receive a sequential `offset` number.
- **Ordering guarantee**: Messages with the same **partition key** always land in the exact same partition, guaranteeing strict FIFO order per entity (e.g. `userId` or `accountId`).
- **Parallelism boundary**: You cannot have more active consumers in a single consumer group than there are partitions on the topic.

```
Topic: 'user-activity' (3 Partitions)

Partition 0: [msg 0][msg 1][msg 2][msg 3] ---> Consumer A (Group 1)
Partition 1: [msg 0][msg 1][msg 2]       ---> Consumer B (Group 1)
Partition 2: [msg 0][msg 1][msg 2][msg 3] ---> Consumer C (Group 1)
```

### Writing a Resilient Producer in Node.js

```typescript
import { Kafka, Partitioners } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'order-api',
  brokers: ['kafka-1.internal:9092', 'kafka-2.internal:9092'],
});

const producer = kafka.producer({
  createPartitioner: Partitioners.DefaultPartitioner,
  idempotent: true, // Prevents duplicate delivery during network retries
  maxInFlightRequests: 5,
});

export async function publishOrderEvent(order: { id: string; userId: string; amount: number }) {
  await producer.connect();
  await producer.send({
    topic: 'orders.v1',
    acks: -1, // acks=all: confirms write across all in-sync replicas (ISR)
    messages: [
      {
        key: order.userId, // Guarantees all events for this user stay strictly in order
        value: JSON.stringify({
          eventType: 'ORDER_PLACED',
          payload: order,
          timestamp: new Date().toISOString(),
        }),
      },
    ],
  });
}
```

### Implementing Consumer Groups for Scale

```typescript
const consumer = kafka.consumer({ groupId: 'fraud-detection-service' });

await consumer.connect();
await consumer.subscribe({ topic: 'orders.v1', fromBeginning: false });

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const event = JSON.parse(message.value?.toString() || '{}');
    console.log(`Processing ${event.eventType} on partition ${partition} offset ${message.offset}`);

    // Analyze velocity, card geography, and anomaly metrics
    await evaluateFraudRisk(event.payload);
  },
});
```

## Best Practices

- **Never use random keys for entity updates**: Use business keys (like `tenantId` or `userId`) so state changes are never interleaved out-of-order.
- **Set retention policies intentionally**: Use size-based or time-based log compaction for tables holding current state.
- **Monitor consumer lag**: If consumer lag climbs, scale out your consumer group instances up to the partition count.

## Conclusion

Kafka transforms enterprise systems from fragile webs of synchronous RPC into resilient, decoupled event streams capable of absorbing massive traffic spikes effortlessly.

