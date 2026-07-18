---
id: META-004
title: "Prompt Engineering Guide"
status: canonical
version: "1.0"
owner: "Prompt Engineering Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: high
change_frequency: low
confidence: 1.0
source_of_truth: ".agents/context/11-ai/prompt-engineering-guide.md"
tags:
  - meta
  - prompts
always_loaded: false
token_budget: 600
---

# META-004 — Prompt Engineering Guide

## Purpose

Index and operating rules for prompt assets. **Prompts are production assets**, versioned and eval-gated.

## Asset Map

| ID | File | Role |
|---|---|---|
| PROMPT-001 | `application/prompts/system-prompts.ctx.md` | Global + capability system constraints |
| PROMPT-002 | `application/prompts/task-prompts.ctx.md` | Task templates / input bindings |
| PROMPT-003 | `application/prompts/tool-prompts.ctx.md` | Tool/function call contracts |
| PROMPT-004 | `application/prompts/output-contracts.ctx.md` | Structured schemas + failure examples |
| APPLICATION-012 | `application/evaluation/evals.ctx.md` | Ship metrics |
| APPLICATION-013 | `application/testing/ai-test-cases.ctx.md` | Concrete cases |

## Change Protocol

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

## Anti-Patterns

- Prompt-only fixes for domain bugs
- Shipping without eval delta
- Duplicating diverging copies in code and context
- “Ignore previous instructions” vulnerability untested

## Canonical Source

Principal Review (Prompt Layer gap) + APPLICATION-001.
