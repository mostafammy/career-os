---
id: FEATURE-011
title: "Search"
status: canonical
version: "1.0"
owner: "Product Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: medium
change_frequency: low
consumers:
  - Frontend Agent
  - Product Agent
depends_on:
  - CORE-002
tags:
  - feature
  - search
  - phase-1
---

# FEATURE-011 — Search

## Purpose

Global full-text search across every entity and workspace.

## User Value

- Never wonder "Where was that?" — everything is searchable
- Instant results as you type
- Command search for power users (keyboard shortcuts)

## Core Capabilities

| Capability | Description |
|---|---|
| **Instant Search** | Type-ahead results as user types |
| **Full Search** | Detailed results with filters and sorting |
| **Command Search** | Slash-commands for quick actions (e.g., `/capture`, `/review`) |
| **Recent Searches** | Persisted history of recent queries |
| **Pinned Results** | User can pin frequently accessed entities |
| **Saved Searches** | Save complex search queries for reuse |

## Search Scope

| Entity | Searchable Fields |
|---|---|
| Opportunity | title, description, organization name, tags |
| Application | status, notes, organization name |
| Organization | name, industry, website |
| Document | title, type, tags |
| KnowledgeEntry | category, insight, source |
| Reflection | content, lessons |
| Task | title, description |

## Search Types

| Type | Trigger | Behavior |
|---|---|---|
| Instant | Keystroke (debounced 300ms) | Dropdown with top 5 results |
| Full | Enter or Search page | Full page with filters, sorting, pagination |
| Command | `/` prefix | Action shortcuts, entity creation |
| Recent | Search focus | Show last 10 searches |
| Pinned | Star icon | User-pinned entities |

## Business Rules

- SRC-001: Search is user-scoped (single-user alpha)
- SRC-002: Archived entities are searchable but flagged as archived
- SRC-003: Deleted entities (deleted_at set) are excluded from results
- SRC-004: Search results respect entity access permissions

## Dependencies

- APPLICATION-004 (API Layer) — Search Router (globalSearch, searchOpportunities, searchDocuments)
- CORE-002 (Glossary) — Canonical field names for search indexing

## Acceptance Criteria

- [ ] Instant search returns results in < 300ms
- [ ] Full search covers all entity types
- [ ] Command search supports `/capture`, `/review`, `/search`
- [ ] Recent searches persist across sessions
- [ ] Archived entities are flagged in results
