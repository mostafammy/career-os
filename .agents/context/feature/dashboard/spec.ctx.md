---
id: FEATURE-001
title: "Dashboard"
status: canonical
version: "1.0"
owner: "Product Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: medium
change_frequency: medium
consumers:
  - Frontend Agent
  - Product Agent
  - UX Agent
depends_on:
  - DOMAIN-001
  - DOMAIN-002
  - DOMAIN-003
  - ORGANIZATION-001
tags:
  - feature
  - dashboard
  - phase-1
---

# FEATURE-001 — Dashboard

## Purpose

Personalized command center for daily career execution. Answers: "What should I do today?"

## User Value

- Immediately surfaces urgent deadlines, pending tasks, and recent activity
- Reduces cognitive load — no searching for what matters right now
- Provides at-a-glance progress toward goals and opportunities

## Core Capabilities

| Capability | Description |
|---|---|
| **Urgent Decisions** | Opportunities with deadlines < 48h in CAPTURED/EVALUATING state |
| **Upcoming Tasks** | Tasks due today and this week, sorted by urgency |
| **Active Applications** | Applications in DRAFTING or SUBMITTED state requiring attention |
| **Quick Capture** | One-click opportunity capture from any source |
| **Weekly Review Prompt** | Periodic prompt to review progress and plan next week |
| **Notification Center** | Recent system notifications and reminders |

## Data Sources

| Source | Content |
|---|---|
| Opportunity table | Deadlines, status, priority |
| Application table | Status, submitted_at, pending actions |
| Task table | Due dates, completion status |
| Activity table | Recent actions and state changes |
| Reminder table | Upcoming reminders |

## Layout

```
┌─────────────────────────────────────────┐
│  Dashboard                              │
├──────────────┬──────────────────────────┤
│ Urgent       │  Active Applications     │
│ Decisions    │  (DRAFTING, SUBMITTED)   │
│ (< 48h)     │                          │
├──────────────┼──────────────────────────┤
│ Today's      │  Quick Actions           │
│ Tasks        │  [Capture] [Review]      │
├──────────────┴──────────────────────────┤
│  This Week                              │
│  (upcoming deadlines & tasks)           │
└─────────────────────────────────────────┘
```

## Business Rules

- DASH-001: Dashboard loads data for the current user only
- DASH-002: "Urgent Decisions" shows opportunities with deadline < 48h AND status in (CAPTURED, EVALUATING)
- DASH-003: "Quick Capture" opens the Inbox capture flow
- DASH-004: Weekly Review prompt fires every Monday morning (configurable)

## Domain Events

DashboardReacted (read-only projection, no domain events emitted)

## Dependencies

- DOMAIN-001 (Strategy) — Goal progress display
- DOMAIN-002 (Opportunity) — Deadline and status data
- DOMAIN-003 (Application) — Application status data
- APPLICATION-004 (API Layer) — Dashboard Router

## Acceptance Criteria

- [ ] Dashboard loads in < 500ms
- [ ] Urgent decisions section shows opportunities with deadlines < 48h
- [ ] Active applications section shows DRAFTING/SUBMITTED applications
- [ ] Quick Capture button opens Inbox flow
- [ ] All data is user-scoped (single-user alpha)
