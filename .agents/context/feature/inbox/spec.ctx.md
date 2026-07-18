---
id: FEATURE-002
title: "Inbox"
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
  - AI Agent
depends_on:
  - DOMAIN-002
  - APPLICATION-001
tags:
  - feature
  - inbox
  - capture
  - phase-1
---

# FEATURE-002 — Inbox

## Purpose

Capture before organization. Rapid triage of incoming opportunities before they enter the pipeline.

## User Value

- Zero-friction capture from any source (URL, text, email, extension)
- AI-powered extraction eliminates manual data entry
- Triage workflow ensures nothing falls through the cracks

## Core Capabilities

| Capability | Description |
|---|---|
| **Multi-Source Capture** | Browser extension, URL paste, email forwarding, manual entry, LinkedIn import |
| **AI Data Extraction** | Parses unstructured input into structured Opportunity draft |
| **Triage Workflow** | Unread → Research → Ready → Ignored → Archived |
| **Bulk Import** | CSV/JSON import for migrating from other tools |
| **Draft Review** | User reviews AI-extracted fields before saving |

## Capture Sources

| Source | Method | AI Extraction |
|---|---|---|
| Browser Extension | One-click capture of current page | Yes — parses job description |
| URL Paste | Paste link, system fetches content | Yes — extracts structured data |
| Email Forward | Forward to capture@career.os | Yes — parses email body |
| Manual Entry | Form-based entry | No — user fills fields |
| LinkedIn | Import from LinkedIn job post | Yes — extracts role details |

## Inbox States

```
UNREAD → RESEARCH → READY → [Saved as Opportunity]
       → IGNORED
       → ARCHIVED
```

## AI Extraction Fields

From `APPLICATION-001`:
- Organization Name
- Role Title
- Application Deadline
- Location
- Salary Range
- Required Documents

**Constraint:** User always reviews and clicks "Save" before Opportunity enters pipeline. UI highlights source text mapping.

## Business Rules

- INB-001: Every captured item starts in UNREAD state
- INB-002: AI extraction is async — user sees "Processing..." until extraction completes
- INB-003: User can override any AI-extracted field before saving
- INB-004: READY items have all required fields populated
- INB-005: IGNORED items are hidden from default view but remain searchable

## Dependencies

- DOMAIN-002 (Opportunity) — Creates Opportunity entities
- APPLICATION-001 (Intelligence) — AI extraction
- APPLICATION-004 (API Layer) — Opportunity Router (capture procedure)

## Acceptance Criteria

- [ ] User can capture an opportunity from a URL in < 10 seconds
- [ ] AI extracts core fields with > 80% accuracy
- [ ] User can review and edit all extracted fields before saving
- [ ] Triage states (UNREAD → RESEARCH → READY) function correctly
- [ ] Browser extension captures page content
