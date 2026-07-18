# Domain Model Specification

**File:** `docs/03-domain/domain-model.md`

---

# Domain Model

**Status:** Reference (defers to canonical `entities.md`)
**Version:** 2.0

---

## Purpose

This document defines the core business concepts of CareerOS at a high level.

**For complete entity definitions, relationships, invariants, and business rules, see the canonical source:** `docs/03-domain/entities.md`

This document provides:
- Domain principles
- Core entity map overview
- Entity categories
- Entity relationship summary
- Domain event summary

---

## 1. Domain Principles

| ID | Principle |
|---|---|
| DM-001 | Every entity represents a meaningful business concept. |
| DM-002 | Every entity has a unique identity. |
| DM-003 | Behavior belongs to entities — not controllers. |
| DM-004 | Relationships should reflect real-world semantics. |
| DM-005 | Domain logic remains independent of infrastructure. |
| DM-006 | The domain language is shared across Product, Design, Engineering, and AI. |

---

## 2. Core Entity Map

The career lifecycle spine:

```
Vision
    ↓
Mission
    ↓
Goal
    ↓
Milestone
    ↓
Opportunity
    ↓
Application
    ↓
Reflection
    ↓
Knowledge
```

Everything else enriches this spine. Documents connect horizontally. Organizations connect horizontally. Activities observe everything.

---

## 3. Entity Categories

### Strategic
Vision, Mission, Goal, Milestone, Career Capital

### Operational
Opportunity, Application, Task, Reminder, Calendar Event

### Knowledge
Knowledge Entry, Reflection, Decision Journal, AI Insight

### Resources
Document, Organization, Contact, Template

### System
Notification, Activity, Automation, Integration, Settings

---

## 4. Entity Relationships

```
Vision
    ↓
Mission
    ↓
Goal
    ↓
Milestone
    ↓
Opportunity
    ↓
Application
    ↓
Reflection
    ↓
Knowledge
```

**See:** `docs/03-domain/entities.md` §9 (Cardinality Matrix) and `docs/03-domain/erd.md` for the complete relationship specification.

---

## 5. Aggregate Roots

Each aggregate protects its own consistency:

- **Opportunity Aggregate:** Opportunity, Application, Task, Timeline, Activities, AI Insights, Requirements, Notes, Documents
- **Application Aggregate:** Application, Submission, Documents, Interview, Reflection, Timeline, Activities, Attachments
- **Goal Aggregate:** Goal, Milestones, Metrics, Opportunities, Progress History, Career Capital
- **Organization Aggregate:** Organization, Opportunities, Contacts, Applications, Reputation, Notes, Analytics
- **Knowledge Aggregate:** Knowledge, Reflection, Decision Journal, AI Insight, Research Notes, Lessons Learned, References

---

## 6. Domain Events

Every entity publishes events. Every subsystem reacts to events.

**Standard Events:** Created, Updated, Archived, Deleted, Linked, Completed, Reviewed, Scored

**See:** `docs/05-engineering/ecs.md` for the complete Event Catalog.

---

## 7. Cross-Cutting Concerns

- **Activity** is a cross-context, append-only observer (INV-004, INV-010). Any aggregate may generate Activities, and Activities are never mutated or hard-deleted.
- **Document** is a shared resource across all aggregates. Documents remain versioned (INV-008).
- **Organization** is a shared resource. Deleting an Organization does not cascade to Applications or Opportunities (reference relationship).

---

## References

| Document | Purpose |
|---|---|
| `docs/03-domain/entities.md` | **Canonical** entity definitions, relationships, invariants |
| `docs/03-domain/state-machines.md` | **Canonical** lifecycle states and transitions |
| `docs/03-domain/erd.md` | Visual ERD with aggregate boundaries |
| `docs/05-engineering/ecs.md` | Event Catalog Specification |
| `docs/00-overview/glossary.md` | Ubiquitous Language glossary |
