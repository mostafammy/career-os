---
id: META-003
title: "Memory Policy"
status: canonical
version: "1.0"
owner: "Context Manager"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: high
change_frequency: low
confidence: 1.0
source_of_truth: ".agents/context/11-ai/memory-policy.md"
tags:
  - meta
  - memory
  - always-load
always_loaded: true
token_budget: 1400
---

# META-003 — Memory Policy

## Purpose

Operational rules for Permanent, Session, Task, and Scratchpad memory — including expiration, summarization, compression, and provenance.

## Memory Tiers

| Tier | Name | Lifetime | Shared? |
|---|---|---|---|
| 0 | Permanent | Until explicitly changed | Read: all agents |
| 1 | Long-term project | Across sessions | Via modules/ADRs |
| 2 | Session | End of session | Via handoff only |
| 3 | Task | End of task | Owner only |
| 4 | Scratchpad | Single reasoning step | Never |
| 5 | Conversation window | Current turn | N/A (assembly) |

## What Lives Where

### Permanent (Tier 0)

- CORE-001–CORE-005, CORE-006 template
- ROADMAP-001
- APPLICATION-006, APPLICATION-007
- Domain invariants, security rules, AI ethics
- Accepted ADRs (index)

### Long-term Project (Tier 1)

- DOMAIN-*, APPLICATION-* (non-L0), FEATURE-*, UI-*, PROMPT-*, EVAL modules
- Decision registry
- Anti-pattern log

### Session (Tier 2)

- Active feature + domain set
- Recent errors, test results
- Conversation summary
- Open tasks for session

### Task (Tier 3)

- Current files, diffs, immediate tool results
- Task envelope (APPLICATION-010)

### Scratchpad (Tier 4)

- Alternatives under evaluation
- Draft plans not yet committed
- Prompt experiments

## Expiration Policies

| Tier | Expire When | Action |
|---|---|---|
| 0 | Never auto-expire | Version + ADR to change |
| 1 | Module `expires_at` or supersession | Drop superseded; load successor |
| 2 | Session end | Summarize decisions → Tier 1 if needed; else purge |
| 3 | Task MERGED/CANCELLED | Summarize into session; purge detail |
| 4 | End of step | Discard |

**MEM-001:** No personal user production data in any agent memory tier.  
**MEM-002:** No secrets/API keys in memory artifacts.

## Summarization Thresholds

| Memory | Threshold | Action |
|---|---|---|
| Task memory | > 2,000 tokens | Summarize to goals, decisions, artifacts, open questions |
| Session memory | > 8,000 tokens | Compress: keep active context_plan + last N handoffs |
| Conversation | Approaching window limit | Compact older turns; preserve constraints & task envelope |
| Scratchpad | > 1,000 tokens | Discard oldest alternatives first |

### Summary Must Preserve

- Decisions and their rationale pointers (ADR ids)
- File paths / artifact list
- Blockers and acceptance criteria
- Correlation ids
- Explicit user/human instructions

### Summary May Drop

- Exploratory dead-ends
- Raw logs already fixed
- Duplicate tool outputs

## Compression Strategies

| Strategy | Use On | Never Use On |
|---|---|---|
| Bullet distillation | Session narrative | Invariants, FSMs, security |
| Keep-headings drop-prose | Long modules over budget | Output contracts |
| Replace body with pointer | Historical ADRs | Active feature acceptance criteria |
| Deduplicate | Repeated glossary echoes | First load of glossary |

## Provenance Requirements

Every durable memory write must record:

```yaml
provenance:
  source: module_id | adr_id | human | tool
  author: AgentId | human
  at: ISO-8601
  correlation_id: string
  confidence: 0.0-1.0
```

**MEM-010:** Confidence < 0.7 on critical path → human review (HITL-006).  
**MEM-011:** Scratchpad content promoted to Tier 1 only via explicit ADR/module update.

## Token Budget Allocation (Default Engineering)

```
Tier 0 always-load     ~4,000–8,000
Tier 1 dynamic         ~6,000
Tier 2 session         ~4,000
Tier 3 task            ~2,000
Tier 4 scratchpad      ≤1,000 (soft)
Response reserve       ~4,000
```

Align with APPLICATION-009 budgets when assembling.

## Sync With Shared State

- Domain mutations never live only in agent memory — emit events (APPLICATION-011).
- Handoffs must include summarized task memory, not raw scratchpad.
- Context Manager owns promotion of session insights into modules.

## Anti-Patterns

- Treating chat history as SSOT
- Infinite session growth without compression
- Storing user CVs/reflections in agent permanent memory
- Promoting low-confidence guesses into CORE modules

## Canonical Source

Context Architecture §7 + Principal Review (Memory enhancements).
