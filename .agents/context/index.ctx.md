---
id: META-000
title: "Context Architecture — Master Module Registry"
status: canonical
version: "2.0"
owner: "Context Manager"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: high
change_frequency: medium
confidence: 1.0
source_of_truth: ".agents/context/index.ctx.md"
tags:
  - meta
  - index
always_loaded: true
token_budget: 2200
---

# Context Architecture — Master Module Registry

**Operational readiness target:** Production AI-native (orchestration + evaluation + prompts + state sync).  
**Entry point for agents:** `.agents/AGENTS.md`

## Status Legend

| Symbol | Meaning |
|---|---|
| ✅ | Populated & operational |
| ⚠️ | Populated with known gaps / lower confidence |
| 🔲 | Placeholder / empty content |
| ❌ | Missing file |

## Architecture Layers

```
CORE          identity · language · architecture · standards · product
DOMAIN        strategy · opportunity · application · knowledge · document · organization · platform · events
APPLICATION   intelligence · automation · analytics · api · database · security · infrastructure
              · orchestration · context · prompts · evaluation · testing
FEATURE       per-capability specs
UI            information-architecture · design-system
PRODUCT       roadmap · personas · decisions
META          index · loading · agents · memory · metadata
```

## Dependency Direction (Hard)

```
Allowed:                         Forbidden:
DOMAIN → CORE                    CORE → DOMAIN
APPLICATION → DOMAIN|CORE        DOMAIN → APPLICATION
FEATURE → DOMAIN|CORE            FEATURE → APPLICATION (except via API contracts)
PRODUCT → CORE                   CORE → FEATURE
META → all (read)                Domain modules importing UI
```

---

## CORE (Always-Load Candidates)

| ID | Module | File | Status | Always |
|---|---|---|---|---|
| CORE-001 | Project Identity | `core/identity/project.ctx.md` | ✅ | YES |
| CORE-002 | Glossary | `core/language/glossary.ctx.md` | ✅ | YES |
| CORE-003 | Architecture Principles | `core/architecture/principles.ctx.md` | ✅ | Eng |
| CORE-004 | Product Principles | `core/product/principles.ctx.md` | ✅ | Product |
| CORE-005 | Coding Standards | `core/standards/coding-standards.ctx.md` | ✅ | Eng |
| CORE-006 | ADR Template | `core/architecture/adr-template.ctx.md` | ✅ | On ADR work |

## PRODUCT

| ID | Module | File | Status | Always |
|---|---|---|---|---|
| ROADMAP-001 | Phase Registry | `product/roadmap/phase-registry.ctx.md` | ✅ | YES |
| ORGANIZATION-001 | Personas | `product/personas/personas.ctx.md` | ✅ | Product/UX |
| DECISION-001 | Decision Registry | `product/decisions/decision-registry.ctx.md` | ✅ | On decision work |

## DOMAIN

| ID | Module | File | Status |
|---|---|---|---|
| DOMAIN-001 | Strategy | `domain/strategy/strategy.ctx.md` | ✅ |
| DOMAIN-002 | Opportunity | `domain/opportunity/opportunity.ctx.md` | ✅ |
| DOMAIN-003 | Application | `domain/application/application.ctx.md` | ✅ |
| DOMAIN-004 | Knowledge | `domain/knowledge/knowledge.ctx.md` | ✅ |
| DOMAIN-005 | Organization | `domain/organization/organization.ctx.md` | ✅ |
| DOMAIN-006 | Document | `domain/document/document.ctx.md` | ✅ |
| DOMAIN-007 | Platform | `domain/platform/platform.ctx.md` | ✅ |
| DOMAIN-008 | Event Catalog | `domain/events/event-catalog.ctx.md` | ✅ |

## APPLICATION — Platform

| ID | Module | File | Status | Always |
|---|---|---|---|---|
| APPLICATION-001 | Intelligence Engine | `application/intelligence/intelligence.ctx.md` | ✅ | AI tasks |
| APPLICATION-002 | Automation Engine | `application/automation/automation.ctx.md` | ✅ | — |
| APPLICATION-003 | Analytics Engine | `application/analytics/analytics.ctx.md` | ✅ | — |
| APPLICATION-004 | API Layer | `application/api/api-layer.ctx.md` | ✅ | — |
| APPLICATION-005 | Database Schema | `application/database/schema.ctx.md` | ✅ | — |
| APPLICATION-006 | Security | `application/security/security.ctx.md` | ✅ | Eng YES |
| APPLICATION-007 | Tech Stack | `application/infrastructure/tech-stack.ctx.md` | ✅ | Eng YES |
| APPLICATION-008 | Deployment | `application/infrastructure/deployment.ctx.md` | ✅ | — |

## APPLICATION — Operational AI (Production Layer)

| ID | Module | File | Status | Always |
|---|---|---|---|---|
| APPLICATION-009 | Context Selection Engine | `application/context/context-selection.ctx.md` | ✅ | YES (implicit) |
| APPLICATION-010 | Execution Protocol | `application/orchestration/execution-protocol.ctx.md` | ✅ | Multi-agent YES |
| APPLICATION-011 | Shared State Sync | `application/orchestration/shared-state.ctx.md` | ✅ | Multi-agent |
| APPLICATION-012 | Evaluation Framework | `application/evaluation/evals.ctx.md` | ✅ | On ship gates |
| APPLICATION-013 | AI Test Cases | `application/testing/ai-test-cases.ctx.md` | ✅ | AI changes |

## APPLICATION — Prompt Assets

