---
id: APPLICATION-003
title: "Analytics Engine"
status: canonical
version: "1.0"
owner: "Backend Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 2
stability: medium
change_frequency: medium
consumers:
  - Backend Agent
  - Frontend Agent
  - Product Agent
depends_on:
  - DOMAIN-002
  - DOMAIN-003
  - DOMAIN-001
tags:
  - application
  - analytics
  - projections
---

# APPLICATION-003 — Analytics Engine

## Purpose

Read-optimized projections derived from domain events and entity state changes. Computes metrics for the Analytics feature without impacting write performance.

## Architecture

Analytics data is computed as projections — materialized views derived from Activities, state transitions, and entity metadata. Not real-time; recomputed on-demand or via background jobs.

```
Domain Events / Activities
        ↓
   Analytics Engine
        ↓
   Projections (computed metrics)
        ↓
   Dashboard Router (getStats, getSummary)
```

## Core Projections

### Opportunity Metrics

| Metric | Source | Formula |
|---|---|---|
| Capture Rate | Opportunity count by status | CAPTURED / Total |
| Evaluation Rate | EVALUATING / CAPTURED | Progression rate |
| Action Rate | ACTIONED / EVALUATING | Decision rate |
| Archive Rate | ARCHIVED / Total | Discard rate |
| Avg Time to Decision | Activity timestamps | EVALUATING → ACTIONED duration |
| Deadline Adherence | Deadline vs. submitted_at | On-time / Total submitted |

### Application Metrics

| Metric | Source | Formula |
|---|---|---|
| Submission Rate | SUBMITTED / DRAFTING | Completion rate |
| Interview Rate | INTERVIEWING / SUBMITTED | Advancement rate |
| Offer Rate | OFFER_RECEIVED / INTERVIEWING | Conversion rate |
| Acceptance Rate | ACCEPTED / OFFER_RECEIVED | Accept rate |
| Rejection Rate | REJECTED / SUBMITTED | Failure rate |
| Avg Preparation Time | DRAFTING → SUBMITTED duration | Time to submit |
| Avg Waiting Time | SUBMITTED → outcome duration | Response time |

### Goal Metrics

| Metric | Source | Formula |
|---|---|---|
| Goal Completion Rate | COMPLETED / ACTIVE | Achievement rate |
| Milestone Progress | Completed milestones / Total | Progress % |
| Goal-Opportunity Alignment | GoalOpportunityLink count | Linked opportunities |

### Knowledge Metrics

| Metric | Source | Formula |
|---|---|---|
| Reflection Rate | Reflections / Closed opportunities | Learning rate |
| Knowledge Entry Count | KnowledgeEntry total | Accumulation |
| Asset Reuse Rate | Reused assets / Total assets | Reuse frequency |

## Computation Strategy

| Phase | Strategy |
|---|---|
| Phase 1 | On-demand computation from raw queries |
| Phase 2 | Cached projections with TTL (Redis) |
| Phase 3 | Event-sourced projections with CQRS |

## Business Rules

- ANA-001: Analytics are computed from entity state changes and Activities
- ANA-002: Archived entities are included in historical analytics
- ANA-003: Analytics respect user scoping (single-user alpha)
- ANA-004: Projections are eventually consistent (not real-time)
- ANA-005: Computation must not block user-facing requests

## Dependencies

- DOMAIN-002 (Opportunity) — Status data, deadlines
- DOMAIN-003 (Application) — Status data, outcomes
- DOMAIN-001 (Strategy) — Goal progress data
- APPLICATION-004 (API Layer) — Dashboard Router

## Canonical Source

`docs/01-product/success-metrics.md`
