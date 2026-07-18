---
id: DECISION-001
title: "Decision Registry"
status: canonical
version: "1.0"
owner: "Architect Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: medium
change_frequency: high
confidence: 0.9
source_of_truth: ".agents/context/product/decisions/decision-registry.ctx.md"
consumers:
  - Architect Agent
  - PM Agent
  - Documentation Agent
  - All Agents
depends_on:
  - CORE-006
  - ROADMAP-001
tags:
  - product
  - decisions
  - adr
always_loaded: false
token_budget: 1000
note: "docs/07-product-management/decisions.md is empty; registry starts here."
---

# DECISION-001 — Decision Registry

## Purpose

Index of product and architecture decisions so agents do not re-litigate settled choices or miss supersessions.

## How to Use

1. Before proposing a significant change, search this registry.
2. If conflict with an **accepted** ADR → escalate; do not silently contradict.
3. New decisions: write ADR from CORE-006, then add a row here.
4. When superseded: update both ADR statuses and this table.

## Registry

| ID | Title | Status | Date | Owner | Area | Summary |
|---|---|---|---|---|---|---|
| ADR-BOOT-001 | Context as first-class architecture | accepted | 2026-07-18 | Architect | architecture | Context decomposed into CORE/DOMAIN/APPLICATION/FEATURE/UI modules under `.agents/context` |
| ADR-BOOT-002 | Clean Architecture + DDD bounded contexts | accepted | 2026-07-18 | Architect | architecture | Domain independent of infrastructure; CQRS + events |
| ADR-BOOT-003 | AI augments; never auto-commits career facts | accepted | 2026-07-18 | AI + Product | ai | User approval required for knowledge/document commits |
| ADR-BOOT-004 | Hybrid retrieval + always-load L0 | accepted | 2026-07-18 | Context Manager | context | Always-load identity/glossary/phase; semantic for domain/features |
| ADR-BOOT-005 | Deterministic automation ≠ probabilistic AI | accepted | 2026-07-18 | Architect | automation | Separate APPLICATION-001 vs APPLICATION-002 |
| ADR-BOOT-006 | Security always-loaded for engineering | accepted | 2026-07-18 | Security | security | APPLICATION-006 in L0 engineering sessions |
| ADR-BOOT-007 | Execution protocol + shared state required | accepted | 2026-07-18 | Architect | orchestration | APPLICATION-010/011 govern multi-agent work |
| ADR-BOOT-008 | Eval gates on prompt/context changes | accepted | 2026-07-18 | AI | evaluation | APPLICATION-012 suites block unsafe merges |

## Pending / Proposed

| ID | Title | Status | Blocker |
|---|---|---|---|
| — | Full visual design tokens | proposed | `docs/02-design/design-system.md` empty |
| — | CI-wired eval suites | proposed | App runtime / test harness not yet hooked to APPLICATION-012 |
| — | Human docs parity for decisions | proposed | `docs/07-product-management/decisions.md` empty |

## Decision Classes (Routing)

| Class | Requires ADR? | Human? |
|---|---|---|
| Local code style within CORE-005 | No | No |
| New public API shape | Yes | If breaking |
| Domain invariant / FSM change | Yes | Yes |
| New AI capability | Yes | Yes |
| Phase scope change | Yes (or roadmap amend) | Yes |
| Dependency add/remove | Yes | Yes |
| Prompt wording (non-ethical) | No (version + eval) | No |
| Prompt ethical surface change | Yes | Yes |

## Anti-Patterns

- “We decided in chat” without registry entry
- Implementing against a **proposed** ADR as if accepted
- Leaving superseded ADRs without `superseded_by`

## Canonical Source

CORE-006 template; product decisions doc when populated.
