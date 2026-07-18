---
id: APPLICATION-012
title: "Evaluation Framework"
status: canonical
version: "1.0"
owner: "AI Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: medium
change_frequency: medium
confidence: 1.0
source_of_truth: ".agents/context/application/evaluation/evals.ctx.md"
consumers:
  - AI Agent
  - Testing Agent
  - Review Agent
  - Context Manager
  - Architect Agent
depends_on:
  - APPLICATION-001
  - APPLICATION-009
  - APPLICATION-010
  - PROMPT-004
tags:
  - application
  - evaluation
  - metrics
  - quality
always_loaded: false
token_budget: 1800
---

# APPLICATION-012 — Evaluation Framework

## Purpose

What is not measured cannot be improved. This module defines objective metrics for retrieval, agents, and AI behavior — the feedback loop missing from a static knowledge base.

## Evaluation Principles

| ID | Principle |
|---|---|
| EVAL-001 | Every production AI path has at least one automated eval |
| EVAL-002 | Metrics must be actionable (tie to a fix owner) |
| EVAL-003 | Human approval rate is a first-class signal, not a vanity metric |
| EVAL-004 | Optimize constraint satisfaction before fluency |
| EVAL-005 | Baseline before change; never ship prompt/context changes without delta |

## Retrieval Metrics

| Metric | Definition | Target (Phase 1) | Owner |
|---|---|---|---|
| **Precision@K** | Relevant modules among top-K loaded | ≥ 0.85 @K=5 | Context Manager |
| **Recall@K** | Required modules present in loaded set | ≥ 0.95 @K=10 | Context Manager |
| **Context hit rate** | Tasks where all hard co-loads present | ≥ 0.98 | Context Manager |
| **Redundant token rate** | Tokens from dropped-priority / duplicate content | ≤ 0.15 | Context Manager |
| **Budget adherence** | Assemblies under token budget | ≥ 0.99 | Context Manager |
| **Gap detection rate** | Empty modules correctly flagged | 1.0 | Context Manager |
| **Freshness compliance** | No expired modules loaded as canonical | 1.0 | Context Manager |

### Retrieval Eval Method

1. Golden task set (min 30 tasks across intent classes).
2. For each: run APPLICATION-009 → compare assembly to labeled required/forbidden sets.
3. Log precision, recall, budget, confidence.
4. Fail CI if recall@required drops below target on critical classes (security, domain).

## Agent Metrics

| Metric | Definition | Target (Phase 1) | Owner |
|---|---|---|---|
| **Task completion rate** | Tasks reaching MERGED without cancel | ≥ 0.80 | Architect |
| **Escalation rate** | Tasks → ESCALATED / human | ≤ 0.25 (track; not always bad) | Architect |
| **Defect escape rate** | Bugs found after MERGED | ≤ 0.10 of merged tasks | Review + Testing |
| **Rework rate** | REVIEW → changes requested → rework | ≤ 0.30 | Review |
| **Ownership violation rate** | Concurrent writers / missing transfer | 0 | Architect |
| **Phase violation rate** | Deferred work treated as in-scope | 0 | PM |
| **Handoff completeness** | Transfers with full envelope | ≥ 0.95 | Architect |

## AI Metrics

| Metric | Definition | Target (Phase 1) | Owner |
|---|---|---|---|
| **Hallucination rate** | Claims not grounded in Career Capital / context | ≤ 0.02 | AI Agent |
| **Constraint violation rate** | Breaks AI ethics / SEC / domain rules | 0 critical | AI + Security |
| **Context utilization score** | Fraction of loaded context cited or used | ≥ 0.40 | AI Agent |
| **Human approval rate** | AI suggestions accepted without major edit | Track baseline | Product |
| **Explainability coverage** | Outputs with required rationale / provenance | 1.0 | AI Agent |
| **Generated-content flag rate** | AI text correctly marked for review | 1.0 | AI Agent |
| **User-commit gate integrity** | No silent commits of AI-proposed knowledge | 1.0 | AI + Backend |

## Metric Formulas (Operational)

```
Precision@K = |loaded ∩ relevant| / |loaded|
Recall@K    = |loaded ∩ required| / |required|
Redundant   = redundant_tokens / total_context_tokens
Hallucination rate = hallucinated_claims / total_factual_claims
Context utilization = distinct_modules_referenced / modules_loaded
Defect escape = post_merge_defects / merged_tasks
```

## Eval Suites

| Suite ID | Scope | Cadence | Blocking? |
|---|---|---|---|
| `EVAL-RETRIEVAL-SMOKE` | 10 golden context assemblies | Every context/prompt change | Yes |
| `EVAL-RETRIEVAL-FULL` | Full golden set | Weekly / pre-release | Yes for release |
| `EVAL-AI-CAPABILITIES` | 5 AI capabilities (APP-001) | Every prompt change | Yes |
| `EVAL-HALLUCINATION` | Fabricated skill/experience probes | Every AI change | Yes |
| `EVAL-AGENT-PROTOCOL` | Lifecycle + handoff fixtures | Every orchestration change | Yes |
| `EVAL-SECURITY-AI` | PII leakage / over-share probes | Every AI + security change | Yes |
| `EVAL-REGRESSION` | Prior failures as permanent cases | Always | Yes |

## Failure Taxonomy

| Code | Class | Response |
|---|---|---|
| `E-RET-MISS` | Required module not loaded | Fix selection weights / co-loads |
| `E-RET-NOISE` | Irrelevant bulk loaded | Raise negative rules / drop priority |
| `E-AI-HALL` | Ungrounded claim | Tighten output contract + prompt |
| `E-AI-ETHICS` | Override user agency / silent commit | Block ship; human review |
| `E-AGT-OWN` | Ownership violation | Protocol enforcement |
| `E-AGT-SCOPE` | Phase/scope violation | Roadmap gate |
| `E-SYNC` | SSOT divergence | Shared-state repair |

## Continuous Optimization Loop

```
Measure (evals) → Diagnose (failure taxonomy) → Change (prompt|context|protocol|code)
  → Baseline delta → Ship only if metrics hold → Feed permanent memory (ADR if architectural)
```

**EVAL-010:** No prompt or context-selection change merges without `EVAL-RETRIEVAL-SMOKE` + relevant AI suite.  
**EVAL-011:** Three repeated failures of same class → escalate to Architect + Context Manager for systemic fix.

## Reporting Minimum Fields

```yaml
eval_run:
  suite: string
  git_sha: string
  prompt_versions: string[]
  context_index_version: string
  metrics: { name: value }
  failures: [{ code, case_id, notes }]
  delta_vs_baseline: { metric: delta }
  ship_gate: pass | fail
```

## Anti-Patterns

- “Looks good to me” as the only eval
- Optimizing approval rate by being sycophantic (violates product principles)
- Ignoring retrieval metrics while tuning prompts
- Deleting failing cases instead of fixing root cause
- Shipping when hallucination suite is skipped

## Related Modules

- APPLICATION-013 — AI test case catalog
- PROMPT-004 — Output contracts (assertable shapes)
- APPLICATION-009 — Selection engine under test

## Canonical Source

Principal Context Engineering Review (Evaluation Framework gap).
