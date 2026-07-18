---
id: APPLICATION-010
title: "Agent Execution Protocol"
status: canonical
version: "1.0"
owner: "Architect Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: high
change_frequency: low
confidence: 1.0
source_of_truth: ".agents/context/application/orchestration/execution-protocol.ctx.md"
consumers:
  - All Agents
  - Architect Agent
  - Context Manager
depends_on:
  - CORE-001
  - CORE-003
  - APPLICATION-011
tags:
  - application
  - orchestration
  - execution
  - always-load
always_loaded: true
token_budget: 1800
---

# APPLICATION-010 — Agent Execution Protocol

## Purpose

Defines **how** agents operate: task lifecycle, ownership, authority, retries, timeouts, and human approval gates. Roles without execution authority produce overlapping work and inconsistent decisions.

## Task Lifecycle FSM

```
NEW → PLANNED → IN_PROGRESS → BLOCKED | REVIEW → APPROVED → MERGED
                              ↓
                           FAILED → RETRY | ESCALATED | CANCELLED
```

| State | Meaning | Who May Transition |
|---|---|---|
| `NEW` | Task created; no owner | Architect / PM / Human |
| `PLANNED` | Owner assigned; context plan ready | Owner agent |
| `IN_PROGRESS` | Active work; exclusive ownership | Owner agent |
| `BLOCKED` | Waiting on dependency or human | Owner agent |
| `REVIEW` | Work complete; awaiting review | Owner → Review Agent |
| `APPROVED` | Review passed | Review Agent / Security Agent / Human |
| `MERGED` | Integrated into canonical state | Architect / Human |
| `FAILED` | Unrecoverable within retry budget | Owner agent |
| `RETRY` | Re-enter IN_PROGRESS after failure | Owner (if retries remain) |
| `ESCALATED` | Beyond agent authority | Owner → escalation chain |
| `CANCELLED` | Explicitly abandoned | Architect / Human |

### Transition Rules

- **EP-001:** Only one agent owns a task in `IN_PROGRESS` at a time.
- **EP-002:** `BLOCKED` requires a named blocker (`dependency | human | missing-context | external`).
- **EP-003:** `REVIEW` is mandatory for: domain model changes, security-sensitive code, AI prompt changes, schema migrations.
- **EP-004:** `MERGED` requires all quality gates from META-002 passed.
- **EP-005:** No direct jump `NEW → MERGED`. Planning and ownership are required.

## Ownership Model

| Role | Authority |
|---|---|
| **Task Creator** | Creates `NEW`; may cancel before `IN_PROGRESS` |
| **Owner Agent** | Sole writer of task artifacts while `IN_PROGRESS` |
| **Reviewer** | Approve / request changes / escalate — cannot edit primary artifacts |
| **Architect** | Reassign owner, cancel, force escalate, resolve multi-agent conflicts |
| **Human** | Absolute authority; overrides any agent decision |

### Ownership Transfer Protocol

```
TRANSFER
  task_id: string
  from: AgentId
  to: AgentId
  reason: string
  context_snapshot: ModuleId[]
  artifacts: Path[]
  open_questions: string[]
  state: PLANNED | BLOCKED | REVIEW
```

- Transfer only from `PLANNED`, `BLOCKED`, or `REVIEW` (never mid-write without checkpoint).
- Receiving agent must re-run context selection (APPLICATION-009) before `IN_PROGRESS`.

## Execution Authority Matrix

| Action Class | Can Decide Alone | Needs Peer Review | Needs Human |
|---|---|---|---|
| Code within coding standards | Owner | Review Agent | No |
| Domain rule interpretation | DDD Agent | Architect if ambiguous | If conflict unresolved |
| New domain rule | No | DDD + Architect | Yes |
| Schema migration | Database Agent | DDD + Backend | Yes if data loss risk |
| Security exception | No | Security Agent | Always |
| New AI capability | No | AI + Architect | Yes |
| Prompt change (existing capability) | Prompt Eng. Agent | AI + Review | If ethical surface changes |
| ADR creation | Documentation / Architect | Review | If irreversible |
| Phase scope change | No | PM + Architect | Always |
| Dependency / stack change | No | Architect | Always |

