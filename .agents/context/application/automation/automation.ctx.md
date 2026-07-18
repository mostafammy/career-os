---
id: APPLICATION-002
title: "Automation Engine"
status: canonical
version: "1.0"
owner: "Backend Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: medium
change_frequency: medium
consumers:
  - Backend Agent
  - Frontend Agent
  - AI Agent
depends_on:
  - DOMAIN-008
  - CORE-004
tags:
  - application
  - automation
  - rules
  - deterministic
co_load:
  - DOMAIN-008
---

# APPLICATION-002 — Automation Engine

## Purpose

Deterministic, rule-based automations that reduce the administrative burden of tracking applications. These are NOT AI/ML-driven — they are predictable if-then rules that fire on entity state changes or temporal conditions.

## Core Philosophy

From Product Principle P-016: **Explain Before You Automate.**
- All automations are completely transparent to the user
- Every automated action produces a visible audit log
- Users can toggle or override behaviors in Settings

## Automation Categories

### 1. Lifecycle & State Automations

Fire when an entity changes state (references `state-machines.md`).

| Trigger | Condition | Automated Action |
|---|---|---|
| Opportunity → `ACTIONED` | Has no child Application | Create `Application` in `DRAFTING` linked to the Opportunity |
| Application → `INTERVIEWING` | No Interview Activity exists | Create pending Activity of type "Interview", prompt for Date/Time |
| Application → `REJECTED` / `ACCEPTED` / `DECLINED` | No Reflection exists | Generate `Reflection` task linked to Application, place in Inbox |
| Goal → `COMPLETED` | N/A | Trigger "Career Capital Review" prompt |

### 2. Temporal (Time-Based) Automations

Fire based on passage of time relative to stored dates.

| Trigger | Condition | Automated Action |
|---|---|---|
| Deadline Approach | Opportunity deadline < 48h away AND state is `CAPTURED` or `EVALUATING` | Add to "Urgent Decisions" dashboard; trigger push/email notification |
| Submission Follow-up | Application in `SUBMITTED` AND 14 days passed | Create Task: "Follow up on application status" + drafted follow-up email template |
| Interview Follow-up | Interview Activity occurred 24h ago | Create Task: "Send Thank You note to interviewers" |
| Stale Opportunity | Opportunity in `CAPTURED` AND > 30 days old with no deadline | Auto-transition to `ARCHIVED` (with undo toast notification) |

### 3. Organizational Automations

Keep the entity graph clean and organized.

| Trigger | Condition | Automated Action |
|---|---|---|
| Opportunity Created | Matches existing Organization domain/name | Link Opportunity to existing Organization aggregate |
| Contact Added | Email domain matches existing Organization | Link Contact to Organization |
| Document Uploaded | Attached directly to Application | Tag Document with Organization Name and Role Title |

## Technical Constraints

| Constraint | Requirement |
|---|---|
| **Idempotency** | All automations must be idempotent. Firing twice must not create duplicates |
| **Auditability** | Every mutated record: `updated_by = system:automation`, `automation_reason` string required |
| **Circuit Breakers** | If an automation fails (e.g., unable to link Organization), fail gracefully without blocking the user's core action |
| **Ordering** | State automations fire synchronously before the response is returned. Temporal automations fire asynchronously via cron/scheduler |
| **Reversibility** | Stale Opportunity archiving includes undo toast; all other automations are append-only (create Tasks, create Activities) |

## Implementation Strategy

| Phase | Capability |
|---|---|
| Phase 1 | State-change automations (inline in tRPC procedures) |
| Phase 2 | Temporal automations via Vercel Cron Jobs |
| Phase 3 | Full automation engine with rule configuration UI, Inngest/Trigger.dev |

## Canonical Source

`docs/04-automation/automation-spec.md`
