---
id: DOMAIN-004
title: "Knowledge Domain"
status: canonical
version: "1.0"
owner: "DDD Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: medium-high
change_frequency: medium
consumers:
  - DDD Agent
  - Backend Agent
  - AI Agent
  - Knowledge Graph Agent
depends_on:
  - CORE-002
  - CORE-003
  - DOMAIN-003
tags:
  - domain
  - knowledge
  - reflection
---

# DOMAIN-004 — Knowledge Domain

## Purpose

Complete context for reasoning about the Knowledge Compounding system. All three entities (Reflection, KnowledgeEntry, DecisionJournal) are semantically coupled and must be co-present.

## Core Concept: Knowledge Compounding

```
Experience → Reflection → Structured Knowledge → Reusable Asset
```

Every completed activity should leave behind reusable knowledge. CareerOS continuously transforms experience into structured learning.

## Entity: Reflection

**Purpose:** Structured analysis after a meaningful experience. Converts experience into reusable knowledge.
**Aggregate Root:** Yes — owns Knowledge Entries generated from reflection

### Attributes

| Attribute | Type | Notes |
|---|---|---|
| application_id | text (FK) | Optional. Source Application |
| opportunity_id | text (FK) | Optional. Source Opportunity |
| goal_id | text (FK) | Optional. Source Goal |
| type | reflection_type | INTERVIEW, APPLICATION_OUTCOME, GOAL_COMPLETE, GOAL_ABANDONED, GENERAL |
| content | text | Raw reflection notes |
| lessons | text[] | Extracted lessons |

### Computed Properties

- **Insight Count:** number of Knowledge Entries generated
- **Learning Score:** derived from depth + breadth of reflection

### Lifecycle

Created → Updated (user edits) → Completed (finalized, triggers Knowledge Entry extraction)

### Business Rules

- **INV-007:** A Reflection always references a completed event (Application terminal state, Goal completion, etc.)
- Reflection is triggered by APP-004 (terminal Application states)
- AI can assist with Reflection Synthesis (unstructured → structured insights)

## Entity: KnowledgeEntry

**Purpose:** Reusable piece of structured knowledge derived from experience, reflection, or research.
**Examples:** Interview Lessons, Scholarship Tips, Personal Best Practices, Skill Gap Notes

### Attributes

| Attribute | Type | Notes |
|---|---|---|
| category | text | Classification |
| insight | text | The knowledge itself |
| source | text | Where this came from |
| tags | text[] | Searchable tags |

### Business Rules

- **INV-005:** Knowledge Entries never lose provenance — they always track their source
- Knowledge Entries are linked to Goals via KnowledgeGoalLink (N:N with provenance_note)

## Entity: DecisionJournal

**Purpose:** Structured record capturing reasoning behind important career decisions.
**Purpose:** Enable future reflection and improve long-term decision quality.

### Attributes

- Decision description
- Alternatives considered
- Rationale
- Expected outcome
- Actual outcome (retrospective)

## Domain Events

ReflectionStarted, ReflectionCompleted, LessonCaptured, KnowledgeEntryCreated, DecisionRecorded, DecisionReviewed, InsightGenerated

## Relationships

| Relationship | Target | Cardinality |
|---|---|---|
| Reflection → Application | Source Application | N:1 (optional) |
| Reflection → KnowledgeEntry | Generated entries | 1:N |
| KnowledgeEntry → Goal | Supports Goal | N:N (KnowledgeGoalLink) |

## AI Integration

- **Reflection Synthesis (AI Capability 5):** Parses unstructured reflection notes, proposes structured Knowledge Entries and Career Capital updates
- **User must approve** all AI-generated knowledge commits before they're persisted
- AI never fabricates skills or experiences (P-004, P-016)

## Canonical Source

`docs/03-domain/entities.md` (§21.6), `docs/04-automation/ai-features.md` (§5)
