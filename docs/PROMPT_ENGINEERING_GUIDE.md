# CareerOS - Prompt Engineering Guide

**ID:** META-004-FULL
**Version:** 1.0
**Status:** Canonical
**Owner:** Prompt Engineering Agent / Architect Agent
**Optimized for:** Human contributors + AI agents in the CareerOS context system
**Do NOT duplicate:** This guide is the Single Source of Truth for all prompt authoring.

---

## Table of Contents

1. The Fundamental Law
2. Prompt Philosophy
3. How the Context System Works
4. Prompt Layers
5. What NEVER Appears in a Prompt
6. What ALWAYS Appears in a Prompt
7. Prompt Categories
8. Prompt Templates (15 Categories)
9. Prompt Lifecycle
10. Prompt Anti-Patterns
11. Prompt Examples (Bad to World-Class)
12. Prompt Quality Checklist
13. Prompt Validation Rules
14. Decision Trees
15. Quick Reference Tables
16. Contributor Workflow
17. Repository Improvement Recommendations
18. Prompt Evolution Policy

---

# 1. The Fundamental Law

> **A prompt is ONLY the delta - the information the agent cannot already know from context.**

This is the single most important principle in this guide. Violating it is the root cause of every prompt anti-pattern.

CareerOS has a complete Context Engineering Architecture (.agents/context/) that loads 30+ knowledge modules covering: project identity, domain model, coding standards, architecture principles, security rules, tech stack, product principles, glossary, and phase boundaries.

**If it is already in the context system, it must NEVER appear in a prompt.**

A prompt that explains the architecture to an agent that already has the architecture loaded is actively harmful. It:
- Wastes the context window
- Creates a drift-prone secondary source of truth
- Dilutes agent attention from task-specific information
- Creates maintenance debt (prompt vs. context module divergence)

The context system is the operating system. The prompt is the application.

---

# 2. Prompt Philosophy

## 2.1 Core Principles

| Principle | Description |
|---|---|
| Prompts are the delta | Only task-specific information belongs in prompts |
| Context is the foundation | Architecture, standards, and domain rules live in context modules |
| Single Source of Truth | Every fact lives in exactly one place |
| Prompts are production assets | Prompts are versioned, reviewed, and eval-gated like code |
| Precision over length | A 50-token precise prompt beats a 2000-token vague one |
| Acceptance criteria over description | Tell the agent what done looks like, not how to think |
| Minimize redundancy, maximize specificity | The unique parts of a task deserve the most attention |

## 2.2 The Three Responsibilities

A prompt has exactly three responsibilities:

1. DECLARE the task objective - what is to be accomplished, in one sentence.
2. PROVIDE task-specific inputs - what the agent cannot retrieve from context.
3. DEFINE done - acceptance criteria: how the agent knows it succeeded.

Everything else belongs in the context system.

## 2.3 The Partition

`
CONTEXT SYSTEM               PROMPT                   AGENT
Architecture                 Task objective            Reasoning
Domain rules                 Task-specific inputs      Implementation
Coding standards             Acceptance criteria       Validation
Security rules               Edge cases (task-only)    Output
Glossary                     Definition of done        Quality gates
Phase boundaries
Agent procedures
Tech stack
History and ADRs
`

---

# 3. How the Context System Works

## 3.1 What Is Always Available Without Any Prompt Mention

For every engineering session, these load automatically:

| What | Module |
|---|---|
| Project identity and vision | CORE-001 |
| Ubiquitous language / glossary | CORE-002 |
| Phase boundaries and deferred features | ROADMAP-001 |
| Architecture principles | CORE-003 |
| Coding standards + file naming | CORE-005 |
| Security rules | APPLICATION-006 |
| Tech stack + prohibitions | APPLICATION-007 |

## 3.2 You Do NOT Write These in Prompts

- Use Clean Architecture
- Use TypeScript strict mode
- This is a Next.js + tRPC project
- Use Prisma for database access
- Ensure user can only see their own data
- Follow SOLID principles
- Use cuid for IDs
- Soft-delete with deleted_at
- Events must be past tense
- CareerOS is not a CRM or task manager
- The North Star is Career Capital Growth

These are in context modules. Writing them in prompts is a DRY violation at the knowledge architecture level.

---

# 4. Prompt Layers

## Layer 0 - System Foundation (NEVER in Prompts)

CORE-001, CORE-002, CORE-003, CORE-004, CORE-005, APPLICATION-006, APPLICATION-007, ROADMAP-001.

Nothing from Layer 0 ever appears in a prompt.

## Layer 1 - Domain Context (RARELY in Prompts)

Domain modules load automatically based on intent signals. Do NOT repeat domain rules.

Does NOT go in prompt: "Remember Opportunity has states CAPTURED, EVALUATING, ACTIONED, ARCHIVED..."
CAN go in prompt: "This task must preserve XAG-001 (auto-create Application on ACTIONED Opportunity)."

## Layer 2 - Feature Context (SOMETIMES in Prompts)

Reference the feature by ID. Add ONLY what is task-specific within that feature.

Does NOT go in prompt: "The Opportunity Inbox is a rapid capture and triage surface. It should support..."
CAN go in prompt: "Feature: FEATURE-002 (Inbox). Task: implement the deduplication UI."

## Layer 3 - Task Context (ALWAYS in Prompts)

Specific objective, task-specific inputs, acceptance criteria, task-unique edge cases, and definition of done.

`
LAYER     IN PROMPT?    EXAMPLE
Layer 0   NEVER         Tech stack, security, architecture
Layer 1   RARELY        Domain rules re-stated - use ID reference instead
Layer 2   SOMETIMES     Feature ID + task-specific scope
Layer 3   ALWAYS        Objective, inputs, acceptance criteria
`

---

# 5. What NEVER Appears in a Prompt

## 5.1 Architecture and Engineering (CORE-003, CORE-005)

