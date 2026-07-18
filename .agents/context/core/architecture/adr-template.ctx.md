---
id: CORE-006
title: "ADR Template"
status: canonical
version: "1.0"
owner: "Architect Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: very-high
change_frequency: extremely-low
confidence: 1.0
source_of_truth: ".agents/context/core/architecture/adr-template.ctx.md"
consumers:
  - Architect Agent
  - Documentation Agent
  - All Agents
depends_on:
  - CORE-003
tags:
  - core
  - architecture
  - adr
always_loaded: false
token_budget: 900
---

# CORE-006 — Architecture Decision Record Template

## Purpose

Standard schema for ADRs. Mentions of “ADRs” without a schema produce inconsistent, unsearchable decisions.

## File Location & Naming

```
docs/07-product-management/adrs/ADR-YYYYMMDD-short-slug.md
```

Also register in `product/decisions/decision-registry.ctx.md`.

## Required Frontmatter

```yaml
---
id: ADR-YYYYMMDD-##
title: "Short imperative title"
status: proposed | accepted | deprecated | superseded
date: YYYY-MM-DD
owner: AgentOrHuman
deciders: [names]
tags: [domain | architecture | security | ai | infra]
supersedes: ADR-id | null
superseded_by: ADR-id | null
related_modules: [CORE-003, DOMAIN-002, ...]
---
```

## Required Body Sections

### 1. Context

What forces require a decision? Include constraints, phase, and problem symptoms.

### 2. Decision

The choice in one clear paragraph. Use normative language (“We will…”).

### 3. Alternatives Considered

| Alternative | Pros | Cons | Why rejected |
|---|---|---|---|
| A | | | |
| B | | | |

Minimum two alternatives (including “do nothing” when relevant).

### 4. Consequences

**Positive:**  
**Negative:**  
**Risks & mitigations:**  
**Follow-up work:**

### 5. Status & Ownership

| Field | Value |
|---|---|
| Status | proposed / accepted / deprecated / superseded |
| Owner | |
| Review date | |

### 6. References

Links to modules, PRs, issues, eval runs.

## Status Lifecycle

```
proposed → accepted → deprecated
                  ↘ superseded (by new ADR)
```

- **proposed:** May not be relied on for implementation.
- **accepted:** Canonical; agents may implement.
- **deprecated:** Do not use for new work; keep for history.
- **superseded:** Pointer to replacement ADR required.

## Quality Rules

| ID | Rule |
|---|---|
| ADR-001 | No accepted ADR without Context + Decision + Alternatives + Consequences |
| ADR-002 | Irreversible or security decisions require human in deciders |
| ADR-003 | Domain invariant changes require ADR + HITL |
| ADR-004 | Prompt architecture / AI capability additions require ADR |
| ADR-005 | Stack additions/removals require ADR |
| ADR-006 | One decision per ADR |

## Minimal Example Skeleton

```markdown
# ADR-20260718-01 — Use tRPC for intent-based API

## Context
...
## Decision
We will expose application operations via tRPC routers with Zod inputs...
## Alternatives Considered
| Alternative | Pros | Cons | Why rejected |
| REST CRUD | Familiar | Encourages table-shaped API | Violates intent-based API principle |
## Consequences
Positive: type-safe client...
Negative: learning curve...
```

## Canonical Source

Principal Review (ADR System gap) + CORE-003.
