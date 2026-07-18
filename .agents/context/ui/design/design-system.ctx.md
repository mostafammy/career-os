---
id: UI-002
title: "Design System"
status: canonical
version: "1.0"
owner: "UX Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: medium
change_frequency: medium
confidence: 0.85
source_of_truth: ".agents/context/ui/design/design-system.ctx.md"
supersedes: null
consumers:
  - UX Agent
  - Frontend Agent
depends_on:
  - UI-001
  - CORE-001
  - CORE-004
tags:
  - ui
  - design-system
always_loaded: false
token_budget: 1400
note: "docs/02-design/design-system.md is empty; this module is the operational SSOT until that file is populated."
---

# UI-002 — Design System

## Purpose

Operational design constraints for CareerOS UI so frontend agents produce a calm, consistent decision-support interface — not a generic SaaS dashboard aesthetic.

## Product Feel (Non-Negotiable)

From CORE-001 design philosophy:

- Calm, intelligent partner
- Reduce uncertainty without removing agency
- Simplify complexity without hiding important information
- Technology supports quietly; never demands attention

**DS-001:** Prefer clarity over decoration.  
**DS-002:** Dense information must remain scannable (progressive disclosure per UI-001).  
**DS-003:** AI content is visually distinct and always reviewable.

## Stack Primitives

| Layer | Choice |
|---|---|
| Components | shadcn/ui primitives |
| Styling | Tailwind CSS |
| Icons | Consistent set (lucide or project standard) |
| Fonts | System / project sans; one monospace for IDs/codes |
| Motion | Minimal; functional only (state change feedback) |

## Layout Patterns

| Pattern | Use |
|---|---|
| **App shell** | Primary nav + content region per UI-001 |
| **Universal Workspace** | Entity-centric: header, key metrics, tabs (Overview / Activity / Documents / …) |
| **Inbox triage** | Fast capture list → detail; keyboard friendly |
| **Pipeline / board** | Opportunity & Application lifecycle columns |
| **Empty states** | Explain next best action; never dead-end |
| **AI panel** | Suggestion + rationale + Accept/Edit/Dismiss |

## Visual Hierarchy

1. **Primary decision** — what should the user do next?
2. **Risk / deadline signals** — urgency without alarm fatigue
3. **Supporting context** — org, score, documents
4. **Meta** — timestamps, audit, system labels

## State & Feedback

| State | UI Requirement |
|---|---|
| Loading | Skeleton within layout; no layout jump (CLS) |
| Empty | Actionable CTA tied to core loop |
| Error | Human-readable; recovery path |
| AI draft | Badge “AI-generated”; require review affordance |
| Success | Quiet confirmation; prefer inline over modal spam |
| Blocked / deferred | Phase-aware copy from ROADMAP-001 |

## AI UX Rules

| ID | Rule |
|---|---|
| AI-UI-001 | Show why (short rationale) next to score/suggestion |
| AI-UI-002 | Map provenance for extracted fields when possible |
| AI-UI-003 | Accept / edit / dismiss on every AI proposal |
| AI-UI-004 | Never auto-apply AI mutations without explicit user action |
| AI-UI-005 | Generated text marked until user edits/accepts |

## Accessibility Baseline

- WCAG AA contrast for text and critical controls
- Focus rings visible; keyboard path for capture and triage
- Do not rely on color alone for fit score (High/Medium/Low needs label)
- Hit targets comfortable for primary actions

## Component Inventory (Phase 1 Minimum)

| Component | Notes |
|---|---|
| Button / IconButton | Primary, secondary, ghost, destructive |
| Input / Textarea / Select | Forms for capture & entity edit |
| Badge | Status, phase, AI-generated |
| Card | Workspace sections |
| Tabs | Workspace regions |
| Table / List | Pipelines and search results |
| Dialog / Sheet | Focused tasks; avoid nested modals |
| Toast | Low-priority confirmations |
| ScorePill | Fit / priority with label |
| EmptyState | Illustration optional; copy required |
| Timeline | Activity / career events |

## Anti-Patterns

- Playful consumer social-app chrome
- Dashboard chart spam without decisions
- Hiding destructive actions without confirm when data loss risk
- AI that “just applies” changes
- Nav that mirrors database tables (violates IA-006)

## Open Gaps

- Full token palette, type scale, and spacing scale not yet in `docs/02-design/design-system.md` (empty). UX Agent should populate and raise confidence to 1.0.

## Canonical Source

CORE-001 philosophy, UI-001 IA, product principles; interim SSOT until design-system.md filled.
