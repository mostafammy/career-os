---
id: APPLICATION-011
title: "Shared State Synchronization Model"
status: canonical
version: "1.0"
owner: "Architect Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: high
change_frequency: low
confidence: 1.0
source_of_truth: ".agents/context/application/orchestration/shared-state.ctx.md"
consumers:
  - All Agents
  - Architect Agent
  - Backend Agent
  - Context Manager
depends_on:
  - APPLICATION-010
  - DOMAIN-008
  - CORE-003
tags:
  - application
  - orchestration
  - state
  - events
always_loaded: false
token_budget: 1500
co_load:
  - APPLICATION-010
  - DOMAIN-008
---

# APPLICATION-011 — Shared State Synchronization Model

## Purpose

Prevent multi-agent state divergence. Defines single sources of truth, write permissions, consistency rules, event emission, and cache invalidation.

## Golden Rule

> **No agent mutates domain state directly without emitting a domain event.**

All cross-agent visibility of domain changes flows through events (DOMAIN-008) or explicit handoff artifacts (APPLICATION-010).

## Single Sources of Truth (SSOT)

| Concern | SSOT | Not Authoritative |
|---|---|---|
| Domain model & invariants | `docs/03-domain/entities.md` + DOMAIN-* modules | Feature specs, UI copy |
| State machines | `docs/03-domain/state-machines.md` + DOMAIN-* | Implementation comments |
| Ubiquitous language | CORE-002 / glossary | Ad-hoc agent synonyms |
| Architecture principles | CORE-003 | One-off PR rationales |
| Security rules | APPLICATION-006 | Client-side checks alone |
| Phase scope | ROADMAP-001 | Sprint chatter |
| Schema | APPLICATION-005 / Prisma schema | Hand-written SQL notes |
| Task ownership & lifecycle | APPLICATION-010 task envelope | Chat messages |
| Context registry | META-000 index | Scattered READMEs |
| Product decisions / ADRs | product/decisions + ADR files | Undocumented chats |
| AI prompts | application/prompts/* | Inline code strings (must sync) |
| Eval baselines | APPLICATION-012 | Anecdotal “looks good” |

## Write Permissions

| State Class | Who May Write | Required Side Effect |
|---|---|---|
| Domain entity data (runtime app) | Backend via domain commands | Domain event + Activity audit |
| Domain model docs / DOMAIN-* | DDD Agent (+ Review) | Version bump + Context Manager notify |
| Schema / migrations | Database Agent | Migration file + event catalog update if needed |
| Feature specs | PM / Feature owner | Phase check + parent domain co-load |
| Context modules | Context Manager / owning agent | Frontmatter `modified` + index update |
| Task envelope | Owner agent / Architect | State transition log |
| Shared agent memory (session) | Owner of session | TTL + no PII |
| Permanent memory | Context Manager / Architect | Human gate if irreversible |
| Prompts | Prompt Engineering Agent | Version + eval smoke tests |
| Security config | Security Agent | Human gate for exceptions |

**SS-001:** Read-anyone, write-owner. Concurrent writers require Architect mediation.  
**SS-002:** Agents MUST NOT rewrite another agent’s SSOT without transfer of ownership.  
**SS-003:** “Fixing” domain rules in application code without updating DOMAIN-* is a sync violation.

## Read Consistency Rules

| Read Type | Consistency | Notes |
|---|---|---|
| Always-load modules | Strong (canonical snapshot at session start) | Reload if Context Manager publishes update mid-session |
| Domain modules | Strong for active task | Prefer version pinned in context_plan |
| Feature specs | Strong for active feature | One feature primary |
| Task envelope | Strong | Owner is authoritative |
| Session memory | Eventual within session | Summarize before handoff |
| Scratchpad | No consistency guarantee | Never shared as truth |
| Eval metrics | Eventual | Batch-updated |

**SS-004:** On handoff, receiver treats sender’s scratchpad as non-authoritative unless promoted into task artifacts.

## Domain Event Emission Requirements

Every domain-mutating command must:

1. Validate invariants in domain layer.
2. Persist state change.
3. Emit versioned domain event (DOMAIN-008 envelope).
4. Write Activity audit (`updated_by` agent or `system:*`).
5. Include `correlation_id` linking to task envelope when agent-driven.

| Mutation | Minimum Event |
|---|---|
| Opportunity created | `OpportunityCaptured` |
| Opportunity state change | `Opportunity*Transitioned` / specific catalog event |
| Application state change | Matching Application event |
| Knowledge commit from AI | Only after user approval event |
| Schema change | ADR + migration (not a domain event; still recorded) |

**SS-005:** AI proposals are **not** domain state until user/system approval path commits them.

## Cache Invalidation Policies

| Cache | Invalidate When | Strategy |
|---|---|---|
| Agent L0 always-load | CORE/ROADMAP/Security module version change | Hard reload next session |
| Domain module cache | DOMAIN-* `modified` or supersedes | Drop module; re-fetch |
| Feature spec cache | FEATURE-* change or phase change | Drop feature entry |
| Context assembly plan | Task intent change or co-load miss | Re-run APPLICATION-009 |
| Embedding / RAG index | KnowledgeEntry approved commit | Async reindex; mark stale until done |
| Eval baselines | Prompt version bump | Re-run smoke suite |
| Task memory | Task → MERGED / CANCELLED | Summarize then purge |

**SS-006:** Prefer explicit version tokens over time-based TTL for canonical modules.  
**SS-007:** TTL is allowed for session/scratchpad only.

## Shared Memory Boundaries

| Memory Tier | Shared Across Agents? | Sync Mechanism |
|---|---|---|
| Permanent | Yes (read) | Context modules |
| Long-term project | Yes (read); write via owner | Modules + ADRs |
| Session | Only via handoff artifact | Transfer protocol |
| Task | Only owner until handoff | Task envelope |
| Scratchpad | Never | — |

## Divergence Detection & Repair

| Symptom | Detection | Repair |
|---|---|---|
| Code implements rule not in DOMAIN-* | Review Agent / tests | Update domain or revert code |
| Two modules define same term differently | Context Manager | CORE-002 wins for terms |
| Event catalog missing emitted event | Automation/Backend review | Add event + version |
| Prompt in code ≠ prompt module | AI Agent CI check | Sync to prompts SSOT |
| Task two owners | Orchestration monitor | Architect reassign |
| Stale context used after module update | Version mismatch in plan | Re-select context |

## Anti-Patterns

- Agents editing the same Prisma models without ownership
- “Silent fixes” to business rules in UI only
- Sharing scratchpad as if it were domain truth
- Caching forever without version keys
- Mutating entities without events “for speed”

## Canonical Source

Context Architecture multi-agent + events sections; Principal Review (State Synchronization gap).
