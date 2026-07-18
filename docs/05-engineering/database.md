# Database Specification

**File:** `docs/05-engineering/database.md`

---

# Database Specification

**Status:** Canonical
**Version:** 1.0

---

## Purpose

This document defines the physical database schema for CareerOS. It implements the conceptual domain model defined in `docs/03-domain/entities.md` and the ERD in `docs/03-domain/erd.md`.

The schema uses PostgreSQL via Prisma ORM. Prisma schema is the implementation source of truth; this document provides the design rationale and reference.

---

## Design Principles

1. **entities.md is canonical.** This schema implements, not overrides, the domain model.
2. **Every table has `id`, `created_at`, `updated_at`.** IDs are cuid strings.
3. **Soft delete via `deleted_at`.** Hard delete only via retention policy.
4. **Enums map to state-machines.md.** All lifecycle states are Postgres ENUMs.
5. **N:N relationships are first-class link tables** with payload columns (see `erd.md` Link Payload Table).
6. **Audit trail via Activity table.** Activities are append-only, never mutated.

---

## Enumerations

These enums map directly to `docs/03-domain/state-machines.md`:

```sql
CREATE TYPE opportunity_status AS ENUM (
  'CAPTURED',
  'EVALUATING',
  'ACTIONED',
  'ARCHIVED'
);

CREATE TYPE application_status AS ENUM (
  'DRAFTING',
  'SUBMITTED',
  'INTERVIEWING',
  'OFFER_RECEIVED',
  'ACCEPTED',
  'REJECTED',
  'DECLINED',
  'WITHDRAWN'
);

CREATE TYPE goal_status AS ENUM (
  'DRAFT',
  'ACTIVE',
  'COMPLETED',
  'ABANDONED'
);

CREATE TYPE document_status AS ENUM (
  'ACTIVE',
  'EXPIRED',
  'ARCHIVED'
);

CREATE TYPE notification_status AS ENUM (
  'PENDING',
  'SENT',
  'READ',
  'DISMISSED'
);

CREATE TYPE reflection_type AS ENUM (
  'INTERVIEW',
  'APPLICATION_OUTCOME',
  'GOAL_COMPLETE',
  'GOAL_ABANDONED',
  'GENERAL'
);
```

---

## Strategy Context

### User

```sql
CREATE TABLE "User" (
  id          TEXT PRIMARY KEY DEFAULT cuid(),
  email       TEXT UNIQUE NOT NULL,
  name        TEXT,
  image       TEXT,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);
```

### Vision

```sql
CREATE TABLE "Vision" (
  id          TEXT PRIMARY KEY DEFAULT cuid(),
  user_id     TEXT NOT NULL REFERENCES "User"(id),
  statement   TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);
```

### Mission

```sql
CREATE TABLE "Mission" (
  id          TEXT PRIMARY KEY DEFAULT cuid(),
  user_id     TEXT NOT NULL REFERENCES "User"(id),
  vision_id   TEXT REFERENCES "Vision"(id),
  title       TEXT NOT NULL,
  description TEXT,
  status      TEXT DEFAULT 'ACTIVE',
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);
```

### Goal

```sql
CREATE TABLE "Goal" (
  id          TEXT PRIMARY KEY DEFAULT cuid(),
  user_id     TEXT NOT NULL REFERENCES "User"(id),
  mission_id  TEXT REFERENCES "Mission"(id),
  objective   TEXT NOT NULL,
  description TEXT,
  status      goal_status DEFAULT 'DRAFT',
  deadline    TIMESTAMP,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);
```

### Milestone

```sql
CREATE TABLE "Milestone" (
  id          TEXT PRIMARY KEY DEFAULT cuid(),
  goal_id     TEXT NOT NULL REFERENCES "Goal"(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  completed   BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);
```

---

## Opportunity Context

### Organization

```sql
CREATE TABLE "Organization" (
  id          TEXT PRIMARY KEY DEFAULT cuid(),
  user_id     TEXT NOT NULL REFERENCES "User"(id),
  name        TEXT NOT NULL,
  industry    TEXT,
  website     TEXT,
  notes       TEXT,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);
```

