---
id: META-004
title: "Prompt Engineering Guide"
status: canonical
version: "2.0"
owner: "Prompt Engineering Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: high
change_frequency: low
confidence: 1.0
source_of_truth: "docs/PROMPT_ENGINEERING_GUIDE.md"
tags:
  - meta
  - prompts
always_loaded: false
token_budget: 600
---

# META-004 — Prompt Engineering Guide (Index)

## Full Guide

**Canonical location:** `docs/PROMPT_ENGINEERING_GUIDE.md`

This file is the module stub. Load the full guide when authoring or reviewing prompts.

## The Fundamental Law

> A prompt is ONLY the delta — the information the agent cannot already know from context.

## Asset Map (AI Capability Prompts)

| ID | File | Role |
|---|---|---|
| PROMPT-001 | `application/prompts/system-prompts.ctx.md` | Global + capability system constraints |
| PROMPT-002 | `application/prompts/task-prompts.ctx.md` | Task templates / input bindings |
| PROMPT-003 | `application/prompts/tool-prompts.ctx.md` | Tool/function call contracts |
| PROMPT-004 | `application/prompts/output-contracts.ctx.md` | Structured schemas + failure examples |
| APPLICATION-012 | `application/evaluation/evals.ctx.md` | Ship metrics |
| APPLICATION-013 | `application/testing/ai-test-cases.ctx.md` | Concrete cases |

## What NEVER Appears in Prompts (Summary)

Anything already in context modules. Key examples:
- Tech stack → APPLICATION-007
- Architecture rules → CORE-003
- Coding standards → CORE-005
- Security rules → APPLICATION-006
- Glossary → CORE-002
- Domain state machines → DOMAIN-*
- Phase boundaries → ROADMAP-001

## What ALWAYS Appears in Prompts

1. Task objective (one sentence)
2. Task-specific inputs
3. Acceptance criteria (binary, measurable)
4. Expected artifacts (file paths)
5. Authority level (solo / peer-review / human-gate)

## 15 Prompt Templates

See `docs/PROMPT_ENGINEERING_GUIDE.md` Section 8:
Feature · Bug Fix · Refactoring · ADR · Testing · Performance · DB Migration ·
API · Frontend · Backend · Documentation · Review · Security · AI Capability · Automation

## Prompt Change Protocol

1. Edit the owning PROMPT-* module (SSOT — not only inline code).
2. Bump `prompt_version` (semver; breaking schema = major).
3. Update parsers/validators if schema changed.
4. Run `EVAL-AI-CAPABILITIES` + `EVAL-HALLUCINATION` (P0 cases).
5. If ethical surface or new capability → ADR + human gate.
6. Register notable decisions in DECISION-001.

## Design Rules

- Constraints in system prompts; thin task prompts.
- Structured outputs always (PROMPT-004).
- Grounding > fluency; refusal > hallucination.
- Terminology from CORE-002 only.
- Proposal tools default; commit tools gated.

## Anti-Patterns (Top 6)

- Repeating architecture/tech stack in prompts (AP-001, AP-002)
- Vague acceptance criteria (AP-004)
- Pasting PRD content (AP-005)
- Security reminders that imply it is optional (AP-006)
- Missing definition of done (AP-009)
- Prompt as architecture discussion (AP-010)

Full list (AP-001 through AP-012): `docs/PROMPT_ENGINEERING_GUIDE.md` Section 10.

## Canonical Source

`docs/PROMPT_ENGINEERING_GUIDE.md` v1.0
