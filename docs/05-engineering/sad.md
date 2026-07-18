# System Architecture Document (SAD)

**File:** `docs/05-engineering/sad.md`

---

# System Architecture Document

**Status:** Canonical
**Version:** 1.0

---

## Purpose

This document defines the logical architecture of CareerOS. It describes system decomposition, bounded contexts, communication patterns, data flow, and module responsibilities.

The architecture is designed to remain stable regardless of implementation technology. Technology-specific decisions are in `docs/05-engineering/tech-stack.md`.

---

## 1. Architectural Vision

CareerOS is a **domain-driven, event-informed** single-page application with server-side rendering. The architecture follows Clean Architecture principles: the domain is the center, and infrastructure is the outermost layer.

```
┌─────────────────────────────────────────────────┐
│                  Presentation                    │
│         (Next.js App Router, React, shadcn)      │
├─────────────────────────────────────────────────┤
│                    API Layer                      │
│              (tRPC Routers, Zod)                 │
├─────────────────────────────────────────────────┤
│               Application Layer                  │
│         (Use cases, orchestration)               │
├─────────────────────────────────────────────────┤
│                 Domain Layer                     │
│    (Entities, State Machines, Business Rules)    │
├─────────────────────────────────────────────────┤
│              Infrastructure Layer                │
│     (Prisma, OpenAI, Vercel Blob, Auth)          │
└─────────────────────────────────────────────────┘
```

---

## 2. Bounded Contexts

CareerOS is divided into four bounded contexts, each owning its language, rules, and models.

### 2.1 Strategy Context

**Responsibility:** Long-term career trajectory — Vision, Missions, Goals, Milestones.

**Entities:** Vision, Mission, Goal, Milestone

**Key Behavior:** Goals influence Opportunity scoring during evaluation (read-only during evaluation session per XAG-004).

### 2.2 Opportunity Context

**Responsibility:** Capture, evaluation, and execution of career opportunities.

**Entities:** Organization, Opportunity, Application, Task, Activity

**Key Behavior:** Dual-lifecycle design. Opportunity models the evaluation decision; Application models execution tracking. Actioning an Opportunity atomically creates an Application (XAG-001).

### 2.3 Knowledge Context

**Responsibility:** Compounding career knowledge through reflection and reusable assets.

**Entities:** Document, Reflection, KnowledgeEntry

**Key Behavior:** Terminal Application states (ACCEPTED, REJECTED, DECLINED) trigger Reflection prompts (XAG-003). Reflections produce Knowledge Entries.

### 2.4 Platform Context

**Responsibility:** Shared services — authentication, notifications, calendar, search, settings.

**Entities:** User, Reminder, CalendarEvent, Notification

**Key Behavior:** Platform knows nothing about careers. It provides infrastructure services consumed by other contexts.

---

## 3. Cross-Context Communication

### 3.1 Within Request Cycle

Contexts communicate synchronously via direct function calls during a single request:

```
User clicks "Action" on Opportunity
  → Opportunity Context processes the transition
  → Creates Application (same aggregate, atomic)
  → Returns updated Opportunity + new Application
```

### 3.2 Side Effects

State transitions trigger side effects that may span contexts:

| Trigger | Side Effect | Target Context |
|---|---|---|
| Opportunity → ACTIONED | Application created, Tasks generated | Opportunity |
| Application → SUBMITTED | Follow-up reminder scheduled | Platform |
| Application → ACCEPTED/REJECTED/DECLINED | Reflection prompt triggered | Knowledge |
| Goal → COMPLETED | Career Reflection triggered | Knowledge |
| Opportunity captured | AI extraction begins (async) | Knowledge (AI) |

### 3.3 Event Awareness

While the alpha does not implement a full event bus, the architecture is designed for future event-driven expansion:

- Every state transition produces an Activity record (append-only audit log).
- The Event Catalog (`docs/05-engineering/ecs.md`) defines all domain events.
- Future phases will introduce an event bus for async cross-context communication.

