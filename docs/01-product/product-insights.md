# Product Insights & Vision Explorations

**File:** `docs/01-product/product-insights.md`

---

# Product Insights

**Status:** Reference
**Version:** 1.0

---

## Purpose

This document preserves product philosophy explorations and vision insights that emerged during PRD development.

These are not part of the canonical PRD. They inform future product direction and should be revisited during roadmap planning.

---

# 1. CareerOS is a Personal Strategy Operating System

**Source:** PRD §21 — Goal System & Career Strategy Engine (editorial exploration)

CareerOS is not:

- An ATS (Applicant Tracking System)
- A CRM (Customer Relationship Management)
- A task manager
- An opportunity tracker

It is a **Personal Strategy Operating System**.

The hierarchy it serves:

```
Vision
  ↓
Mission
  ↓
Goals
  ↓
Milestones
  ↓
Opportunities
```

---

# 2. Life Domains — The Platform Vision

**Source:** PRD §21 — Goal System & Career Strategy Engine (editorial exploration)

There is a more fundamental concept above Vision: **Life Domains**.

```
Life Domains
│
├── Career
├── Education
├── Research
├── Entrepreneurship
├── Finance
├── Health
├── Relationships
└── Personal Development
```

Then:

```
Life Domain
    ↓
Vision
    ↓
Mission
    ↓
Goals
    ↓
Milestones
    ↓
Career Capital
    ↓
Opportunities
```

**Why this matters:** Once you build the engine correctly for Career, you have built a reusable strategic framework. Tomorrow you could add:

- ResearchOS
- StartupOS
- LearningOS
- HealthOS

Each would reuse the same strategic architecture with different domain entities.

---

# 3. Platform Architecture Vision

**Source:** PRD §21 — Goal System & Career Strategy Engine (editorial exploration)

If building at venture scale, the architecture would be:

```
                    PersonalOS Platform
                           │
      ┌────────────────────┼────────────────────┐
      ▼                    ▼                    ▼
  CareerOS            ResearchOS          StartupOS
      │                    │                    │
      └────────────────────┼────────────────────┘
                           ▼
                  Shared Strategy Engine
                           │
                    Goal Engine
                    Decision Engine
                    Knowledge Graph
                    Event Engine
                    Intelligence Layer
```

This separation keeps CareerOS focused while making the underlying platform extensible.

---

# 4. Scope Decision

**Decision:** CareerOS v1.0 is scoped exclusively to career management.

Life Domains and the PersonalOS platform vision are explicitly deferred. The strategic architecture is designed to be compatible with future expansion, but no work should be done on cross-domain abstractions until the career domain is validated through daily use.

---

# 5. Product Philosophy Principles (extracted)

These principles emerged from the exploration and are reflected in the canonical Product Principles (`product-principles.md`):

| Principle | Source |
|---|---|
| Opportunities are investments, not tasks | §4 Product Philosophy |
| Every opportunity has measurable value | §4 Product Philosophy |
| Reduce cognitive overhead, not increase it | §2 Vision |
| The product should be the user's career memory | §2 Long-Term Vision |
| Complexity should grow only when justified | P-010 |
