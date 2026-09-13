---
title: Distributed Tracing & Observability with OpenTelemetry
slug: distributed-tracing-and-opentelemetry-guide
description: A practical guide to instrumenting microservices with OpenTelemetry, tracing HTTP spans across service boundaries, and visualizing bottlenecks.
author: Subhajit Sarkar
date: 2026-02-18
category: DevOps
tags: [OpenTelemetry, Observability, DevOps, Monitoring, Tracing]
coverImage: /blog-covers/opentelemetry-tracing.jpg
keywords: [opentelemetry, distributed tracing, traces, spans, jaeger, observability, microservices debugging]
featured: false
---

# Introduction

In a monolithic architecture, debugging a slow HTTP request is relatively simple: you read the application logs or profile the stack trace. In a microservices mesh with 30 distinct services, a single user checkout might traverse an API Gateway, an Auth Service, an Inventory Service, and a Payment Gateway across dozens of asynchronous network hops.

When that request takes 4.2 seconds to complete, traditional isolated logs cannot tell you which service caused the delay. **Distributed Tracing with OpenTelemetry (OTel)** provides complete end-to-end visibility.

## What You'll Learn

- The core telemetry triad: Metrics, Logs, and Traces (M.E.L.T.)
- The anatomy of a Trace: Trace IDs, Span IDs, and Parent-Child hierarchies
- Context propagation over HTTP headers using W3C `traceparent` standards
- Auto-instrumenting Node.js and Express applications with OpenTelemetry SDK
- Visualizing latency bottlenecks and error spans with Jaeger or Grafana Tempo

## Main Content

### Anatomy of a Distributed Trace

A **Trace** represents the complete lifecycle of a request as it flows through a distributed architecture. Each individual unit of work within a trace is called a **Span**.

```
Trace ID: 4bf92f3577b34da6a3ce929d0e0e4736 (Total: 420ms)
+-------------------------------------------------------------------------------+
| [Frontend API Gateway] GET /api/v1/orders (420ms)                             |
+-------------------------------------------------------------------------------+
       |
       +---> [Auth Service] Validate Token (25ms)
       |
       +---> [Order Service] DB Query SELECT orders (85ms)
       |
       +---> [Inventory Service] HTTP GET /items/availability (280ms)  <-- BOTTLENECK!
```

### Context Propagation via W3C Trace Context

To connect spans across different network hosts, services inject a standardized HTTP header:

```http
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
              |  |                                |                |
        Version  Trace ID                         Parent Span ID   Trace Flags (Sampled)
```

Downstream services extract this header and attach their new child spans to the same `Trace ID`.

### Instrumenting a Node.js Service with OpenTelemetry

```typescript
// tracer.ts - Must be initialized before any other imports!
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: 'http://otel-collector:4317', // Exports to OpenTelemetry Collector
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      // Automatically instruments Express, HTTP, PostgreSQL, Redis, etc.
      '@opentelemetry/instrumentation-fs': { enabled: false },
    }),
  ],
});

sdk.start();
console.log('OpenTelemetry instrumentation active.');
```

### Adding Custom Business Spans

```typescript
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('payment-processor');

export async function processRefund(orderId: string, amount: number) {
  return tracer.startActiveSpan('processRefund', async (span) => {
    try {
      span.setAttribute('order.id', orderId);
      span.setAttribute('refund.amount', amount);

      const result = await paymentGateway.refund(orderId, amount);
      span.setStatus({ code: 1 }); // OK
      return result;
    } catch (error: any) {
      span.recordException(error);
      span.setStatus({ code: 2, message: error.message }); // ERROR
      throw error;
    } finally {
      span.end();
    }
  });
}
```

## Best Practices

- **Use Head-Based & Tail-Based Sampling**: In high-throughput systems, exporting 100% of traces is cost-prohibitive. Sample 5% of healthy requests, but retain 100% of errors and slow requests (`latency > 1s`).
- **Never record PII in Span Attributes**: Do not attach passwords, credit card numbers, or sensitive personal data to trace tags.
- **Adopt an OpenTelemetry Collector**: Decouple your applications from vendor backends by routing all telemetry through a central OTel Collector agent.

## Conclusion

Distributed tracing turns distributed microservice architectures from opaque black boxes into transparent, observable systems where performance bottlenecks can be diagnosed in seconds.