| Never Include | Module |
|---|---|
| Use Clean Architecture | CORE-003 |
| Separate domain from infrastructure | CORE-003 |
| Follow SOLID principles | CORE-003 |
| Emit domain events | CORE-003 |
| Use TypeScript strict mode | CORE-005 |
| Follow naming conventions | CORE-005 |
| Soft-delete with deleted_at | APPLICATION-005 |
| Use cuid IDs | APPLICATION-005 |

## 5.2 Technology Stack (APPLICATION-007)

| Never Include | Module |
|---|---|
| Use Next.js App Router | APPLICATION-007 |
| Use tRPC for API | APPLICATION-007 |
| Use Prisma for DB access | APPLICATION-007 |
| Use Zod for validation | APPLICATION-007 |
| Do NOT use GraphQL | APPLICATION-007 |
| Do NOT use Redis in Phase 1 | APPLICATION-007 |

## 5.3 Security (APPLICATION-006)

| Never Include | Module |
|---|---|
| Ensure user can only see their own data | APPLICATION-006 |
| Add WHERE user_id to all queries | APPLICATION-006 |
| Validate file types on upload | APPLICATION-006 |
| Never expose secrets in code | APPLICATION-006 |

## 5.4 Domain Language (CORE-002)

| Never Include | Module |
|---|---|
| An Opportunity is an external opening | CORE-002 |
| Application is one attempt to pursue | CORE-002 |
| Use Opportunity not Job Post | CORE-002 |
| Core loop is Capture to Improve | CORE-001 |

## 5.5 Product Identity (CORE-001, CORE-004)

| Never Include | Module |
|---|---|
| CareerOS is not a CRM | CORE-001 |
| North Star is Career Capital Growth | CORE-001 |
| AI augments never replaces P-004 | CORE-004 |
| Explain before you automate P-016 | CORE-004 |

## 5.6 Phase and Roadmap (ROADMAP-001)

| Never Include | Module |
|---|---|
| This is Phase 1 MVP | ROADMAP-001 |
| Knowledge Graph is Phase 3 | ROADMAP-001 |
| Redis is not available yet | ROADMAP-001 |

## 5.7 Domain Rules (DOMAIN-* modules)

| Never Include | Module |
|---|---|
| Opportunity state machine | DOMAIN-002 |
| Application 8-state lifecycle | DOMAIN-003 |
| Application always has parent Opportunity | DOMAIN-003 |
| Activity is append-only | DOMAIN-007 |
| Goal hierarchy Vision to Goal | DOMAIN-001 |
| XAG cross-aggregate rules | DOMAIN-002/003 |

## 5.8 The Test

Before adding any sentence to a prompt: Does a context module already contain this information?
If YES - Delete it. If NO - Include it.

---

# 6. What ALWAYS Appears in a Prompt

## 6.1 Mandatory Elements

### 1. Task Objective (Required)
One sentence. Example: Implement the captureOpportunity tRPC procedure.

### 2. Task-Specific Inputs (Required when not inferable)
Specific IDs, states, files, or conditions unique to this task.

### 3. Acceptance Criteria (Required)
Measurable, binary pass/fail conditions.
Example:
  - Validates with Zod; title required, url optional
  - Returns 400 BAD_REQUEST on empty title
  - Activity row created on every successful capture

### 4. Scope Boundaries (Required when ambiguous)
What is explicitly IN scope and OUT of scope.

### 5. Edge Cases (Required when task-specific)
Only cases unique to this task - not general error handling.

### 6. Authority Level (Required)
AUTHORITY: solo / peer-review / human-gate

### 7. Expected Artifacts (Required)
Specific file paths that will be created or modified.

---

# 7. Prompt Categories

| Category | When to Use | Context Auto-Loaded |
|---|---|---|
| Feature Implementation | Building new feature end-to-end | DOMAIN-*, FEATURE-*, UI-001 |
| Bug Fix | Reproducing and fixing a defect | Relevant DOMAIN-* |
| Refactoring | Improving code quality without behavior change | CORE-003, CORE-005 |
| Architecture | ADR, system design, layer boundary | All CORE-* |
| Testing | Unit, integration, or E2E tests | DOMAIN-*, FEATURE-* |
| Performance Optimization | Improving response times | APPLICATION-005 |
| Database Migration | Schema changes, index creation | APPLICATION-005, DOMAIN-* |
| API Development | tRPC procedure implementation | APPLICATION-004, DOMAIN-* |
| Frontend | React components, pages, hooks | UI-001, FEATURE-* |
| Backend | Server-side business logic | DOMAIN-*, APPLICATION-004 |
| Documentation | Writing or filling docs | All relevant context |
| Review | Code review, doc review | All relevant context |
| Security | Auth, authorization, encryption | APPLICATION-006 |
| AI Capability | AI feature implementation | APPLICATION-001, PROMPT-001/004 |
| Automation | Deterministic rule implementation | APPLICATION-002, DOMAIN-008 |

---

# 8. Prompt Templates (15 Categories)

## Template Conventions

`
TASK: [One-sentence objective]
SCOPE: [In/out - only when ambiguous]
INPUTS: [Task-specific data]
EDGE_CASES: [Task-specific only]
ACCEPTANCE: [Measurable criteria]
ARTIFACTS: [Expected outputs]
AUTHORITY: [solo | peer-review | human-gate]
`

Omit any field that is empty. Do not use N/A fillers.


## Template 1 - Feature Implementation

`
TASK: Implement [feature name or ID] - [specific sub-component].

FEATURE: FEATURE-[N] (loaded from context)

INPUTS:
  - [Task-specific data, IDs, or current state]

SCOPE:
  IN:  [Specific component/layer]
  OUT: [Adjacent concerns excluded]

ACCEPTANCE:
  - [Functional behavior]
  - [Test: expected coverage]

ARTIFACTS:
  - [File paths to create/modify]

AUTHORITY: peer-review
`

