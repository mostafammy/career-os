# Database Schema & Design

**File:** `docs/05-engineering/database.md`

---

# Database Schema & Design

**Status:** Canonical
**Version:** 1.0

---

## 1. Purpose

This document defines the physical database schema for CareerOS. It translates the conceptual domain model defined in `docs/03-domain/domain-model.md` and the ERD defined in `docs/03-domain/erd.md` into concrete table structures, indexes, and constraints.

**Canonical references:**

- Domain Model: `docs/03-domain/domain-model.md`
- ERD: `docs/03-domain/erd.md`
- State Machines: `docs/03-domain/state-machines.md`
- Entity Relationships: `docs/03-domain/entities.md`

---

## 2. Database Technology

| Property | Value |
|---|---|
| **Engine** | SQLite (via Cloudflare D1) |
| **ORM** | Drizzle ORM |
| **Migration Tool** | Drizzle Kit |
| **Encoding** | UTF-8 |
| **Primary Keys** | UUIDv7 (time-sortable, opaque) |
| **Timestamps** | ISO 8601 UTC strings |
| **Soft Deletes** | `deleted_at` nullable timestamp |

---

## 3. Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Tables | `snake_case`, plural | `opportunities`, `applications` |
| Columns | `snake_case` | `created_at`, `user_id` |
| Primary Keys | `id` | `id` |
| Foreign Keys | `<entity>_id` | `opportunity_id`, `user_id` |
| Indexes | `idx_<table>_<columns>` | `idx_opportunities_user_id` |
| Unique Constraints | `uniq_<table>_<columns>` | `uniq_organizations_user_domain` |
| Enums | Stored as TEXT with CHECK constraints | `status TEXT CHECK(status IN ('CAPTURED', ...))` |

---

## 4. Schema Overview

```
┌──────────────────────────────────────────────────────────┐
│                     PLATFORM CONTEXT                      │
│  users, sessions, accounts, verification_tokens          │
├──────────────────────────────────────────────────────────┤
│                   STRATEGY CONTEXT                        │
│  visions, missions, goals, milestones                     │
├──────────────────────────────────────────────────────────┤
│                 OPPORTUNITY CONTEXT                       │
│  opportunities, applications, organizations, tasks        │
├──────────────────────────────────────────────────────────┤
│                  KNOWLEDGE CONTEXT                        │
│  documents, document_versions, reflections,               │
│  knowledge_entries, decision_journals                     │
├──────────────────────────────────────────────────────────┤
│                 CROSS-CONTEXT                             │
│  activities, goal_opportunity_links,                      │
│  knowledge_goal_links, opportunity_document_links,        │
│  application_document_links                               │
├──────────────────────────────────────────────────────────┤
│                 INTEGRATION CONTEXT                       │
│  calendar_events, integrations                            │
└──────────────────────────────────────────────────────────┘
```

---

## 5. Platform Context

### 5.1 `users`

The root identity entity. Every aggregate is user-scoped.

