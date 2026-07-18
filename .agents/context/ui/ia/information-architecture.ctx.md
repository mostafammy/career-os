---
id: UI-001
title: "Information Architecture"
status: canonical
version: "1.0"
owner: "UX Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: high
change_frequency: low
consumers:
  - UX Agent
  - Frontend Agent
  - Product Agent
depends_on:
  - CORE-002
  - CORE-004
  - ORGANIZATION-001
tags:
  - ui
  - ia
  - navigation
  - workspace
---

# UI-001 — Information Architecture

## Purpose

Structural blueprint of CareerOS: navigation, content hierarchy, entity relationships, workspace organization, and cross-navigation patterns.

## IA Principles

| ID | Principle |
|---|---|
| IA-001 | Navigation mirrors user thinking |
| IA-002 | Everything has one canonical location |
| IA-003 | Users should rarely need more than three clicks |
| IA-004 | Search complements navigation — it does not replace it |
| IA-005 | Related information remains close |
| IA-006 | Navigation exposes workflows, not database tables |
| IA-007 | Every screen answers: "Why am I here?" |

## Global Structure

Six primary domains representing user intent:

```
Capture → Organize → Execute → Learn → Plan → Configure
```

## Primary Navigation

| Nav Item | Domain | Purpose |
|---|---|---|
| Dashboard | Execute | Daily command center — what to do, what changed, what's urgent |
| Inbox | Capture | Temporary holding area for newly captured opportunities |
| Opportunities | Organize | Active opportunities being evaluated |
| Applications | Execute | Active submissions tracking |
| Calendar | Execute | Time-based view of deadlines and interviews |
| Documents | Learn | Reusable career assets |
| Organizations | Organize | External institutions |
| Goals | Plan | Vision, Missions, Goals, Milestones, Career Capital |
| Knowledge | Learn | Reflections, Decision Journal, AI Insights |
| Analytics | Plan | Statistics and trends |
| Search | — | Global full-text search |
| Configure | — | Settings |

## Navigation Hierarchy

```
Dashboard
├── Inbox
├── Opportunities
│   ├── Active
│   ├── Archived
│   ├── Templates
│   └── Saved Views
├── Applications
│   ├── Active
│   ├── Submitted
│   ├── Interviews
│   ├── Accepted
│   ├── Rejected
│   └── Archived
├── Calendar
│   ├── Month / Week / Day / Agenda
├── Documents
│   ├── CV / Essays / Certificates / Passport / Portfolio / Templates
├── Organizations
│   ├── Universities / Companies / NGOs / Research Labs / Saved
├── Goals
│   ├── Vision / Missions / Goals / Milestones / Career Capital
├── Knowledge
│   ├── Notes / Reflections / Decision Journal / AI Insights / Research
├── Analytics
│   ├── Dashboard / Opportunities / Applications / Goals / Career Capital / Trends
└── Settings
```

## Object-Oriented Workspace Pattern

Every entity type automatically gets a consistent workspace:

| Tab | Content |
|---|---|
| Overview | Summary, key fields, status |
| Related Objects | Linked entities |
| Timeline | Chronological activity feed |
| Activity | Immutable audit trail |
| Notes | User annotations |
| Attachments | Linked documents |
| Analytics | Entity-specific metrics |
| History | State transition log |
| Settings | Entity configuration |

**One engine. Infinite entities.** Users learn ONE interface, not ten.

### Workspace Examples

**Organization Workspace:** Overview → Applications → Opportunities → Contacts → Documents → Timeline → Analytics → Notes → History

**Document Workspace:** Overview → Versions → Usage → History → Related Opportunities → Analytics → Notes

**Goal Workspace:** Overview → Milestones → Linked Opportunities → Timeline → Analytics → Notes → History

## Dashboard — Daily Command Center

**Primary Questions:**
- What should I do?
- What changed?
- What is urgent?
- Where am I progressing?

**Primary Actions:** Open Opportunity, Quick Capture, Weekly Review, Search, Calendar, Notifications

## Inbox — Capture Before Organization

**Sources:** Browser Extension, Email, Manual Entry, LinkedIn, RSS, Import, AI Discovery

**States:** Unread → Research → Ready → Ignored → Archived

## Cross-Navigation Map

```
Opportunity → Organization → Applications → Documents → Goals → Analytics → Knowledge
```

Everything remains interconnected. Related information stays close.

## Context Preservation Rules

When navigating:
- Filters persist
- Scroll position persists
- Selections persist
- Workspace state persists

Users never lose context.

## Empty States

Every empty page answers:
1. What is this?
2. Why should I care?
3. What should I do next?

Every empty state contains exactly one primary CTA.

## Progressive Disclosure

Simple by default, advanced when needed:
- Hide advanced filters
- Collapse AI details
- Expandable analytics
- Optional metadata

## Search-First Philosophy

Users should never wonder "Where was that?" Everything is searchable, linkable, and referenceable.

**Search Types:** Instant, Full Search, Command Search, Recent, Pinned, Saved

## Canonical Source

`docs/08-ux/InformationArchitecture.md`
