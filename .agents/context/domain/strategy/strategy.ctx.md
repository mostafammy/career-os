---
id: DOMAIN-001
title: "Strategy Domain"
status: canonical
version: "1.0"
owner: "DDD Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: high
change_frequency: low
consumers:
  - DDD Agent
  - Backend Agent
  - Architect Agent
  - Analytics Agent
  - AI Agent
depends_on:
  - CORE-002
  - CORE-003
tags:
  - domain
  - strategy
---

# DOMAIN-001 — Strategy Domain

## Purpose

Complete context for reasoning about Vision, Mission, Goal, Milestone, and Career Capital.

## Entities

### Vision
- **Purpose:** Highest-level aspiration guiding all strategic planning
- **Cardinality:** User owns 1 Vision (1:1)
- **Attributes:** statement (text)
- **Immutable after creation** — changes require explicit revision

### Mission
- **Purpose:** Strategic objective composed of multiple Goals
- **Cardinality:** Vision contains 1:N Missions
- **Attributes:** title, description, status (ACTIVE)
- **Lifecycle:** Created → ACTIVE

### Goal
- **Purpose:** Measurable objective supporting one or more Missions
- **Cardinality:** Mission contains 1:N Goals
- **Attributes:** objective, description, status (goal_status enum), deadline
- **Lifecycle (FSM):**
  ```
  DRAFT → ACTIVE → COMPLETED
                 → ABANDONED
  ```
- **Business Rules:**
  - GOAL-001: ACTIVE Goals directly influence Opportunity Score during EVALUATING (Strategic Alignment dimension)
  - GOAL-002: Must have at least one Milestone before transitioning to ACTIVE
  - GOAL-003: COMPLETED triggers Career Reflection prompt
  - GOAL-004: ABANDONED triggers Career Reflection prompt

### Milestone
- **Purpose:** Checkpoint contributing toward Goal completion
- **Cardinality:** Goal contains 1:N Milestones (strong ownership — delete Goal deletes Milestones)
- **Attributes:** title, description, completed (boolean), completed_at

## Career Capital

The collection of durable assets that increase long-term career opportunities:
- Knowledge, Skills, Credentials, Portfolio, Network, Reputation, Experience

**Note:** Career Capital scoring algorithm deferred to Phase 2. In Phase 1, tracking is manual.

## Cross-Aggregate Rules

- **XAG-004:** Goal scoring alignment is READ-ONLY during Opportunity EVALUATING. If Goal changes state during evaluation, score is NOT recalculated until next session.
- **XAG-005:** Archived Opportunities revived to CAPTURED discard historical score. Fresh evaluation required.

## Domain Events

VisionCreated, MissionCreated, GoalCreated, GoalUpdated, GoalAchieved, MilestoneCompleted, CareerCapitalIncreased, CareerCapitalDecreased

## Computed Properties

- Goal: Progress, Remaining Effort, Confidence, Strategic Value
- Career Capital: Aggregated from completed Goals, Applications, and Reflections

## Canonical Source

`docs/03-domain/entities.md` (§21.4), `docs/03-domain/state-machines.md` (§3)