```sql
CREATE TABLE users (
  id            TEXT PRIMARY KEY,              -- UUIDv7
  email         TEXT NOT NULL UNIQUE,
  name          TEXT,
  image         TEXT,                          -- Avatar URL
  email_verified INTEGER,                     -- Timestamp (epoch ms)
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### 5.2 `accounts`

OAuth account linking (NextAuth.js schema).

```sql
CREATE TABLE accounts (
  id                TEXT PRIMARY KEY,          -- UUIDv7
  user_id           TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type              TEXT NOT NULL,
  provider          TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token     TEXT,
  access_token      TEXT,
  expires_at        INTEGER,
  token_type        TEXT,
  scope             TEXT,
  id_token          TEXT,
  session_state     TEXT,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(provider, provider_account_id)
);
```

### 5.3 `sessions`

Active user sessions.

```sql
CREATE TABLE sessions (
  id            TEXT PRIMARY KEY,              -- UUIDv7
  session_token TEXT NOT NULL UNIQUE,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires       TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### 5.4 `verification_tokens`

Email verification and password reset tokens.

```sql
CREATE TABLE verification_tokens (
  identifier  TEXT NOT NULL,
  token       TEXT NOT NULL UNIQUE,
  expires     TEXT NOT NULL,
  PRIMARY KEY (identifier, token)
);
```

---

## 6. Strategy Context

### 6.1 `visions`

The highest-level career aspiration. One per user (optional — not required at signup).

```sql
CREATE TABLE visions (
  id          TEXT PRIMARY KEY,                -- UUIDv7
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  statement   TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at  TEXT
);

CREATE INDEX idx_visions_user_id ON visions(user_id);
```

### 6.2 `missions`

Strategic objectives composed of multiple goals. Belongs to a Vision.

```sql
CREATE TABLE missions (
  id          TEXT PRIMARY KEY,                -- UUIDv7
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vision_id   TEXT REFERENCES visions(id) ON DELETE SET NULL,
  title       TEXT NOT NULL,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'ACTIVE'
              CHECK(status IN ('ACTIVE', 'COMPLETED', 'ABANDONED')),
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at  TEXT
);

CREATE INDEX idx_missions_user_id ON missions(user_id);
CREATE INDEX idx_missions_vision_id ON missions(vision_id);
```

### 6.3 `goals`

Measurable objectives supporting missions. Goals in ACTIVE state influence Opportunity scoring.

```sql
CREATE TABLE goals (
  id          TEXT PRIMARY KEY,                -- UUIDv7
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mission_id  TEXT REFERENCES missions(id) ON DELETE SET NULL,
  objective   TEXT NOT NULL,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'DRAFT'
              CHECK(status IN ('DRAFT', 'ACTIVE', 'COMPLETED', 'ABANDONED')),
  target_date TEXT,                            -- ISO 8601 date
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at  TEXT
);

CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_mission_id ON goals(mission_id);
CREATE INDEX idx_goals_status ON goals(user_id, status);
```

### 6.4 `milestones`

Checkpoints contributing toward goal completion.

```sql
CREATE TABLE milestones (
  id          TEXT PRIMARY KEY,                -- UUIDv7
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  goal_id     TEXT NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  completed   INTEGER NOT NULL DEFAULT 0,     -- Boolean (0/1)
  completed_at TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_milestones_goal_id ON milestones(goal_id);
CREATE INDEX idx_milestones_user_id ON milestones(user_id);
```

---

## 7. Opportunity Context

### 7.1 `organizations`

External institutions. Optional at CAPTURED; resolved during EVALUATING.

```sql
CREATE TABLE organizations (
  id          TEXT PRIMARY KEY,                -- UUIDv7
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  domain      TEXT,                            -- Email domain for deduplication
  industry    TEXT,
  website     TEXT,
  logo_url    TEXT,
  notes       TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at  TEXT
);

CREATE INDEX idx_organizations_user_id ON organizations(user_id);
CREATE UNIQUE INDEX uniq_organizations_user_domain ON organizations(user_id, domain)
  WHERE domain IS NOT NULL;
```

### 7.2 `opportunities`

The heart of CareerOS. Represents a potential career opportunity worth evaluating.

**Canonical lifecycle:** `docs/03-domain/state-machines.md` (§1 — Opportunity Lifecycle)

```sql
CREATE TABLE opportunities (
  id              TEXT PRIMARY KEY,            -- UUIDv7
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id TEXT REFERENCES organizations(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  url             TEXT,                        -- Original source URL
  location        TEXT,
  salary_range    TEXT,
  opportunity_type TEXT                        -- 'scholarship', 'internship', 'job', etc.
                    CHECK(opportunity_type IN (
                      'scholarship', 'internship', 'job', 'hackathon',
                      'conference', 'research', 'grant', 'competition',
                      'fellowship', 'other'
                    )),
  status          TEXT NOT NULL DEFAULT 'CAPTURED'
                  CHECK(status IN ('CAPTURED', 'EVALUATING', 'ACTIONED', 'ARCHIVED')),
  deadline        TEXT,                        -- ISO 8601 date
  priority        TEXT DEFAULT 'MEDIUM'
                  CHECK(priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  captured_at     TEXT NOT NULL DEFAULT (datetime('now')),
  evaluated_at    TEXT,
  actioned_at     TEXT,
  archived_at     TEXT,
  archive_reason  TEXT,
  source          TEXT DEFAULT 'manual'        -- 'extension', 'email', 'manual', 'import'
                  CHECK(source IN ('extension', 'email', 'manual', 'import')),
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at      TEXT
);

CREATE INDEX idx_opportunities_user_id ON opportunities(user_id);
CREATE INDEX idx_opportunities_status ON opportunities(user_id, status);
CREATE INDEX idx_opportunities_deadline ON opportunities(deadline)
  WHERE deadline IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX idx_opportunities_organization_id ON opportunities(organization_id);
```

### 7.3 `applications`

A concrete submission to one Opportunity. One active Application per Opportunity (OP-003).

**Canonical lifecycle:** `docs/03-domain/state-machines.md` (§2 — Application Lifecycle)

```sql
CREATE TABLE applications (
  id              TEXT PRIMARY KEY,            -- UUIDv7
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id  TEXT NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  organization_id TEXT REFERENCES organizations(id) ON DELETE SET NULL,
  status          TEXT NOT NULL DEFAULT 'DRAFTING'
                  CHECK(status IN (
                    'DRAFTING', 'SUBMITTED', 'INTERVIEWING',
                    'OFFER_RECEIVED', 'ACCEPTED', 'REJECTED',
                    'DECLINED', 'WITHDRAWN'
                  )),
  submitted_at    TEXT,
  offer_received_at TEXT,
  decision_at     TEXT,                        -- When accepted/rejected/declined
  withdraw_reason TEXT,
  notes           TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at      TEXT
);

CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_opportunity_id ON applications(opportunity_id);
CREATE INDEX idx_applications_status ON applications(user_id, status);
CREATE INDEX idx_applications_organization_id ON applications(organization_id);

-- OP-003: Only one active (non-terminal) application per opportunity
-- Enforced at application layer (state machine validation)
```

### 7.4 `tasks`

Concrete actions required to progress an Opportunity or Application.

```sql
CREATE TABLE tasks (
  id              TEXT PRIMARY KEY,            -- UUIDv7
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id  TEXT REFERENCES opportunities(id) ON DELETE CASCADE,
  application_id  TEXT REFERENCES applications(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  status          TEXT NOT NULL DEFAULT 'PENDING'
                  CHECK(status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  due_date        TEXT,                        -- ISO 8601 date
  completed_at    TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at      TEXT
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_opportunity_id ON tasks(opportunity_id);
CREATE INDEX idx_tasks_application_id ON tasks(application_id);
CREATE INDEX idx_tasks_status ON tasks(user_id, status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date)
  WHERE due_date IS NOT NULL AND deleted_at IS NULL;
```

---

## 8. Knowledge Context

### 8.1 `documents`

Reusable career assets (CVs, transcripts, essays, etc.). Documents are versioned.

```sql
CREATE TABLE documents (
  id          TEXT PRIMARY KEY,                -- UUIDv7
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  type        TEXT NOT NULL                    -- 'cv', 'transcript', 'essay', etc.
              CHECK(type IN (
                'cv', 'transcript', 'essay', 'cover_letter',
                'recommendation', 'portfolio', 'certificate',
                'passport', 'other'
              )),
  description TEXT,
  tags        TEXT,                            -- JSON array of strings
  current_version INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at  TEXT
);

CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_type ON documents(user_id, type);
```

### 8.2 `document_versions`

Immutable snapshots of documents. Each upload creates a new version (INV-008).

```sql
CREATE TABLE document_versions (
  id            TEXT PRIMARY KEY,              -- UUIDv7
  document_id   TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  version       INTEGER NOT NULL,
  file_name     TEXT NOT NULL,
  file_size     INTEGER NOT NULL,             -- Bytes
  mime_type     TEXT NOT NULL,
  r2_key        TEXT NOT NULL,                 -- R2 storage key
  checksum      TEXT NOT NULL,                 -- SHA-256 hash
  notes         TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(document_id, version)
);

CREATE INDEX idx_document_versions_document_id ON document_versions(document_id);
```

### 8.3 `reflections`

Structured analysis after meaningful experiences. Links to Application, Opportunity, or Goal.

```sql
CREATE TABLE reflections (
  id              TEXT PRIMARY KEY,            -- UUIDv7
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id  TEXT REFERENCES opportunities(id) ON DELETE SET NULL,
  application_id  TEXT REFERENCES applications(id) ON DELETE SET NULL,
  goal_id         TEXT REFERENCES goals(id) ON DELETE SET NULL,
  content         TEXT NOT NULL,               -- Structured reflection content
  questions_asked TEXT,                        -- JSON array
  skill_gaps      TEXT,                        -- JSON array
  lessons_learned TEXT,                        -- JSON array
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at      TEXT
);

CREATE INDEX idx_reflections_user_id ON reflections(user_id);
CREATE INDEX idx_reflections_opportunity_id ON reflections(opportunity_id);
CREATE INDEX idx_reflections_application_id ON reflections(application_id);
CREATE INDEX idx_reflections_goal_id ON reflections(goal_id);
```

### 8.4 `knowledge_entries`

Reusable structured knowledge derived from experience, reflection, or research.

```sql
CREATE TABLE knowledge_entries (
  id          TEXT PRIMARY KEY,                -- UUIDv7
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category    TEXT NOT NULL                    -- 'interview_question', 'lesson', 'tip', etc.
              CHECK(category IN (
                'interview_question', 'lesson', 'tip', 'best_practice',
                'skill_gap', 'decision', 'reference', 'other'
              )),
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  source      TEXT,                            -- Where this knowledge came from
  confidence  TEXT DEFAULT 'USER_ENTERED'      -- 'user_entered', 'ai_extracted', 'imported'
              CHECK(confidence IN ('user_entered', 'ai_extracted', 'imported')),
  tags        TEXT,                            -- JSON array of strings
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at  TEXT
);

CREATE INDEX idx_knowledge_entries_user_id ON knowledge_entries(user_id);
CREATE INDEX idx_knowledge_entries_category ON knowledge_entries(user_id, category);
```

### 8.5 `decision_journals`

Structured records capturing reasoning behind important career decisions.

```sql
CREATE TABLE decision_journals (
  id              TEXT PRIMARY KEY,            -- UUIDv7
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id  TEXT REFERENCES opportunities(id) ON DELETE SET NULL,
  goal_id         TEXT REFERENCES goals(id) ON DELETE SET NULL,
  decision        TEXT NOT NULL,               -- What was decided
  reasoning       TEXT NOT NULL,               -- Why it was decided
  alternatives    TEXT,                        -- JSON array of alternatives considered
  outcome         TEXT,                        -- Filled in during reflection
  confidence_at_time TEXT,                     -- How confident at time of decision
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at      TEXT
);

CREATE INDEX idx_decision_journals_user_id ON decision_journals(user_id);
CREATE INDEX idx_decision_journals_opportunity_id ON decision_journals(opportunity_id);
```

---

## 9. Cross-Context Tables

### 9.1 `activities`

Immutable historical record. Append-only. Never modified or deleted (INV-004, INV-010).

```sql
CREATE TABLE activities (
  id          TEXT PRIMARY KEY,                -- UUIDv7
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,                   -- 'opportunity', 'application', 'goal', etc.
  entity_id   TEXT NOT NULL,
  action      TEXT NOT NULL,                   -- 'captured', 'submitted', 'completed', etc.
  actor       TEXT NOT NULL DEFAULT 'user',    -- 'user:<id>', 'system:automation', 'ai:extraction'
  metadata    TEXT,                            -- JSON object with additional context
  occurred_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_entity ON activities(entity_type, entity_id);
CREATE INDEX idx_activities_occurred_at ON activities(occurred_at);
```

### 9.2 `goal_opportunity_links`

N:N relationship between Goals and Opportunities. Carries `alignment_score` (ref: `erd.md` Link Payload Table).

```sql
CREATE TABLE goal_opportunity_links (
  id              TEXT PRIMARY KEY,            -- UUIDv7
  goal_id         TEXT NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  opportunity_id  TEXT NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  alignment_score REAL,                        -- 0.0 to 1.0
  linked_at       TEXT NOT NULL DEFAULT (datetime('now')),
  linked_by       TEXT DEFAULT 'user',         -- 'user' or 'ai'
  UNIQUE(goal_id, opportunity_id)
);

CREATE INDEX idx_goal_opportunity_links_goal_id ON goal_opportunity_links(goal_id);
CREATE INDEX idx_goal_opportunity_links_opportunity_id ON goal_opportunity_links(opportunity_id);
```

### 9.3 `knowledge_goal_links`

N:N relationship between Knowledge Entries and Goals. Carries `provenance_note` (ref: `erd.md` Link Payload Table).

```sql
CREATE TABLE knowledge_goal_links (
  id              TEXT PRIMARY KEY,            -- UUIDv7
  knowledge_entry_id TEXT NOT NULL REFERENCES knowledge_entries(id) ON DELETE CASCADE,
  goal_id         TEXT NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  provenance_note TEXT,
  linked_at       TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(knowledge_entry_id, goal_id)
);

CREATE INDEX idx_knowledge_goal_links_goal_id ON knowledge_goal_links(goal_id);
CREATE INDEX idx_knowledge_goal_links_knowledge_id ON knowledge_goal_links(knowledge_entry_id);
```

### 9.4 `opportunity_document_links`

N:N relationship between Opportunities and Documents. Carries `requirement_type`.

```sql
CREATE TABLE opportunity_document_links (
  id              TEXT PRIMARY KEY,            -- UUIDv7
  opportunity_id  TEXT NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  document_id     TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  requirement_type TEXT DEFAULT 'optional'
                  CHECK(requirement_type IN ('required', 'optional')),
  notes           TEXT,
  linked_at       TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(opportunity_id, document_id)
);

CREATE INDEX idx_opportunity_document_links_opportunity_id ON opportunity_document_links(opportunity_id);
CREATE INDEX idx_opportunity_document_links_document_id ON opportunity_document_links(document_id);
```

### 9.5 `application_document_links`

N:N relationship between Applications and Documents. Pins immutable `document_version_id` (INV-008).

```sql
CREATE TABLE application_document_links (
  id                  TEXT PRIMARY KEY,        -- UUIDv7
  application_id      TEXT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  document_id         TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  document_version_id TEXT NOT NULL REFERENCES document_versions(id) ON DELETE RESTRICT,
  attached_at         TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(application_id, document_id)
);

CREATE INDEX idx_application_document_links_application_id ON application_document_links(application_id);
CREATE INDEX idx_application_document_links_document_id ON application_document_links(document_id);
```

---

## 10. Integration Context

### 10.1 `calendar_events`

Calendar entries linked to Opportunities or Applications.

```sql
CREATE TABLE calendar_events (
  id              TEXT PRIMARY KEY,            -- UUIDv7
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id  TEXT REFERENCES opportunities(id) ON DELETE SET NULL,
  application_id  TEXT REFERENCES applications(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  start_time      TEXT NOT NULL,               -- ISO 8601 datetime
  end_time        TEXT NOT NULL,               -- ISO 8601 datetime
  location        TEXT,
  event_type      TEXT DEFAULT 'other'
                  CHECK(event_type IN (
                    'deadline', 'interview', 'follow_up', 'reminder', 'other'
                  )),
  reminder_minutes INTEGER,                    -- Minutes before event to remind
  synced_at       TEXT,                        -- Last sync with external calendar
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at      TEXT
);

CREATE INDEX idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX idx_calendar_events_start_time ON calendar_events(user_id, start_time);
CREATE INDEX idx_calendar_events_opportunity_id ON calendar_events(opportunity_id);
```

### 10.2 `integrations`

External service connections.

```sql
CREATE TABLE integrations (
  id              TEXT PRIMARY KEY,            -- UUIDv7
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider        TEXT NOT NULL,               -- 'google_calendar', 'github', etc.
  status          TEXT NOT NULL DEFAULT 'active'
                  CHECK(status IN ('active', 'disconnected', 'error')),
  access_token    TEXT,                        -- Encrypted
  refresh_token   TEXT,                        -- Encrypted
  expires_at      TEXT,
  scopes          TEXT,                        -- JSON array
  metadata        TEXT,                        -- JSON object
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now')),
  disconnected_at TEXT
);

CREATE INDEX idx_integrations_user_id ON integrations(user_id);
CREATE UNIQUE INDEX uniq_integrations_user_provider ON integrations(user_id, provider)
  WHERE disconnected_at IS NULL;
```

---

## 11. Index Strategy

### 11.1 Index Principles

- **Index foreign keys** — Every FK column gets an index for JOIN performance
- **Index status columns** — Filtered queries on status are common
- **Index date columns** — Deadline and date-range queries are frequent
- **Partial indexes** — Use `WHERE deleted_at IS NULL` for soft-delete filtering
- **Composite indexes** — For common query patterns (user_id + status)

### 11.2 Query Patterns → Index Mapping

| Query Pattern | Index |
|---|---|
| "Get all active opportunities for user" | `idx_opportunities_status (user_id, status)` |
| "Get upcoming deadlines" | `idx_opportunities_deadline (deadline) WHERE deadline IS NOT NULL AND deleted_at IS NULL` |
| "Get all applications for an opportunity" | `idx_applications_opportunity_id (opportunity_id)` |
| "Get pending tasks for user" | `idx_tasks_status (user_id, status)` |
| "Get activities for an entity" | `idx_activities_entity (entity_type, entity_id)` |
| "Get overdue tasks" | `idx_tasks_due_date (due_date) WHERE due_date IS NOT NULL AND deleted_at IS NULL` |

---

## 12. Migration Strategy

### 12.1 Migration Tool

Drizzle Kit generates migrations from schema changes:

```bash
# Generate migration from schema changes
pnpm drizzle-kit generate

# Apply migrations
pnpm drizzle-kit migrate

# Push schema directly (development only)
pnpm drizzle-kit push
```

### 12.2 Migration Principles

- **Never drop columns** — Mark as deprecated, remove in future migration
- **Never rename columns** — Add new column, migrate data, drop old column
- **Always add columns as nullable** — Backfill before adding NOT NULL constraint
- **Test migrations on staging** — Before applying to production
- **Version migrations** — Each migration is timestamped and immutable

### 12.3 Migration File Structure

```
drizzle/
├── 0000_initial_schema.sql
├── 0001_add_calendar_events.sql
├── 0002_add_decision_journals.sql
└── meta/
    └── _journal.json
```

---

## 13. Data Integrity Rules

### 13.1 Domain Invariants (from `entities.md`)

| ID | Rule | Enforcement |
|---|---|---|
| INV-001 | Every Application belongs to exactly one Opportunity | FK constraint + application layer validation |
| INV-002 | Every Goal belongs to exactly one Mission | FK constraint |
| INV-003 | A Milestone cannot belong to multiple Goals | FK constraint |
| INV-004 | Activities are immutable | No UPDATE/DELETE on activities table |
| INV-005 | Knowledge Entries never lose provenance | provenance_note is required in knowledge_goal_links |
| INV-006 | Archived entities remain searchable | Soft delete (deleted_at), filtered queries |
| INV-007 | A Reflection always references a completed event | Application layer validation |
| INV-008 | Documents remain versioned | document_version_id is immutable in application_document_links |
| INV-009 | Every aggregate has exactly one root | Enforced by repository pattern |
| INV-010 | Business events never mutate historical events | Activities table is append-only |

### 13.2 Cascade Rules

| Relationship | On Delete | On Update |
|---|---|---|
| User → All owned entities | CASCADE | CASCADE |
| Opportunity → Applications | CASCADE | CASCADE |
| Opportunity → Tasks | CASCADE | CASCADE |
| Goal → Milestones | CASCADE | CASCADE |
| Document → Document Versions | CASCADE | — |
| Application → Document Links | CASCADE | — |
| Document Version ← Application Links | RESTRICT | — |

**RESTRICT on Document Version deletion:** Prevents deleting a version that is pinned to an submitted Application (INV-008).

---

## 14. Soft Delete Strategy

All user-owned entities support soft delete via `deleted_at` column:

- **Soft delete:** Set `deleted_at = datetime('now')`
- **Restore:** Set `deleted_at = NULL`
- **Hard delete:** Only via admin tooling, after retention period
- **Query filtering:** All queries include `WHERE deleted_at IS NULL` (enforced by repository layer)
- **Unique constraints:** Must account for soft-deleted rows (use partial unique indexes)

---

## 15. Open Items

1. **Full-text Search Index** — D1 supports FTS5. Index strategy for global search to be defined during Phase 2.
2. **Vector Embeddings** — If AI-powered semantic search is added, vector storage strategy (Cloudflare Vectorize) to be defined.
3. **Audit Log Rotation** — Activity table growth strategy for multi-user scaling.
4. **Encryption at Rest** — Sensitive fields (integration tokens) encryption strategy to be defined.

---

## Version History

| Version | Date | Description |
|---|---|---|
| 1.0 | Initial Draft | Established canonical database schema for CareerOS Phase 1 MVP. |
