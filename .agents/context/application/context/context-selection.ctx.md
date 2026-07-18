---
id: APPLICATION-009
title: "Context Selection Engine"
status: canonical
version: "1.0"
owner: "Context Manager"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: high
change_frequency: medium
confidence: 1.0
source_of_truth: ".agents/context/application/context/context-selection.ctx.md"
consumers:
  - All Agents
  - Context Manager
  - Architect Agent
depends_on:
  - META-000
  - META-001
  - CORE-001
tags:
  - application
  - context
  - retrieval
  - always-load
always_loaded: true
token_budget: 2000
---

# APPLICATION-009 — Context Selection Engine

## Purpose

Deterministic brain of the context system. Defines **what** loads, **why**, **in what order**, and **within which budget**. Loading policies alone are insufficient without selection scoring.

## Selection Pipeline (Deterministic)

```
1. Classify task intent
2. Inject always-load set for intent class
3. Score candidate modules
4. Apply co-load rules (hard constraints)
5. Apply negative retrieval rules
6. Enforce token budget (priority drop, then compress)
7. Apply recency / freshness weighting
8. Emit Context Assembly Plan + confidence score
9. If confidence < 0.7 on critical path → HITL-006
```

## Task Classification

| Intent Class | Signals (keywords / task type) | Base Always-Load |
|---|---|---|
| `identity` | what is careeros, vision, north star | CORE-001, CORE-002, ROADMAP-001 |
| `product` | persona, feature scope, roadmap, JTBD | + CORE-004, PERSONAS, FEATURE-* |
| `engineering` | implement, refactor, tRPC, prisma | + CORE-003, CORE-005, APP-006, APP-007 |
| `domain` | entity, FSM, invariant, XAG | + CORE-003 + matching DOMAIN-* |
| `feature` | workspace, UI for F-00x | + UI-001 + FEATURE-* + parent DOMAIN |
| `architecture` | ADR, layer, dependency, CQRS | + all CORE-* + APP-006/007 |
| `security` | auth, encryption, rate limit, PII | + APP-006, DOMAIN-007 |
| `ai` | prompt, RAG, hallucination, OpenAI | + APP-001, APP-006, DOMAIN-002/003/004, PROMPT-* |
| `automation` | cron, trigger, idempotency | + APP-002, DOMAIN-008 |
| `ops` | deploy, vercel, neon, env | + APP-007, deployment module |
| `orchestration` | agent handoff, task state | + APP-010, APP-011, META-002 |
| `evaluation` | eval, metric, precision, rework | + APP-012, APP-013 |

## Context Scoring Weights

| Context Type | Weight | Drop Priority (if over budget) |
|---|---:|---|
| Security (APP-006) | 100 | Never drop for engineering/ai/security |
| Core Identity (CORE-001) | 100 | Never drop |
| Glossary (CORE-002) | 100 | Never drop |
| Phase Registry (ROADMAP-001) | 95 | Never drop |
| Architecture Principles (CORE-003) | 95 | Never drop for engineering |
| Coding Standards (CORE-005) | 90 | Compress before drop |
| Product Principles (CORE-004) | 90 | Never drop for product/ai |
| Domain (primary) | 90 | Compress rationale only |
| Feature Spec (active) | 85 | Keep acceptance criteria |
| Tech Stack (APP-007) | 85 | Compress examples |
| Co-loaded domain (secondary) | 80 | Compress |
| Execution Protocol (APP-010) | 80 | Keep for multi-agent work |
| Output Contracts (PROMPT-004) | 80 | Keep for AI tasks |
| Shared State (APP-011) | 75 | Keep for multi-agent |
| Historical ADRs | 70 | Load on demand only |
| Neighboring features | 50 | Drop first |
| Deprecated / archived | 10 | Load only if explicit |

**Score formula (per module):**

```
score = weight
      + (co_load_required ? +50 : 0)
      + (recency_boost: 0–15)
      + (freshness_penalty: 0–30)
      + (confidence * 10)
      - (redundant_with_loaded ? 40 : 0)
```

Load highest scores first until budget exhausted. Hard constraints (never-drop + co-loads) always win.

## Token Budgets

| Session Type | Total Context Budget | Always-Load Cap | Dynamic Cap | Response Reserve |
|---|---:|---:|---:|---:|
| Default engineering | 18,000 | 8,000 | 6,000 | 4,000 |
| Domain modeling | 16,000 | 6,000 | 7,000 | 3,000 |
| Feature UI work | 16,000 | 6,000 | 7,000 | 3,000 |
| AI / prompt work | 20,000 | 9,000 | 7,000 | 4,000 |
| Quick factual query | 8,000 | 4,000 | 2,000 | 2,000 |
| Multi-agent orchestration | 22,000 | 10,000 | 8,000 | 4,000 |

