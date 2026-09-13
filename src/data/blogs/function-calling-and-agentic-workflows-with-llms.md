---
title: Agentic Workflows & Structured Tool Calling with LLMs
slug: function-calling-and-agentic-workflows-with-llms
description: Building reliable autonomous agents with JSON schema tool definitions, error correction loops, and multi-step reasoning.
author: Subhajit Sarkar
date: 2026-05-28
category: AI & Machine Learning
tags: [AI, LLMs, Agents, Automation, Python]
coverImage: /blog-covers/agentic-workflows.jpg
keywords: [function calling, ai agents, structured outputs, react pattern, tool execution, json schema]
featured: false
---

# Introduction

Chatbots provide conversation, but **AI agents take action**. Through function calling and structured outputs, developers can grant LLMs the ability to query production databases, call external third-party APIs, execute shell commands, and iteratively solve complex multi-step problems.

However, naive agent implementations easily get stuck in infinite loops or execute hallucinated tool calls. Making autonomous agents reliable requires strict schema validation and deterministic feedback loops.

## What You'll Learn

- The core mechanics of JSON schema function calling
- The ReAct (Reason + Act) execution loop
- Parsing and validating LLM function arguments with strict types
- Implementing self-healing error recovery loops when tools fail
- Guardrails, timeouts, and state management for autonomous systems

## Main Content

### Defining Tools with Strict JSON Schema

LLMs do not execute code directly; they predict a structured JSON payload indicating which tool to execute and with what arguments. Defining explicit parameter schemas prevents malformed payloads.

```typescript
export const getDatabaseMetricsTool = {
  name: "get_database_metrics",
  description: "Retrieves real-time CPU, memory, and active query count for a PostgreSQL database instance.",
  parameters: {
    type: "object",
    properties: {
      instanceId: {
        type: "string",
        description: "The AWS RDS instance identifier, e.g. 'prod-db-primary'."
      },
      timeRangeMinutes: {
        type: "integer",
        description: "Duration in minutes to look back (default: 15, max: 1440).",
        default: 15
      }
    },
    required: ["instanceId"]
  }
};
```

### The Autonomous ReAct Loop

In an agentic loop, the model evaluates whether it can answer the prompt directly or needs external information. If a tool call is produced, the host environment runs the function and feeds the output back as a `tool` role message:

```typescript
async function runAgentLoop(userGoal: string) {
  const messages = [
    { role: "system", content: "You are an autonomous operations engineer. Use tools to investigate incidents." },
    { role: "user", content: userGoal }
  ];

  let iterations = 0;
  const MAX_ITERATIONS = 8;

  while (iterations < MAX_ITERATIONS) {
    iterations++;
    const response = await callLLM({ messages, tools: [getDatabaseMetricsTool, restartServiceTool] });

    if (!response.tool_calls || response.tool_calls.length === 0) {
      // Agent finished its reasoning and delivered final answer
      return response.content;
    }

    // Process each tool request
    for (const toolCall of response.tool_calls) {
      try {
        const args = JSON.parse(toolCall.function.arguments);
        const result = await executeLocalTool(toolCall.function.name, args);

        messages.push(response); // Assistant call record
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result)
        });
      } catch (err: any) {
        // Feedback loop: instruct model of the runtime error so it can correct itself
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify({ error: err.message, status: "failed" })
        });
      }
    }
  }

  throw new Error("Agent exceeded maximum iterations without reaching conclusion.");
}
```

### Critical Guardrails for Agent Safety

1. **Human-in-the-loop for destructive actions**: Require manual operator approval before executing `DELETE`, `DROP`, or `REBOOT` operations.
2. **Deterministic parameter coercion**: Use libraries like `Zod` to validate generated tool arguments against TypeScript schemas before calling internal services.
3. **Hard limits on depth & tokens**: Always impose maximum iteration limits to avert runaway cloud API billing.

## Conclusion

Structured tool calling shifts LLMs from passive text generators to active problem-solving engines. Pairing declarative schemas with resilient execution loops unlocks production-grade automation.

