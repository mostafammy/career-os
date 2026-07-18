---
id: FEATURE-004
title: "Applications"
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
  - DOMAIN-003
  - DOMAIN-002
tags:
  - feature
  - applications
  - phase-1
---

# FEATURE-004 — Applications

## Purpose

Prepare, submit, and track applications through the complete submission lifecycle.

## User Value

- Track every application from drafting through outcome
- Never miss a follow-up or interview
- Structured reflection on every outcome compounds knowledge

## Core Capabilities

| Capability | Description |
|---|---|
| **Application Workspace** | Unified view: checklist, documents, timeline, reflection |
| **Submission Tracking** | Lock timestamp when submitted externally |
| **Interview Management** | Record interview rounds with Activity entries |
| **Outcome Recording** | Track ACCEPTED, REJECTED, DECLINED, WITHDRAWN |
| **Reflection Prompt** | Auto-trigger reflection on terminal states |
| **Document Pinning** | Pin specific document versions to applications |

## Lifecycle (from state-machines.md)

```
DRAFTING → SUBMITTED → INTERVIEWING → OFFER_RECEIVED → ACCEPTED
         → REJECTED                                      → DECLINED
         → WITHDRAWN
```

## Application Workspace Tabs

| Tab | Content |
|---|---|
| Overview | Status, key dates, linked Opportunity |
| Checklist | Required deliverables and completion status |
| Interview | Interview rounds, notes, feedback |
| Documents | Linked documents with pinned versions |
| Timeline | Chronological activity and state transitions |
| Reflection | Post-action reflection and lessons |
| History | Full audit trail |

## Business Rules

- APP-001: DRAFTING requires at least one linked Document before SUBMITTED allowed
- APP-002: SUBMITTED locks submission timestamp; preparation artifacts become read-only
- APP-003: INTERVIEWING generates Activity record for each interview round
- APP-004: Terminal states (ACCEPTED, REJECTED, DECLINED) must prompt Reflection
- APP-005: WITHDRAWN can be triggered from any non-terminal state; optional reason required
- APP-006: Timeline shows all state transitions with timestamps

## Domain Events

ApplicationCreated, ApplicationSubmitted, InterviewScheduled, InterviewCompleted, OfferReceived, ApplicationAccepted, ApplicationRejected, ApplicationDeclined, ApplicationWithdrawn

## Dependencies

- DOMAIN-003 (Application) — Entity, lifecycle, events
- DOMAIN-002 (Opportunity) — Parent entity
- DOMAIN-006 (Document) — Linked documents
- APPLICATION-002 (Automation) — State-change automations
- APPLICATION-004 (API Layer) — Application Router

## Acceptance Criteria

- [ ] Application workspace shows all tabs with correct data
- [ ] Submission locks timestamp and prevents document edits
- [ ] Interview rounds generate Activity records
- [ ] Terminal states trigger Reflection prompt
- [ ] Timeline shows complete state transition history