EXAMPLE:
`
TASK: Implement the captureOpportunity tRPC procedure (opportunityRouter).

INPUTS:
  - Router target: src/server/routers/opportunity.router.ts
  - Input schema: { title: string (required), url?: string, category?: OpportunityCategory }

SCOPE:
  IN:  tRPC procedure + Zod validation + domain command + Activity record
  OUT: AI extraction (TASK-047), UI form (TASK-051)

ACCEPTANCE:
  - Validates with Zod; title required, url optional
  - Creates Opportunity in CAPTURED state
  - Inserts Activity row for audit trail
  - Returns { opportunityId: string }
  - Returns BAD_REQUEST on missing title
  - Test: capture with title only => 201 + id
  - Test: capture with empty title => 400 BAD_REQUEST
  - Test: Activity row created for every successful capture

ARTIFACTS:
  - src/server/routers/opportunity.router.ts
  - src/server/domain/opportunity/capture-opportunity.command.ts
  - src/server/domain/opportunity/capture-opportunity.command.spec.ts

AUTHORITY: peer-review (first API surface for this domain)
`

## Template 2 - Bug Fix

`
TASK: Fix [observed behavior].

BUG:
  Trigger:  [how to reproduce]
  Expected: [correct behavior]
  Actual:   [broken behavior]
  File:     [location if known]

ACCEPTANCE:
  - [Regression test added covering the bug]
  - [Original behavior restored]
  - [Specific cases that must pass]

ARTIFACTS:
  - [Fix location + test file]

AUTHORITY: [solo | peer-review if domain involved]
`

EXAMPLE:
`
TASK: Fix cascade-archive bug - archiving Opportunity leaves child Applications orphaned.

BUG:
  Trigger:  User archives an ACTIONED Opportunity
  Expected: All child Applications transition to ARCHIVED per INV-003
  Actual:   Applications remain in DRAFTING or SUBMITTED state
  File:     src/server/domain/opportunity/opportunity.entity.ts ~line 87

ACCEPTANCE:
  - Opportunity with 0 Applications: archives cleanly
  - Opportunity with 1 DRAFTING Application: Application => ARCHIVED
  - Opportunity with 1 SUBMITTED Application: Application => ARCHIVED
  - Opportunity with 1 REJECTED Application: no change (already terminal)
  - Activity records created for each cascaded archive
  - Regression tests for all 4 cases

ARTIFACTS:
  - src/server/domain/opportunity/opportunity.entity.ts
  - src/server/domain/opportunity/opportunity.entity.spec.ts

AUTHORITY: peer-review (domain state machine change, DDD Agent review required)
`

## Template 3 - Refactoring

`
TASK: Refactor [component] to [goal].

CURRENT STATE: [What exists now]
TARGET STATE:  [What it should look like]

CONSTRAINTS:
  - No behavior change (all existing tests must pass)
  - [Architecture constraint for this refactor]

ACCEPTANCE:
  - All existing tests pass
  - [Specific improvement measurable]

ARTIFACTS: [Files to modify]
AUTHORITY: solo [or peer-review if cross-layer]
`

## Template 4 - Architecture Decision (ADR)

`
TASK: Write ADR for the decision to [topic].

CONTEXT:
  - [Why this decision is needed]
  - [Options considered]

DECISION:
  - [Chosen option and rationale]

CONSEQUENCES:
  - [Trade-offs, future implications]

TEMPLATE: CORE-006 (ADR Template loaded from context)

ACCEPTANCE:
  - Follows CORE-006 template exactly
  - References relevant principles from CORE-003/CORE-004
  - Registered in DECISION-001

ARTIFACTS:
  - docs/07-product-management/adrs/ADR-[NNN]-[name].md

AUTHORITY: human-gate
`

## Template 5 - Testing

`
TASK: Write [unit | integration | E2E] tests for [component].

TARGET: [File or component to test]

COVERAGE:
  - [Happy path scenarios]
  - [Error/edge cases]

ACCEPTANCE:
  - All stated test cases implemented
  - Test file follows {name}.spec.ts naming
  - Tests isolated (no shared state)
  - All tests pass on clean run

ARTIFACTS: [test file path]
AUTHORITY: solo
`

## Template 6 - Performance Optimization

`
TASK: Optimize [operation] to meet [target].

CURRENT:  [Measured performance]
TARGET:   [From PRD NFR or task-specific]

CONSTRAINTS:
  - Must not change API contract
  - Must not remove indexes used by other queries

ACCEPTANCE:
  - [Measurable performance improvement]
  - Existing tests still pass

ARTIFACTS: [Files modified]
AUTHORITY: solo [or peer-review if schema change]
`

## Template 7 - Database Migration

`
TASK: Create migration for [schema change].

CHANGE:
  - [Table, column, index, or enum modification]
  - [Domain entity this maps to: DOMAIN-N]

BACKWARD COMPATIBILITY:
  - [Additive? Requires backfill?]

ACCEPTANCE:
  - Migration runs on dev and preview Neon branch
  - Schema matches domain model
  - Existing data preserved / migrated correctly

ARTIFACTS:
  - prisma/migrations/[timestamp]_[name]/migration.sql
  - prisma/schema.prisma (updated)

AUTHORITY: peer-review (schema is shared state)
`

## Template 8 - API Development

`
TASK: Implement the [procedureName] procedure in [routerName].

ROUTER: [router name]
INPUTS (Zod schema):
  - [field: type, required/optional]

SIDE EFFECTS:
  - [Domain state changes]
  - [Activity records created]
  - [Events emitted]
  - [Cross-aggregate effects: reference XAG rule if any]

OUTPUT: [return type]

ACCEPTANCE:
  - Input validated with Zod
  - [Specific success behavior]
  - [Specific error behavior]
  - Unit test: happy path + validation error

ARTIFACTS: [router file + handler + test]
AUTHORITY: [solo | peer-review]
`

## Template 9 - Frontend

`
TASK: Build the [ComponentName] component for [feature].

FEATURE: FEATURE-[N] (loaded from context)

DESIGN:
  - [IA section from UI-001]
  - [Task-specific visual requirement]

BEHAVIOR:
  - [What the component does]
  - [States: loading, empty, error, populated]

API: Consumes [tRPC procedures]

ACCEPTANCE:
  - Renders loading state
  - Renders empty state
  - Renders with data
  - User action X produces result Y

ARTIFACTS: [component file path]
AUTHORITY: solo
`

## Template 10 - Backend Domain Layer