---

## 4. Data Flow

### 4.1 Opportunity Capture Flow

```
Browser Extension / Manual Entry
  → Next.js API Route (tRPC)
    → Opportunity Router.capture()
      → Prisma: INSERT INTO Opportunity (status: CAPTURED)
      → OpenAI: Extract metadata (async)
      → Prisma: UPDATE Opportunity (metadata, organization link)
      → Return Opportunity to client
```

### 4.2 Application Submission Flow

```
User clicks "Submit" in Application Workspace
  → tRPC: application.submit()
    → Validate: all required documents linked
    → Prisma: UPDATE Application (status: SUBMITTED, submitted_at: NOW)
    → Prisma: INSERT INTO Reminder (follow-up in 14 days)
    → Prisma: INSERT INTO Activity (type: APPLICATION_SUBMITTED)
    → Return updated Application
```

### 4.3 Reflection Flow

```
Application reaches terminal state
  → Automation: trigger reflection prompt
  → User completes reflection form
  → tRPC: reflection.create()
    → Prisma: INSERT INTO Reflection
    → OpenAI: Extract lessons (async)
    → Prisma: INSERT INTO KnowledgeEntry (from extracted lessons)
    → Prisma: INSERT INTO Activity (type: REFLECTION_COMPLETED)
    → Return Reflection + KnowledgeEntries
```

---

## 5. Module Responsibilities

| Module | Location | Responsibility |
|---|---|---|
| Presentation | `src/app/` | Pages, layouts, client components |
| API Layer | `src/server/routers/` | tRPC routers, input validation |
| Domain | `src/server/domain/` | Business rules, state transitions |
| Data Access | `src/server/db/` | Prisma client, database queries |
| AI Services | `src/server/ai/` | OpenAI integration, prompt management |
| Auth | `src/server/auth/` | NextAuth.js configuration |
| Shared | `src/lib/` | Types, utilities, constants |

---

## 6. Key Architectural Decisions

| ID | Decision | Rationale | Trade-off |
|---|---|---|---|
| AD-001 | Server-side rendering (Next.js App Router) | Fast initial load, SEO, reduced client JS | More complex data fetching patterns |
| AD-002 | tRPC over REST/GraphQL | End-to-end type safety, no code generation | Tighter coupling between client/server |
| AD-003 | Prisma over raw SQL | Type safety, migration management, developer experience | Abstraction overhead for complex queries |
| AD-004 | Single PostgreSQL database | Simplicity, ACID transactions, full-text search | Single point of failure (mitigated by Neon backups) |
| AD-005 | Bounded contexts without separate services | Appropriate for single-developer alpha | Contexts share database (not service-isolated) |
| AD-006 | No event bus in alpha | Simplicity; side effects are synchronous | Future migration to async events required |

---

## 7. Evolution Path

| Phase | Architecture Change |
|---|---|
| Phase 1 (Alpha) | Monolith, synchronous side effects, single database |
| Phase 2 | Add Redis caching, background jobs (Inngest) |
| Phase 3 | Event bus for async cross-context communication |
| Phase 4 | Extract AI services into dedicated workers |
| Phase 5 | Multi-tenant architecture, RBAC |
| Phase 6 | Microservices extraction (if team size warrants) |

---

## References

| Document | Purpose |
|---|---|
| `docs/03-domain/entities.md` | Canonical entity definitions |
| `docs/03-domain/state-machines.md` | Lifecycle state machines |
| `docs/03-domain/erd.md` | Entity Relationship Diagram |
| `docs/05-engineering/ecs.md` | Event Catalog Specification |
| `docs/05-engineering/tech-stack.md` | Technology choices |
| `docs/05-engineering/database.md` | Physical schema |
| `docs/05-engineering/api-design.md` | API layer design |
| `docs/05-engineering/deployment.md` | Deployment architecture |
