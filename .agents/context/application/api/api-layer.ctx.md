---
id: APPLICATION-004
title: "API Layer"
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
depends_on:
  - CORE-003
  - CORE-005
  - APPLICATION-007
tags:
  - application
  - api
  - trpc
---

# APPLICATION-004 — API Layer

## Purpose

Type-safe RPC layer connecting React frontend to PostgreSQL database via tRPC. All procedures use intent-based naming reflecting domain actions, not HTTP methods.

## Architecture

```
Client (React)
    ↓ tRPC hooks
tRPC Router
    ↓
Aggregate Routers (opportunity, application, goal, ...)
    ↓
Prisma Client
    ↓
PostgreSQL
```

## Design Principles

| ID | Principle |
|---|---|
| API-001 | **Type safety end-to-end.** No code generation. TypeScript types flow from Prisma → tRPC → React |
| API-002 | **Intent-based operations.** `captureOpportunity`, not `PATCH /opportunities/:id` |
| API-003 | **Domain-driven naming.** Procedure names use the Ubiquitous Language from CORE-002 |
| API-004 | **Input validation with Zod.** Every procedure validates input with Zod schemas |
| API-005 | **Single-user alpha.** No multi-tenant routing. Auth checks verify ownership |

## Aggregate Routers

### Opportunity Router

| Procedure | Input | Output |
|---|---|---|
| `capture` | CaptureInput | Opportunity |
| `evaluate` | id | Opportunity |
| `action` | id | { opportunity, application } |
| `archive` | id | Opportunity |
| `revive` | id | Opportunity |
| `getById` | id | OpportunityWithRelations |
| `list` | ListFilters | Opportunity[] |
| `update` | id, UpdateInput | Opportunity |

### Application Router

| Procedure | Input | Output |
|---|---|---|
| `create` | opportunityId | Application |
| `submit` | id | Application |
| `interview` | id, InterviewInput | Application |
| `accept` | id | Application |
| `decline` | id, DeclineInput? | Application |
| `withdraw` | id, WithdrawInput? | Application |
| `getById` | id | ApplicationWithRelations |
| `list` | ListFilters | Application[] |

### Goal Router

| Procedure | Input | Output |
|---|---|---|
| `create` | CreateGoalInput | Goal |
| `activate` | id | Goal |
| `complete` | id | Goal |
| `abandon` | id, AbandonInput? | Goal |
| `getById` | id | GoalWithMilestones |
| `list` | ListFilters | Goal[] |

### Document Router

| Procedure | Input | Output |
|---|---|---|
| `upload` | UploadInput | Document |
| `createVersion` | id, VersionInput | Document |
| `linkToOpportunity` | docId, oppId, LinkInput | void |
| `linkToApplication` | docId, appId | void |
| `unlink` | docId, targetType, targetId | void |
| `getById` | id | DocumentWithVersions |
| `list` | ListFilters | Document[] |

### Organization Router

| Procedure | Input | Output |
|---|---|---|
| `create` | CreateOrgInput | Organization |
| `update` | id, UpdateOrgInput | Organization |
| `getById` | id | OrganizationWithRelations |
| `list` | ListFilters | Organization[] |

### Reflection Router

| Procedure | Input | Output |
|---|---|---|
| `create` | CreateReflectionInput | Reflection |
| `update` | id, UpdateReflectionInput | Reflection |
| `getById` | id | Reflection |
| `list` | ListFilters | Reflection[] |

### Dashboard Router

| Procedure | Input | Output |
|---|---|---|
| `getSummary` | — | DashboardSummary |
| `getUpcoming` | days | UpcomingItem[] |
| `getStats` | — | DashboardStats |

### Calendar Router

| Procedure | Input | Output |
|---|---|---|
| `getEvents` | DateRange | CalendarEvent[] |
| `createEvent` | CreateEventInput | CalendarEvent |
| `deleteEvent` | id | void |

### Search Router

| Procedure | Input | Output |
|---|---|---|
| `globalSearch` | query | SearchResult[] |
| `searchOpportunities` | query | Opportunity[] |
| `searchDocuments` | query | Document[] |

## Error Handling

| Error Code | Meaning |
|---|---|
| `NOT_FOUND` | Entity does not exist |
| `FORBIDDEN` | User does not own this entity |
| `BAD_REQUEST` | Input validation failed |
| `CONFLICT` | Entity is in an invalid state for this operation |
| `INTERNAL_SERVER_ERROR` | Unexpected server error |

Domain-specific errors use `CONFLICT` with a descriptive message (e.g., "Cannot submit application without documents").

## Rate Limiting

Single-user alpha: no rate limiting. If multi-user, implement per-user rate limiting at tRPC middleware layer.

## API Versioning

tRPC does not require explicit versioning. Additive changes (new fields/procedures) need no version bump. Breaking changes require migration + deprecation period.

## Canonical Source

`docs/05-engineering/api-design.md`