`
TASK: Implement [command or query] in [BoundedContext] domain.

DOMAIN: [DOMAIN-N] (loaded from context)
OPERATION: [Command | Query]
  Name:    [e.g., EvaluateOpportunity]
  Trigger: [What initiates this]

BUSINESS RULES (task-specific only):
  - [Rule NOT already in the domain module]

SIDE EFFECTS:
  - [Domain events to emit]
  - [Activity records to create]

ACCEPTANCE:
  - Pre-conditions validated
  - Post-state correct
  - Events emitted
  - Tests covering FSM transition + side effects

ARTIFACTS:
  - src/server/domain/[context]/[name].command.ts
  - src/server/domain/[context]/[name].command.spec.ts

AUTHORITY: peer-review
`

## Template 11 - Documentation

`
TASK: Write [document name or path].

PURPOSE: [What this document enables]
AUDIENCE: [Human engineers | AI agents | Both]

CONTENT REQUIREMENTS:
  - [Section 1: what it must cover]
  - [Section 2: what it must cover]

CONSTRAINTS:
  - Must not duplicate content in [module ID]
  - Must follow frontmatter standard META-005
  - Use CORE-002 terminology only

ACCEPTANCE:
  - All required sections present
  - Cross-references validated
  - Frontmatter complete

ARTIFACTS: [file path]
AUTHORITY: peer-review
`

## Template 12 - Code Review

`
TASK: Review [PR/file] for correctness and standard compliance.

TARGET: [PR number or files]

FOCUS AREAS:
  - [Specific concern 1 unique to this review]
  - [Specific concern 2]

ACCEPTANCE:
  - Terminology matches CORE-002 (auto-loaded)
  - Architecture boundaries respected (CORE-003 auto-loaded)
  - Security rules enforced (APPLICATION-006 auto-loaded)
  - Phase boundaries correct (ROADMAP-001 auto-loaded)
  - Task-specific AC verified: [list them]

OUTPUT: Structured review: approved | changes-requested + findings
AUTHORITY: peer-review
`

## Template 13 - Security Review

`
TASK: Security review of [component/change].

CHANGE SUMMARY: [What was changed]

SPECIFIC CONCERNS (task-specific only):
  - [Security aspect unique to this change, beyond APPLICATION-006 general rules]

ACCEPTANCE:
  - Authorization enforced at repository layer
  - Input validation present
  - [Task-specific security criteria]

AUTHORITY: human-gate if exception; Security Agent otherwise
`

## Template 14 - AI Capability Implementation

`
TASK: Implement [capability] for APPLICATION-001.

CAPABILITY: [intelligent_capture | strategic_fit | asset_suggestion | document_generation | reflection_synthesis]

INPUTS: [What the capability receives]

OUTPUT CONTRACT: PROMPT-004 AiResult<T> (loaded from context)

ACCEPTANCE:
  - Passes APPLICATION-013 test cases for this capability
  - Passes smoke tests SP-T01 through SP-T05
  - No ungrounded_claims in happy-path output
  - user_review_required: true on domain-mutating output
  - Eval: APPLICATION-012 smoke + hallucination test P0

ARTIFACTS:
  - src/server/ai/[capability].ts
  - src/server/ai/[capability].spec.ts

AUTHORITY: human-gate (new/modified AI capability)
`

## Template 15 - Automation Implementation

`
TASK: Implement the [automation name] deterministic automation (APPLICATION-002).

AUTOMATION:
  Trigger:   [State transition or temporal event]
  Condition: [When the rule fires]
  Action:    [What is automated]

IDEMPOTENCY: [How duplicate triggers are handled]

ACCEPTANCE:
  - Fires exactly once for the trigger condition
  - Idempotent: second trigger has no effect
  - Creates Activity: { updated_by: system:automation, automation_reason: [string] }
  - Fails gracefully: if action fails, core user action is NOT blocked
  - Visible in audit log

ARTIFACTS: [handler file + test file]
AUTHORITY: peer-review
`

---

# 9. Prompt Lifecycle

`
CONTRIBUTOR REQUEST
         |
         v
1. INTENT CLASSIFICATION
   What category? Which template? Which authority?
         |
         v
2. CONTEXT RESOLUTION (Automatic - not in prompt)
   APPLICATION-009 loads modules based on intent signals
   Always loaded: CORE-001, CORE-002, ROADMAP-001
   Engineering: + CORE-003, CORE-005, APP-006, APP-007
   Domain signals: + relevant DOMAIN-* modules
         |
         v
3. AGENT SELECTION
   Feature implementation => Backend + Frontend + Testing Agents
   Domain model change    => DDD Agent + Architect review
   AI capability          => AI Agent + human gate
         |
         v
4. PROMPT ASSEMBLY (By contributor)
   Select correct template from Section 8
   Fill task-specific fields only
   Strip any Layer 0/1 content per Section 5
   Verify acceptance criteria are measurable
   Set authority level
         |
         v
5. PROMPT VALIDATION
   Run Quality Checklist (Section 12)
   Pass Validation Rules (Section 13)
   No anti-patterns present (Section 10)
         |
         v
6. TASK EXECUTION
   Agent loads context via APPLICATION-009
   Agent follows APPLICATION-010 task lifecycle
   Agent MUST NOT implement deferred features
         |
         v
7. IMPLEMENTATION
   Follows CORE-005 coding standards
   Follows CORE-003 architecture principles
   APPLICATION-006 security enforced throughout
         |
         v
8. SELF-VALIDATION
   Terminology check (CORE-002)
   Architecture boundary check (CORE-003)
   AI changes: APPLICATION-012 eval smoke
         |
         v
9. REVIEW (If Required)
   Peer review: domain, schema, security-sensitive
   Human gate: security exceptions, AI capabilities, invariant changes
         |
         v
10. COMPLETION
    Task state => MERGED
    Context Manager notified if modules affected
    Decisions registered in DECISION-001
    ADR created if architectural using CORE-006 template
`


# 10. Prompt Anti-Patterns

