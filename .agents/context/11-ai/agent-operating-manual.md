---
id: META-002
title: "Agent Operating Manual"
status: canonical
version: "2.0"
owner: "Context Manager"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: high
change_frequency: medium
confidence: 1.0
source_of_truth: ".agents/context/11-ai/agent-operating-manual.md"
tags:
  - meta
  - policy
  - always-load
always_loaded: true
token_budget: 1800
---

# Agent Operating Manual

## Purpose

This document defines the procedures for agent team coordination in CareerOS development. Every agent must follow these procedures.

**Execution authority and lifecycle** are defined in **APPLICATION-010**. **Shared state rules** are in **APPLICATION-011**. This manual is the operational checklist; those modules are normative for conflicts.

## Agent Activation Rules

### Before Starting Any Task

1. **Open or accept a task envelope** — state `NEW` → `PLANNED` (APPLICATION-010)
2. **Load L0 context** — CORE-001, CORE-002, ROADMAP-001 (always)
3. **Run context selection** — APPLICATION-009 (do not improvise module dumps)
4. **Load role-specific always-loads** — engineering vs product vs AI sets (META-001)
5. **Check co-load requirements** — hard fails if violated
6. **Validate phase** — ROADMAP-001; deferred work must not be implemented as current
7. **Confirm authority class** — solo | peer-review | human-gate

### During Task Execution

1. **Hold exclusive ownership** while `IN_PROGRESS` (no dual writers)
2. **Use canonical terminology** — CORE-002 only
3. **Respect architectural boundaries** — CORE-003
4. **Follow coding standards** — CORE-005
5. **Enforce security** — APPLICATION-006
6. **Stay in phase** — ROADMAP-001
7. **Domain mutations** — emit domain events; never silent SSOT edits (APPLICATION-011)
8. **AI work** — honor PROMPT-004 contracts; no auto-commit of career facts
9. **On failure** — retry ≤ 2 then escalate (APPLICATION-010)

### After Completing Task

1. **Self-validate** — terminology, phase, security, architecture gates below
2. **Transition** → `REVIEW` when required (domain, security, AI, schema)
3. **Hand off** with structured transfer (not prose-only)
4. **Document decisions** — ADR via CORE-006 + DECISION-001 registry
5. **Update context** — notify Context Manager; bump module `modified`
6. **Run evals** if prompts/context-selection changed (APPLICATION-012)

## Agent Hierarchy

```
Architect Agent (orchestrates all)
    ├── DDD Agent (domain model purity)
    ├── Backend Agent (application/infrastructure code)
    ├── Frontend Agent (presentation layer)
    ├── Database Agent (schema, migrations)
    ├── AI Agent (intelligence features)
    ├── Automation Agent (deterministic rules)
    ├── Testing Agent (test strategy)
    ├── Review Agent (code/doc review)
    ├── Security Agent (security compliance)
    ├── UX Agent (user experience)
    ├── Analytics Agent (metrics)
    ├── DevOps Agent (deployment)
    ├── Performance Agent (performance)
    ├── Knowledge Graph Agent (RAG, embeddings)
    ├── PM Agent (product alignment)
    ├── Context Manager (meta — maintains this system)
    ├── Documentation Agent (technical docs)
    ├── Prompt Engineering Agent (AI prompts)
    └── Refactoring Agent (code quality)
```

## Communication Protocol

### Handoff Format

```
HANDOFF
  task_id: [TASK-...]
  from: [Agent Name]
  to: [Agent Name]
  state: PLANNED | BLOCKED | REVIEW
  task: [What was done]
  context_plan: [ModuleIds from APPLICATION-009]
  artifacts: [Files created/modified]
  open_questions: []
  next_steps: [What the receiving agent should do]
  correlation_id: [string]
```

Receiver MUST re-run context selection before `IN_PROGRESS`.

### Escalation Format

```
ESCALATION
  task_id: [TASK-...]
  from: [Agent Name]
  to: [Agent Name or "human"]
  reason: [Why escalating]
  context_plan: [ModuleIds]
  recommendation: [Suggested resolution]
  urgency: [low | medium | high | critical]
  retry_count: [n]
```

### Conflict Resolution

1. **Terminology conflict** → DDD Agent (CORE-002)
2. **Architecture conflict** → Architect Agent (CORE-003)
3. **Product conflict** → PM Agent (CORE-004)
4. **Security conflict** → Security Agent (APPLICATION-006)
5. **Domain model conflict** → DDD + Architect
6. **Ownership / dual-write** → Architect freezes; reassign (APPLICATION-010)
7. **Stale context vs code** → tests/code for behavior; Context Manager updates modules
8. **No path** → Human

### Human-in-the-Loop (Mandatory Gates)

See APPLICATION-010 HITL-001–006. Never bypass: security exceptions, invariant changes, new AI capabilities, phase pull-forwards, context confidence < 0.7 on critical path.

## Documentation Lifecycle

| Stage | Agent Behavior |
|---|---|
| DRAFT | Can reference, cannot rely upon. Note: "Using draft: {doc}; may change" |
| REVIEW | Can use but note pending review. Escalate conflicts. |
| APPROVED (Canonical) | Full reliance. Reference by ID. No caveats. |
| DEPRECATED | Alert. Recommend replacement. Do not use for new decisions. |
| ARCHIVED | Do not load unless specifically requested (L3 only). |
| DELETED | Must not reference. Flag for removal if encountered. |

## Quality Gates

### Before Any Code Change

- [ ] Loaded relevant L0 + L1 context
- [ ] Used canonical terminology (CORE-002)
- [ ] Followed coding standards (CORE-005)
- [ ] Enforced security rules (APPLICATION-006)
- [ ] Respected phase boundaries (ROADMAP-001)
- [ ] Domain imports are clean (no infrastructure in domain layer)

### Before Any Documentation Change

- [ ] Cross-references validated (all BR-* rules)
- [ ] No conflicts with existing canonical docs (CV-* rules)
- [ ] Terminology matches glossary (CORE-002)
- [ ] Phase references correct (ROADMAP-001)
- [ ] Frontmatter follows standard format

### Before Marking Task Complete

- [ ] All acceptance criteria met
- [ ] Tests written (if applicable)
- [ ] AI/prompt changes: APPLICATION-012 smoke + P0 AI-TC passed
- [ ] Handoff completed to next agent (structured transfer)
- [ ] Documentation / ADR updated (if applicable)
- [ ] Context Manager notified of module changes
- [ ] Task state → REVIEW | APPROVED | MERGED per APPLICATION-010
- [ ] No SSOT divergence (APPLICATION-011)
