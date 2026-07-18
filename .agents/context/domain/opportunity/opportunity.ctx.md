---
id: DOMAIN-002
title: "Opportunity Domain"
status: canonical
version: "1.0"
owner: "DDD Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: high
change_frequency: medium
consumers:
  - DDD Agent
  - Backend Agent
  - Architect Agent
  - Frontend Agent
  - AI Agent
  - Automation Agent
depends_on:
  - CORE-002
  - CORE-003
tags:
  - domain
  - opportunity
  - lifecycle
---

# DOMAIN-002 — Opportunity Domain

## Purpose

Complete context for reasoning about Opportunity capture, evaluation, and actioning. This is the **heart of CareerOS** — more code touches this domain than any other.

## Entity: Opportunity

**Purpose:** Represents a potential career advancement worth evaluating.
**Examples:** Scholarship, Internship, Job, Hackathon, Conference, Research Position, Grant, Competition, Exchange Program
**Aggregate Root:** Yes — owns Applications, Tasks, Documents, Activities, Timeline, AI Insights

### Attributes

| Attribute | Type | Notes |
|---|---|---|
| title | text | Required |
| description | text | Optional |
| url | text | Source URL |
| type | text | Internship, Scholarship, etc. |
| deadline | timestamp | Optional |
| status | opportunity_status | FSM state |
| priority | integer | 0 = default |
| opportunity_score | float | Computed during evaluation |
| tags | text[] | User-defined |
| metadata | jsonb | Flexible extension |
| archived_at | timestamp | When archived |
| deleted_at | timestamp | Soft delete |

### Computed Properties

- **Opportunity Score:** 10-dimension evaluation (Strategic Alignment, Expected Value, Probability of Success, Required Effort, Deadline Urgency, Financial Cost, Learning Value, Networking Potential, Prestige, Personal Interest)
- **Days Remaining:** deadline - now
- **Preparation Progress:** percentage of tasks completed
- **Application Count:** number of child Applications
- **Risk Level:** derived from deadline + effort + probability
- **Strategic Alignment:** derived from active Goals (XAG-004)

### Lifecycle (FSM)

```
[*] → CAPTURED
CAPTURED → EVALUATING (begin research)
CAPTURED → ARCHIVED (auto-expire 30d or manual)
EVALUATING → ACTIONED (decide to apply → creates Application)
EVALUATING → ARCHIVED (decide not to pursue)
ARCHIVED → CAPTURED (revive)
```

### State Definitions

| State | Description |
|---|---|
| **CAPTURED** | Raw entry point. Minimal data. Not yet evaluated. |
| **EVALUATING** | User actively scoring against Goals. Research, comparison, decision. |
| **ACTIONED** | Terminal. User decided to pursue. Application auto-created. |
| **ARCHIVED** | Soft-deleted. Searchable. Revocable. |

### Transition Rules

| From | To | Trigger | Side Effects |
|---|---|---|---|
| *(new)* | CAPTURED | Created via any capture method | AI extraction begins (async). Organization linked/created. |
| CAPTURED | EVALUATING | User clicks "Start Evaluation" | Scoring dimensions initialized. Strategy Context loaded. |
| CAPTURED | ARCHIVED | Auto-expire (30d, no deadline) or manual | Toast with undo. Analytics updated. |
| EVALUATING | ACTIONED | User clicks "Action" | **Application created** in DRAFTING. Score locked. Tasks generated. |
| EVALUATING | ARCHIVED | User clicks "Not Now" | Reason logged (optional). Analytics updated. |
| ARCHIVED | CAPTURED | User revives | Returns for re-evaluation. Historical score discarded. |

### Business Rules

- **OP-001:** CAPTURED >30 days without deadline → auto ARCHIVED (with undo)
- **OP-002:** ACTIONED requires at least one active Goal for scoring alignment
- **OP-003:** Only ONE active Application per Opportunity at a time
- **OP-004:** ARCHIVED remains searchable in "All Opportunities" with filter
- **OP-005:** Score locked when transitioning to ACTIONED, stored in history

### Domain Events

OpportunityCaptured, OpportunityClassified, OpportunityResearched, OpportunityScored, OpportunityPrioritized, OpportunityDeferred, OpportunityArchived, OpportunityRestored, OpportunityExpired, OpportunityActioned

### Quick Capture Rules

- <30 seconds to capture
- Requires only: Title + optional URL
- AI extracts remaining fields asynchronously
- User reviews extracted data before save

## Domain Invariants

- **INV-001:** Every Application belongs to exactly one Opportunity
- **INV-006:** Archived entities remain searchable

## Relationships

| Relationship | Target | Cardinality |
|---|---|---|
| Belongs to | User | N:1 |
| May belong to | Organization | N:1 |
| May link to | Goal | N:N (GoalOpportunityLink) |
| Produces | Application | 1:N |
| Requires | Document | N:N (OpportunityDocumentLink) |
| Generates | Activity | 1:N |

## Canonical Source

`docs/03-domain/entities.md` (§21.1), `docs/03-domain/state-machines.md` (§1)
