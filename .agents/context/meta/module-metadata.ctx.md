---
id: META-005
title: "Context Module Metadata Schema"
status: canonical
version: "1.0"
owner: "Context Manager"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: very-high
change_frequency: low
confidence: 1.0
source_of_truth: ".agents/context/meta/module-metadata.ctx.md"
tags:
  - meta
  - schema
always_loaded: false
token_budget: 700
---

# META-005 — Context Module Metadata Schema

## Purpose

Uniform frontmatter so selection, freshness, and ownership can be automated.

## Required Fields

```yaml
---
id: MODULE-ID                 # e.g. DOMAIN-002, APPLICATION-010
title: "Human title"
status: draft | review | canonical | deprecated | archived
version: "semver"
owner: "Agent or role"
created: "YYYY-MM-DD"
modified: "YYYY-MM-DD"        # ISO-8601 date minimum
phase: 1 | 2 | 3 | all
stability: very-high | high | medium | low
change_frequency: extremely-low | low | medium | high
confidence: 0.0-1.0
source_of_truth: "path or docs path"
consumers: []                 # agent roles
depends_on: []                # module ids
tags: []
always_loaded: true | false
token_budget: number          # soft max for this module body
---
```

## Optional Fields

```yaml
expires_at: "YYYY-MM-DD"      # if set and past → do not load as canonical
supersedes: MODULE-ID | null
superseded_by: MODULE-ID | null
co_load: []                   # hard co-load companions
updated_at: "ISO-8601"        # full timestamp if available
note: "operator notes"
```

## Validation Rules

| ID | Rule |
|---|---|
| MD-001 | `id` unique in META-000 registry |
| MD-002 | `status: canonical` requires confidence ≥ 0.8 |
| MD-003 | `always_loaded: true` requires stability ≥ high |
| MD-004 | `superseded_by` set ⇒ status deprecated or archived |
| MD-005 | `token_budget` should reflect actual size; Context Manager trims if exceeded |
| MD-006 | Empty body modules must not be `canonical` |

## Status Semantics

| Status | Agent behavior |
|---|---|
| draft | Reference only with caveat |
| review | Usable; flag pending review |
| canonical | Full reliance |
| deprecated | Prefer replacement; warn |
| archived | Load only if explicit |

## Canonical Source

Principal Review retrieval metadata recommendation.
