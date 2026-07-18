---
id: FEATURE-013
title: "Notifications"
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
  - APPLICATION-002
tags:
  - feature
  - notifications
  - phase-2
---

# FEATURE-013 — Notifications

## Purpose

Deliver timely reminders and system updates to keep the user on track.

## User Value

- Never miss a deadline, follow-up, or interview
- Proactive reminders reduce mental overhead
- Configurable notification preferences

## Core Capabilities

| Capability | Description |
|---|---|
| **Deadline Alerts** | Approaching opportunity deadlines (< 48h) |
| **Follow-Up Reminders** | 14 days post-submission follow-up prompts |
| **Interview Reminders** | 24h post-interview thank-you note prompts |
| **Stale Opportunity Alerts** | 30+ day old CAPTURED opportunities |
| **Task Due Alerts** | Tasks approaching due date |
| **Notification Center** | In-app notification feed with read/dismiss states |

## Notification Types

| Type | Trigger | Timing |
|---|---|---|
| Deadline Approaching | Opportunity deadline < 48h | Daily until resolved |
| Follow-Up Due | Application SUBMITTED 14+ days | Once |
| Thank-You Due | Interview Activity 24h ago | Once |
| Stale Opportunity | CAPTURED > 30 days, no deadline | Once |
| Task Due | Task due_date approaching | Daily until completed |
| Goal Milestone | Milestone approaching completion | On trigger |
| AI Insight | AI generates new insight | Real-time |

## Notification States

```
PENDING → SENT → READ → DISMISSED
```

## Business Rules

- NOT-001: Notifications are user-scoped (single-user alpha)
- NOT-002: Deadline notifications fire daily until resolved
- NOT-003: Follow-up and thank-you reminders fire once
- NOT-004: Users can dismiss notifications individually or mark all as read
- NOT-005: Notification preferences configurable in Settings

## Dependencies

- DOMAIN-002 (Opportunity) — Deadline data
- DOMAIN-003 (Application) — Submission and interview dates
- APPLICATION-002 (Automation) — Temporal automations
- APPLICATION-004 (API Layer) — Reminder table queries

## Acceptance Criteria

- [ ] Deadline notifications appear for opportunities < 48h away
- [ ] Follow-up reminders fire at 14 days post-submission
- [ ] Thank-you reminders fire at 24h post-interview
- [ ] Notification center shows all notifications with read/dismiss
- [ ] Notification preferences are configurable
