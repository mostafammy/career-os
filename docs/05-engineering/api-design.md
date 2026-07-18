# API Design Specification

**File:** `docs/05-engineering/api-design.md`

---

# API Design

**Status:** Canonical
**Version:** 1.0

---

## Purpose

This document defines the API layer for CareerOS using tRPC (type-safe RPC over HTTP). The API is organized by aggregate and uses intent-based operation names that reflect domain actions, not HTTP methods.

---

## Design Principles

1. **Type safety end-to-end.** No code generation. TypeScript types flow from database (Prisma) through API (tRPC) to client (React).
2. **Intent-based operations.** Use `captureOpportunity`, not `PATCH /opportunities/:id`.
3. **Domain-driven naming.** Procedure names use the ubiquitous language from `docs/00-overview/glossary.md`.
4. **Input validation with Zod.** Every procedure validates input with Zod schemas.
5. **Single-user alpha.** No multi-tenant routing. Auth checks verify ownership.

---

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

Routers are organized by aggregate root. Each aggregate router exposes procedures for its domain operations.

---

## Opportunity Router

```typescript
opportunityRouter = {
  // Capture a new opportunity (from extension, URL, or manual)
  capture:           (input: CaptureInput) → Opportunity

  // Begin evaluating an opportunity against goals
  evaluate:          (id: string) → Opportunity

  // Decide to pursue — creates Application automatically
  action:            (id: string) → { opportunity, application }

  // Archive an opportunity (soft delete)
  archive:           (id: string) → Opportunity

  // Revive from archive
  revive:            (id: string) → Opportunity

  // Get single opportunity with full context
  getById:           (id: string) → OpportunityWithRelations

  // List opportunities with filters
  list:              (filters: ListFilters) → Opportunity[]

  // Update opportunity metadata
  update:            (id: string, input: UpdateInput) → Opportunity
}
```

---

## Application Router

```typescript
applicationRouter = {
  // Create application from actioned opportunity
  create:            (opportunityId: string) → Application

  // Submit application externally, record timestamp
  submit:            (id: string) → Application

  // Record interview round
  interview:         (id: string, input: InterviewInput) → Application

  // Accept offer
  accept:            (id: string) → Application

  // Decline offer
  decline:           (id: string, input?: DeclineInput) → Application

  // Withdraw from process
  withdraw:          (id: string, input?: WithdrawInput) → Application

  // Get single application with full context
  getById:           (id: string) → ApplicationWithRelations

  // List applications with filters
  list:              (filters: ListFilters) => Application[]
}
```

---

## Goal Router

```typescript
goalRouter = {
  // Create a new goal
  create:            (input: CreateGoalInput) → Goal

  // Activate goal (requires at least one Milestone)
  activate:          (id: string) → Goal

  // Complete goal — triggers reflection prompt
  complete:          (id: string) → Goal

  // Abandon goal — triggers reflection prompt
  abandon:           (id: string, input?: AbandonInput) → Goal

  // Get single goal with milestones
  getById:           (id: string) → GoalWithMilestones

  // List goals with filters
  list:              (filters: ListFilters) → Goal[]
}
```

---

## Document Router

```typescript
documentRouter = {
  // Upload new document
  upload:            (input: UploadInput) → Document

  // Create new version of existing document
  createVersion:     (id: string, input: VersionInput) → Document

  // Link document to opportunity
  linkToOpportunity: (documentId: string, opportunityId: string, input: LinkInput) → void

  // Link document to application (pins version)
  linkToApplication: (documentId: string, applicationId: string) → void

  // Unlink document
  unlink:            (documentId: string, targetType: string, targetId: string) → void

  // Get single document with versions
  getById:           (id: string) → DocumentWithVersions

  // List documents with filters
  list:              (filters: ListFilters) → Document[]
}
```

---

## Organization Router

```typescript
organizationRouter = {
  // Create or match existing organization
  create:            (input: CreateOrgInput) → Organization

  // Update organization details
  update:            (id: string, input: UpdateOrgInput) → Organization

  // Get single organization with opportunities
  getById:           (id: string) → OrganizationWithRelations

  // List organizations
  list:              (filters: ListFilters) → Organization[]
}
```

---

## Reflection Router

```typescript
reflectionRouter = {
  // Create a new reflection
  create:            (input: CreateReflectionInput) → Reflection

  // Update reflection content
  update:            (id: string, input: UpdateReflectionInput) → Reflection

  // Get single reflection
  getById:           (id: string) => Reflection

  // List reflections with filters
  list:              (filters: ListFilters) => Reflection[]
}
```

---

## Dashboard Router

```typescript
dashboardRouter = {
  // Get dashboard summary (deadlines, stats, priorities)
  getSummary:        () => DashboardSummary

  // Get upcoming deadlines and events
  getUpcoming:       (days: number) => UpcomingItem[]

  // Get application statistics
  getStats:          () => DashboardStats
}
```

---

## Calendar Router

```typescript
calendarRouter = {
  // Get events for date range
  getEvents:         (range: DateRange) => CalendarEvent[]

  // Create calendar event
  createEvent:       (input: CreateEventInput) => CalendarEvent

  // Delete calendar event
  deleteEvent:       (id: string) => void
}
```

---

## Search Router

```typescript
searchRouter = {
  // Global full-text search across all entities
  globalSearch:      (query: string) => SearchResult[]

  // Search opportunities specifically
  searchOpportunities: (query: string) => Opportunity[]

  // Search documents specifically
  searchDocuments:   (query: string) => Document[]
}
```

---

## Error Handling

All procedures return typed errors:

| Error Code | Meaning |
|---|---|
| NOT_FOUND | Entity does not exist |
| FORBIDDEN | User does not own this entity |
| BAD_REQUEST | Input validation failed |
| CONFLICT | Entity is in an invalid state for this operation |
| INTERNAL_SERVER_ERROR | Unexpected server error |

Domain-specific errors (e.g., "Cannot submit application without documents") use the CONFLICT code with a descriptive message.

---

## Rate Limiting

Single-user alpha: no rate limiting required. If the product expands to multi-user, implement per-user rate limiting at the tRPC middleware layer.

---

## API Versioning

tRPC does not require explicit versioning. Breaking changes are handled through:

1. **Additive changes** (new fields, new procedures) — no version bump needed.
2. **Breaking changes** (renamed fields, removed procedures) — require a migration step and deprecation period.
3. **Schema version** tracked in `package.json` version field.

---

## References

| Document | Purpose |
|---|---|
| `docs/03-domain/entities.md` | Entity definitions and relationships |
| `docs/05-engineering/ecs.md` | Event names used in side effects |
| `docs/05-engineering/database.md` | Physical schema (Prisma types) |
| `docs/00-overview/glossary.md` | Ubiquitous Language for naming |