## AP-001 - Architecture Repetition
WRONG: "Use Clean Architecture. Keep domain separate. Use tRPC. Use Prisma. Follow SOLID. TypeScript strict. Write tests..."
WHY: In CORE-003, CORE-005, APPLICATION-007. Auto-loaded. Wastes ~400 tokens and creates drift.
FIX: Delete all of it.

## AP-002 - Tech Stack Specification
WRONG: "This project uses Next.js 14 with App Router, tRPC 11, Prisma 6, PostgreSQL Neon serverless..."
WHY: APPLICATION-007 is loaded for every engineering session.
FIX: Never include the tech stack. If ONE choice is task-relevant, include ONLY that delta.

## AP-003 - Domain Glossary in Prompts
WRONG: "In CareerOS, an Opportunity is any external opening. An Application is one attempt to pursue..."
WHY: CORE-002 is always loaded.
FIX: Use canonical terms directly. The agent already knows what they mean.

## AP-004 - Vague Acceptance Criteria
WRONG: "The feature should work correctly and feel good. Implement error handling. Write some tests."
WHY: Unmeasurable. Agent cannot confirm completion. Reviewer cannot confirm correctness.
FIX: Binary pass/fail criteria with specific inputs and expected outputs.

## AP-005 - The PRD Dump
WRONG: "Here is the relevant section from the PRD: [3 pages of PRD content]. Now implement this..."
WHY: Defeats the entire context architecture. Creates version drift risk.
FIX: Reference module ID or feature ID. The context system loads the current version.

## AP-006 - Security as an Afterthought
WRONG: "...and also make sure to add proper auth and that users only see their own data."
WHY: APPLICATION-006 is always loaded. Mentioning it implies it is optional.
FIX: Never mention general security rules. Only include task-specific deviations.

## AP-007 - Duplicate Context Creation
WRONG (in a feature prompt): "The Opportunity Inbox shows all opportunities in CAPTURED state. It should support quick filtering by deadline, category..."
WHY: Belongs in FEATURE-002. Fix the feature spec, not the prompt.
FIX: Write the missing context module first. Then reference it by ID.

## AP-008 - Scope Creep via Prompt
WRONG: "Implement Opportunity capture with AI extraction, Knowledge Graph linking, and browser extension support."
WHY: Knowledge Graph is Phase 3, browser extension is Phase 2. ROADMAP-001 defers these.
FIX: Scope prompts to the current phase. Check ROADMAP-001 first.

## AP-009 - Missing Definition of Done
WRONG: "Implement the dashboard router."
WHY: Without acceptance criteria, done is undefined.
FIX: Always define done. Even one AC is better than none.

## AP-010 - Prompt as Architecture Discussion
WRONG: "Should we use CQRS here? What about event sourcing? Can you implement it?"
WHY: Architecture debates produce ADRs, not implementation tasks.
FIX: Write the ADR first (Template 4). Then write the implementation prompt referencing it.

## AP-011 - Agent Behavioral Instructions
WRONG: "Be careful and thorough. Think step by step. Do not hallucinate..."
WHY: General agent behavior is defined in META-002 (Agent Operating Manual).
FIX: Trust the operating procedures. Focus the prompt on the task.

## AP-012 - Vague Context References
WRONG: "Look at the PRD for requirements. Check the domain docs."
WHY: The PRD is 137KB. Vague references are meaningless.
FIX: Reference specific module IDs, invariant IDs, or principle IDs. Example: Respect XAG-001.

---

# 11. Prompt Examples (Bad to World-Class)

## Feature Implementation - captureOpportunity

### BAD
`
Implement the opportunity management feature for CareerOS. CareerOS is built with Next.js, tRPC, Prisma, PostgreSQL. Use Clean Architecture and DDD. Opportunities have states CAPTURED, EVALUATING, ACTIONED, ARCHIVED. Make sure it is secure. Use TypeScript. Write tests.
`
Problems: Repeats tech stack (~60 tokens wasted), architecture (~20 tokens), domain states (~30 tokens), glossary. No AC. Zero signal.

### GOOD
`
TASK: Implement the captureOpportunity tRPC procedure.

INPUT:  { title: string, url?: string }
OUTPUT: { opportunityId: string }

ACCEPTANCE:
  - Creates Opportunity in CAPTURED state
  - Returns 400 if title is empty
  - Creates Activity row on success

ARTIFACTS:
  - opportunity.router.ts
  - capture-opportunity.command.ts
  - capture-opportunity.command.spec.ts

AUTHORITY: peer-review
`
60 tokens. Has AC. Defines artifacts. No redundancy.

### EXCELLENT
`
TASK: Implement the captureOpportunity tRPC procedure - first write operation in the Opportunity domain.

INPUTS:
  - title: string (required, max 250 chars)
  - url?: string (stored as-is per capture-flow spec)

SCOPE:
  IN:  tRPC procedure + Zod validation + domain command + Activity record
  OUT: AI extraction (TASK-047), deduplication (TASK-048), Inbox UI (TASK-051)

EDGE CASES:
  - URL provided but title empty => 400 BAD_REQUEST
  - Same URL within 5 min by same user => return existing opportunityId

ACCEPTANCE:
  - title required, url optional, Zod validated
  - Opportunity created in CAPTURED state
  - Activity row created: type CAPTURED, actor user_id
  - Returns { opportunityId: string }
  - Error: empty title => 400 BAD_REQUEST
  - Error: url duplicate within 5 min => 409 CONFLICT + existing id
  - Tests: happy path, validation error, duplicate url case

ARTIFACTS:
  - src/server/routers/opportunity.router.ts
  - src/server/domain/opportunity/capture-opportunity.command.ts
  - src/server/domain/opportunity/capture-opportunity.command.spec.ts

AUTHORITY: peer-review (first domain write surface)
`
~220 tokens. Complete, precise, no redundancy.