## Escalation Chain

```
Owner Agent
  → Specialist (DDD | Security | UX | Database | AI)
    → Architect Agent
      → Human
```

| Trigger | Escalate To | Urgency |
|---|---|---|
| Terminology conflict | DDD Agent | medium |
| Architecture violation | Architect | high |
| Security violation | Security + Architect | critical |
| AI ethical risk / hallucination | Architect + Human | critical |
| Missing critical context module | Context Manager | high |
| Retry budget exhausted | Architect | high |
| Conflicting multi-agent claims | Architect | high |
| Product scope ambiguity | PM Agent | medium |

## Retry & Timeout Policies

| Policy | Default | Notes |
|---|---|---|
| Max automatic retries | 2 | Third failure → `ESCALATED` |
| Retry backoff | Immediate → 1 reasoning cycle → escalate | No silent infinite loops |
| Task soft timeout | 1 session | Re-plan if unfinished |
| Task hard timeout | 3 sessions | `BLOCKED` or `ESCALATED` |
| Review SLA | Same session preferred | Max 1 session stall before escalate |
| Human approval wait | Indefinite | Task stays `BLOCKED` with blocker=`human` |

### Failure Handling

1. Capture failure reason + last successful checkpoint.
2. If retries remain → `RETRY` with reduced scope or alternate approach.
3. If retries exhausted → `ESCALATED` with full failure report.
4. Never delete partial artifacts without Architect approval; mark as `superseded`.

## Human-in-the-Loop Gates (Mandatory)

| Gate ID | When | Blocks Until |
|---|---|---|
| HITL-001 | Security exception or data retention change | Human approve |
| HITL-002 | Domain invariant change | Human + ADR |
| HITL-003 | New AI capability or ethical surface change | Human approve |
| HITL-004 | Phase boundary / deferred feature pull-forward | Human + PM |
| HITL-005 | Production deploy of security-sensitive change | Human approve |
| HITL-006 | Context confidence < 0.7 on critical path | Human review |

## Conflict Resolution

1. **Same artifact, two writers** → Architect freezes both; reassign single owner.
2. **Contradictory domain claims** → DDD Agent is source of truth for domain; Architect for architecture.
3. **Contradictory product claims** → PM Agent; Human if roadmap impact.
4. **Stale context vs live code** → Code + tests win for behavior; Context Manager updates modules.
5. **No path** → Human.

## Task Envelope (Required Shape)

Every task MUST carry:

```yaml
task:
  id: "TASK-..."
  title: string
  state: NEW | PLANNED | IN_PROGRESS | BLOCKED | REVIEW | APPROVED | MERGED | FAILED | RETRY | ESCALATED | CANCELLED
  owner: AgentId | null
  creator: AgentId | human
  intent_class: product | engineering | domain | feature | architecture | security | ai | ops
  phase_check: pass | fail
  context_plan:
    always: ModuleId[]
    dynamic: ModuleId[]
    co_loads: ModuleId[]
    token_estimate: number
  authority: solo | peer-review | human-gate
  retry_count: 0
  max_retries: 2
  blockers: []
  artifacts: []
  acceptance: string[]
  parent: TaskId | null
  correlation_id: string
```

## Anti-Patterns

- Two agents editing the same file without transfer
- Skipping `REVIEW` for domain/security/AI changes
- Infinite retry without escalation
- Mutating domain state without domain event (see APPLICATION-011)
- Completing task without context re-validation
- Treating handoff as optional narrative instead of structured transfer

## Canonical Source

Derived from Context Architecture §5 (agents) + Principal Context Engineering Review (Execution Protocol gap).
