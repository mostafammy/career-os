---
id: META-001
title: "Context Loading Policy"
status: canonical
version: "2.0"
owner: "Context Manager"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: high
change_frequency: medium
confidence: 1.0
source_of_truth: ".agents/context/11-ai/context-loading-policy.md"
tags:
  - meta
  - policy
  - always-load
always_loaded: true
token_budget: 1600
---

# Context Loading Policy

## Purpose

This policy defines how context modules are loaded into agent sessions. It ensures every agent operates with the right knowledge at the right time, minimizing token waste while maximizing reasoning accuracy.

**Deterministic selection** is owned by **APPLICATION-009** (Context Selection Engine). This file is the policy surface; APPLICATION-009 is the scoring brain.

## Level System

### L0 — Permanent Session Context (Always Injected)

These modules are injected into EVERY agent session, every context window. Never removed.

```
CORE-001  (Project Identity)        ~500 tokens
CORE-002  (Glossary)                ~1,500 tokens
ROADMAP-001 (Phase Registry)        ~800 tokens
```

**For engineering sessions, also inject:**
```
CORE-003  (Architecture Principles) ~1,000 tokens
CORE-005  (Coding Standards)        ~1,200 tokens
APPLICATION-006 (Security)          ~1,500 tokens
APPLICATION-007 (Tech Stack)        ~800 tokens
APPLICATION-010 (Execution Protocol) ~ when multi-agent / task lifecycle
```

**For product sessions, also inject:**
```
CORE-004  (Product Principles)      ~1,000 tokens
```

**For AI / prompt sessions, also inject:**
```
APPLICATION-001 (Intelligence)      dynamic but preferred early
APPLICATION-006 (Security)          always with AI
PROMPT-004 (Output Contracts)       when producing/validating AI I/O
```

**Total L0 budget:** ~4,000–8,000 tokens

### L1 — Current Feature/Domain Context

Loaded when task is identified. Swapped (not accumulated) when task changes.

- Current DOMAIN-* package
- Current FEATURE-* spec
- Relevant APPLICATION-* module

### L2 — Related/Neighboring Context

Loaded when cross-context reasoning is needed.

- Co-load requirements (e.g., DOMAIN-002 when DOMAIN-003 is loaded)
- Related feature specs
- Implementation-layer modules

### L3 — Historical/Archived Context

Loaded only when explicitly requested.

- ADRs, sprint plans, changelogs, deprecated versions

## Retrieval Pipeline

```
1. INTENT CLASSIFICATION
   ├── Product question? → CORE-004
   ├── Engineering? → CORE-003, CORE-005, APP-006, APP-007
   ├── Domain question? → Domain classification
   ├── Feature question? → UI-001 + feature spec
   └── Architectural? → All CORE-* + architect agent

2. ALWAYS-LOAD INJECTION
   └── L0 modules injected automatically

3. DOMAIN CLASSIFICATION
   ├── "opportunity" → DOMAIN-002 (+ DOMAIN-003 if Application also needed)
   ├── "application" → DOMAIN-003 + DOMAIN-002 (co-load rule)
   ├── "goal"/"strategy" → DOMAIN-001
   ├── "knowledge"/"reflection" → DOMAIN-004
   ├── "organization" → DOMAIN-005
   ├── "document" → DOMAIN-006
   ├── "platform"/"auth" → DOMAIN-007
   └── "event"/"automation" → DOMAIN-008 + APPLICATION-002

4. PHASE VALIDATION
   └── Does the feature exist in current phase?
       → YES: proceed
       → NO: return "Deferred to Phase X"

5. CONTEXT ASSEMBLY
   └── L0 + L1 + L2 modules assembled

6. CO-LOAD VALIDATION
   └── Verify mandatory co-loads satisfied

7. KNOWLEDGE GAP CHECK
   └── Is required module empty/missing?
       → YES: alert + load nearest parent + note gap
       → NO: proceed

8. CONTEXT COMPRESSION
   └── Apply compression rules
       [Never compress: invariants, FSM transitions, security rules]
       [Always compress: historical narrative, extended rationale]

9. REASON + RESPOND

10. OUTPUT VALIDATION
    └── Verify no non-canonical terminology, no deferred features referenced as implemented
```

## Co-Load Rules (Mandatory)

| Primary | Must Co-load | Reason |
|---|---|---|
| DOMAIN-003 (Application) | DOMAIN-002 (Opportunity) | XAG-001, XAG-002 |
| APPLICATION-001 (Intelligence) | DOMAIN-004 (Knowledge) | RAG on KnowledgeEntries |
| APPLICATION-001 (Intelligence) | APPLICATION-006 (Security) | AI processes confidential data |
| APPLICATION-002 (Automation) | DOMAIN-008 (Events) | Automations fire on events |
| FEATURE-* | Parent DOMAIN-* | Feature reasoning needs domain rules |

## Anti-Retrieval Rules (Never Load Together Without Reason)

- Do NOT load APPLICATION-001 without APPLICATION-006
- Do NOT load APPLICATION-002 without DOMAIN-008
- Do NOT load DOMAIN-003 without DOMAIN-002
- Do NOT load FEATURE-* without parent DOMAIN-*
- Do NOT load APPLICATION-005 alone for domain questions

## Compression Rules

### Never Summarize
- Domain invariants (INV-001 through INV-010)
- State machine transitions with side effects
- Security rules (SEC-001 through SEC-007)
- Cross-aggregate rules (XAG-001 through XAG-005)
- AI ethical constraints
- Event envelope definition
- Authorization rules (`WHERE user_id = ?`)

### Always Compress
- Extended rationale → one-line principle ID
- Example code → type signature + behavior
- Meeting notes → decisions only
- Historical version history → latest + last major

## Token Budget

Default engineering assembly (align with APPLICATION-009):

```
Tier 0 (Always-load)     ~4,000–8,000
Tier 1 (Domain modules)  ~6,000
Tier 2 (Session)         ~4,000
Tier 3 (Task)            ~2,000
Tier 4 (Scratchpad)      ≤1,000 soft
Response reserve         ~4,000
```

If over budget: drop by APPLICATION-009 priority (neighbor features → ADRs → secondary domains), then compress Tier 2/3, then Tier 1 rationale. **Never compress or drop Tier 0 security/identity/glossary/phase.**

## Module Metadata (Required for Load Decisions)

Every module should expose META-005 fields. Selection uses:

| Field | Use |
|---|---|
| `confidence` | < 0.7 → warn / HITL on critical path |
| `expires_at` | past → do not load as canonical |
| `stability` | freshness decay schedule (META-003 / APP-009) |
| `supersedes` / `superseded_by` | prefer successor |
| `co_load` | hard constraints |
| `token_budget` | soft size cap per module |
| `source_of_truth` | conflict resolution |

## Negative Retrieval (Never)

- APP-001 without APP-006
- DOMAIN-003 without DOMAIN-002
- FEATURE-* without parent DOMAIN-*
- Full domain dump without classification
- Deprecated + successor together without explicit migration task
- Production secrets / real user PII

## Feedback Loop

After task completion, Context Manager / evals may record:

- Which modules were used vs unused (context utilization)
- Gaps (empty modules requested)
- Budget overruns

Feed into APPLICATION-012 retrieval metrics.
