# CareerOS — Agent Entry Point

**Read this first.** Then load modules from `.agents/context/` using the selection rules below.

| Resource | Path |
|---|---|
| Master registry | `context/index.ctx.md` |
| Loading policy | `context/11-ai/context-loading-policy.md` |
| Operating manual | `context/11-ai/agent-operating-manual.md` |
| Memory policy | `context/11-ai/memory-policy.md` |
| Context selection engine | `context/application/context/context-selection.ctx.md` |
| Execution protocol | `context/application/orchestration/execution-protocol.ctx.md` |
| Shared state | `context/application/orchestration/shared-state.ctx.md` |
| Evals | `context/application/evaluation/evals.ctx.md` |
| Human architecture doc | `docs/Context Architecture.md` |

---

## 60-Second Bootstrap

1. **Identity** — You are building **CareerOS** (`career-os.mostafayaser.earth`): a career decision OS, not a task manager/CRM/job board.
2. **North star** — Career Capital Growth.
3. **Core loop** — Capture → Understand → Decide → Prepare → Execute → Reflect → Learn → Improve.
4. **Phase** — Private Alpha / Phase 1 MVP (check `product/roadmap/phase-registry.ctx.md` before implementing).
5. **Architecture** — Clean Architecture + DDD. Domain never imports infrastructure.
6. **AI law** — Augment judgment; never invent career facts; never auto-commit Knowledge without user approval.

---

## Mandatory Load Order

```
META-000 index (skim registry)
  → L0 always-load (CORE-001, CORE-002, ROADMAP-001)
  → role set (engineering | product | ai)
  → APPLICATION-009 selection for this task
  → domain/feature/application modules
  → co-loads
  → work under APPLICATION-010 lifecycle
```

### L0 — Always

- `core/identity/project.ctx.md`
- `core/language/glossary.ctx.md`
- `product/roadmap/phase-registry.ctx.md`
- `11-ai/context-loading-policy.md`
- `11-ai/agent-operating-manual.md`
- `11-ai/memory-policy.md`

### Engineering (+L0)

- `core/architecture/principles.ctx.md`
- `core/standards/coding-standards.ctx.md`
- `application/security/security.ctx.md`
- `application/infrastructure/tech-stack.ctx.md`

### AI work (+Engineering as needed)

- `application/intelligence/intelligence.ctx.md`
- `application/prompts/output-contracts.ctx.md` (+ system/task/tool prompts)
- `application/evaluation/evals.ctx.md`
- `application/testing/ai-test-cases.ctx.md`
- Domain: opportunity, application, knowledge as relevant

### Multi-agent / long tasks

- `application/orchestration/execution-protocol.ctx.md`
- `application/orchestration/shared-state.ctx.md`
- `application/context/context-selection.ctx.md`

---

## Hard Rules (Non-Negotiable)

| ID | Rule |
|---|---|
| R1 | Use glossary terms only (Opportunity ≠ Application) |
| R2 | DOMAIN-003 always with DOMAIN-002 |
| R3 | AI always with Security (APP-006) |
| R4 | No domain mutation without domain event |
| R5 | One task owner in `IN_PROGRESS` |
| R6 | Phase gate: do not ship deferred features as done |
| R7 | Prompt/context-selection changes need eval smoke |
| R8 | Confidence < 0.7 on critical path → human review |
| R9 | Task memory > 2k tokens → summarize; session > 8k → compress |
| R10 | ADRs use `core/architecture/adr-template.ctx.md` + decision registry |

---

## Task Lifecycle (Summary)

```
NEW → PLANNED → IN_PROGRESS → BLOCKED | REVIEW → APPROVED → MERGED
```

Retries: max 2 → escalate. Human gates: security exceptions, invariant changes, new AI capabilities, phase pull-forwards.

Full spec: `application/orchestration/execution-protocol.ctx.md`.

---

## What Not To Load

- Entire domain tree “just in case”
- Deprecated modules alongside successors
- Empty docs placeholders as if complete (flag gaps)
- Real user PII / secrets into agent memory
- All ADRs + all features simultaneously

---

## Efficiency Contract

Agents optimize for **decision quality per token**:

1. Classify intent before loading.
2. Score and budget via APPLICATION-009.
3. Prefer constraints (invariants, FSMs, security, contracts) over narrative.
4. Emit structured handoffs, not essay transfers.
5. Measure with APPLICATION-012; fix systemic failures, don’t paper over them.

---

## Folder Map

```
.agents/
├── AGENTS.md                 ← you are here
└── context/
    ├── index.ctx.md          ← full registry
    ├── 11-ai/                ← policies (load, operate, memory)
    ├── meta/                 ← metadata schema
    ├── core/                 ← stable identity & standards
    ├── domain/               ← bounded contexts
    ├── application/          ← platform + orchestration + prompts + evals
    ├── feature/              ← capability specs
    ├── ui/                   ← IA + design system
    └── product/              ← roadmap, personas, decisions
```
