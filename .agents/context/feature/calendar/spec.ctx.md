---
id: FEATURE-008
title: "Calendar"
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
  - calendar
  - phase-2
---

# FEATURE-008 — Calendar

## Purpose

Coordinate deadlines, interviews, and reminders in a unified time-based view.

## User Value

- Never miss a deadline or interview
- Visual timeline of career activity
- Automated reminders keep the user on track

## Core Capabilities

| Capability | Description |
|---|---|
| **Multi-View Calendar** | Month, Week, Day, and Agenda views |
| **Deadline Tracking** | Opportunity deadlines visualized on calendar |
| **Interview Scheduling** | Record and track interview dates |
| **Automated Reminders** | System-generated reminders for deadlines and follow-ups |
| **Calendar Events** | Create custom events (networking, prep time, etc.) |
| **External Sync** | Import/export with Google Calendar, Outlook (Phase 2+) |

## Calendar Views

| View | Description |
|---|---|
| Month | Traditional month grid with deadlines and events |
| Week | Detailed week view with time slots |
| Day | Hour-by-hour view for interview days |
| Agenda | List view sorted by date, showing upcoming items |

## Event Sources

| Source | Event Type | Auto-Created |
|---|---|---|
| Opportunity deadline | Deadline | Yes (on capture) |
| Application submission | Milestone | Yes (on submit) |
| Interview round | Interview | Yes (on INTERVIEWING) |
| Follow-up reminder | Reminder | Yes (14 days post-submit) |
| Thank-you note | Reminder | Yes (24h post-interview) |
| User-created | Custom | No |

## Business Rules

- CAL-001: Opportunity deadlines auto-create calendar events
- CAL-002: Interview dates auto-create calendar events when Application enters INTERVIEWING
- CAL-003: Follow-up reminders auto-create at 14 days post-submission
- CAL-004: Thank-you reminders auto-create at 24h post-interview
- CAL-005: Calendar events link back to parent Opportunity/Application

## Dependencies

- DOMAIN-002 (Opportunity) — Deadline data
- DOMAIN-003 (Application) — Interview dates, submission dates
- APPLICATION-002 (Automation) — Temporal automations
- APPLICATION-004 (API Layer) — Calendar Router

## Acceptance Criteria

- [ ] Calendar displays deadlines, interviews, and custom events
- [ ] Month, Week, Day, Agenda views all function
- [ ] Auto-created events link to parent entities
- [ ] Follow-up and thank-you reminders fire correctly
- [ ] Events can be created and deleted manually
