---
id: APPLICATION-005
title: "Database Schema"
status: canonical
version: "1.0"
owner: "Backend Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: high
change_frequency: low
consumers:
  - Backend Agent
  - DDD Agent
  - AI Agent
depends_on:
  - CORE-003
  - CORE-005
  - APPLICATION-007
tags:
  - application
  - database
  - prisma
  - postgresql
---

# APPLICATION-005 — Database Schema

## Purpose

Physical database schema implementing the conceptual domain model from `entities.md`. PostgreSQL via Prisma ORM. Prisma schema is the implementation source of truth.

## Design Principles

| ID | Principle |
|---|---|
| DB-001 | `entities.md` is canonical. This schema implements, not overrides, the domain model |
| DB-002 | Every table has `id` (cuid), `created_at`, `updated_at` |
| DB-003 | Soft delete via `deleted_at`. Hard delete only via retention policy |
| DB-004 | Enums map to `state-machines.md`. All lifecycle states are Postgres ENUMs |
| DB-005 | N:N relationships are first-class link tables with payload columns |
| DB-006 | Audit trail via Activity table. Activities are append-only, never mutated |

## Enumerations

| Enum | Values |
|---|---|
| `opportunity_status` | CAPTURED, EVALUATING, ACTIONED, ARCHIVED |
| `application_status` | DRAFTING, SUBMITTED, INTERVIEWING, OFFER_RECEIVED, ACCEPTED, REJECTED, DECLINED, WITHDRAWN |
| `goal_status` | DRAFT, ACTIVE, COMPLETED, ABANDONED |
| `document_status` | ACTIVE, EXPIRED, ARCHIVED |
| `notification_status` | PENDING, SENT, READ, DISMISSED |
| `reflection_type` | INTERVIEW, APPLICATION_OUTCOME, GOAL_COMPLETE, GOAL_ABANDONED, GENERAL |

## Tables — Strategy Context

| Table | Key Columns | Relationships |
|---|---|---|
| **User** | id, email, name, image | Owns all entities |
| **Vision** | id, user_id, statement | 1:1 with User |
| **Mission** | id, user_id, vision_id, title, description, status | Belongs to Vision |
| **Goal** | id, user_id, mission_id, objective, description, status, deadline | Belongs to Mission |
| **Milestone** | id, goal_id, title, description, completed, completed_at | Strong ownership by Goal (cascade delete) |

## Tables — Opportunity Context

| Table | Key Columns | Relationships |
|---|---|---|
| **Organization** | id, user_id, name, industry, website, notes | Has many Opportunities |
| **Opportunity** | id, user_id, organization_id, title, description, url, type, deadline, status, priority, opportunity_score, tags[], metadata, archived_at, deleted_at | Belongs to Organization; has many Applications |
| **Application** | id, user_id, opportunity_id, organization_id, status, submitted_at, accepted_at, notes, metadata, deleted_at | Belongs to Opportunity; has many Activities |
| **Task** | id, user_id, opportunity_id, application_id, title, description, due_date, completed, completed_at | Optional link to Opportunity or Application |
| **Activity** | id, user_id, opportunity_id, application_id, type, description, metadata, occurred_at | Immutable (no updated_at). Append-only audit trail |

## Tables — Knowledge Context

| Table | Key Columns | Relationships |
|---|---|---|
| **Document** | id, user_id, title, type, status, file_url, file_size, mime_type, version, tags[], expires_at, deleted_at | Linked to Opportunities and Applications via link tables |
| **Reflection** | id, user_id, application_id, opportunity_id, goal_id, type, content, lessons[] | Optional links to Application, Opportunity, or Goal |
| **KnowledgeEntry** | id, user_id, category, insight, source, tags[] | Linked to Goals via KnowledgeGoalLink |

## Tables — Integration Context

| Table | Key Columns | Relationships |
|---|---|---|
| **Reminder** | id, user_id, opportunity_id, application_id, title, description, remind_at, status | Optional link to Opportunity or Application |
| **CalendarEvent** | id, user_id, opportunity_id, application_id, title, description, start_time, end_time, all_day, external_id | Optional link to Opportunity or Application |

## N:N Link Tables

| Link Table | From | To | Payload Columns |
|---|---|---|---|
| **GoalOpportunityLink** | Goal | Opportunity | alignment_score, linked_at, linked_by |
| **OpportunityDocumentLink** | Opportunity | Document | requirement_type, notes |
| **ApplicationDocumentLink** | Application | Document | document_version_id, attached_at |
| **KnowledgeGoalLink** | KnowledgeEntry | Goal | provenance_note, linked_at |

## Indexes

| Table | Index | Columns | Purpose |
|---|---|---|---|
| Opportunity | idx_opp_user_status | user_id, status | Filter by user and status |
| Opportunity | idx_opp_deadline | deadline | Sort by deadline |
| Application | idx_app_user_status | user_id, status | Filter by user and status |
| Application | idx_app_opportunity | opportunity_id | Join with Opportunity |
| Task | idx_task_user_due | user_id, due_date | Dashboard upcoming tasks |
| Activity | idx_activity_user_occurred | user_id, occurred_at | Timeline queries |
| Document | idx_doc_user_type | user_id, type | Filter by type |
| Reflection | idx_refl_user | user_id, created_at | User reflection history |
| CalendarEvent | idx_cal_user_start | user_id, start_time | Calendar view |

## Deferred Entities (Phase 2+)

| Entity | Target Phase | Reason |
|---|---|---|
| CareerCapital | Phase 2 | Derived/computed; materialization strategy TBD |
| Contact | Phase 2 | CRM design pending |
| Template | Phase 2 | Document versioning design lands first |
| AIInsight | Phase 2 | Provenance model TBD |
| Notification | Phase 2 | Platform service |
| Settings | Phase 1 | Platform service |
| Automation | Phase 3 | Automation engine |
| Integration | Phase 3 | External service connections |

## Migration Strategy

- **Tool:** Prisma Migrate
- **Dev:** `prisma migrate dev` creates migration files
- **Prod:** `prisma migrate deploy` applies pending migrations
- **Preview:** Neon branching provides isolated database per PR
- **Backward compatibility:** Migrations must be backward-compatible for zero-downtime deploys

## Canonical Source

`docs/05-engineering/database.md`