### Opportunity

```sql
CREATE TABLE "Opportunity" (
  id              TEXT PRIMARY KEY DEFAULT cuid(),
  user_id         TEXT NOT NULL REFERENCES "User"(id),
  organization_id TEXT REFERENCES "Organization"(id),
  title           TEXT NOT NULL,
  description     TEXT,
  url             TEXT,
  type            TEXT,
  deadline        TIMESTAMP,
  status          opportunity_status DEFAULT 'CAPTURED',
  priority        INTEGER DEFAULT 0,
  opportunity_score FLOAT,
  tags            TEXT[] DEFAULT '{}',
  metadata        JSONB DEFAULT '{}',
  archived_at     TIMESTAMP,
  deleted_at      TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);
```

### Application

```sql
CREATE TABLE "Application" (
  id              TEXT PRIMARY KEY DEFAULT cuid(),
  user_id         TEXT NOT NULL REFERENCES "User"(id),
  opportunity_id  TEXT NOT NULL REFERENCES "Opportunity"(id),
  organization_id TEXT REFERENCES "Organization"(id),
  status          application_status DEFAULT 'DRAFTING',
  submitted_at    TIMESTAMP,
  accepted_at     TIMESTAMP,
  notes           TEXT,
  metadata        JSONB DEFAULT '{}',
  deleted_at      TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);
```

### Task

```sql
CREATE TABLE "Task" (
  id              TEXT PRIMARY KEY DEFAULT cuid(),
  user_id         TEXT NOT NULL REFERENCES "User"(id),
  opportunity_id  TEXT REFERENCES "Opportunity"(id),
  application_id  TEXT REFERENCES "Application"(id),
  title           TEXT NOT NULL,
  description     TEXT,
  due_date        TIMESTAMP,
  completed       BOOLEAN DEFAULT FALSE,
  completed_at    TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);
```

### Activity

```sql
CREATE TABLE "Activity" (
  id              TEXT PRIMARY KEY DEFAULT cuid(),
  user_id         TEXT NOT NULL REFERENCES "User"(id),
  opportunity_id  TEXT REFERENCES "Opportunity"(id),
  application_id  TEXT REFERENCES "Application"(id),
  type            TEXT NOT NULL,
  description     TEXT NOT NULL,
  metadata        JSONB DEFAULT '{}',
  occurred_at     TIMESTAMP NOT NULL,
  created_at      TIMESTAMP DEFAULT NOW()
  -- No updated_at: Activities are immutable (INV-004)
);
```

---

## Knowledge Context

### Document

```sql
CREATE TABLE "Document" (
  id          TEXT PRIMARY KEY DEFAULT cuid(),
  user_id     TEXT NOT NULL REFERENCES "User"(id),
  title       TEXT NOT NULL,
  type        TEXT NOT NULL,
  status      document_status DEFAULT 'ACTIVE',
  file_url    TEXT,
  file_size   INTEGER,
  mime_type   TEXT,
  version     INTEGER DEFAULT 1,
  tags        TEXT[] DEFAULT '{}',
  expires_at  TIMESTAMP,
  deleted_at  TIMESTAMP,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);
```

### Reflection

```sql
CREATE TABLE "Reflection" (
  id              TEXT PRIMARY KEY DEFAULT cuid(),
  user_id         TEXT NOT NULL REFERENCES "User"(id),
  application_id  TEXT REFERENCES "Application"(id),
  opportunity_id  TEXT REFERENCES "Opportunity"(id),
  goal_id         TEXT REFERENCES "Goal"(id),
  type            reflection_type NOT NULL,
  content         TEXT NOT NULL,
  lessons         TEXT[] DEFAULT '{}',
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);
```

### KnowledgeEntry

```sql
CREATE TABLE "KnowledgeEntry" (
  id          TEXT PRIMARY KEY DEFAULT cuid(),
  user_id     TEXT NOT NULL REFERENCES "User"(id),
  category    TEXT NOT NULL,
  insight     TEXT NOT NULL,
  source      TEXT,
  tags        TEXT[] DEFAULT '{}',
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);
```

