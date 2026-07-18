---
id: PROMPT-003
title: "Tool Prompts"
status: canonical
version: "1.0"
owner: "Prompt Engineering Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: medium
change_frequency: medium
confidence: 1.0
source_of_truth: ".agents/context/application/prompts/tool-prompts.ctx.md"
consumers:
  - AI Agent
  - Backend Agent
  - Automation Agent
depends_on:
  - PROMPT-004
  - APPLICATION-001
  - APPLICATION-011
tags:
  - application
  - prompts
  - tools
always_loaded: false
token_budget: 1100
---

# PROMPT-003 — Tool Prompts

## Purpose

Contracts for tool/function calling used by the Intelligence Engine and build agents. Tools are the only path from AI reasoning to side effects — and most side effects must remain proposals.

## Tool Design Rules

| ID | Rule |
|---|---|
| TP-001 | Tools that mutate domain state require explicit user/system approval step |
| TP-002 | Read tools may run freely within user scope (`user_id` always bound server-side) |
| TP-003 | Tool args validated with Zod (or equivalent) before execution |
| TP-004 | Tool results returned to model must not include secrets |
| TP-005 | Every mutating tool emits audit + correlation_id |
| TP-006 | Prefer draft/proposal tools over commit tools |

## Runtime AI Tools (Product)

### `extract_opportunity_draft` (read-only compute)

- **Args:** `{ raw_text, source_url? }`
- **Returns:** `IntelligentCaptureData`
- **Side effects:** None (compute only)

### `score_strategic_fit` (read-only compute)

- **Args:** `{ opportunity_id }` (server loads goals/capital)
- **Returns:** `StrategicFitData`
- **Side effects:** None; optional cache of score as non-authoritative suggestion

### `search_career_assets` (read)

- **Args:** `{ opportunity_id, k }`
- **Returns:** ranked asset ids + snippets
- **Side effects:** None
- **Security:** Enforce `user_id` scope in repository

### `propose_document_draft` (write draft artifact only)

- **Args:** `{ opportunity_id, document_type }`
- **Returns:** draft document id in **draft** state
- **Side effects:** Creates reviewable draft; not final Application document until user accepts

### `propose_knowledge_updates` (write proposals only)

- **Args:** `{ reflection_id }`
- **Returns:** proposal list
- **Side effects:** Stores proposals with `requires_user_approval=true`
- **Forbidden:** Direct KnowledgeEntry insert as committed

### `commit_user_approved_proposals` (mutate)

- **Args:** `{ proposal_ids[], user_confirmation: true }`
- **Returns:** committed entity ids
- **Side effects:** Domain events + Activity
- **Gate:** Reject if `user_confirmation !== true`

## Build-Agent Tools (Development)

| Tool | Purpose | Authority |
|---|---|---|
| `load_context_modules` | Assemble plan per APPLICATION-009 | All agents |
| `open_task` / `transition_task` | Execution protocol states | Owner / Architect |
| `emit_handoff` | Structured transfer | Owner |
| `run_eval_suite` | APPLICATION-012 suites | AI / Testing |
| `propose_adr` | Draft ADR from template | Architect / Docs |

## Tool Prompt Snippets

### Before Any Mutating Tool

```
Confirm: Is this a proposal or a commit?
If commit: is user_confirmation or human gate satisfied?
If not: call propose_* instead.
```

### On Tool Error

```
Do not retry mutating tools more than twice.
Surface error; escalate per APPLICATION-010.
Never invent a successful tool result.
```

## Failure Examples

- Model calls `commit_*` without approval
- Search tool returns other users’ documents
- Tool error ignored and model fabricates data
- Infinite tool-call loops

## Canonical Source

APPLICATION-001, APPLICATION-011, PROMPT-004.