### WORLD-CLASS
`
TASK: Implement captureOpportunity - phase-gate enforced entry point for the Opportunity domain (DOMAIN-002).

INPUTS (Zod schema):
  title:     string, min 1, max 250 chars, trimmed
  url?:      string URL, stored exactly as provided
  category?: OpportunityCategory enum from DOMAIN-002

SCOPE:
  IN:  tRPC mutation + ZodValidation + CaptureOpportunityCommand + Activity write
  OUT: AI extraction (TASK-047), deduplication (TASK-048), org auto-link automation (downstream)

BUSINESS RULE (task-specific):
  If url provided AND Opportunity with same url exists for this user AND less than 5 minutes old
  => 409 CONFLICT: { conflict: duplicate_url, existingId: string }
  Source: capture-flow.md Section 4 (deduplication policy)

ACCEPTANCE:
  Functional:
    - Opportunity created in CAPTURED state, owned by authenticated user
    - Activity: { aggregate_type: OPPORTUNITY, type: CAPTURED, actor: user_id }
    - Returns { opportunityId: string } on success
  Validation:
    - Empty title => 400 BAD_REQUEST: { code: BAD_REQUEST, field: title }
    - Title > 250 chars => 400 BAD_REQUEST
  Edge cases:
    - Duplicate URL under 5 min => 409 CONFLICT: { existingId }
    - Valid URL without title => 400 (title still required)
  Tests:
    - Happy path: title only => 201 + id
    - Happy path: full capture => 201 + id
    - Empty title => 400
    - Duplicate URL within 5 min => 409 + existingId
    - Activity row verified on success
    - No Activity row on validation error

ARTIFACTS:
  - src/server/routers/opportunity.router.ts
  - src/server/domain/opportunity/capture-opportunity.command.ts
  - src/server/domain/opportunity/capture-opportunity.command.spec.ts

CORRELATION_ID: TASK-046
DEPENDS_ON: TASK-031 (opportunityRouter scaffolding)
HANDOFF_TO: Testing Agent (TASK-048 deduplication after this merges)
AUTHORITY: peer-review
`
~380 tokens. All signal, zero noise. Binary AC. Correlation for traceability.

---

# 12. Prompt Quality Checklist

## Mandatory Checks
- [ ] P1 - Task objective is stated in one clear sentence
- [ ] P2 - Scope is defined when ambiguous
- [ ] P3 - Acceptance criteria are present and measurable (binary pass/fail)
- [ ] P4 - Expected artifacts are listed with specific file paths
- [ ] P5 - Authority level is set (solo / peer-review / human-gate)

## Duplication Checks
- [ ] D1 - No tech stack mentioned (APPLICATION-007 auto-loaded)
- [ ] D2 - No architecture rules (CORE-003 auto-loaded)
- [ ] D3 - No coding conventions (CORE-005 auto-loaded)
- [ ] D4 - No security reminders (APPLICATION-006 auto-loaded)
- [ ] D5 - No domain state machine descriptions (DOMAIN-* auto-loaded)
- [ ] D6 - No glossary definitions (CORE-002 auto-loaded)
- [ ] D7 - No phase context (ROADMAP-001 auto-loaded)
- [ ] D8 - No product principles (CORE-004 auto-loaded)

## Quality Checks
- [ ] Q1 - Acceptance criteria are testable (not "it should feel good")
- [ ] Q2 - Edge cases are task-specific (not general error handling)
- [ ] Q3 - No PRD content pasted (reference module IDs instead)
- [ ] Q4 - Scope does not include deferred features
- [ ] Q5 - Business rules cited with source (invariant ID or principle ID)
- [ ] Q6 - No anti-patterns from Section 10 present

## Size Check
- [ ] S1 - Prompt is under 500 tokens (target: 100-300 for simple tasks)
- [ ] S2 - Every sentence adds unique information

## Scoring
| Score | Status |
|---|---|
| All P + all D + Q1/Q2/Q3/Q4 | Ready to submit |
| Fails any P check | Incomplete - add missing element |
| Fails any D check | DRY violation - remove redundant content |
| Over 500 tokens | Audit for anti-patterns first |

---

# 13. Prompt Validation Rules

## PV-001 - No Layer 0 Content
Any sentence answerable by CORE-001 through CORE-005, APPLICATION-006, APPLICATION-007, or ROADMAP-001 must not appear in a prompt.

## PV-002 - Acceptance Criteria Must Be Binary
Every AC must have a clear pass/fail condition. "Works correctly" fails. "Returns 201 with opportunityId" passes.

## PV-003 - Feature Prompts Must Reference Feature ID
Any feature implementation prompt must include the FEATURE-N ID so the spec is loaded correctly.

## PV-004 - Authority Must Be Set

| Change Type | Minimum Authority |
|---|---|
| Solo implementation, no domain/schema/AI change | solo |
| Domain model change | peer-review (DDD Agent) |
| Schema migration | peer-review (Database Agent) |
| Security-sensitive code | peer-review (Security Agent) |
| New AI capability | human-gate |
| Security policy exception | human-gate |
| Architectural decision | human-gate + ADR |
| Phase pull-forward | BLOCKED - requires human approval |

## PV-005 - No Deferred Features as In-Scope
Phase 2+ features must not appear as in-scope tasks. ROADMAP-001 is the gate.

## PV-006 - Correlation ID for Multi-Step Tasks
Multi-agent workflows must include CORRELATION_ID and optionally DEPENDS_ON and HANDOFF_TO.

## PV-007 - No Secrets in Prompts
API keys, database strings, tokens, and passwords must never appear in prompts.

---

# 14. Decision Trees

## Should This Be in the Prompt?

`
Is this information task-specific?
|
+-- NO --> Is it already in a context module?
|          |
|          +-- YES --> DELETE IT
|          +-- NO  --> Create the context module, then reference by ID
|
+-- YES --> Is it a general coding rule?
            |
            +-- YES --> Does CORE-003 or CORE-005 cover it?
            |           |
            |           +-- YES --> DELETE IT
            |           +-- NO  --> Add to CORE-005, then reference by rule ID
            |
            +-- NO --> Is it a task-unique edge case?
                       |
                       +-- YES --> INCLUDE IT
                       +-- NO  --> Include only if it clarifies scope or AC
`

## Which Template?