**CSE-001:** Never exceed budget by dumping modules; compress or drop by priority.  
**CSE-002:** Always reserve response tokens; never fill 100% with context.

## Priority Ordering (Assembly Order)

1. Security + Identity + Glossary + Phase
2. Role always-loads (standards, principles, stack)
3. Primary domain / feature
4. Hard co-loads
5. Application modules for task type
6. Prompt / output contracts (if AI)
7. Orchestration / shared state (if multi-agent)
8. ADRs / historical (only if referenced)
9. Scratchpad / task memory (session)

## Co-Load Rules (Hard)

| Primary | Must Co-load | Severity if missed |
|---|---|---|
| DOMAIN-003 | DOMAIN-002 | Critical |
| APPLICATION-001 | APPLICATION-006 + DOMAIN-004 | Critical |
| APPLICATION-002 | DOMAIN-008 | Critical |
| FEATURE-* | Parent DOMAIN-* | Critical |
| PROMPT-* | APPLICATION-001 + CORE-002 | High |
| APPLICATION-010 | APPLICATION-011 | High (multi-agent) |

## Negative Retrieval Rules (Never Load Together Without Explicit Reason)

| Forbidden Pair / Pattern | Reason |
|---|---|
| APP-001 without APP-006 | AI without security |
| DOMAIN-003 without DOMAIN-002 | Broken parent aggregate |
| FEATURE-* without parent DOMAIN | Spec without rules |
| Full ADR corpus + full feature set | Token waste; pick one decision |
| All DOMAIN-* simultaneously | Overload; classify first |
| Deprecated module + canonical successor | Contradiction risk |
| Production secrets / user PII into agent context | Security |

## Recency Weighting

| Signal | Boost |
|---|---:|
| Modified in current session | +15 |
| Modified last 7 days | +10 |
| Referenced by active task | +12 |
| Supersedes another loaded module | +20 to successor; −100 to superseded |

## Freshness Decay

Use module frontmatter:

```yaml
updated_at: ISO-8601
expires_at: optional
confidence: 0.0-1.0
stability: very-high | high | medium | low
```

| Condition | Action |
|---|---|
| `stability: very-high` | No decay |
| `stability: high` and age > 90d without review | confidence × 0.9 |
| `stability: medium` and age > 30d | confidence × 0.85 |
| `expires_at` past | Do not load; flag Context Manager |
| `confidence < 0.7` | Load with warning; HITL on critical path |
| Empty / placeholder module | Flag gap; load nearest parent; do not pretend complete |

## Context Compression (When Over Budget)

**Never compress:**
- Invariants INV-*
- FSM transitions with side effects
- Security SEC-*
- Cross-aggregate XAG-*
- AI ethical constraints
- Output contracts / schemas
- Acceptance criteria

**Always compress first:**
- Extended rationale / narrative history
- Duplicate examples
- Changelog prose
- Alternative approaches already rejected (unless ADR task)

## Context Assembly Plan (Output Contract)

```yaml
context_plan:
  task_id: string
  intent_class: string
  modules:
    - id: ModuleId
      path: string
      score: number
      reason: always | scored | co_load | explicit
  dropped:
    - id: ModuleId
      reason: budget | negative_rule | stale | empty
  token_estimate: number
  budget: number
  confidence: 0.0-1.0
  gaps: ModuleId[]
  warnings: string[]
```

## Confidence Scoring

```
confidence = min(
  1.0,
  0.4 * (required_modules_present / required_modules_total)
  + 0.3 * (co_loads_satisfied ? 1 : 0)
  + 0.2 * avg(module_confidence)
  + 0.1 * (phase_check_pass ? 1 : 0)
)
```

| Confidence | Action |
|---:|---|
| ≥ 0.9 | Proceed |
| 0.7–0.9 | Proceed with warnings listed |
| < 0.7 | Trigger human review (HITL-006) or escalate to Context Manager |

## Anti-Patterns

- Loading “everything just in case”
- Ignoring co-load rules to save tokens
- Dropping security to fit more feature prose
- Using stale superseded modules
- Silent gap: empty module treated as complete

## Canonical Source

Context Architecture §6 (Retrieval) + Principal Review (Context Selection Engine gap).
