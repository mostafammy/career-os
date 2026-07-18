---
id: DOMAIN-007
title: "Platform Domain"
status: canonical
version: "1.0"
owner: "DDD Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: high
change_frequency: low
consumers:
  - All Engineering Agents
depends_on:
  - CORE-002
  - CORE-003
tags:
  - domain
  - platform
  - cross-cutting
---

# DOMAIN-007 — Platform Domain

## Purpose

Define cross-cutting platform services: User, Activity, Notification, Reminder, CalendarEvent. Platform knows nothing about careers — it provides infrastructure services consumed by other contexts.

## Entity: User

**Purpose:** Authenticated individual who owns a CareerOS workspace.
**Phase 1:** Single-user alpha. Owner-only access.

### Attributes

| Attribute | Type | Notes |
|---|---|---|
| email | text | Unique, required |
| name | text | Optional |
| image | text | Avatar URL |

### Business Rules

- All queries include `WHERE user_id = ?` at repository layer (SEC-003, INV-009)
- Every aggregate has exactly one owner

## Entity: Activity

**Purpose:** Immutable historical record. Append-only audit trail.
**Explains:** Who, What, When, Why

### Attributes

| Attribute | Type | Notes |
|---|---|---|
| entity_type | text | "opportunity", "application", etc. |
| entity_id | text | ID of the entity |
| type | text | Action type |
| description | text | Human-readable |
| actor | text | "user:{id}", "system:automation", "ai:extraction" |
| metadata | jsonb | Additional context |
| occurred_at | timestamp | When it happened |

### Business Rules

- **INV-004:** Activities are immutable
- **INV-010:** Business events never mutate historical events
- No `updated_at` column — Activities only have `created_at`
- Activities are cross-context — any aggregate may generate them

## Entity: Notification

**Purpose:** Deliver timely reminders and system updates.

### Attributes

| Attribute | Type | Notes |
|---|---|---|
| title | text | Required |
| body | text | Optional |
| status | notification_status | PENDING, SENT, READ, DISMISSED |

### Anti-Spam Rules

- **Weekend Rule:** No notifications on weekends unless urgent
- **Batching:** Multiple notifications within 1 hour batched into one digest
- **Auto-Squelch:** Same notification type suppressed after 3 consecutive dismissals

## Entity: Reminder

**Purpose:** Scheduled notification prompting future action.

### Attributes

| Attribute | Type | Notes |
|---|---|---|
| opportunity_id | FK | Optional |
| application_id | FK | Optional |
| title | text | Required |
| remind_at | timestamp | When to trigger |
| status | notification_status | PENDING, SENT, READ, DISMISSED |

## Entity: CalendarEvent

**Purpose:** Time-based event linked to Opportunities or Applications.

### Attributes

| Attribute | Type | Notes |
|---|---|---|
| opportunity_id | FK | Optional |
| application_id | FK | Optional |
| title | text | Required |
| start_time | timestamp | Required |
| end_time | timestamp | Required |
| all_day | boolean | Default false |
| external_id | text | For external calendar sync (Phase 2+) |

## Domain Events

ReminderScheduled, ReminderTriggered, CalendarSynced, InterviewReminderGenerated, DeadlineApproaching, DeadlineMissed, UserAuthenticated, SessionExpired, NotificationSent, SearchIndexed, BackupCompleted, AuditRecorded

## Canonical Source

`docs/03-domain/entities.md`, `docs/05-engineering/database.md`