`
Building something new?
  Full feature (domain + API + UI + tests) => Template 1 (Feature)
  API endpoint only                        => Template 8 (API)
  Frontend component only                  => Template 9 (Frontend)
  Backend domain logic only                => Template 10 (Backend)
  Database migration only                  => Template 7 (Database)
  AI capability                            => Template 14 (AI)
  Automation rule                          => Template 15 (Automation)

Fixing something?       => Template 2 (Bug Fix)
Improving code?         => Template 3 (Refactoring)
Speeding something up?  => Template 6 (Performance)
Writing docs?           => Template 11 (Documentation)
Writing tests?          => Template 5 (Testing)
Reviewing work?         => Template 12 (Review)
Security review?        => Template 13 (Security)
Architectural decision? => Template 4 (ADR)
`

## What Authority Level?

`
Does this change domain invariants, FSMs, or entity definitions?
+-- YES => peer-review (DDD Agent required)

Does this change the database schema?
+-- YES => peer-review (Database Agent required)

Does this implement a new AI capability?
+-- YES => human-gate

Does this introduce a security exception?
+-- YES => human-gate

Does this implement a feature from a future phase?
+-- YES => BLOCKED (requires human approval to pull forward)

None of the above?
+-- solo
`

---

# 15. Quick Reference Tables

## Context vs. Prompts

| Information | In Context Module | In Prompt? |
|---|---|---|
| Tech stack | APPLICATION-007 | Never |
| Architecture principles | CORE-003 | Never |
| Coding standards | CORE-005 | Never |
| Security rules | APPLICATION-006 | Never |
| Glossary definitions | CORE-002 | Never |
| Product principles | CORE-004 | Never |
| Phase boundaries | ROADMAP-001 | Never |
| Domain state machines | DOMAIN-* | Never |
| AI ethical constraints | APPLICATION-001 | Never |
| Feature description | FEATURE-* | Never - reference ID |
| Task objective | n/a | Always |
| Task-specific inputs | n/a | Always |
| Acceptance criteria | n/a | Always |
| Expected artifacts | n/a | Always |
| Authority level | n/a | Always |
| Task-unique edge cases | n/a | When present |
| Scope boundaries | n/a | When ambiguous |

## Prompt Size Guidelines

| Task Complexity | Target | Max |
|---|---|---|
| Simple bug fix | 50-100 tokens | 200 |
| Simple implementation | 100-200 tokens | 300 |
| Multi-component feature | 200-400 tokens | 600 |
| Complex cross-domain | 300-500 tokens | 800 |
| Architecture decision | 200-400 tokens | 600 |

## Context Module Routing by Signal

| Signal in Prompt | Module Auto-Loaded |
|---|---|
| opportunity, capture, inbox | DOMAIN-002 |
| application, submit, interview | DOMAIN-003 + DOMAIN-002 |
| goal, mission, strategy, career capital | DOMAIN-001 |
| reflection, knowledge entry | DOMAIN-004 |
| organization, company | DOMAIN-005 |
| document, upload, CV | DOMAIN-006 |
| auth, session, notification | DOMAIN-007 |
| event, automation, domain event | DOMAIN-008 + APPLICATION-002 |
| AI, extract, RAG, fit score | APPLICATION-001 |
| tRPC, router, procedure, API | APPLICATION-004 |
| schema, Prisma, migration | APPLICATION-005 |

## Authority Reference

| Authority | When | Gate |
|---|---|---|
| solo | No domain/schema/AI/security change | None |
| peer-review | Domain model, schema, security-sensitive | Review Agent |
| human-gate | New AI capability, security exception, architectural decision | Human |

---

# 16. Contributor Workflow

## New Contributor Onboarding

Before writing your first prompt, read in this order:
1. This guide (META-004-FULL)
2. AGENTS.md (.agents/AGENTS.md) - the agent team
3. Context Index (.agents/context/index.ctx.md) - available modules
4. Context Loading Policy (11-ai/context-loading-policy.md) - what loads automatically
5. CORE-001 - project identity
6. CORE-002 - vocabulary
7. ROADMAP-001 - what is in/out of current scope

## Human Contributor Workflow

`
1. IDENTIFY TASK
   Category? => Choose template from Section 8

2. CHECK PHASE
   Is the feature in the current phase?
   => If deferred, discuss with PM Agent first

3. CHECK CONTEXT MODULES
   Does the feature spec exist?
   => If FEATURE spec is empty => write spec first with PM Agent
   => If exists => reference by ID in prompt

4. WRITE PROMPT
   Fill template fields only
   Run Quality Checklist (Section 12)
   Run Validation Rules (Section 13)

5. SUBMIT
   Agent executes under APPLICATION-010 lifecycle

6. AFTER COMPLETION
   Missing context found? => notify Context Manager
   Decision made? => register in DECISION-001
   Architectural? => create ADR with CORE-006 template
`

## AI Agent Workflow

`
1. RECEIVE PROMPT
   Parse: TASK + SCOPE + INPUTS + EDGE_CASES + ACCEPTANCE + ARTIFACTS + AUTHORITY

2. VALIDATE PROMPT COMPLETENESS
   If ACCEPTANCE missing => reject: Missing acceptance criteria. Prompt incomplete.
   If scope unclear => ask one specific clarifying question
   Never begin implementation with incomplete AC

3. LOAD CONTEXT (APPLICATION-009)
   Intent classification => context assembly => co-load validation

4. PHASE CHECK (ROADMAP-001)
   If any requested feature is deferred => return BLOCKED with phase reference

5. EXECUTE
   Follow APPLICATION-010 task lifecycle
   Follow META-002 quality gates
   Apply CORE-005 coding standards to all output

6. SELF-VALIDATE
   Terminology check (CORE-002)
   Architecture boundary check (CORE-003)
   Security check (APPLICATION-006)
   Acceptance criteria check

7. HAND OFF
   Structured handoff per META-002 format
   If domain change => notify Context Manager
`

---

# 17. Repository Improvement Recommendations

## REC-001 - Fill the 14 Empty Feature Specification Files (Critical)