---

## Integration Context

### Reminder

```sql
CREATE TABLE "Reminder" (
  id              TEXT PRIMARY KEY DEFAULT cuid(),
  user_id         TEXT NOT NULL REFERENCES "User"(id),
  opportunity_id  TEXT REFERENCES "Opportunity"(id),
  application_id  TEXT REFERENCES "Application"(id),
  title           TEXT NOT NULL,
  description     TEXT,
  remind_at       TIMESTAMP NOT NULL,
  status          notification_status DEFAULT 'PENDING',
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);
```

### CalendarEvent

```sql
CREATE TABLE "CalendarEvent" (
  id              TEXT PRIMARY KEY DEFAULT cuid(),
  user_id         TEXT NOT NULL REFERENCES "User"(id),
  opportunity_id  TEXT REFERENCES "Opportunity"(id),
  application_id  TEXT REFERENCES "Application"(id),
  title           TEXT NOT NULL,
  description     TEXT,
  start_time      TIMESTAMP NOT NULL,
  end_time        TIMESTAMP NOT NULL,
  all_day         BOOLEAN DEFAULT FALSE,
  external_id     TEXT,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);
```

---

## N:N Link Tables

### GoalOpportunityLink

```sql
CREATE TABLE "GoalOpportunityLink" (
  id                TEXT PRIMARY KEY DEFAULT cuid(),
  goal_id           TEXT NOT NULL REFERENCES "Goal"(id) ON DELETE CASCADE,
  opportunity_id    TEXT NOT NULL REFERENCES "Opportunity"(id) ON DELETE CASCADE,
  alignment_score   FLOAT,
  linked_at         TIMESTAMP DEFAULT NOW(),
  linked_by         TEXT,
  UNIQUE(goal_id, opportunity_id)
);
```

### OpportunityDocumentLink

```sql
CREATE TABLE "OpportunityDocumentLink" (
  id              TEXT PRIMARY KEY DEFAULT cuid(),
  opportunity_id  TEXT NOT NULL REFERENCES "Opportunity"(id) ON DELETE CASCADE,
  document_id     TEXT NOT NULL REFERENCES "Document"(id) ON DELETE CASCADE,
  requirement_type TEXT DEFAULT 'optional',
  notes           TEXT,
  UNIQUE(opportunity_id, document_id)
);
```

### ApplicationDocumentLink

```sql
CREATE TABLE "ApplicationDocumentLink" (
  id                    TEXT PRIMARY KEY DEFAULT cuid(),
  application_id        TEXT NOT NULL REFERENCES "Application"(id) ON DELETE CASCADE,
  document_id           TEXT NOT NULL REFERENCES "Document"(id) ON DELETE CASCADE,
  document_version_id   TEXT NOT NULL,
  attached_at           TIMESTAMP DEFAULT NOW(),
  UNIQUE(application_id, document_id)
);
```

### KnowledgeGoalLink

```sql
CREATE TABLE "KnowledgeGoalLink" (
  id                TEXT PRIMARY KEY DEFAULT cuid(),
  knowledge_entry_id TEXT NOT NULL REFERENCES "KnowledgeEntry"(id) ON DELETE CASCADE,
  goal_id           TEXT NOT NULL REFERENCES "Goal"(id) ON DELETE CASCADE,
  provenance_note   TEXT,
  linked_at         TIMESTAMP DEFAULT NOW(),
  UNIQUE(knowledge_entry_id, goal_id)
);
```

---

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

---

## Deferred Entities

The following entities from `entities.md` are not implemented in alpha:

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

---

## Migration Strategy

- **Tool:** Prisma Migrate
- **Development:** `prisma migrate dev` creates migration files
- **Production:** `prisma migrate deploy` applies pending migrations
- **Preview:** Neon branching provides isolated database per PR
- **Backward compatibility:** Migrations must be backward-compatible for zero-downtime deploys
