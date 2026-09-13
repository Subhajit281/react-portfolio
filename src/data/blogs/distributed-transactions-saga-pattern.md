---
title: Distributed Transactions & The Saga Pattern in Microservices
slug: distributed-transactions-saga-pattern
description: Managing multi-service state consistency without blocking 2-Phase Commit (2PC) using Choreography and Orchestration Sagas.
author: Subhajit Sarkar
date: 2026-05-15
category: System Design
tags: [System Design, Distributed Systems, Saga, Microservices]
coverImage: /blog-covers/saga-pattern.jpg
keywords: [saga pattern, distributed transactions, 2pc, eventual consistency, compensating transactions, microservices architecture]
featured: false
---

# Introduction

In a monolithic architecture, executing a database transaction is straightforward: you wrap your queries in a single `BEGIN` and `COMMIT` block. If anything fails, the database automatically rolls back all changes via ACID guarantees.

In microservices, however, each business domain owns its private database. A simple e-commerce checkout might involve the **Order Service**, the **Payment Service**, and the **Inventory Service**. Traditional Two-Phase Commit (2PC) protocols create severe locks and single points of failure. The **Saga Pattern** is the industry standard for achieving eventual consistency.

## What You'll Learn

- Why 2-Phase Commit (2PC) fails in high-scale cloud distributed systems
- The anatomy of a Saga: Local transactions, events, and compensating actions
- Choreography-based Sagas vs Orchestrator-based Sagas
- Implementing compensating actions to reverse partial state failures
- Handling network partitions and out-of-order event delivery

## Main Content

### The Core Saga Concept

A Saga is a sequence of local transactions. Each local transaction updates data within a single service and emits an event. Subsequent services listen to the event and execute their local transaction.

If a local step fails (e.g. Credit Card Declined), the Saga executes a sequence of **compensating transactions** in reverse order to undo earlier steps:

```
Happy Path:
[Create Pending Order] -> [Authorize Payment] -> [Reserve Inventory] -> [Mark Confirmed]

Failure Path (Inventory Out of Stock):
[Create Pending Order] -> [Authorize Payment] -> [Reserve Inventory FAILS]
                                  |
                                  v
                        [Compensate: Refund Payment]
                                  |
                                  v
                        [Compensate: Cancel Order]
```

### Choreography vs Orchestration

| Dimension | Choreography (Event-Driven) | Orchestration (Command-Driven) |
| :--- | :--- | :--- |
| **Coupling** | Loosely coupled (Pub/Sub) | Tightly coordinated by central worker |
| **Complexity** | Difficult to trace across many hops | Centralized visualization of state machine |
| **Best For** | Simple 2–4 step workflows | Complex enterprise multi-step transactions |

### Orchestrator Implementation Pattern

An Orchestrator acts as a finite state machine managing task execution and timeouts:

```typescript
class OrderSagaOrchestrator {
  async execute(orderData: OrderRequest) {
    const sagaState = await this.db.createSaga({ orderData, status: "STARTED" });

    try {
      // Step 1: Create Order
      const order = await orderService.createPending(orderData);
      await this.logStep(sagaState.id, "ORDER_CREATED");

      // Step 2: Charge Payment
      const payment = await paymentService.charge(orderData.userId, orderData.amount);
      await this.logStep(sagaState.id, "PAYMENT_CHARGED");

      // Step 3: Reserve Inventory
      await inventoryService.reserve(orderData.items);
      await this.logStep(sagaState.id, "INVENTORY_RESERVED");

      // Finalize
      await orderService.confirmOrder(order.id);
      return { success: true };
    } catch (error) {
      // Trigger backward recovery compensating chain
      await this.rollback(sagaState.id, orderData);
      throw new Error(`Saga failed and compensated: ${error.message}`);
    }
  }

  async rollback(sagaId: string, orderData: OrderRequest) {
    const executedSteps = await this.getExecutedSteps(sagaId);

    if (executedSteps.includes("INVENTORY_RESERVED")) {
      await inventoryService.release(orderData.items);
    }
    if (executedSteps.includes("PAYMENT_CHARGED")) {
      await paymentService.refund(orderData.userId, orderData.amount);
    }
    if (executedSteps.includes("ORDER_CREATED")) {
      await orderService.cancel(orderData.orderId);
    }
  }
}
```

## Best Practices

- **Idempotent Compensations**: Compensating calls may be retried multiple times due to network glitches; ensure refunding an already refunded order is a safe no-op.
- **Dead Letter Queues (DLQ)**: When automated compensation encounters an unexpected critical error, push the payload to a DLQ for manual engineer review.
- **Semantic Locks**: Mark items as `PENDING_RESERVATION` to prevent other customers from purchasing them during transaction flight.

## Conclusion

The Saga pattern trades immediate ACID consistency for distributed availability and resilience. By designing clear compensating actions and central orchestrators, you can build reliable transactional systems at global scale.