| ID | Module | File | Status |
|---|---|---|---|
| PROMPT-001 | System Prompts | `application/prompts/system-prompts.ctx.md` | ✅ |
| PROMPT-002 | Task Prompts | `application/prompts/task-prompts.ctx.md` | ✅ |
| PROMPT-003 | Tool Prompts | `application/prompts/tool-prompts.ctx.md` | ✅ |
| PROMPT-004 | Output Contracts | `application/prompts/output-contracts.ctx.md` | ✅ |

## FEATURE

| ID | Feature | File | Phase | Status |
|---|---|---|---|---|
| FEATURE-001 | Dashboard | `feature/dashboard/spec.ctx.md` | 1 | ✅ |
| FEATURE-002 | Inbox | `feature/inbox/spec.ctx.md` | 1 | ✅ |
| FEATURE-003 | Opportunities | `feature/opportunities/spec.ctx.md` | 1 | ✅ |
| FEATURE-004 | Applications | `feature/applications/spec.ctx.md` | 1 | ✅ |
| FEATURE-005 | Organizations | `feature/organizations/spec.ctx.md` | 2 | ✅ |
| FEATURE-006 | Documents | `feature/documents/spec.ctx.md` | 1 | ✅ |
| FEATURE-007 | Goals | `feature/goals/spec.ctx.md` | 3 | ✅ |
| FEATURE-008 | Calendar | `feature/calendar/spec.ctx.md` | 2 | ✅ |
| FEATURE-009 | Knowledge | `feature/knowledge/spec.ctx.md` | 2 | ✅ |
| FEATURE-010 | Analytics | `feature/analytics/spec.ctx.md` | 2 | ✅ |
| FEATURE-011 | Search | `feature/search/spec.ctx.md` | 1 | ✅ |
| FEATURE-012 | AI Assistant | `feature/ai-assistant/spec.ctx.md` | 3 | ✅ |
| FEATURE-013 | Notifications | `feature/notifications/spec.ctx.md` | 2 | ✅ |
| FEATURE-014 | Settings | `feature/settings/spec.ctx.md` | 1 | ✅ |

> Note: many `docs/01-product/features/*.md` sources are still empty; feature **context** modules above are the agent SSOT for now.

## UI

| ID | Module | File | Status |
|---|---|---|---|
| UI-001 | Information Architecture | `ui/ia/information-architecture.ctx.md` | ✅ |
| UI-002 | Design System | `ui/design/design-system.ctx.md` | ⚠️ |

## META / Policy

| ID | Document | File | Status | Always |
|---|---|---|---|---|
| META-000 | This registry | `index.ctx.md` | ✅ | YES |
| META-001 | Context Loading Policy | `11-ai/context-loading-policy.md` | ✅ | YES |
| META-002 | Agent Operating Manual | `11-ai/agent-operating-manual.md` | ✅ | YES |
| META-003 | Memory Policy | `11-ai/memory-policy.md` | ✅ | YES |
| META-005 | Module Metadata Schema | `meta/module-metadata.ctx.md` | ✅ | On authoring |

---

## Co-Load Rules (Critical)

| Primary | Must Co-load |
|---|---|
| DOMAIN-003 | DOMAIN-002 |
| APPLICATION-001 | APPLICATION-006 + DOMAIN-004 |
| APPLICATION-002 | DOMAIN-008 |
| FEATURE-* | Parent DOMAIN-* |
| PROMPT-* | APPLICATION-001 + CORE-002 |
| APPLICATION-010 | APPLICATION-011 (multi-agent) |
| APPLICATION-012 | PROMPT-004 + APPLICATION-013 (AI ship) |

## Default Load Profiles

| Profile | Modules |
|---|---|
| **Any session** | CORE-001, CORE-002, ROADMAP-001, META-000/001/002/003 |
| **Engineering** | + CORE-003, CORE-005, APP-006, APP-007 |
| **Product** | + CORE-004, personas as needed |
| **AI implementation** | + APP-001, APP-006, PROMPT-001..004, DOMAIN-002/003/004, APP-012/013 |
| **Multi-agent task** | + APP-009, APP-010, APP-011 |
| **Feature UI** | + UI-001, UI-002, FEATURE-*, parent DOMAIN-* |

## Maturity Scorecard (Post v2)

| Dimension | Score | Notes |
|---|---:|---|
| Context Architecture | 10 | Layered modules intact |
| DDD Alignment | 10 | Domain boundaries preserved |
| Agent Design | 9 | Roles + execution authority (APP-010) |
| Retrieval Design | 9 | Selection engine + budgets (APP-009) |
| Memory Design | 9 | Expiration + summarization (META-003) |
| Prompt Engineering | 9 | Prompt asset layer present |
| Evaluation Framework | 9 | Metrics + test cases |
| Orchestration | 9 | Lifecycle + shared state |
| Operational Readiness | 8.5 | Remaining: analytics/deployment modules, design tokens |
| Scalability | 10 | Hierarchy scales |

## Remaining Gaps (Do Next)

1. Fill `docs/02-design/design-system.md` and raise UI-002 confidence to 1.0
2. Mirror feature SSOT back into empty `docs/01-product/features/*` when ready
3. Wire CI to APPLICATION-012 smoke suites when application code exists
4. Author real ADRs under `docs/07-product-management/adrs/` as decisions accumulate
5. Populate empty `docs/07-product-management/decisions.md` from DECISION-001

## Canonical Human Doc

`docs/Context Architecture.md` — design rationale.  
`.agents/context/*` — **runtime agent context** (this tree).