Problem: All 14 files in docs/01-product/features/*.md are empty. Feature prompts bloat because feature context is absent. Every feature prompt requires embedding feature description (AP-007 anti-pattern).

Fix: PM Agent fills FEATURE-001 through FEATURE-014 using the Feature Specification Standard. Start with Phase 1: F-001 Dashboard, F-002 Inbox, F-003 Opportunities, F-004 Applications, F-006 Documents, F-011 Search, F-014 Settings.

Result: Feature prompts reduce by 300-500 tokens each. Agents reason from complete specs.

## REC-002 - Create the Design System Module (UI-002)

Problem: docs/02-design/design-system.md is empty. UI-002 is marked at low confidence. Frontend prompts must embed visual specifications, defeating the context architecture.

Fix: UX Agent writes the design system covering color tokens, typography, spacing scale, component primitives (Button, Card, Input, Modal, Toast), and the CareerOS workspace layout pattern.

Result: Frontend prompts reference component names rather than describing them. Visual consistency is enforced.

## REC-003 - Formalize the ADR Registry

Problem: 6 architectural decisions (AD-001 through AD-006) exist only as narrative in sad.md. Contributors cannot reference them by ID in prompts.

Fix: Architect Agent creates docs/07-product-management/adrs/ADR-001 through ADR-006 using CORE-006 template. Register in DECISION-001.

Result: Prompts reference "Respect ADR-002 (tRPC over REST)" as a 5-token precise reference instead of repeating the rationale.

## REC-004 - Create a Prompt Library

Problem: Contributors without context engineering experience write anti-pattern prompts. Examples help far more than rules.

Fix: Create docs/11-ai/prompt-library.md with 15+ worked prompt examples organized by category. Each example shows: the bad version, the good version, the token comparison, and the rationale.

Result: Onboarding time for new contributors drops significantly. Prompt quality improves immediately.

## REC-005 - Add Task ID System

Problem: Multi-agent workflows have no standard task identification. CORRELATION_ID, DEPENDS_ON, and HANDOFF_TO fields cannot be meaningfully filled.

Fix: Create docs/07-product-management/backlog.md as a live task registry with sequential TASK-NNN IDs.

Result: Prompts include "CORRELATION_ID: TASK-046" enabling full workflow traceability across agents.

## REC-006 - Annotate AGENTS.md with Prompt Routing

Problem: AGENTS.md defines the agent team but does not tell contributors which agent handles which type of task prompt.

Fix: Add a Prompt Routing section to AGENTS.md: a table showing Task Category => Agent Owner => Authority Level => Template Number.

Result: Contributors immediately know which agent their prompt targets and what authority level to set.

## REC-007 - Context Confidence Monitoring

Problem: UI-002 is marked at low confidence. Agents that load low-confidence modules may produce incorrect outputs without knowing the context is weak.

Fix: Add a confidence check to the pre-task workflow. If any required module has confidence under 0.8, agent reports it before proceeding.

Result: Reduces incorrect outputs caused by stale or incomplete context.

---

# 18. Prompt Evolution Policy

## When to Update a Template

| Trigger | Action |
|---|---|
| A field is consistently empty across all prompts | Remove it from the template |
| A field is consistently forgotten | Make it more prominent |
| New context module covers previously in-prompt content | Remove that content from all templates |
| New task type emerges | Create template; add to Section 8 |
| Anti-pattern observed in multiple prompts | Add to Section 10; update Section 12 checklist |

## Version Control

- Templates in this guide are versioned with the guide (current: v1.0)
- AI capability prompts (PROMPT-001 through PROMPT-004) have independent semver
- Breaking template changes require a minor version bump to this guide
- Notify all contributors on template changes

## Feedback Loop

When a prompt produces unexpected output:
1. Identify failure mode: missing context, ambiguous AC, or unclear scope?
2. Root cause:
   - Missing context => create or update the relevant context module
   - Ambiguous AC => update template AC guidance in Section 8
   - New anti-pattern => add to Section 10
3. Fix the system, not just the prompt. A prompt fix that does not update the template or context module will recur.

## Prompt Retirement

A template is retired when the task type no longer exists, a context module fully replaces its content, or it is superseded by a more specific template. Mark as DEPRECATED. Keep for 90 days for reference.

---

# Appendix A - Module ID Quick Reference

| ID | Name | Type |
|---|---|---|
| CORE-001 | Project Identity | Always-load |
| CORE-002 | Glossary | Always-load |
| CORE-003 | Architecture Principles | Eng always-load |
| CORE-004 | Product Principles | Product always-load |
| CORE-005 | Coding Standards | Eng always-load |
| ROADMAP-001 | Phase Registry | Always-load |
| APPLICATION-001 | Intelligence Engine | AI sessions |
| APPLICATION-004 | API Layer | Backend/API tasks |
| APPLICATION-005 | Database Schema | DB tasks |
| APPLICATION-006 | Security | Eng always-load |
| APPLICATION-007 | Tech Stack | Eng always-load |
| DOMAIN-001 | Strategy | Strategy tasks |
| DOMAIN-002 | Opportunity | Opportunity tasks |
| DOMAIN-003 | Application | Application tasks |
| DOMAIN-004 | Knowledge | Knowledge tasks |
| DOMAIN-005 | Organization | Organization tasks |
| DOMAIN-006 | Document | Document tasks |
| DOMAIN-007 | Platform | Auth/notification tasks |
| DOMAIN-008 | Event Catalog | Event/automation tasks |
| FEATURE-001 to 014 | Feature Specs | Per-feature tasks |
| UI-001 | Information Architecture | Frontend tasks |
| PROMPT-001 | System Prompts | AI capability work |
| PROMPT-004 | Output Contracts | AI capability work |
| META-001 | Context Loading Policy | Agent operations |
| META-002 | Agent Operating Manual | Agent operations |
| META-003 | Memory Policy | Agent operations |

---

End of PROMPT_ENGINEERING_GUIDE.md v1.0

This document is the canonical guide for all prompt authoring in CareerOS.
It must be updated whenever the context architecture, templates, or anti-patterns evolve.
Owner: Prompt Engineering Agent / Architect Agent
Next review: After Phase 2 launch
