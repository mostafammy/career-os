# Architectural Insights & Design Decisions

**File:** `docs/05-engineering/architectural-insights.md`

---

# Architectural Insights

**Status:** Reference
**Version:** 1.0

---

## Purpose

This document preserves architectural insights and design recommendations that emerged during the review of CareerOS domain and engineering specifications.

These insights are not part of the canonical specification. They inform future design decisions and should be revisited as the system evolves.

---

# 1. Domain Context Map (from entities.md review)

**Source:** entities.md review — Principal Architect Introduction

The CareerOS domain should be divided into **Bounded Contexts** (a core Domain-Driven Design concept) rather than modeled as a single monolithic domain.

```
                    CareerOS
                         │
 ┌───────────────────────┼────────────────────────┐
 │                       │                        │
 ▼                       ▼                        ▼
Strategy Context     Opportunity Context    Knowledge Context
(Vision, Goals)      (Inbox, Apps)          (Reflections, AI)
 │                       │                        │
 └──────────────┐        │        ┌───────────────┘
                ▼        ▼        ▼
             Integration Context
      (Calendar, Email, Drive, GitHub)
                │
                ▼
         Platform Context
 (Identity, Notifications, Search, Settings)
```

Each context owns its language, rules, and models.

- **Strategy Context** knows about Missions, Goals, and Career Capital.
- **Opportunity Context** knows about Opportunities and Applications.
- **Knowledge Context** knows about Reflections and Decision Journals.
- **Platform Context** knows nothing about careers — it only provides shared services.

**Impact:** This separation makes the system dramatically easier to evolve, allows teams to work independently in the future, and keeps the domain model from becoming an unmanageable monolith.

**Status:** Adopted. The ERD (`erd.md`) already reflects this structure with Strategy, Opportunity, and Knowledge contexts.

---

# 2. Domain-Driven Design over CRUD (from domain-model.md review)

**Source:** domain-model.md review — Principal Engineer Recommendation

Most applications are built around CRUD:

```
Create Opportunity
Read Opportunity
Update Opportunity
Delete Opportunity
```

That is how databases think, but users do not think that way.

Instead, define **intent-based operations**:

```
Capture Opportunity
Research Opportunity
Prepare Application
Submit Application
Schedule Interview
Complete Reflection
Review Strategy
Archive Opportunity
```

These are verbs from the user's world, not database operations.

**Impact:**
- APIs become more expressive.
- Business rules become clearer.
- Events map naturally to real actions.
- Automation becomes easier.
- AI recommendations gain better context.

For example, instead of an endpoint like:

```
PATCH /opportunities/123
```

expose domain-oriented actions such as:

```
CaptureOpportunity
AdvanceOpportunityStage
SubmitApplication
ArchiveOpportunity
CompleteReflection
```

Internally, these still result in data changes — but the architecture is driven by business intent, not storage mechanics.

**Status:** Adopted. The ECS (`ecs.md`) uses intent-based event names throughout. The Opportunity and Application lifecycles in `state-machines.md` follow this pattern.

---

# 3. Career Timeline (from ecs.md review)

**Source:** ecs.md review — Principal Architect Recommendation

Most systems store activities, notifications, audit logs, history, and calendar events as separate concepts. Instead, unify them into a single chronological stream.

```
Career Timeline
──────────────────────────────
2028-03-12  Opportunity Captured
──────────────────────────────
2028-03-15  Requirements Extracted
──────────────────────────────
2028-03-18  Preparation Started
──────────────────────────────
2028-03-25  Application Submitted
──────────────────────────────
2028-04-04  Interview Completed
──────────────────────────────
2028-04-06  Reflection Completed
──────────────────────────────
2028-04-08  Career Capital +5
──────────────────────────────
```

Everything becomes part of one unified narrative.

**Impact:**
- A user can replay their career journey.
- AI can reason over a complete history.
- Analytics become timeline-based.
- Auditing becomes almost free.
- Debugging becomes much easier.
- Future visualizations become richer.

In practice, different underlying systems may still store events, notifications, and audit records differently for performance and operational reasons. The Career Timeline is the **conceptual projection** that unifies them into a single user-facing experience.

**Status:** Adopted as a design principle. The Activity entity (INV-004) serves as the foundation for the Career Timeline. Implementation deferred to Phase 2.

---

# 4. Design Decisions Log

| ID | Decision | Rationale | Status |
|---|---|---|---|
| DD-001 | Adopt Bounded Contexts for domain modeling | Prevents monolithic domain; enables independent evolution | Adopted |
| DD-002 | Use intent-based operations, not CRUD | Aligns architecture with user mental model | Adopted |
| DD-003 | Unify activity/event/audit into Career Timeline | Single narrative, easier AI reasoning and analytics | Adopted (design), deferred (implementation) |
| DD-004 | Dual-lifecycle design (Opportunity + Application) | Separates evaluation decision from execution tracking | Adopted |
| DD-005 | Events as immutable business facts | Auditability, event sourcing readiness, debugging | Adopted |
