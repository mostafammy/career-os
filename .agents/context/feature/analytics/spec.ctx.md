---
id: FEATURE-010
title: "Analytics"
status: canonical
version: "1.0"
owner: "Product Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 2
stability: medium
change_frequency: low
consumers:
  - Frontend Agent
  - Product Agent
depends_on:
  - DOMAIN-002
  - DOMAIN-003
  - DOMAIN-001
tags:
  - feature
  - analytics
  - phase-2
---

# FEATURE-010 — Analytics

## Purpose

Measure long-term career progress and surface insights for strategic decision-making.

## User Value

- Quantify career progress beyond just "number of applications"
- Identify patterns in success and failure
- Data-driven strategy adjustments

## Core Capabilities

| Capability | Description |
|---|---|
| **Dashboard Analytics** | Overview metrics and trend charts |
| **Opportunity Analytics** | Capture-to-action conversion, deadline adherence |
| **Application Analytics** | Submission-to-outcome rates, interview performance |
| **Goal Analytics** | Progress toward goals, milestone completion rates |
| **Career Capital Analytics** | Accumulated assets, reuse rates, growth over time |
| **Trend Analysis** | Month-over-month and quarter-over-quarter trends |

## Core Metrics (from success-metrics.md)

| Category | Metric | Formula |
|---|---|---|
| Execution | Deadline Adherence Rate | On-time submissions / Total submissions |
| Execution | Conversion Rate | Actioned opportunities / Captured opportunities |
| Efficiency | Time-to-Capture | Avg time from source to structured entry |
| Efficiency | Context Switch Reduction | Decrease in external tool usage |
| Knowledge | Asset Reuse Rate | Reused assets / Total assets |
| Knowledge | Reflection Completion Rate | Reflections / Closed opportunities |
| Strategy | High-Impact Prioritization | High-fit actions / Total actions |
| Strategy | Decision Journal Utilization | Decisions logged / Total decisions |

## Analytics Views

| View | Content |
|---|---|
| Dashboard | Summary cards, sparklines, trend indicators |
| Opportunities | Funnel: CAPTURED → EVALUATING → ACTIONED |
| Applications | Funnel: DRAFTING → SUBMITTED → INTERVIEWING → OUTCOME |
| Goals | Progress bars, milestone completion, confidence |
| Career Capital | Growth over time, asset distribution |
| Trends | Month-over-month comparisons, seasonality |

## Business Rules

- ANA-001: Analytics are computed from entity state changes and Activities
- ANA-002: Archived entities are included in historical analytics
- ANA-003: Analytics respect user scoping (single-user alpha)
- ANA-004: Real-time updates when entity states change

## Dependencies

- DOMAIN-002 (Opportunity) — Status data, deadlines
- DOMAIN-003 (Application) — Status data, outcomes
- DOMAIN-001 (Strategy) — Goal progress data
- APPLICATION-004 (API Layer) — Dashboard Router (getStats, getSummary)

## Acceptance Criteria

- [ ] Dashboard shows summary metrics with trend indicators
- [ ] Opportunity funnel displays correctly
- [ ] Application funnel displays correctly
- [ ] Goal progress is visualized
- [ ] Trend data shows month-over-month comparisons
