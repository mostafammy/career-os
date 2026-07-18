---
id: DOMAIN-003
title: "Application Domain"
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
  - AI Agent
  - Automation Agent
depends_on:
  - CORE-002
  - CORE-003
  - DOMAIN-002
tags:
  - domain
  - application
  - lifecycle
---

# DOMAIN-003 — Application Domain

## Purpose

Complete context for reasoning about the Application lifecycle. Application is **always reasoned about in relation to its parent Opportunity**.

## CRITICAL: Co-Load Rule

**DOMAIN-003 MUST always co-load with DOMAIN-002 (Opportunity).**

Reason: XAG-001 through XAG-005 create mandatory dependencies. Application reasoning without Opportunity context produces incorrect implementations.

## Entity: Application

**Purpose:** Represents one submission to one opportunity. The execution engine.
**Aggregate Root:** Yes — owns Submission, Documents, Interview, Reflection, Timeline

### Attributes

| Attribute | Type | Notes |
|---|---|---|
| opportunity_id | text (FK) | Required. Parent Opportunity |
| organization_id | text (FK) | Optional. Denormalized from Opportunity |
| status | application_status | FSM state |
| submitted_at | timestamp | Locked on submit |
| accepted_at | timestamp | When accepted |
| notes | text | Free-form |
| metadata | jsonb | Flexible extension |
| deleted_at | timestamp | Soft delete |

### Computed Properties

- **Readiness Score:** percentage of deliverables complete
- **Submission Duration:** now - created_at
- **Waiting Time:** now - submitted_at (if submitted)
- **Interview Count:** number of interview activities
- **Success Probability:** derived from status + organization history

### Lifecycle (FSM)

```
[*] → DRAFTING (auto-created from ACTIONED Opportunity)
DRAFTING → SUBMITTED (user submits)
DRAFTING → WITHDRAWN (user abandons)
SUBMITTED → INTERVIEWING (invited to interview)
SUBMITTED → REJECTED (denied)
SUBMITTED → WITHDRAWN
INTERVIEWING → OFFER_RECEIVED (offer extended)
INTERVIEWING → REJECTED (denied post-interview)
INTERVIEWING → WITHDRAWN
OFFER_RECEIVED → ACCEPTED (offer signed)
OFFER_RECEIVED → DECLINED (user rejects)
```

### State Definitions

| State | Description |
|---|---|
| **DRAFTING** | Preparing deliverables (essays, CV, documents) |
| **SUBMITTED** | Delivered to organization. Timestamp locked. Follow-ups scheduled. |
| **INTERVIEWING** | Interview process active. May span multiple rounds. |
| **OFFER_RECEIVED** | Positive decision. Pending user acceptance. |
| **ACCEPTED** | Terminal. Offer signed. Triggers celebration + reflection + Career Capital update. |
| **REJECTED** | Terminal. Denied by organization. Triggers reflection prompt. |
| **DECLINED** | Terminal. User actively rejects offer. Triggers reflection prompt. |
| **WITHDRAWN** | Terminal. User abandons at any point. Historical data preserved. |

### Transition Rules

| From | To | Trigger | Side Effects |
|---|---|---|---|
| *(new)* | DRAFTING | Created from ACTIONED Opportunity | Documents linked. Tasks generated. Deliverables initialized. |
| DRAFTING | SUBMITTED | User clicks "Submit" | Submission timestamp locked. Prep artifacts read-only. Follow-ups scheduled. |
| DRAFTING | WITHDRAWN | User clicks "Withdraw" | Historical data preserved. Analytics updated. |
| SUBMITTED | INTERVIEWING | Organization invites | Interview Activity generated. Calendar event created. |
| SUBMITTED | REJECTED | Application denied | Reflection prompt triggered. Analytics updated. |
| SUBMITTED | WITHDRAWN | User withdraws | Historical data preserved. |
| INTERVIEWING | OFFER_RECEIVED | Offer extended | Offer details recorded. Response deadline set. |
| INTERVIEWING | REJECTED | Denied post-interview | Reflection prompt. Interview feedback recorded. |
| INTERVIEWING | WITHDRAWN | User drops out | Historical data preserved. |
| OFFER_RECEIVED | ACCEPTED | User accepts | **Celebration.** Career Capital updated. Reflection prompt. |
| OFFER_RECEIVED | DECLINED | User declines | Reflection prompt. Reason recorded. |

### Business Rules

- **APP-001:** DRAFTING requires at least one linked Document before SUBMITTED
- **APP-002:** SUBMITTED locks submission timestamp, prevents document edits
- **APP-003:** INTERVIEWING generates Activity per interview round
- **APP-004:** ACCEPTED/REJECTED/DECLINED **must** prompt Reflection (Knowledge Compounding)
- **APP-005:** WITHDRAWN from any non-terminal state. Optional reason required.
- **APP-006:** Timeline view shows all state transitions with timestamps

### Domain Events

ApplicationCreated, PreparationStarted, ChecklistCompleted, ApplicationSubmitted, InterviewScheduled, InterviewCompleted, OfferReceived, ApplicationAccepted, ApplicationRejected, ApplicationWithdrawn, ApplicationArchived

## Cross-Aggregate Rules

| Rule | Description |
|---|---|
| **XAG-001** | ACTIONED Opportunity **must** atomically create Application in DRAFTING |
| **XAG-002** | Application's parent Opportunity must be in ACTIONED state |
| **XAG-003** | Terminal Application states trigger Reflection prompt (Knowledge Context) |
| **XAG-004** | Goal scoring read-only during Opportunity EVALUATING |
| **XAG-005** | Revived Opportunity discards historical score |

## Domain Invariants

- **INV-001:** Every Application belongs to exactly one Opportunity

## Relationships

| Relationship | Target | Cardinality |
|---|---|---|
| Belongs to | Opportunity | N:1 |
| May belong to | Organization | N:1 |
| References | Document | N:N (ApplicationDocumentLink with version pinning) |
| Generates | Reflection | 1:0..1 |
| Generates | Activity | 1:N |

## Canonical Source

`docs/03-domain/entities.md` (§21.2), `docs/03-domain/state-machines.md` (§2)
