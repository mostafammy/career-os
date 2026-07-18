---
id: FEATURE-007
title: "Goals"
status: canonical
version: "1.0"
owner: "Product Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 3
stability: medium
change_frequency: low
consumers:
  - Frontend Agent
  - Product Agent
  - DDD Agent
depends_on:
  - DOMAIN-001
tags:
  - feature
  - goals
  - phase-3
---

# FEATURE-007 — Goals

## Purpose

Connect daily execution with long-term career strategy through Vision, Missions, Goals, and Milestones.

## User Value

- Strategic alignment ensures every application serves a larger purpose
- ACTIVE Goals influence Opportunity scoring — only pursue what matters
- Completed Goals trigger reflection, capturing what was learned

## Core Capabilities

| Capability | Description |
|---|---|
| **Goal Workspace** | Unified view: milestones, linked opportunities, progress, timeline |
| **Strategic Hierarchy** | Vision → Mission → Goal → Milestone |
| **Milestone Tracking** | Checkpoints toward Goal completion |
| **Opportunity Linking** | Link Goals to Opportunities with alignment scoring |
| **Career Capital View** | Aggregated view of accumulated career assets |
| **Goal-Influenced Scoring** | ACTIVE Goals directly influence Opportunity Fit Score |

## Strategic Hierarchy

```
Vision (1 per user)
  └── Mission (1:N from Vision)
        └── Goal (1:N from Mission)
              └── Milestone (1:N from Goal)
```

## Goal Lifecycle

```
DRAFT → ACTIVE → COMPLETED
              → ABANDONED
```

## Goal Workspace Tabs

| Tab | Content |
|---|---|
| Overview | Goal objective, status, deadline, progress |
| Milestones | Checklist of milestones with completion tracking |
| Linked Opportunities | Opportunities aligned to this Goal |
| Timeline | Activity and state transition history |
| Analytics | Progress metrics, confidence, strategic value |
| Notes | Free-form notes and reflections |

## Business Rules

- GOAL-001: ACTIVE Goals directly influence Opportunity Score during EVALUATING
- GOAL-002: Must have at least one Milestone before transitioning to ACTIVE
- GOAL-003: COMPLETED triggers Career Reflection prompt
- GOAL-004: ABANDONED triggers Career Reflection prompt
- GOAL-005: Vision is immutable after creation — changes require explicit revision

## Domain Events

VisionCreated, MissionCreated, GoalCreated, GoalUpdated, GoalAchieved, MilestoneCompleted, CareerCapitalIncreased, CareerCapitalDecreased

## Dependencies

- DOMAIN-001 (Strategy) — Vision, Mission, Goal, Milestone, Career Capital
- DOMAIN-002 (Opportunity) — Goal ↔ Opportunity linking
- APPLICATION-004 (API Layer) — Goal Router

## Acceptance Criteria

- [ ] Goal workspace shows milestones with completion tracking
- [ ] ACTIVE Goals appear in Opportunity scoring context
- [ ] Completed/Abandoned Goals trigger Reflection prompt
- [ ] Vision, Mission, Goal hierarchy displays correctly
- [ ] Career Capital view shows aggregated assets
