# Information Architecture (IA)

Version: 1.0

Status: Draft

Owner: Product

---

# 1. Purpose

This document defines the structural organization of CareerOS.

It establishes:

- Navigation
- Content hierarchy
- Entity relationships
- Workspace organization
- Information discoverability
- Cross-navigation
- Search boundaries

The IA acts as the structural blueprint of the application.

---

# 2. IA Principles

IA-001

Navigation should mirror user thinking.

---

IA-002

Everything has one canonical location.

---

IA-003

Users should rarely need more than three clicks.

---

IA-004

Search complements navigation.

It does not replace it.

---

IA-005

Related information should remain close.

---

IA-006

Navigation should expose workflows rather than database tables.

---

IA-007

Every screen should answer:

"Why am I here?"

---

# 3. Global Structure

CareerOS consists of six primary domains.

```

Capture

Organize

Execute

Learn

Plan

Configure

```

These domains represent user intent.

---

# 4. Primary Navigation

```

Dashboard

Inbox

Opportunities

Applications

Calendar

Documents

Organizations

Goals

Knowledge

Analytics

Search

Settings

```

These represent top-level navigation.

---

# 5. Navigation Hierarchy

```

Dashboard

│

├── Inbox

│

├── Opportunities

│ ├── Active

│ ├── Archived

│ ├── Templates

│ └── Saved Views

│

├── Applications

│ ├── Active

│ ├── Submitted

│ ├── Interviews

│ ├── Accepted

│ ├── Rejected

│ └── Archived

│

├── Calendar

│ ├── Month

│ ├── Week

│ ├── Day

│ └── Agenda

│

├── Documents

│ ├── CV

│ ├── Essays

│ ├── Certificates

│ ├── Passport

│ ├── Portfolio

│ └── Templates

│

├── Organizations

│ ├── Universities

│ ├── Companies

│ ├── NGOs

│ ├── Research Labs

│ └── Saved

│

├── Goals

│ ├── Vision

│ ├── Missions

│ ├── Goals

│ ├── Milestones

│ └── Career Capital

│

├── Knowledge

│ ├── Notes

│ ├── Reflections

│ ├── Decision Journal

│ ├── AI Insights

│ └── Research

│

├── Analytics

│ ├── Dashboard

│ ├── Opportunities

│ ├── Applications

│ ├── Goals

│ ├── Career Capital

│ └── Trends

│

└── Settings

```

---

# 6. Dashboard

Purpose

Daily Command Center

Primary Questions

What should I do?

What changed?

What is urgent?

Where am I progressing?

Primary Actions

Open Opportunity

Quick Capture

Weekly Review

Search

Calendar

Notifications

---

# 7. Inbox

Purpose

Capture before organization.

Sources

Browser Extension

Email

Manual Entry

LinkedIn

RSS

Import

AI Discovery

States

Unread

Research

Ready

Ignored

Archived

---

# 8. Opportunity Workspace

Sections

Overview

Tasks

Applications

Requirements

Deliverables

Documents

Contacts

Timeline

Knowledge

AI

History

Settings

---

# 9. Application Workspace

Sections

Overview

Checklist

Interview

Documents

Timeline

Reflection

History

---

# 10. Global Search

Searches

Everything.

Search Types

Instant

Full Search

Command Search

Recent

Pinned

Saved

---

# 11. Cross Navigation

Opportunity

↓

Organization

↓

Applications

↓

Documents

↓

Goals

↓

Analytics

↓

Knowledge

Everything remains interconnected.

---

# 12. Context Preservation

When navigating:

Filters remain.

Scroll remains.

Selections remain.

Workspace remains.

Users should never lose context.

---

# 13. Empty States

Every empty page answers:

What is this?

Why should I care?

What should I do next?

Every empty state contains exactly one primary CTA.

---

# 14. Progressive Disclosure

Simple by default.

Advanced when needed.

Examples

Hide advanced filters.

Collapse AI details.

Expandable analytics.

Optional metadata.

---

# 15. Search First Philosophy

Users should never wonder:

"Where was that?"

Everything searchable.

Everything linkable.

Everything referenceable.

---

# 16. IA Principles

Everything has a home.

Everything has relationships.

Everything is discoverable.

Navigation reflects thinking.

Search augments navigation.

Users remain oriented.


🏛 Principal Engineer Review

Daphi...

I think we can make this even better.

Instead of thinking in pages...

Let's think in Objects.

Object-Oriented Information Architecture

Imagine everything is simply an object.

Opportunity

Application

Organization

Document

Goal

Task

Event

Reflection

Decision

Knowledge

Every object automatically gets:

Overview

Related Objects

Timeline

Activity

Notes

Attachments

Analytics

History

Settings

Now the product becomes consistent.

Users learn ONE interface.

Not ten.

For example:

Organization

Overview

Applications

Opportunities

Contacts

Documents

Timeline

Analytics

Notes

History

Or:

Document

Overview

Versions

Usage

History

Related Opportunities

Analytics

Notes

Same pattern.

Different object.

🌟 The Best Idea So Far

This is something I would absolutely implement.

Universal Workspace

Instead of:

Different pages.

Different layouts.

Different code.

CareerOS has ONE workspace engine.

Workspace

↓

Entity Type

↓

Configuration

↓

Rendered Interface

Example:

Workspace

↓

Opportunity

↓

Tabs

↓

Opportunity Workspace

Or

Workspace

↓

Organization

↓

Tabs

↓

Organization Workspace

Or

Workspace

↓

Goal

↓

Tabs

↓

Goal Workspace

One engine.

Infinite entities.

This is precisely the type of architectural reuse you see in mature platforms because it reduces implementation effort, ensures a consistent user experience, and makes future expansion significantly easier.
