---
id: APPLICATION-001
title: "Intelligence Engine"
status: canonical
version: "1.0"
owner: "AI Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: medium
change_frequency: medium
consumers:
  - AI Agent
  - Backend Agent
  - Frontend Agent
depends_on:
  - APPLICATION-006
  - DOMAIN-004
  - CORE-004
tags:
  - application
  - intelligence
  - ai
  - rag
co_load:
  - APPLICATION-006
  - DOMAIN-004
---

# APPLICATION-001 — Intelligence Engine

## Purpose

AI subsystem that augments human judgment across the career workflow. Every AI output must be explainable, user-reviewed, and grounded in the user's own Career Capital. AI never fabricates skills or experiences.

## Core Philosophy

From Product Principles P-004 and P-016:
- **AI must augment human judgment, never override it.** The user owns their career decisions.
- **Explain Before You Automate.** AI outputs must be explainable. If the AI suggests an action, it must briefly state *why*.

## AI Capabilities

### 1. Intelligent Capture (Data Extraction)

| Property | Value |
|---|---|
| **Domain** | Opportunity Context |
| **Trigger** | User captures a URL, raw text, or email via Inbox |
| **Input** | Unstructured text/URL |
| **Output** | Structured Opportunity draft |

**Extraction Fields:** Organization Name, Role Title, Application Deadline, Location, Salary Range, Required Documents.

**Constraint:** User always reviews and clicks "Save" before the Opportunity enters the pipeline. UI highlights which source text maps to each extracted field.

### 2. Strategic Fit Scoring

| Property | Value |
|---|---|
| **Domain** | Strategy + Opportunity Context |
| **Trigger** | Opportunity transitions to `EVALUATING` |
| **Input** | Opportunity description + User's active Goals + Career Capital |
| **Output** | Fit Score (High/Medium/Low) + reasoning bullets |

**Reasoning Format:** Explicitly links score to user-defined Goals. Example: "Aligns with your goal to move into FinTech. Requires 5 years of Python; your Career Capital indicates 3 years."

### 3. Asset Suggestion Engine (RAG)

| Property | Value |
|---|---|
| **Domain** | Knowledge Context |
| **Trigger** | Opportunity transitions to `ACTIONED`, user begins `DRAFTING` |
| **Input** | Job description + User's Knowledge Entries + past Documents |
| **Output** | Top 3 most relevant past cover letters, portfolio pieces, or essay answers |

**Mechanism:** Retrieval-augmented generation over the user's own historical data. Surfaces with provenance: "Suggested because this opportunity emphasizes 'Cross-functional leadership', similar to your Application to Stripe in 2024."

### 4. Tailored Document Generation

| Property | Value |
|---|---|
| **Domain** | Opportunity Context |
| **Trigger** | User requests a draft (Cover Letter, Resume tailoring) |
| **Input** | Career Capital (Master Resume, past reflections, portfolio) + Opportunity description |
| **Output** | First draft document |

**Hard Constraint:** AI is strictly barred from hallucinating skills or experiences. Only uses facts present in the user's Career Capital. AI flags all generated sentences so the user is forced to review and edit.

### 5. Reflection Synthesis

| Property | Value |
|---|---|
| **Domain** | Knowledge + Strategy Context |
| **Trigger** | User completes an unstructured Reflection after interview/rejection |
| **Input** | Unstructured reflection notes |
| **Output** | Proposed structured updates to Career Capital |

**Extracted Insights:** New Interview Questions, Skill Gaps, Decision Journal Entries. User must explicitly approve each before committing to the Knowledge database.

## Technical Architecture

| Component | Technology | Purpose |
|---|---|---|
| LLM Provider | OpenAI API (GPT-4o) | Reasoning, extraction, generation |
| Embeddings | OpenAI text-embedding-3-small | Vector embeddings for RAG |
| Vector Store | pgvector (Phase 3) / in-memory (Phase 1) | Similarity search |
| Prompt Management | Typed prompt templates in code | Version-controlled prompts |

## Security Rules (Co-loaded with APPLICATION-006)

- AI processes confidential career data — privacy rules are mandatory
- AI ethical constraints: NEVER fabricate skills/experiences, ALWAYS flag AI-generated content
- User approval required for all AI-generated knowledge commits
- Rate limit: 50 AI requests per hour per user

## Limitations (Phase 1)

| Limitation | Mitigation |
|---|---|
| In-memory vector store (no pgvector yet) | RAG results less precise; compensate with keyword matching |
| No fine-tuning | Prompt engineering only |
| No streaming responses | Standard request/response; add streaming in Phase 2 |
| Single-user only | No multi-tenant data isolation concerns |

## Canonical Source

`docs/04-automation/ai-features.md`
