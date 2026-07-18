---
id: FEATURE-003
title: "Opportunities"
status: canonical
version: "1.0"
owner: "Product Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: high
change_frequency: low
consumers:
  - Frontend Agent
  - Product Agent
  - DDD Agent
depends_on:
  - DOMAIN-002
  - DOMAIN-001
  - APPLICATION-001
tags:
  - feature
  - opportunities
  - phase-1
---

# FEATURE-003 — Opportunities

## Purpose

Manage the lifecycle of career opportunities from capture through evaluation to action.

## User Value

- Structured evaluation against strategic goals prevents reactive applying
- AI-powered fit scoring surfaces highest-value opportunities
- Complete audit trail from capture to decision

## Core Capabilities

| Capability | Description |
|---|---|
| **Opportunity Workspace** | Unified view of all opportunity data, tasks, documents, timeline |
| **Strategic Evaluation** | Score opportunities against active Goals (AI-assisted) |
| **Pipeline View** | Kanban-style view of CAPTURED → EVALUATING → ACTIONED → ARCHIVED |
| **Fit Score Display** | High/Medium/Low with reasoning bullets from AI |
| **Archive & Revive** | Soft-delete with undo; archived items remain searchable |
| **Bulk Operations** | Multi-select for archive, tag, or move |

## Lifecycle (from state-machines.md)

```
CAPTURED → EVALUATING → ACTIONED (creates Application)
         → ARCHIVED
ARCHIVED → CAPTURED (revive)
```

## Opportunity Workspace Tabs

| Tab | Content |
|---|---|
| Overview | Summary, key fields, status, fit score |
| Tasks | Linked tasks and deliverables |
| Applications | Child Application entities |
| Requirements | Required documents and deliverables |
| Documents | Linked documents via OpportunityDocumentLink |
| Timeline | Chronological activity feed |
| Knowledge | Related knowledge entries |
| AI | AI insights and recommendations |
| History | State transition log |

## Business Rules

- OPP-001: Opportunity in CAPTURED > 30 days without deadline auto-archives (with undo)
- OPP-002: ACTIONED requires at least one active Goal for scoring alignment
- OPP-003: Only ONE active Application per Opportunity at a time
- OPP-004: Archived opportunities remain searchable
- OPP-005: Fit score locked when transitioning to ACTIONED
- OPP-006: Deadline cannot precede creation date

## Domain Events

OpportunityCreated, OpportunityUpdated, OpportunityArchived, OpportunityRestored, OpportunityScored, DeadlineChanged, PriorityChanged

## Dependencies

- DOMAIN-002 (Opportunity) — Entity, lifecycle, events
- DOMAIN-001 (Strategy) — Goal alignment for scoring
- APPLICATION-001 (Intelligence) — Strategic Fit Scoring
- APPLICATION-002 (Automation) — State-change automations
- APPLICATION-004 (API Layer) — Opportunity Router

## Acceptance Criteria

- [ ] Opportunity workspace shows all tabs with correct data
- [ ] Pipeline view displays opportunities grouped by status
- [ ] AI Fit Score displays with reasoning bullets
- [ ] Archive with undo toast works correctly
- [ ] Only one active Application per Opportunity enforced
