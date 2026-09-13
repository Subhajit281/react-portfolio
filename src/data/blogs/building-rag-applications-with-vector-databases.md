---
title: Building Production RAG Pipelines with Vector Databases
slug: building-rag-applications-with-vector-databases
description: Complete architecture guide for building Retrieval-Augmented Generation (RAG) systems using embeddings, chunking, and pgvector.
author: Subhajit Sarkar
date: 2026-06-02
category: AI & Machine Learning
tags: [AI, RAG, Vector Search, LLM, Embeddings]
coverImage: /blog-covers/rag-vector-databases.jpg
keywords: [rag architecture, vector database, pgvector, embeddings, semantic search, llm hallucination]
featured: true
---

# Introduction

Large Language Models (LLMs) are frozen in time at their training cutoff and frequently hallucinate when asked about proprietary company data, real-time metrics, or private documentation. **Retrieval-Augmented Generation (RAG)** solves this by dynamically searching a knowledge base for relevant facts and injecting them directly into the LLM's prompt context.

## What You'll Learn

- The core RAG pipeline: Ingestion, Embedding, Vector Search, and Synthesis
- Effective text chunking strategies to retain semantic nuance
- Setting up vector similarity search with `pgvector` in PostgreSQL
- Hybrid search: combining BM25 keyword matching with dense vector cosine similarity
- Techniques to eliminate hallucinations and minimize token consumption

## Main Content

### The High-Level RAG Architecture

```
[Document Corpus] -> [Semantic Chunker] -> [Embedding Model] -> [Vector Store (pgvector)]
                                                                           |
User Question ---> [Question Embedding] ---------------------> [Cosine Search (Top-K)]
                                                                           |
User Question + [Retrieved Context Chunks] ------------------> [LLM Generation] -> Response
```

### Chunking Strategies: Size Matters

Chunking too small loses broader document context; chunking too large dilutes the embedding vector and blows through LLM context limits.

- **Fixed-size with overlap**: 500 characters with 100 character sliding overlap.
- **Recursive semantic chunking**: Splitting primarily by paragraphs (`\n\n`), then sentences (`. `), ensuring logical ideas remain intact.

### Implementing Vector Search with PostgreSQL (`pgvector`)

You don't always need a standalone vector database. If you already run PostgreSQL, the `pgvector` extension gives you ACID-compliant vector storage right alongside relational metadata:

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Table storing document chunks with 1536-dimensional embeddings (e.g. text-embedding-3-small)
CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    embedding vector(1536)
);

-- Create HNSW index for ultra-fast approximate nearest neighbor lookup
CREATE INDEX ON document_chunks 
USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);

-- Query top-5 most semantically relevant chunks
SELECT id, content, 1 - (embedding <=> $1) AS similarity_score
FROM document_chunks
WHERE 1 - (embedding <=> $1) > 0.78
ORDER BY embedding <=> $1
LIMIT 5;
```

### Crafting the Grounded Synthesis Prompt

When passing retrieved context to the LLM, strict prompt scaffolding is essential to prevent speculative extrapolation:

```typescript
const systemPrompt = `You are a factual technical assistant.
Answer the user's question using ONLY the retrieved context fragments below.
If the answer cannot be found directly in the context, reply:
"I do not have enough verified information in the provided documentation to answer this."
Never fabricate APIs, URLs, or commands.

--- CONTEXT FRAGMENTS ---
${retrievedChunks.map((c, i) => `[Doc ${i + 1}]: ${c.content}`).join("\n\n")}
`;
```

## Best Practices

- **Add metadata filtering**: Narrow search scope by `tenant_id`, `created_at`, or `tag` before calculating cosine distance.
- **Re-ranking**: Use a lightweight cross-encoder re-ranker (like Cohere Rerank or BGE-Reranker) on the top 20 candidates to surface the best 5.
- **Monitor embedding drift**: When upgrading embedding models, regenerate all stored vectors simultaneously.

## Conclusion

RAG bridges the gap between private organizational intelligence and general LLM reasoning. By coupling PostgreSQL's `pgvector` with disciplined chunking and grounded prompting, you can build production-ready search and AI assistant systems with minimal latency.

