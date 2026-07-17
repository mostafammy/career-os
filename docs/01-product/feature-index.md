# CareerOS Feature Index

**File:** `docs/01-product/feature-index.md`

---

# CareerOS Feature Index

**Status:** Canonical
**Version:** 1.0

---

# Purpose

The Feature Index is the authoritative catalog of all functional capabilities within CareerOS.

It serves as the primary navigation document for product specifications and provides a high-level overview of the platform's functional architecture.

Individual feature documents contain detailed specifications. This document defines **what exists**, **why it exists**, and **where it is documented**.

---

# Product Capability Map

CareerOS is composed of thirteen primary product capabilities.

```text
CareerOS

├── Dashboard
├── Opportunity Inbox
├── Opportunity Management
├── Application Management
├── Organization Management
├── Document Library
├── Goal Management
├── Calendar & Timeline
├── Knowledge System
├── Analytics
├── Global Search
├── AI Assistant
└── Settings
```

These capabilities collectively deliver the complete CareerOS experience.

---

# Feature Catalog

| ID    | Feature                 | Purpose                                                   | Priority | Status  | Specification               |
| ----- | ----------------------- | --------------------------------------------------------- | -------- | ------- | --------------------------- |
| F-001 | Dashboard               | Personalized command center for daily execution.          | Core     | Planned | `features/dashboard.md`     |
| F-002 | Opportunity Inbox       | Rapid capture and triage of incoming opportunities.       | Core     | Planned | `features/inbox.md`         |
| F-003 | Opportunity Management  | Manage the lifecycle of opportunities.                    | Core     | Planned | `features/opportunities.md` |
| F-004 | Application Management  | Prepare, submit, and track applications.                  | Core     | Planned | `features/applications.md`  |
| F-005 | Organization Management | Manage organizations and institutional knowledge.         | High     | Planned | `features/organizations.md` |
| F-006 | Document Library        | Store and reuse career assets.                            | Core     | Planned | `features/documents.md`     |
| F-007 | Goal Management         | Connect execution with long-term strategy.                | High     | Planned | `features/goals.md`         |
| F-008 | Calendar & Timeline     | Coordinate deadlines, interviews, and reminders.          | High     | Planned | `features/calendar.md`      |
| F-009 | Knowledge System        | Convert experience into reusable knowledge.               | High     | Planned | `features/knowledge.md`     |
| F-010 | Analytics               | Measure long-term career progress.                        | High     | Planned | `features/analytics.md`     |
| F-011 | Global Search           | Search across every entity and workspace.                 | Core     | Planned | `features/search.md`        |
| F-012 | AI Assistant            | Provide intelligent recommendations and insights.         | High     | Planned | `features/ai-assistant.md`  |
| F-013 | Notifications           | Deliver timely reminders and system updates.              | Medium   | Planned | `features/notifications.md` |
| F-014 | Settings                | Configure preferences, integrations, and personalization. | Core     | Planned | `features/settings.md`      |

---

# Capability Relationships

The following diagram illustrates how the major product capabilities interact.

```text
                    Dashboard
                         │
      ┌──────────────────┼──────────────────┐
      ▼                  ▼                  ▼
 Opportunity        Applications        Calendar
      │                  │                  │
      ├──────────────┐   │   ┌──────────────┤
      ▼              ▼   ▼   ▼              ▼
 Organizations   Documents  Knowledge   Notifications
      │                  │                  │
      └──────────────┬───┴──────────────────┘
                     ▼
                 Analytics
                     │
                     ▼
                AI Assistant
```

This diagram represents conceptual relationships rather than implementation dependencies.

---

# Feature Prioritization

CareerOS development follows a staged delivery model.

## Phase 1 — Foundation (MVP)

* Dashboard
* Opportunity Inbox
* Opportunity Management
* Application Management
* Document Library
* Global Search
* Settings

---

## Phase 2 — Intelligence

* Calendar
* Organizations
* Knowledge System
* Notifications
* Analytics

---

## Phase 3 — Strategic Growth

* Goal Management
* AI Assistant
* Career Capital
* Advanced Automation
* Integrations

---

# Specification Standards

Every feature specification follows a common structure:

* Purpose
* User Value
* Functional Overview
* Core Capabilities
* User Flows
* Business Rules
* Domain Events
* Dependencies
* Permissions
* Edge Cases
* Acceptance Criteria
* Future Evolution

This ensures consistency across all product documentation.

---

# Relationship to Other Documents

```text
Vision
    │
    ▼
Product Principles
    │
    ▼
PRD
    │
    ▼
Feature Index
    │
    ▼
Feature Specifications
    │
    ▼
UX Specifications
    │
    ▼
System Architecture
```

The Feature Index acts as the bridge between high-level product strategy and detailed feature design.

---

# Version History

| Version | Date          | Description                                             |
| ------- | ------------- | ------------------------------------------------------- |
| 1.0     | Initial Draft | Established the canonical feature catalog for CareerOS. |
