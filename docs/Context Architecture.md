# CareerOS — Production-Grade Context Engineering Architecture

**Version:** 1.0  
**Status:** Canonical  
**Optimized for:** AI Reasoning, not human reading  
**Covers:** Tasks 1–17 as specified in the prompt

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Context Architecture](#2-context-architecture)
3. [Module Hierarchy & Full Module Catalog](#3-module-hierarchy--full-module-catalog)
4. [Context Dependency Graph](#4-context-dependency-graph)
5. [Multi-Agent Architecture](#5-multi-agent-architecture)
6. [Retrieval Architecture](#6-retrieval-architecture)
7. [Memory Architecture](#7-memory-architecture)
8. [Documentation Architecture](#8-documentation-architecture)
9. [Missing Documents Registry](#9-missing-documents-registry)
10. [Canonical File Structure](#10-canonical-file-structure)
11. [Loading Policies](#11-loading-policies)
12. [Retrieval Policies](#12-retrieval-policies)
13. [Validation Policies](#13-validation-policies)
14. [Evolution Strategy](#14-evolution-strategy)
15. [Implementation Roadmap](#15-implementation-roadmap)
16. [Final Recommendations](#16-final-recommendations)

---

# 1. Executive Summary

## 1.1 Project Identity

| Property | Value |
|---|---|
| Product | CareerOS — Career Operating System |
| Domain | `career-os.mostafayaser.earth` |
| Stack | Next.js 14+ · tRPC · Prisma · PostgreSQL (Neon) · OpenAI · Vercel |
| Architecture | Clean Architecture + DDD Bounded Contexts |
| Phase | Private Alpha (Phase 1 MVP active) |
| Core Loop | Capture → Understand → Decide → Prepare → Execute → Reflect → Learn → Improve |

## 1.2 Architecture Mandate

CareerOS stores highly sensitive personal career data. Its documentation spans 60+ files across 9 directories. The existing docs are high quality in the core areas (domain, engineering, automation) but contain **26 empty placeholder files** representing critical knowledge gaps.

This Context Engineering Architecture solves three problems:

1. **AI agents cannot reason accurately from 137KB of unstructured PRD.** Context must be decomposed into retrievable, scoped modules.
2. **26 empty files create silent knowledge gaps.** Agents must know what is missing, not assume completeness.
3. **No retrieval strategy exists.** Different knowledge types require different retrieval mechanisms.

## 1.3 Core Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Context Level System | 4 levels (L0–L3) | Minimizes token load while preserving full fidelity on demand |
| Module granularity | Bounded Context aligned | Matches architectural boundaries in SAD/entities.md |
| Retrieval primary strategy | Hybrid (semantic + keyword + always-load) | Different knowledge types require different access patterns |
| Agent communication | Structured JSON over shared memory | Deterministic, debuggable, type-safe |
| Memory system | 5 tiers (Permanent → Scratchpad) | Maps to reasoning depth requirements |
| Primary missing gap | 26 empty files + 11 critical engineering docs | Must be created before agent team can operate |

---

# 2. Context Architecture

## 2.1 Reasoning Domain Analysis (Task 1)

The PRD knowledge does NOT divide naturally by chapter. It divides by **reasoning domain** — the cognitive lens an AI agent applies when working on a specific problem.

### Domain Partition Principles

**Keep together:** Knowledge that must be co-present for a single reasoning step.  
**Isolate:** Knowledge that changes at different rates or belongs to different decision-making contexts.

### Reasoning Domain Map

```
REASONING DOMAIN         KNOWLEDGE THAT MUST STAY TOGETHER
────────────────         ─────────────────────────────────
Identity                 Vision · Principles · Glossary · North Star Metric
                         → Agent must never reason without these

Strategy                 Vision → Mission → Goal → Milestone → Career Capital
                         + Goal lifecycle FSM + Strategic alignment scoring
                         → Strategy reasoning chain cannot be split

Opportunity              Opportunity entity + state machine (CAPTURED/EVALUATING/ACTIONED/ARCHIVED)
                         + Opportunity Score dimensions + Quick Capture rules
                         → Opportunity reasoning requires all 4 states simultaneously

Application              Application entity + state machine (8 states) + cross-aggregate rules XAG-001–XAG-005
                         + Reflection trigger rules (APP-004)
                         → Application never makes sense without Opportunity context (parent)

Knowledge                Reflection + KnowledgeEntry + DecisionJournal + Knowledge Compounding
                         + Reflection Synthesis AI feature
                         → Knowledge reasoning requires provenance chain

Organization             Organization entity + relationship cardinalities + contact model
                         → Relatively independent; thin coupling to Opportunity

Document                 Document + DocumentVersion + link tables + file security rules
                         + Document lifecycle + version pinning (ApplicationDocumentLink)
                         → Document reasoning independent of strategy/opportunity execution

Intelligence (AI)        All 5 AI capabilities + RAG design + explainability rules
                         + AI ethical constraints (never hallucinate, always flag generated content)
                         → Must be isolated: AI rules must NEVER contaminate domain rules

Automation               All deterministic automations + temporal rules + idempotency constraints
                         + Circuit breaker rules
                         → Automation reasoning isolated from domain reasoning

Events                   ECS event catalog + correlation ID system + event versioning rules
                         + Career Timeline concept
                         → Events are cross-cutting; must be loadable alongside any domain

Platform                 Auth + session + CORS + rate limits + security headers
                         + Data classification + encryption
                         → Always present in security-sensitive reasoning

API                      tRPC routers + intent-based operations + error codes
                         + Zod validation + API versioning
                         → Required for any implementation task

Database                 Schema + enumerations + indexes + link tables + migration strategy
                         → Never split from domain (database IS the implementation of entities)

Testing                  Empty today — requires full specification
                         → Must be created; currently a critical gap

UI/UX                    IA + navigation + workspace pattern + progressive disclosure
                         + Feature Index (13 capabilities)
                         → Isolated from backend concerns; required by frontend agents only

Analytics                Analytics levels (Operational/Performance/Strategic) + metrics + anti-metrics
                         → Isolated from execution; required by analytics agent only
```

### Critical Isolation Rules

```
MUST BE SEPARATE           REASON
─────────────────          ──────
Domain rules               from Infrastructure details
State machine definitions  from UI behavior
AI ethical constraints     from general coding standards
Security rules             from business rules
Event catalog              from event implementation
Feature contracts          from feature specifications
Automation rules           from AI behavior (deterministic ≠ probabilistic)
```

## 2.2 Hierarchy Design (Task 2)

```
LEVEL     LAYER              MODULES
─────     ─────              ───────
L0        Core               Identity · Glossary · Architecture · Domain Language
                             Coding Standards · Engineering Principles

L1        Domain             Strategy · Opportunity · Application · Knowledge
                             Organization · Document · Platform · Events

L2        Application        Intelligence (AI) · Automation · Analytics · API
                             Database · Security · Testing · Deployment

L3        Feature            Feature Specifications (per capability) · UX/IA
                             Sprint Context · ADRs · Historical Decisions
```

---

# 3. Module Hierarchy & Full Module Catalog

## 3.1 Module Naming Convention

```
{layer}/{domain}/{scope}.ctx.md
```

Examples:
- `core/identity/project.ctx.md`
- `domain/opportunity/lifecycle.ctx.md`
- `application/ai/intelligence.ctx.md`
- `feature/opportunity/workspace.ctx.md`

## 3.2 Complete Module Catalog (Task 3 & Task 4)

---

### MODULE: CORE-001 — Project Identity

| Property | Value |
|---|---|
| **Module Name** | Project Identity |
| **Purpose** | Establish absolute project context for any reasoning session |
| **Primary Responsibility** | Provide invariant facts: product name, domain, mission, north star, phase |
| **Dependencies** | None — this is the root |
| **Consumers** | All agents, all sessions |
| **Stability** | Very High (changes < once/year) |
| **Change Frequency** | Extremely Low |
| **Recommended File** | `core/identity/project.ctx.md` |
| **Recommended Folder** | `.agents/context/core/identity/` |
| **Recommended Token Size** | 400–600 tokens |
| **Max Token Size** | 800 tokens |
| **Granularity** | Single tight document |
| **Always Loaded?** | ✅ YES |
| **Dynamically Loaded?** | No |
| **Semantic Retrieval?** | No |
| **Hierarchical Retrieval?** | No |
| **Graph Retrieval?** | No |
| **Vector Retrieval?** | No |
| **Cached?** | YES — permanent |
| **Why?** | Every agent reasoning step requires project identity grounding. Without it, agents hallucinate scope. |

**What absolutely belongs here:**
- Product name, vision statement, core loop
- Domain URL, current phase (Phase 1 MVP)
- North Star Metric (Career Capital Growth)
- The 3 product anti-patterns (not a task manager, not a CRM, not a social network)
- What CareerOS is / what CareerOS is NOT

**What absolutely does NOT belong here:**
- Feature descriptions, technical implementation, glossary definitions, coding standards

**Common mistakes:**
- Bloating with feature lists (belongs in Feature Index)
- Including tech stack (belongs in Tech Stack module)
- Including user personas (belongs in Personas module)

**Duplication risks:** Vision statement may drift from `vision.md` — must be auto-synced  
**Maintenance risks:** Phase number must be updated when product evolves

---

### MODULE: CORE-002 — Ubiquitous Language (Glossary)

| Property | Value |
|---|---|
| **Module Name** | Ubiquitous Language |
| **Purpose** | Define every canonical term used across the platform |
| **Primary Responsibility** | Prevent terminology drift; ensure all agents use identical concepts |
| **Dependencies** | CORE-001 |
| **Consumers** | All agents |
| **Stability** | High (terms occasionally added, rarely changed) |
| **Change Frequency** | Low (new terms added per phase) |
| **Recommended File** | `core/language/glossary.ctx.md` |
| **Recommended Folder** | `.agents/context/core/language/` |
| **Recommended Token Size** | 1,200–1,800 tokens |
| **Max Token Size** | 2,500 tokens |
| **Granularity** | Alphabetically organized, brief definitions |
| **Always Loaded?** | ✅ YES |
| **Dynamically Loaded?** | No |
| **Semantic Retrieval?** | YES — term lookup |
| **Hierarchical Retrieval?** | No |
| **Graph Retrieval?** | YES — canonical relationship graph |
| **Vector Retrieval?** | No |
| **Cached?** | YES — permanent |
| **Why?** | Terminology is the foundation of all reasoning. Wrong terms = wrong reasoning. |

**What absolutely belongs here:**
- All terms from `glossary.md`: Opportunity, Application, Reflection, Knowledge Entry, Career Capital, Activity, Command, Query, Engine, Entity, Workspace, etc.
- Canonical relationship map (Vision → Mission → Goal → Milestone → Opportunity → Application → Reflection → Knowledge)
- Naming conventions (never "Job Post", always "Opportunity")

**What absolutely does NOT belong here:**
- Entity attributes, state definitions, API schemas, implementation details

**Common mistakes:**
- Mixing business definitions with technical definitions
- Including synonyms without canonical preference

**Information leakage risks:** Business terms bleeding into technical documentation  
**Duplication risks:** Same term defined in entities.md AND glossary — entities.md is implementation, glossary is business language

---

### MODULE: CORE-003 — Architecture Principles

| Property | Value |
|---|---|
| **Module Name** | Architecture Principles |
| **Purpose** | Encode immutable architectural decisions for all engineering agents |
| **Primary Responsibility** | Enforce ARCH-001 through ARCH-008, SOLID, DDD, Clean Architecture |
| **Dependencies** | CORE-001, CORE-002 |
| **Consumers** | Architect Agent, Backend Agent, Database Agent, Review Agent, DDD Agent |
| **Stability** | Very High |
| **Change Frequency** | Extremely Low |
| **Recommended File** | `core/architecture/principles.ctx.md` |
| **Recommended Folder** | `.agents/context/core/architecture/` |
| **Recommended Token Size** | 800–1,200 tokens |
| **Max Token Size** | 1,800 tokens |
| **Granularity** | One principle per block, ID + rationale |
| **Always Loaded?** | ✅ YES for engineering agents |
| **Dynamically Loaded?** | No |
| **Semantic Retrieval?** | No |
| **Hierarchical Retrieval?** | No |
| **Graph Retrieval?** | No |
| **Vector Retrieval?** | No |
| **Cached?** | YES — permanent |
| **Why?** | Architectural principles must never be overridden or forgotten during any engineering session. |

**What absolutely belongs here:**
- ARCH-001–ARCH-008 (Domain Independence through Simplicity Over Cleverness)
- Clean Architecture layer order and dependency direction
- Bounded Context isolation rules
- CQRS separation policy
- Event-Driven communication policy

**What absolutely does NOT belong here:**
- Technology choices (belongs in Tech Stack), specific implementations, feature logic

**Common mistakes:**
- Confusing principle with implementation detail
- Mixing product principles with engineering principles

---

### MODULE: CORE-004 — Product Principles

| Property | Value |
|---|---|
| **Module Name** | Product Principles |
| **Purpose** | Ground all product decisions in the 18 canonical product principles |
| **Primary Responsibility** | Provide decision framework for product reasoning |
| **Dependencies** | CORE-001 |
| **Consumers** | PM Agent, Review Agent, Feature Agent, UX Agent |
| **Stability** | Very High |
| **Change Frequency** | Extremely Low |
| **Recommended File** | `core/product/principles.ctx.md` |
| **Recommended Folder** | `.agents/context/core/product/` |
| **Recommended Token Size** | 800–1,200 tokens |
| **Max Token Size** | 1,500 tokens |
| **Granularity** | P-001 through P-018, each with ID + one-liner + constraint |
| **Always Loaded?** | ✅ YES for product agents |
| **Dynamically Loaded?** | No |
| **Semantic Retrieval?** | No |
| **Hierarchical Retrieval?** | No |
| **Graph Retrieval?** | No |
| **Vector Retrieval?** | No |
| **Cached?** | YES — permanent |
| **Why?** | Product decisions made without principles risk feature creep, misalignment, or anti-patterns. |

**What absolutely belongs here:**
- All 18 principles with their ID codes
- Product anti-principles (what CareerOS must never become)
- Decision framework (7 questions before introducing any feature)

**What absolutely does NOT belong here:**
- Specific feature behavior, technical rules, UX patterns

---

### MODULE: CORE-005 — Coding Standards

| Property | Value |
|---|---|
| **Module Name** | Coding Standards |
| **Purpose** | Establish invariant code conventions for all engineering agents |
| **Primary Responsibility** | Ensure consistency across all generated/reviewed code |
| **Dependencies** | CORE-003 |
| **Consumers** | Backend Agent, Frontend Agent, Database Agent, Testing Agent, Review Agent |
| **Stability** | High |
| **Change Frequency** | Low (updated when new tools/patterns are adopted) |
| **Recommended File** | `core/standards/coding-standards.ctx.md` |
| **Recommended Folder** | `.agents/context/core/standards/` |
| **Recommended Token Size** | 1,000–1,500 tokens |
| **Max Token Size** | 2,000 tokens |
| **Granularity** | Organized by layer: Domain / Application / Infrastructure / Presentation |
| **Always Loaded?** | ✅ YES for all engineering agents |
| **Dynamically Loaded?** | No |
| **Semantic Retrieval?** | No |
| **Hierarchical Retrieval?** | No |
| **Graph Retrieval?** | No |
| **Vector Retrieval?** | No |
| **Cached?** | YES — permanent |
| **Why?** | Agents without coding standards produce inconsistent, unmaintainable code across sessions. |

**What absolutely belongs here:**
- TypeScript strict mode rules
- File naming conventions (`.entity.ts`, `.command.ts`, `.query.ts`)
- Import order rules (domain imports nothing from infrastructure)
- tRPC router naming conventions (intent-based, not CRUD)
- Prisma schema conventions (cuid IDs, soft delete via `deleted_at`)
- Error handling patterns per layer
- Test naming conventions

**What absolutely does NOT belong here:**
- Business logic, domain rules, feature specifications

---

### MODULE: DOMAIN-001 — Strategy Domain

| Property | Value |
|---|---|
| **Module Name** | Strategy Domain |
| **Purpose** | Complete context for reasoning about Vision, Mission, Goal, Milestone, Career Capital |
| **Primary Responsibility** | Define the strategic planning hierarchy and its rules |
| **Dependencies** | CORE-001, CORE-002, CORE-003 |
| **Consumers** | DDD Agent, Backend Agent, Architect Agent, Analytics Agent, AI Agent |
| **Stability** | High |
| **Change Frequency** | Low |
| **Recommended File** | `domain/strategy/strategy.ctx.md` |
| **Recommended Folder** | `.agents/context/domain/strategy/` |
| **Recommended Token Size** | 1,500–2,000 tokens |
| **Max Token Size** | 3,000 tokens |
| **Granularity** | Per-entity: Purpose + Relationships + Business Rules + Domain Events |
| **Always Loaded?** | No |
| **Dynamically Loaded?** | YES — when working on strategy features |
| **Semantic Retrieval?** | YES |
| **Hierarchical Retrieval?** | YES — the hierarchy IS the domain |
| **Graph Retrieval?** | YES |
| **Vector Retrieval?** | No |
| **Cached?** | YES — session-level |
| **Why?** | Strategy is a coherent hierarchy; splitting it across modules would require re-assembly for every reasoning step. |

**What absolutely belongs here:**
- Vision → Mission → Goal → Milestone hierarchy with cardinalities
- Goal lifecycle FSM (DRAFT → ACTIVE → COMPLETED / ABANDONED)
- Goal business rules (GOAL-001 through GOAL-004)
- Career Capital model (7 forms: Knowledge, Credential, Portfolio, Network, Financial, Reputation, Geographic)
- Cross-aggregate rule XAG-004 (Goal scoring is read-only during Opportunity EVALUATING)
- Strategic Alignment Score concept

**What absolutely does NOT belong here:**
- Opportunity scoring mechanics (belongs in Opportunity Domain)
- Career Capital analytics (belongs in Analytics module)
- AI recommendation logic (belongs in Intelligence module)

**Duplication risks:** Career Capital appears in both Strategy and Analytics — strategy module owns the DEFINITION, analytics module owns the METRICS  
**Future risks:** Career Capital Scoring algorithm (Phase 2 deferral) will require this module expansion

---

### MODULE: DOMAIN-002 — Opportunity Domain

| Property | Value |
|---|---|
| **Module Name** | Opportunity Domain |
| **Purpose** | Complete context for reasoning about Opportunity capture, evaluation, and actioning |
| **Primary Responsibility** | Define Opportunity aggregate, lifecycle, scoring, and capture rules |
| **Dependencies** | CORE-002, CORE-003, DOMAIN-001 (for strategic alignment) |
| **Consumers** | DDD Agent, Backend Agent, Architect Agent, Frontend Agent, AI Agent, Automation Agent |
| **Stability** | High |
| **Change Frequency** | Medium (new opportunity types, scoring dimensions) |
| **Recommended File** | `domain/opportunity/opportunity.ctx.md` |
| **Recommended Folder** | `.agents/context/domain/opportunity/` |
| **Recommended Token Size** | 2,000–2,800 tokens |
| **Max Token Size** | 4,000 tokens |
| **Granularity** | Full: entity + lifecycle + scoring + capture + business rules |
| **Always Loaded?** | No |
| **Dynamically Loaded?** | YES — highest-frequency domain |
| **Semantic Retrieval?** | YES |
| **Hierarchical Retrieval?** | YES |
| **Graph Retrieval?** | YES |
| **Vector Retrieval?** | No |
| **Cached?** | YES — session-level |
| **Why?** | Opportunity is the heart of CareerOS. More code touches this domain than any other. |

**What absolutely belongs here:**
- Opportunity entity: all attributes, computed properties (Score, Days Remaining, Preparation Progress, Application Count, Risk Level, Strategic Alignment)
- Lifecycle FSM: CAPTURED → EVALUATING → ACTIONED → (terminal) / ARCHIVED with all transition rules
- Business rules OP-001 through OP-005
- Opportunity Score: 10 evaluation dimensions (Strategic Alignment, Expected Value, Probability of Success, Required Effort, Deadline Urgency, Financial Cost, Learning Value, Networking Potential, Prestige, Personal Interest)
- Priority levels: Critical, High, Medium, Low, Someday
- Quick Capture rules (<30 seconds, requires only Title + optional URL)
- Domain invariants INV-001 related to Opportunity
- Domain events: OpportunityCaptured through OpportunityActioned

**What absolutely does NOT belong here:**
- Application lifecycle (DOMAIN-003)
- Document storage rules (DOMAIN-006)
- AI extraction implementation (APPLICATION-001)
- Automation trigger implementation (APPLICATION-002)

**Common mistakes:**
- Conflating Opportunity state with Application state (they are SEPARATE aggregates)
- Including capture flow implementation (belongs in Automation module)
- Including scoring UI (belongs in Feature/UI modules)

---

### MODULE: DOMAIN-003 — Application Domain

| Property | Value |
|---|---|
| **Module Name** | Application Domain |
| **Purpose** | Complete context for reasoning about the Application lifecycle |
| **Primary Responsibility** | Define Application aggregate, 8-state lifecycle, cross-aggregate rules |
| **Dependencies** | CORE-002, CORE-003, DOMAIN-002 (parent is Opportunity) |
| **Consumers** | DDD Agent, Backend Agent, Architect Agent, AI Agent, Automation Agent |
| **Stability** | High |
| **Change Frequency** | Medium |
| **Recommended File** | `domain/application/application.ctx.md` |
| **Recommended Folder** | `.agents/context/domain/application/` |
| **Recommended Token Size** | 2,000–2,500 tokens |
| **Max Token Size** | 3,500 tokens |
| **Granularity** | Full: entity + 8-state FSM + cross-aggregate rules + reflection trigger |
| **Always Loaded?** | No |
| **Dynamically Loaded?** | YES — when working on application features |
| **Semantic Retrieval?** | YES |
| **Hierarchical Retrieval?** | YES |
| **Graph Retrieval?** | YES |
| **Vector Retrieval?** | No |
| **Cached?** | YES — session-level |
| **Why?** | Application is always reasoned about in relation to its parent Opportunity and its child Reflection. The 8-state FSM requires full simultaneous view. |

**What absolutely belongs here:**
- Application entity: all attributes + computed properties (Readiness Score, Submission Duration, Waiting Time, Interview Count, Success Probability)
- 8-state lifecycle FSM: DRAFTING → SUBMITTED → INTERVIEWING → OFFER_RECEIVED → ACCEPTED/REJECTED/DECLINED/WITHDRAWN
- All transition rules with side effects
- Business rules APP-001 through APP-006
- Cross-aggregate rules XAG-001 through XAG-005
- Domain invariant INV-001 (every Application belongs to exactly one Opportunity)
- Domain events: ApplicationCreated through ApplicationArchived
- Reflection trigger logic (APP-004: terminal states MUST trigger Reflection)

**What absolutely does NOT belong here:**
- Interview scheduling UI (belongs in Calendar Feature)
- Document version pinning implementation (belongs in Document Domain)
- Career Capital update logic (belongs in Strategy Domain)

**Critical isolation:**  
Application reasoning must ALWAYS co-load DOMAIN-002 (Opportunity) because:
- XAG-001: ACTIONED Opportunity atomically creates Application in DRAFTING
- XAG-002: Application parent Opportunity must be in ACTIONED state
These cross-aggregate rules cannot be reasoned about in isolation.

---

### MODULE: DOMAIN-004 — Knowledge Domain

| Property | Value |
|---|---|
| **Module Name** | Knowledge Domain |
| **Purpose** | Complete context for reasoning about the Knowledge compounding system |
| **Primary Responsibility** | Define Reflection, KnowledgeEntry, DecisionJournal entities and Knowledge compounding lifecycle |
| **Dependencies** | CORE-002, CORE-003, DOMAIN-003 (Reflection triggered by Application terminal states) |
| **Consumers** | DDD Agent, Backend Agent, AI Agent, Knowledge Graph Agent |
| **Stability** | Medium-High |
| **Change Frequency** | Medium |
| **Recommended File** | `domain/knowledge/knowledge.ctx.md` |
| **Recommended Folder** | `.agents/context/domain/knowledge/` |
| **Recommended Token Size** | 1,500–2,000 tokens |
| **Max Token Size** | 2,800 tokens |
| **Granularity** | Per entity: Reflection + KnowledgeEntry + DecisionJournal + knowledge graph concept |
| **Always Loaded?** | No |
| **Dynamically Loaded?** | YES — when working on knowledge features |
| **Semantic Retrieval?** | YES |
| **Hierarchical Retrieval?** | YES |
| **Graph Retrieval?** | YES — knowledge IS a graph |
| **Vector Retrieval?** | YES — RAG over knowledge entries (Phase 2+) |
| **Cached?** | YES — session-level |
| **Why?** | Knowledge compounding is the long-term value proposition. All 3 entities are semantically coupled and must be co-present for any reasoning about the knowledge system. |

**What absolutely belongs here:**
- Reflection entity: types (INTERVIEW, APPLICATION_OUTCOME, GOAL_COMPLETE, GOAL_ABANDONED, GENERAL), provenance chain, computed properties (Insight Count, Learning Score)
- KnowledgeEntry entity: category, insight, source, tags, provenance
- Decision Journal concept
- Domain invariants INV-005 (Knowledge Entries never lose provenance), INV-007 (Reflection always references a completed event)
- Knowledge Compounding concept: experience → reflection → structured knowledge → reusable asset
- KnowledgeGoalLink table (many-to-many with provenance_note)
- Domain events: ReflectionStarted through InsightGenerated

**What absolutely does NOT belong here:**
- AI extraction implementation (belongs in Intelligence module)
- RAG retrieval implementation (belongs in AI/Infrastructure modules)
- Career Capital scoring (belongs in Strategy Domain)

---

### MODULE: DOMAIN-005 — Organization Domain

| Property | Value |
|---|---|
| **Module Name** | Organization Domain |
| **Purpose** | Define the Organization aggregate and its relationships |
| **Primary Responsibility** | Model external institutions and their relationship to Opportunities/Applications |
| **Dependencies** | CORE-002, CORE-003 |
| **Consumers** | DDD Agent, Backend Agent |
| **Stability** | High |
| **Change Frequency** | Low |
| **Recommended File** | `domain/organization/organization.ctx.md` |
| **Recommended Folder** | `.agents/context/domain/organization/` |
| **Recommended Token Size** | 800–1,200 tokens |
| **Max Token Size** | 1,500 tokens |
| **Granularity** | Entity + relationships + computed properties |
| **Always Loaded?** | No |
| **Dynamically Loaded?** | YES — when working on organization features |
| **Semantic Retrieval?** | YES |
| **Hierarchical Retrieval?** | No |
| **Graph Retrieval?** | YES |
| **Vector Retrieval?** | No |
| **Cached?** | YES — session-level |
| **Why?** | Organization is a supporting aggregate. Thin module sufficient. |

**What absolutely belongs here:**
- Organization entity: name, industry, website, notes
- Computed properties: Historical Success Rate, Relationship Strength, Average Response Time, Career Capital Contribution
- Cardinality: Organization `publishes` Opportunity (1:N), Organization owns Applications, Contacts, Knowledge, Analytics
- Organization auto-linking rule (Automation: match by domain)
- Contact entity concept (deferred to Phase 2)

**What absolutely does NOT belong here:**
- Opportunity details (belongs in Opportunity Domain)
- CRM features (explicitly out of scope per product anti-principles)

---

### MODULE: DOMAIN-006 — Document Domain

| Property | Value |
|---|---|
| **Module Name** | Document Domain |
| **Purpose** | Define the Document aggregate including versioning and link tables |
| **Primary Responsibility** | Model reusable career assets with version history and link semantics |
| **Dependencies** | CORE-002, CORE-003 |
| **Consumers** | DDD Agent, Backend Agent, Frontend Agent |
| **Stability** | Medium-High |
| **Change Frequency** | Low-Medium |
| **Recommended File** | `domain/document/document.ctx.md` |
| **Recommended Folder** | `.agents/context/domain/document/` |
| **Recommended Token Size** | 1,000–1,500 tokens |
| **Max Token Size** | 2,000 tokens |
| **Granularity** | Entity + versioning model + 3 link table semantics |
| **Always Loaded?** | No |
| **Dynamically Loaded?** | YES — when working on document features |
| **Semantic Retrieval?** | YES |
| **Hierarchical Retrieval?** | No |
| **Graph Retrieval?** | YES |
| **Vector Retrieval?** | No |
| **Cached?** | YES — session-level |
| **Why?** | Document versioning and link semantics require simultaneous view of all 3 link tables (OpportunityDocumentLink, ApplicationDocumentLink, KnowledgeGoalLink). |

**What absolutely belongs here:**
- Document entity: types (CV, Passport, Essay, Portfolio, Transcript, Certificate, Recommendation Letter), statuses (ACTIVE, EXPIRED, ARCHIVED)
- Version model: version counter, document_version_id, version pinning (ApplicationDocumentLink pins `document_version_id`)
- Link table semantics: OpportunityDocumentLink (with `requirement_type`), ApplicationDocumentLink (pins version), KnowledgeGoalLink
- Business rule INV-008: Documents remain versioned
- Deletion rule: "Prevent if still referenced"
- Storage path convention: `documents/{user_id}/{doc_id}/v{version}/{server_generated_name}`
- MIME type whitelist: PDF/DOCX/DOC/TXT/PNG/JPG/JPEG, 10MB max
- Pre-signed URL expiry: 1 hour
- Computed properties: Version Count, Reuse Count, Expiration Status

**What absolutely does NOT belong here:**
- File upload implementation (Infrastructure concern)
- Document generation by AI (belongs in Intelligence module)
- Storage provider details (belongs in Tech Stack module)

---

### MODULE: DOMAIN-007 — Platform Domain

| Property | Value |
|---|---|
| **Module Name** | Platform Domain |
| **Purpose** | Define cross-cutting platform services: User, Activity, Notification, Settings |
| **Primary Responsibility** | Model the Platform Context entities and cross-cutting concerns |
| **Dependencies** | CORE-002, CORE-003 |
| **Consumers** | All engineering agents |
| **Stability** | High |
| **Change Frequency** | Low |
| **Recommended File** | `domain/platform/platform.ctx.md` |
| **Recommended Folder** | `.agents/context/domain/platform/` |
| **Recommended Token Size** | 1,000–1,500 tokens |
| **Max Token Size** | 2,000 tokens |
| **Granularity** | Per entity: User + Activity + Notification + Reminder + CalendarEvent |
| **Always Loaded?** | No |
| **Dynamically Loaded?** | YES — when working on platform/auth/notifications |
| **Semantic Retrieval?** | YES |
| **Hierarchical Retrieval?** | No |
| **Graph Retrieval?** | No |
| **Vector Retrieval?** | No |
| **Cached?** | YES — session-level |
| **Why?** | Platform entities are thin but cross-cutting. Activity (audit trail) is referenced by all domains. |

**What absolutely belongs here:**
- Activity entity: immutability rules INV-004, INV-010, append-only audit trail
- User entity + ownership model (all queries `WHERE user_id = ?`)
- Notification entity: channels (in-app, email digest, push), anti-spam rules (Weekend Rule, Batching, Auto-Squelch)
- Reminder entity + temporal rules
- CalendarEvent entity + external_id for sync

**What absolutely does NOT belong here:**
- Authentication implementation (belongs in Security module)
- Calendar integration (belongs in Integration module)

---

### MODULE: DOMAIN-008 — Event Catalog

| Property | Value |
|---|---|
| **Module Name** | Event Catalog |
| **Purpose** | Authoritative catalog of all domain events |
| **Primary Responsibility** | Define event taxonomy, naming conventions, envelope, and versioning rules |
| **Dependencies** | CORE-002, all DOMAIN-* modules |
| **Consumers** | All engineering agents, Automation Agent, AI Agent |
| **Stability** | Medium (new events added per phase) |
| **Change Frequency** | Medium |
| **Recommended File** | `domain/events/event-catalog.ctx.md` |
| **Recommended Folder** | `.agents/context/domain/events/` |
| **Recommended Token Size** | 1,500–2,000 tokens |
| **Max Token Size** | 3,000 tokens |
| **Granularity** | Per category: event names + envelope schema + versioning rules |
| **Always Loaded?** | No |
| **Dynamically Loaded?** | YES — when reasoning about event-driven behavior |
| **Semantic Retrieval?** | YES |
| **Hierarchical Retrieval?** | No |
| **Graph Retrieval?** | YES |
| **Vector Retrieval?** | No |
| **Cached?** | YES — session-level |
| **Why?** | Events are the backbone of automation. Any automation reasoning requires this module. |

**What absolutely belongs here:**
- 9 event categories and their events (all ~50 events from ECS)
- Event envelope: Event ID, Name, Aggregate ID/Type, Occurred At, Actor, Correlation ID, Causation ID, Version, Payload
- Immutability rules: facts not intentions, past tense, no "Opportunity Updated"
- Versioning rules: never change meaning, add fields not remove
- Correlation ID pattern for end-to-end journey tracing
- Career Timeline concept (unified chronological projection)
- Event consumer map (which engines subscribe to which events)

**What absolutely does NOT belong here:**
- Event bus implementation (belongs in Infrastructure/Deployment)
- Specific event handler code (belongs in Application Layer)

---

### MODULE: APPLICATION-001 — Intelligence Engine

| Property | Value |
|---|---|
| **Module Name** | Intelligence Engine |
| **Purpose** | Define all AI capabilities, constraints, and ethical rules |
| **Primary Responsibility** | Specify what AI does, how it works, and what it must never do |
| **Dependencies** | CORE-002, CORE-003, DOMAIN-002, DOMAIN-003, DOMAIN-004 |
| **Consumers** | AI Agent, Backend Agent, Review Agent, Prompt Engineering Agent |
| **Stability** | Medium |
| **Change Frequency** | Medium (new capabilities per phase) |
| **Recommended File** | `application/intelligence/intelligence.ctx.md` |
| **Recommended Folder** | `.agents/context/application/intelligence/` |
| **Recommended Token Size** | 1,800–2,500 tokens |
| **Max Token Size** | 3,500 tokens |
| **Granularity** | Per capability: trigger + behavior + explainability + constraints |
| **Always Loaded?** | No |
| **Dynamically Loaded?** | YES — for any AI feature work |
| **Semantic Retrieval?** | YES |
| **Hierarchical Retrieval?** | No |
| **Graph Retrieval?** | No |
| **Vector Retrieval?** | No |
| **Cached?** | YES — session-level |
| **Why?** | AI ethical constraints MUST be present whenever any AI-related code is written or reviewed. Missing them leads to hallucination of skills/experiences violating product principle P-004. |

**What absolutely belongs here:**
- AI Philosophy: augment not replace (P-004), explain before automate (P-016)
- 5 AI capabilities (Intelligent Capture, Strategic Fit Scoring, Asset Suggestion Engine, Document Generation, Reflection Synthesis) with trigger, behavior, and explainability rules
- Ethical constraints: NEVER fabricate skills/experiences, ALWAYS flag AI-generated content, NEVER hide uncertainty, ALWAYS require user approval for knowledge commits
- RAG design: user's own KnowledgeEntries + Documents (not external data)
- Confidence model: how CareerOS represents AI uncertainty
- Capability Layer: AI Capability abstraction (provider-agnostic interface)
- OpenAI API: GPT-4o for reasoning, text-embedding-3-small for vectors
- Explainability requirements per capability

**What absolutely does NOT belong here:**
- OpenAI API credentials (environment variables)
- Prompt templates (belongs in Prompt Engineering module)
- Automation rules (belongs in Automation module — deterministic ≠ probabilistic)

**Critical isolation:** AI capabilities must NEVER be confused with deterministic automations. One is probabilistic + user-approved; the other is deterministic + logged.

---

### MODULE: APPLICATION-002 — Automation Engine

| Property | Value |
|---|---|
| **Module Name** | Automation Engine |
| **Purpose** | Define all deterministic rule-based automations |
| **Primary Responsibility** | Specify triggers, conditions, automated actions, and technical constraints |
| **Dependencies** | CORE-002, CORE-003, DOMAIN-002, DOMAIN-003, DOMAIN-007, DOMAIN-008 |
| **Consumers** | Backend Agent, Automation Agent, DDD Agent |
| **Stability** | Medium |
| **Change Frequency** | Medium |
| **Recommended File** | `application/automation/automation.ctx.md` |
| **Recommended Folder** | `.agents/context/application/automation/` |
| **Recommended Token Size** | 1,200–1,800 tokens |
| **Max Token Size** | 2,500 tokens |
| **Granularity** | Per category: Lifecycle/State + Temporal + Organizational automations |
| **Always Loaded?** | No |
| **Dynamically Loaded?** | YES — when implementing automation features |
| **Semantic Retrieval?** | YES |
| **Hierarchical Retrieval?** | No |
| **Graph Retrieval?** | No |
| **Vector Retrieval?** | No |
| **Cached?** | YES — session-level |
| **Why?** | Idempotency, auditability, and circuit breaker rules must ALL be present when implementing any automation. Missing one leads to data integrity issues. |

**What absolutely belongs here:**
- 4 lifecycle/state automations (OA-001 through AA-004)
- 4 temporal automations (deadline approach, follow-up 14 days, interview follow-up 24h, stale opportunity 30 days)
- 3 organizational automations (org auto-link, contact auto-link, document auto-tag)
- Technical constraints: Idempotency requirement, `updated_by: "system:automation"` + `automation_reason`, Circuit Breakers, Principle P-016 compliance
- Transparency requirement: every automated action visible in audit log

**What absolutely does NOT belong here:**
- AI features (probabilistic, not deterministic)
- Event bus implementation
- User-facing notification content

---

### MODULE: APPLICATION-003 — Analytics Engine

| Property | Value |
|---|---|
| **Module Name** | Analytics Engine |
| **Purpose** | Define the 3-level analytics framework and key metrics |
| **Primary Responsibility** | Specify what is measured, how, and what anti-metrics to avoid |
| **Dependencies** | CORE-002, DOMAIN-001, DOMAIN-002, DOMAIN-003, DOMAIN-004 |
| **Consumers** | Analytics Agent, PM Agent, Backend Agent |
| **Stability** | Medium |
| **Change Frequency** | Medium |
| **Recommended File** | `application/analytics/analytics.ctx.md` |
| **Recommended Folder** | `.agents/context/application/analytics/` |
| **Recommended Token Size** | 1,000–1,500 tokens |
| **Max Token Size** | 2,000 tokens |
| **Granularity** | Per level: metrics definition + measurement method + anti-metrics |
| **Always Loaded?** | No |
| **Dynamically Loaded?** | YES — for analytics feature work |
| **Semantic Retrieval?** | YES |
| **Hierarchical Retrieval?** | No |
| **Graph Retrieval?** | No |
| **Vector Retrieval?** | No |
| **Cached?** | YES — session-level |
| **Why?** | Analytics reasoning requires all 3 levels simultaneously to avoid implementing vanity metrics. |

**What absolutely belongs here:**
- 3 analytics levels: Operational (pipeline view), Performance (funnel, conversion), Strategic (career capital growth, decision quality)
- North Star: Career Capital Growth
- Core metrics: Deadline Adherence Rate, Opportunity Conversion Rate, Time-to-Capture, Asset Reuse Rate, Reflection Completion Rate, Decision Journal Utilization
- Anti-metrics: reject time-in-app, clicks per session, DAU without context
- Decision Quality Score (DQS) concept
- Analytics level availability per phase (Phase 1: Operational only, Phase 2: Performance, Phase 3: Strategic)
- Trend analysis + forecasting (Phase 3)

**What absolutely does NOT belong here:**
- Specific query implementations (belongs in Database module)
- Dashboard layout (belongs in UI/Feature module)

---

### MODULE: APPLICATION-004 — API Layer

| Property | Value |
|---|---|
| **Module Name** | API Layer |
| **Purpose** | Define the tRPC router structure and all procedure signatures |
| **Primary Responsibility** | Specify intent-based API operations for all aggregates |
| **Dependencies** | CORE-002, CORE-003, CORE-005, DOMAIN-002 through DOMAIN-007 |
| **Consumers** | Backend Agent, Frontend Agent, Testing Agent, Review Agent |
| **Stability** | Medium |
| **Change Frequency** | Medium (new procedures per feature) |
| **Recommended File** | `application/api/api-layer.ctx.md` |
| **Recommended Folder** | `.agents/context/application/api/` |
| **Recommended Token Size** | 1,500–2,000 tokens |
| **Max Token Size** | 2,500 tokens |
| **Granularity** | Per router: procedure names + input/output types + error codes |
| **Always Loaded?** | No |
| **Dynamically Loaded?** | YES — for any backend implementation task |
| **Semantic Retrieval?** | YES |
| **Hierarchical Retrieval?** | No |
| **Graph Retrieval?** | No |
| **Vector Retrieval?** | No |
| **Cached?** | YES — session-level |
| **Why?** | API layer is the contract between presentation and application layers. Full fidelity required for consistent implementation. |

**What absolutely belongs here:**
- All 9 tRPC routers with procedure signatures: opportunityRouter, applicationRouter, goalRouter, documentRouter, organizationRouter, reflectionRouter, dashboardRouter, calendarRouter, searchRouter
- Intent-based naming principle (captureOpportunity not PATCH /opportunities/:id)
- Error codes and their semantics: NOT_FOUND, FORBIDDEN, BAD_REQUEST, CONFLICT, INTERNAL_SERVER_ERROR
- Zod validation requirement for all inputs
- API versioning approach (additive changes, deprecation periods)
- Idempotency-Key header support

**What absolutely does NOT belong here:**
- Database implementation, UI components, business rule logic

---

### MODULE: APPLICATION-005 — Database Schema

| Property | Value |
|---|---|
| **Module Name** | Database Schema |
| **Purpose** | Physical database schema implementing the domain model |
| **Primary Responsibility** | Provide complete table definitions, enumerations, indexes, and link tables |
| **Dependencies** | CORE-003, CORE-005, DOMAIN-001 through DOMAIN-007 |
| **Consumers** | Database Agent, Backend Agent, DDD Agent, Testing Agent |
| **Stability** | Medium (schema evolves with features) |
| **Change Frequency** | Medium |
| **Recommended File** | `application/database/schema.ctx.md` |
| **Recommended Folder** | `.agents/context/application/database/` |
| **Recommended Token Size** | 2,000–3,000 tokens |
| **Max Token Size** | 4,000 tokens |
| **Granularity** | Per bounded context: tables + enumerations + link tables + indexes |
| **Always Loaded?** | No |
| **Dynamically Loaded?** | YES — for database-related tasks |
| **Semantic Retrieval?** | YES |
| **Hierarchical Retrieval?** | No |
| **Graph Retrieval?** | No |
| **Vector Retrieval?** | No |
| **Cached?** | YES — session-level |
| **Why?** | Schema must be fully loaded for any database reasoning — partial schema leads to invalid queries, missing foreign keys, or wrong index usage. |

**What absolutely belongs here:**
- All 6 enumerations (opportunity_status, application_status, goal_status, document_status, notification_status, reflection_type)
- All tables by bounded context with full column definitions
- All 4 N:N link tables with payload columns
- All 9 indexes with purpose annotation
- Design principles (cuid IDs, soft delete, append-only Activity, enums from state-machines)
- Deferred entities table (Contact, CareerCapital, Template, AIInsight, Automation, Integration — Phase 2+)
- Migration strategy (Prisma Migrate, Neon branching per PR)

**What absolutely does NOT belong here:**
- ORM query patterns (belongs in Coding Standards)
- Data retention rules (belongs in Security module)

---

### MODULE: APPLICATION-006 — Security Architecture

| Property | Value |
|---|---|
| **Module Name** | Security Architecture |
| **Purpose** | Define authentication, authorization, encryption, and data protection rules |
| **Primary Responsibility** | Ensure security constraints are enforced in all engineering decisions |
| **Dependencies** | CORE-003, CORE-005, DOMAIN-007 |
| **Consumers** | Backend Agent, DevOps Agent, Review Agent, Security Agent |
| **Stability** | High |
| **Change Frequency** | Low-Medium |
| **Recommended File** | `application/security/security.ctx.md` |
| **Recommended Folder** | `.agents/context/application/security/` |
| **Recommended Token Size** | 1,500–2,000 tokens |
| **Max Token Size** | 2,800 tokens |
| **Granularity** | Per concern: Auth + AuthZ + Encryption + Input Validation + File Security + Audit |
| **Always Loaded?** | ✅ YES for all engineering agents |
| **Dynamically Loaded?** | No |
| **Semantic Retrieval?** | No |
| **Hierarchical Retrieval?** | No |
| **Graph Retrieval?** | No |
| **Vector Retrieval?** | No |
| **Cached?** | YES — permanent |
| **Why?** | Security constraints must be omnipresent in engineering reasoning. A missed security rule leads to vulnerabilities that compromise user trust (P-010). |

**What absolutely belongs here:**
- 7 security principles (SEC-001 through SEC-007)
- Auth methods per phase (Google/GitHub/Magic Link Phase 1, MFA Phase 2, Passkeys Phase 3)
- Session management: 30-day lifetime, 7-day idle, database-backed (not JWT), SHA-256 token hashing
- Authorization: every query `WHERE user_id = ? AND deleted_at IS NULL` at repository layer
- Encryption: TLS 1.3 in transit, AES-256 at rest, AES-256-GCM for integration tokens
- File upload: 10MB max, allowed MIME types, server-generated filenames, 1-hour pre-signed URLs
- Data classification: Public / Internal / Confidential / Restricted
- Rate limits: 1000/hr general, 10/15min auth, 50/hr AI, 200/hr search
- CSP headers, CORS policy (origin: career-os.mostafayaser.earth)

**What absolutely does NOT belong here:**
- Business logic, UI design, feature specifications

---

### MODULE: APPLICATION-007 — Tech Stack

| Property | Value |
|---|---|
| **Module Name** | Tech Stack |
| **Purpose** | Define all technology choices and version constraints |
| **Primary Responsibility** | Ensure all agents use consistent technology and avoid prohibited tools |
| **Dependencies** | CORE-003 |
| **Consumers** | All engineering agents |
| **Stability** | Medium (changes per phase) |
| **Change Frequency** | Low-Medium |
| **Recommended File** | `application/infrastructure/tech-stack.ctx.md` |
| **Recommended Folder** | `.agents/context/application/infrastructure/` |
| **Recommended Token Size** | 600–1,000 tokens |
| **Max Token Size** | 1,500 tokens |
| **Granularity** | Per layer: technology + version + purpose + rationale |
| **Always Loaded?** | ✅ YES for all engineering agents |
| **Dynamically Loaded?** | No |
| **Semantic Retrieval?** | No |
| **Hierarchical Retrieval?** | No |
| **Graph Retrieval?** | No |
| **Vector Retrieval?** | No |
| **Cached?** | YES — permanent |
| **Why?** | Agents that don't know the tech stack will suggest incompatible tools (Redis when not permitted in Phase 1, GraphQL when tRPC is canonical). |

**What absolutely belongs here:**
- Frontend: Next.js 14+ (App Router), React 18+, TypeScript 5+ strict, Tailwind 3+, shadcn/ui
- Backend: tRPC 11+, Zod 3+, Prisma 6+
- Database: PostgreSQL 16+ (Neon), Prisma ORM
- Auth: NextAuth.js v5
- AI: OpenAI GPT-4o, text-embedding-3-small
- Deployment: Vercel (hosting/CI/CD), Neon, Vercel Blob
- Dev: pnpm, ESLint, Prettier, Vitest, Prisma Studio
- Explicit prohibitions: No MongoDB, No GraphQL, No REST-only, No Redis (Phase 1), No Docker/K8s, No AWS/GCP/Azure
- Future phases: Redis (P2), pgvector (P3), Inngest (P4), RBAC (P5)

**What absolutely does NOT belong here:**
- Implementation patterns (belongs in Coding Standards)
- Security rules (belongs in Security Architecture)

---

### MODULE: APPLICATION-008 — Deployment & Infrastructure

| Property | Value |
|---|---|
| **Module Name** | Deployment & Infrastructure |
| **Purpose** | Define environments, CI/CD, backup, and operational requirements |
| **Primary Responsibility** | Enable DevOps Agent to reason about deployment topology |
| **Dependencies** | APPLICATION-007 |
| **Consumers** | DevOps Agent, Backend Agent |
| **Stability** | Medium |
| **Change Frequency** | Low-Medium |
| **Recommended File** | `application/infrastructure/deployment.ctx.md` |
| **Recommended Folder** | `.agents/context/application/infrastructure/` |
| **Recommended Token Size** | 600–1,000 tokens |
| **Max Token Size** | 1,200 tokens |
| **Granularity** | Environments + CI/CD pipeline + backup + required env vars |
| **Always Loaded?** | No |
| **Dynamically Loaded?** | YES — for deployment-related tasks |
| **Semantic Retrieval?** | No |
| **Hierarchical Retrieval?** | No |
| **Graph Retrieval?** | No |
| **Vector Retrieval?** | No |
| **Cached?** | YES — session-level |
| **Why?** | Deployment topology is stable and compact enough to load on demand without semantic retrieval. |

---

### MODULE: FEATURE-001 through FEATURE-014 — Feature Specifications

| Property | Value |
|---|---|
| **Module Name** | Feature Specification (per feature, F-001 through F-014) |
| **Purpose** | Complete specification for one product capability |
| **Primary Responsibility** | Define UX, business rules, acceptance criteria, and dependencies for one feature |
| **Dependencies** | CORE-002, CORE-004, relevant DOMAIN-* modules |
| **Consumers** | Frontend Agent, UX Agent, Testing Agent, PM Agent |
| **Stability** | Medium (features evolve) |
| **Change Frequency** | Medium-High |
| **Recommended File** | `feature/{feature-name}/spec.ctx.md` |
| **Recommended Folder** | `.agents/context/feature/{name}/` |
| **Recommended Token Size** | 2,000–3,500 tokens per feature |
| **Max Token Size** | 5,000 tokens |
| **Granularity** | Full feature spec per Feature Specification Standard |
| **Always Loaded?** | No |
| **Dynamically Loaded?** | YES — load only the specific feature being worked on |
| **Semantic Retrieval?** | YES |
| **Hierarchical Retrieval?** | YES |
| **Graph Retrieval?** | No |
| **Vector Retrieval?** | No |
| **Cached?** | YES — task-level |
| **Why?** | Feature specs are large but only one is relevant at a time. Loading all 14 simultaneously would waste 35,000+ tokens. |

**Status note:** As of July 2026, all 14 individual feature spec files (`docs/01-product/features/*.md`) are **empty placeholders**. These are the highest-priority gap in the documentation system. See §9 (Missing Documents).

---

### MODULE: UI-001 — Information Architecture

| Property | Value |
|---|---|
| **Module Name** | Information Architecture |
| **Purpose** | Define navigation structure, workspace patterns, and IA principles |
| **Primary Responsibility** | Provide mental model for UI organization |
| **Dependencies** | CORE-002, CORE-004 |
| **Consumers** | Frontend Agent, UX Agent, PM Agent |
| **Stability** | Medium-High |
| **Change Frequency** | Low |
| **Recommended File** | `ui/ia/information-architecture.ctx.md` |
| **Recommended Folder** | `.agents/context/ui/ia/` |
| **Recommended Token Size** | 1,000–1,500 tokens |
| **Max Token Size** | 2,000 tokens |
| **Granularity** | Navigation hierarchy + IA principles + workspace pattern |
| **Always Loaded?** | No |
| **Dynamically Loaded?** | YES — for any UI/frontend work |
| **Semantic Retrieval?** | YES |
| **Hierarchical Retrieval?** | YES |
| **Graph Retrieval?** | No |
| **Vector Retrieval?** | No |
| **Cached?** | YES — session-level |
| **Why?** | IA is the skeleton of all UI decisions. Without it, agents produce inconsistent navigation and workspace patterns. |

**What absolutely belongs here:**
- 6 primary domains (Capture, Organize, Execute, Learn, Plan, Configure)
- Primary navigation: Dashboard, Inbox, Opportunities, Applications, Calendar, Documents, Organizations, Goals, Knowledge, Analytics, Search, Settings
- Universal Workspace pattern: Overview + Related Objects + Timeline + Activity + Notes + Attachments + Analytics + History + Settings
- IA principles IA-001 through IA-007
- Context preservation rules
- Progressive Disclosure principle

---

### MODULE: UI-002 — Design System (MISSING — CRITICAL GAP)

See §9 for complete gap analysis.

---

### MODULE: ORGANIZATION-001 — Personas

| Property | Value |
|---|---|
| **Module Name** | User Personas |
| **Purpose** | Define the 3 target user archetypes |
| **Primary Responsibility** | Ground product decisions in real user needs |
| **Dependencies** | CORE-001 |
| **Consumers** | PM Agent, UX Agent, Frontend Agent |
| **Stability** | High |
| **Change Frequency** | Very Low |
| **Recommended File** | `product/personas/personas.ctx.md` |
| **Recommended Folder** | `.agents/context/product/personas/` |
| **Recommended Token Size** | 600–900 tokens |
| **Max Token Size** | 1,200 tokens |
| **Granularity** | Per persona: archetype + needs + pain points |
| **Always Loaded?** | No |
| **Dynamically Loaded?** | YES — for product/UX reasoning |
| **Semantic Retrieval?** | YES |
| **Hierarchical Retrieval?** | No |
| **Graph Retrieval?** | No |
| **Vector Retrieval?** | No |
| **Cached?** | YES — session-level |
| **Why?** | Small, stable, high-value context for product decisions. |

**What absolutely belongs here:**
- Persona 1: The Strategic Starter (20-25, early-career) — needs chaos management, deadline tracking, asset reuse
- Persona 2: The Intentional Pivot (28-40, mid-career) — needs strategic decision making, low cognitive load, insight from rejections
- Persona 3: The Serial Achiever (researchers/academics) — needs knowledge compounding, reliability, confidence

---

### MODULE: ROADMAP-001 — Phase Registry

| Property | Value |
|---|---|
| **Module Name** | Phase Registry |
| **Purpose** | Define what is in-scope and out-of-scope per development phase |
| **Primary Responsibility** | Prevent agents from implementing Phase 3+ features in Phase 1 |
| **Dependencies** | CORE-001, CORE-004 |
| **Consumers** | All agents |
| **Stability** | Medium (updated as phases complete) |
| **Change Frequency** | Low-Medium |
| **Recommended File** | `product/roadmap/phase-registry.ctx.md` |
| **Recommended Folder** | `.agents/context/product/roadmap/` |
| **Recommended Token Size** | 600–900 tokens |
| **Max Token Size** | 1,200 tokens |
| **Granularity** | Per phase: in-scope + deferred items |
| **Always Loaded?** | ✅ YES — prevents scope creep |
| **Dynamically Loaded?** | No |
| **Semantic Retrieval?** | No |
| **Hierarchical Retrieval?** | No |
| **Graph Retrieval?** | No |
| **Vector Retrieval?** | No |
| **Cached?** | YES — permanent |
| **Why?** | Without phase boundaries, agents will suggest Redis caching in Phase 1 or Knowledge Graph in the MVP — both explicitly deferred. |

**What absolutely belongs here:**
- Phase 0: No-Code MVP (Notion + Make + Google Calendar)
- Phase 1 MVP: Auth + Dashboard + Inbox + Opportunity + Application + Tasks + Calendar + Notifications + Basic Analytics
- Phase 2 Intelligence: AI Summaries + RAG + Browser Extension + Redis
- Phase 3 Automation: Event Bus + Calendar Sync + Email Detection + Workflows
- Phase 4 Platform: Public API + Webhooks + GitHub/LinkedIn
- Phase 5 Collaboration: Mentors + Shared Workspaces
- Phase 6 Enterprise: SSO + RBAC + Multi-tenant
- Deferral Registry: Career Capital Scoring (P2), Decision Engine (P2), Knowledge Graph (P3), Advanced Analytics (P3)

---

# 4. Context Dependency Graph

## 4.1 Dependency Topology

```
                          CORE-001 (Identity)
                               │
                    ┌──────────┼──────────────────┐
                    │          │                  │
               CORE-002    CORE-003          CORE-004
              (Glossary)  (Architecture)   (Principles)
                    │          │
               CORE-005    CORE-005
              (Coding Std)   │
                    │        │
       ┌────────────┼────────┼──────────────────────┐
       │            │        │                      │
  DOMAIN-001   DOMAIN-002  DOMAIN-003          DOMAIN-004
  (Strategy)  (Opportunity)(Application)       (Knowledge)
       │            │        │                      │
       │            └────────┘                      │
       │            (always co-loaded)              │
       │                 │                          │
  DOMAIN-005        DOMAIN-006              DOMAIN-007
  (Organization)   (Document)              (Platform)
                         │                      │
                    DOMAIN-008 (Events) ─────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
  APPLICATION-001  APPLICATION-002  APPLICATION-003
  (Intelligence)   (Automation)    (Analytics)
         │               │
  APPLICATION-004  APPLICATION-005
  (API Layer)      (Database)
         │               │
  APPLICATION-006  APPLICATION-007
  (Security)       (Tech Stack)
                         │
                  APPLICATION-008
                  (Deployment)
                         │
         ┌───────────────┼───────────────┐
         │               │               │
  FEATURE-001..014    UI-001        ROADMAP-001
  (Feature Specs)  (IA)             (Phase Registry)
```

## 4.2 Co-loading Requirements

These modules MUST always be loaded together:

| Primary Module | Must Co-load | Reason |
|---|---|---|
| DOMAIN-003 (Application) | DOMAIN-002 (Opportunity) | XAG-001, XAG-002 cross-aggregate rules |
| APPLICATION-001 (Intelligence) | DOMAIN-004 (Knowledge) | RAG operates on KnowledgeEntries |
| APPLICATION-002 (Automation) | DOMAIN-008 (Events) | Automations fire on events |
| APPLICATION-004 (API) | DOMAIN-002, DOMAIN-003, CORE-002 | Intent-based operations reference domain entities |
| APPLICATION-005 (Database) | All DOMAIN-* | Schema implements domain model |
| FEATURE-001..014 | Relevant DOMAIN-* | Feature specs reference domain concepts |

## 4.3 Dependency Direction Rules

```
Allowed:                        Forbidden:
DOMAIN → CORE                   CORE → DOMAIN
APPLICATION → DOMAIN            DOMAIN → APPLICATION
APPLICATION → CORE              FEATURE → APPLICATION (except via API)
FEATURE → DOMAIN                CORE → FEATURE
FEATURE → CORE
FEATURE → APPLICATION-004 (API only)
```

---

# 5. Multi-Agent Architecture

## 5.1 Agent Ecosystem Overview

```
                    ORCHESTRATION LAYER
                   ┌─────────────────────┐
                   │   Architect Agent   │ (coordinates all)
                   └──────────┬──────────┘
                              │
          ┌───────────────────┼───────────────────────┐
          │                   │                       │
   DOMAIN LAYER        APPLICATION LAYER        QUALITY LAYER
   ┌─────────────┐    ┌─────────────────┐    ┌──────────────┐
   │ DDD Agent   │    │ Backend Agent   │    │Testing Agent │
   │ Domain      │    │ Frontend Agent  │    │Review Agent  │
   │ Expert      │    │ Database Agent  │    │Security Agent│
   └─────────────┘    │ AI Agent        │    └──────────────┘
                      │ Automation Agent│
                      └─────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
  SUPPORT LAYER        KNOWLEDGE LAYER       OPERATIONS LAYER
  ┌────────────┐       ┌──────────────┐      ┌─────────────┐
  │UX Agent    │       │Knowledge     │      │DevOps Agent │
  │Analytics   │       │Graph Agent   │      │Performance  │
  │Agent       │       │Context       │      │Agent        │
  │PM Agent    │       │Manager       │      │             │
  └────────────┘       └──────────────┘      └─────────────┘
```

## 5.2 Complete Agent Definitions

---

### AGENT: Architect Agent

**Purpose:** Orchestrate all other agents. Make and enforce architectural decisions.

**Responsibilities:**
- Evaluate cross-cutting concerns and bounded context boundaries
- Decide when to split or merge aggregates
- Review architectural fitness functions
- Approve any change to CORE-* or DOMAIN-* modules
- Maintain the Context Architecture document

**Knowledge Required:**
- ALL CORE-* modules (always loaded)
- DOMAIN-001 through DOMAIN-008 (always loaded)
- APPLICATION-001 through APPLICATION-008 (always loaded)
- ROADMAP-001 (always loaded)

**Knowledge Forbidden:**
- Feature implementation details (delegates to specialized agents)
- UI/UX specifics (delegates to UX Agent)
- Test implementation (delegates to Testing Agent)

**Always Loaded Context:** CORE-001, CORE-002, CORE-003, CORE-005, APPLICATION-007, ROADMAP-001

**Dynamic Context:** Any DOMAIN-* or APPLICATION-* module relevant to the architectural question

**Expected Inputs:** Architecture questions, design decisions, cross-cutting concerns, ADR proposals

**Expected Outputs:** Architecture Decision Records (ADRs), module boundaries, dependency rules, escalation to human for irreversible decisions

**Decision Boundaries:**
- CAN decide: module boundaries, dependency direction, naming conventions
- CANNOT decide: product strategy (escalate to PM Agent), security policy exceptions (escalate to human)

**Escalation Rules:**
- New bounded context → human review required
- Breaking change to CORE-* → human review required
- Technology stack change → ADR required + human approval

**Handoff Rules:**
- After architectural decision → notify Backend Agent and DDD Agent
- After ADR created → notify Context Manager to update modules

**Memory Requirements:** Permanent memory: all ADRs; Session memory: current architectural question

**Collaboration Pattern:** Hub-and-spoke. Architect is the hub. All other agents speak to it for architectural guidance.

---

### AGENT: DDD Agent (Domain-Driven Design Expert)

**Purpose:** Maintain the purity and correctness of the domain model.

**Responsibilities:**
- Define and refine domain entities, aggregates, and value objects
- Enforce bounded context boundaries (no cross-context direct dependencies)
- Design state machines and business rule enforcement
- Validate that domain events are named as business facts (past tense)
- Detect and correct domain model violations

**Knowledge Required:**
- CORE-001, CORE-002, CORE-003 (always loaded)
- DOMAIN-001 through DOMAIN-008 (always loaded)
- APPLICATION-005 (Database) (dynamically loaded)

**Knowledge Forbidden:**
- UI implementation, API design specifics, infrastructure concerns

**Always Loaded Context:** CORE-001, CORE-002, CORE-003, DOMAIN-001–DOMAIN-008

**Dynamic Context:** APPLICATION-005 when reviewing schema alignment with domain

**Expected Inputs:** New entity proposals, business rule questions, aggregate boundary questions, event catalog additions

**Expected Outputs:** Entity definitions, state machine diagrams, domain invariants (INV-*), cross-aggregate rules (XAG-*), domain event names

**Decision Boundaries:**
- CAN decide: aggregate boundaries, entity attributes, state transitions, event names
- CANNOT decide: persistence strategy (Database Agent), API design (Backend Agent)

**Escalation Rules:**
- New aggregate root → Architect Agent review
- Domain invariant contradiction → human review
- Cross-bounded-context dependency proposal → Architect Agent veto

**Handoff Rules:**
- After entity definition → Backend Agent (implementation), Database Agent (schema)
- After event definition → Automation Agent (handler), Analytics Agent (metrics)

**Memory Requirements:** Long-term: complete domain model; Session: current entity/aggregate being designed

**Collaboration Pattern:** Peer with Backend Agent; reports to Architect Agent; consulted by all other agents on domain questions.

---

### AGENT: Backend Agent

**Purpose:** Implement application and infrastructure layer code.

**Responsibilities:**
- Implement tRPC routers following API Layer specification
- Implement Prisma repository patterns
- Implement application layer commands and queries
- Implement domain event handlers
- Ensure all queries include `WHERE user_id = ?` at repository layer
- Enforce Clean Architecture layer dependency rules

**Knowledge Required:**
- CORE-001, CORE-002, CORE-003, CORE-005 (always loaded)
- APPLICATION-004 (API Layer), APPLICATION-005 (Database), APPLICATION-006 (Security), APPLICATION-007 (Tech Stack) (always loaded)
- Relevant DOMAIN-* modules (dynamically loaded per feature)

**Knowledge Forbidden:**
- UI/CSS/styling concerns, product strategy, business metric definitions

**Always Loaded Context:** CORE-001, CORE-002, CORE-003, CORE-005, APPLICATION-004, APPLICATION-005, APPLICATION-006, APPLICATION-007, ROADMAP-001

**Dynamic Context:** DOMAIN-002+DOMAIN-003 when implementing opportunity/application features; APPLICATION-001 when implementing AI features; APPLICATION-002 when implementing automations

**Expected Inputs:** Feature task description, domain entity reference, API procedure signature

**Expected Outputs:** TypeScript source files (.entity.ts, .command.ts, .query.ts, .repository.ts, router files), Prisma schema changes, migration files

**Decision Boundaries:**
- CAN decide: implementation patterns within established conventions
- CANNOT decide: API design changes (escalate to Architect), domain model changes (escalate to DDD Agent)

**Escalation Rules:**
- Domain rule ambiguity → DDD Agent
- Security concern → Security Agent review
- Performance issue → Performance Agent

**Handoff Rules:**
- After implementation → Testing Agent (unit tests), Review Agent (code review)
- After schema change → Database Agent (migration review)

**Memory Requirements:** Session: current feature implementation; Task: current file being written

**Collaboration Pattern:** Receives tasks from Architect Agent; pairs with DDD Agent for domain questions; pairs with Database Agent for schema questions.

---

### AGENT: Frontend Agent

**Purpose:** Implement presentation layer components and pages.

**Responsibilities:**
- Implement Next.js App Router pages and layouts
- Implement React components using shadcn/ui primitives + Tailwind CSS
- Implement tRPC client hooks
- Follow IA patterns (workspace structure, navigation, progressive disclosure)
- Ensure accessibility compliance

**Knowledge Required:**
- CORE-001, CORE-002, CORE-004, CORE-005 (always loaded)
- APPLICATION-004 (API Layer) — for tRPC hooks (dynamically loaded)
- UI-001 (Information Architecture) (always loaded)
- Current Feature spec (dynamically loaded)
- APPLICATION-007 (Tech Stack) (always loaded)

**Knowledge Forbidden:**
- Domain business rules (domain agent owns these), database schema, security implementation

**Always Loaded Context:** CORE-001, CORE-002, CORE-004, CORE-005, UI-001, APPLICATION-007

**Dynamic Context:** Current FEATURE-* spec + APPLICATION-004

**Expected Inputs:** Feature spec, wireframe/UX description, tRPC procedure signatures

**Expected Outputs:** React components (.tsx), Next.js pages, tRPC client hooks, Tailwind/CSS styles

**Decision Boundaries:**
- CAN decide: component composition, styling, client-side state
- CANNOT decide: business rules (Backend Agent), navigation IA changes (UX Agent + Architect)

**Escalation Rules:**
- New UI pattern needed → UX Agent
- Performance concern → Performance Agent
- Accessibility question → UX Agent

**Handoff Rules:**
- After implementation → Testing Agent (E2E), Review Agent (code review)
- UI pattern discovered → Context Manager to document in UI modules

**Memory Requirements:** Session: current component tree; Task: current file

**Collaboration Pattern:** Receives from UX Agent (designs) and PM Agent (feature specs); pairs with Backend Agent for API integration.

---

### AGENT: Database Agent

**Purpose:** Design and maintain the PostgreSQL schema and Prisma ORM.

**Responsibilities:**
- Design and review schema migrations
- Ensure schema implements domain model (entities.md is canonical)
- Enforce database design principles (cuid IDs, soft delete, enums from state machines)
- Design query optimizations and indexes
- Review N:N link table designs for correct payload columns
- Ensure Activity table remains append-only

**Knowledge Required:**
- CORE-003, CORE-005 (always loaded)
- APPLICATION-005 (Database Schema) (always loaded)
- DOMAIN-001 through DOMAIN-008 (dynamically loaded)
- APPLICATION-006 (Security — for data retention rules) (always loaded)

**Knowledge Forbidden:**
- Business logic, API design, UI concerns

**Always Loaded Context:** CORE-003, CORE-005, APPLICATION-005, APPLICATION-006

**Dynamic Context:** Relevant DOMAIN-* modules when designing schema for a bounded context

**Expected Inputs:** Domain entity definition, feature requirement requiring new tables

**Expected Outputs:** Prisma schema files, migration files, index recommendations, query optimization plans

**Decision Boundaries:**
- CAN decide: table structure, indexes, migration approach
- CANNOT decide: domain model changes (DDD Agent), data retention policy exceptions (Security Agent)

**Escalation Rules:**
- Domain model conflict → DDD Agent
- Data retention change → Security Agent + human approval
- Performance-breaking query pattern → Performance Agent

**Handoff Rules:**
- After schema change → Backend Agent (repository implementation), Testing Agent (integration tests)

**Memory Requirements:** Session: current schema being modified; Long-term: complete schema state

**Collaboration Pattern:** Tight pairing with DDD Agent and Backend Agent. Independent for index/query optimization.

---

### AGENT: AI Agent (Intelligence Engine Agent)

**Purpose:** Design, implement, and validate all AI/ML capabilities in CareerOS.

**Responsibilities:**
- Implement the 5 AI capabilities following APPLICATION-001 specs
- Design prompts and RAG pipelines
- Enforce AI ethical constraints (no hallucination, explainability, user approval for commits)
- Integrate with OpenAI API (GPT-4o, text-embedding-3-small)
- Implement confidence model and explainability markers
- Design vector embedding strategy

**Knowledge Required:**
- CORE-001, CORE-002, CORE-003, CORE-004 (always loaded)
- APPLICATION-001 (Intelligence Engine) (always loaded)
- DOMAIN-002, DOMAIN-003, DOMAIN-004 (always loaded)
- APPLICATION-005 (Database) — for knowledge retrieval schema
- APPLICATION-006 (Security — AI privacy section) (always loaded)

**Knowledge Forbidden:**
- Deterministic automation rules (APPLICATION-002 — that's the Automation Agent's domain)
- Product principles (may consult, but should not reinterpret)

**Always Loaded Context:** CORE-001, CORE-002, CORE-004, APPLICATION-001, APPLICATION-006, DOMAIN-002, DOMAIN-003, DOMAIN-004

**Dynamic Context:** APPLICATION-005 for schema; Prompt Engineering guide when writing prompts

**Expected Inputs:** AI capability requirement, KnowledgeEntry schema, test cases for hallucination detection

**Expected Outputs:** Prompt templates, AI service TypeScript files (src/server/ai/), embedding schemas, confidence score implementations, explainability markers

**Decision Boundaries:**
- CAN decide: prompt design, chunking strategy, embedding approach
- CANNOT decide: which data to collect (Product/Privacy Agent), business rules for AI output (DDD Agent)

**Escalation Rules:**
- Ethical constraint conflict → Architect Agent + human review
- Hallucination risk detected → immediate escalation, do NOT implement
- New AI capability → APPLICATION-001 must be updated first (Context Manager)

**Handoff Rules:**
- After AI feature implementation → Review Agent (ethical review), Testing Agent (hallucination tests)

**Memory Requirements:** Long-term: AI ethical rules; Session: current capability being implemented; Scratchpad: prompt experiments

**Collaboration Pattern:** Works closely with Backend Agent (integration), Knowledge Graph Agent (retrieval), DDD Agent (domain constraints).

---

### AGENT: Automation Agent

**Purpose:** Implement and validate all deterministic rule-based automations.

**Responsibilities:**
- Implement lifecycle/state automations (triggered by state transitions)
- Implement temporal automations (triggered by time)
- Implement organizational automations (triggered by data relationships)
- Ensure idempotency for all automations
- Ensure all automations produce audit records (`updated_by: "system:automation"`)
- Implement circuit breakers

**Knowledge Required:**
- CORE-002, CORE-003, CORE-005 (always loaded)
- APPLICATION-002 (Automation Engine) (always loaded)
- DOMAIN-002, DOMAIN-003, DOMAIN-007, DOMAIN-008 (always loaded)
- APPLICATION-005 (Database) (dynamically loaded)

**Knowledge Forbidden:**
- AI/probabilistic features (AI Agent handles these)
- User-facing notification content (Automation triggers notification, Platform Agent designs content)

**Always Loaded Context:** CORE-002, CORE-003, CORE-005, APPLICATION-002, DOMAIN-002, DOMAIN-003, DOMAIN-008

**Dynamic Context:** APPLICATION-005 for schema; DOMAIN-007 for Activity audit trail

**Expected Inputs:** State transition event, time-based trigger, business rule from automation spec

**Expected Outputs:** Automation handler TypeScript files, idempotency key implementations, circuit breaker patterns, audit record creation

**Decision Boundaries:**
- CAN decide: automation implementation within defined rules
- CANNOT decide: new automation rules (PM Agent + DDD Agent + Architect must approve), AI feature behavior

**Escalation Rules:**
- New automation proposed → Architect Agent + DDD Agent review required
- Idempotency violation detected → immediate escalation
- Automation failure pattern → Circuit Breaker must be implemented

**Memory Requirements:** Session: current automation being implemented; Long-term: complete automation rule registry

---

### AGENT: Testing Agent

**Purpose:** Design and implement the complete test strategy.

**Responsibilities:**
- Write unit tests for domain entities and state machines
- Write integration tests for tRPC routers
- Write E2E tests for critical user flows
- Write tests for AI features (hallucination detection)
- Implement architectural fitness function tests
- Maintain test coverage standards
- Validate acceptance criteria

**Knowledge Required:**
- CORE-002, CORE-003, CORE-005 (always loaded)
- Relevant DOMAIN-* modules (dynamically loaded per test area)
- APPLICATION-004 (API Layer) for router tests
- APPLICATION-005 (Database) for integration tests
- Current FEATURE-* spec for acceptance criteria

**Knowledge Forbidden:**
- UI styling, prompt design, deployment configuration

**Always Loaded Context:** CORE-003, CORE-005

**Dynamic Context:** Relevant DOMAIN-* + FEATURE-* for the area being tested

**Expected Inputs:** Implementation code, acceptance criteria, domain rules, state machine definitions

**Expected Outputs:** Vitest test files (.spec.ts, .test.ts), E2E test files, fitness function implementations, test coverage reports

**Decision Boundaries:**
- CAN decide: test approach, test data design
- CANNOT decide: acceptance criteria (PM Agent defines these), domain rule changes based on test findings (DDD Agent)

**Escalation Rules:**
- Domain rule ambiguity in test → DDD Agent
- Failed acceptance criteria → PM Agent
- Security test failure → Security Agent

**Memory Requirements:** Session: current test suite; Long-term: acceptance criteria registry

---

### AGENT: Review Agent

**Purpose:** Review all code and documentation for correctness, consistency, and standard compliance.

**Responsibilities:**
- Review code against Coding Standards (CORE-005)
- Verify architectural principles are not violated (CORE-003)
- Check domain language consistency (CORE-002)
- Validate security compliance (APPLICATION-006)
- Review AI feature outputs for ethical compliance (APPLICATION-001)
- Check that business rules are correctly implemented (DOMAIN-*)
- Identify information leakage between modules

**Knowledge Required:**
- ALL CORE-* modules (always loaded)
- APPLICATION-001, APPLICATION-002, APPLICATION-006 (always loaded)
- Relevant DOMAIN-* modules (dynamically loaded)

**Knowledge Forbidden:**
- Nothing — Review Agent must have broad access to detect violations

**Always Loaded Context:** CORE-001, CORE-002, CORE-003, CORE-004, CORE-005, APPLICATION-006, ROADMAP-001

**Dynamic Context:** Relevant DOMAIN-* + APPLICATION-* for the code being reviewed

**Expected Inputs:** Pull request content, code files, documentation changes

**Expected Outputs:** Review comments with principle/rule references (e.g., "Violates ARCH-001"), approval/rejection decision, suggested corrections

**Decision Boundaries:**
- CAN decide: code quality issues, standard violations
- CANNOT decide: architectural changes (Architect Agent), business rule changes (DDD Agent)

**Escalation Rules:**
- Security violation → Security Agent + immediate escalation
- Architectural violation → Architect Agent
- AI ethical violation → Architect Agent + human review

**Memory Requirements:** Session: current review; Long-term: known anti-patterns registry

---

### AGENT: Security Agent

**Purpose:** Enforce security architecture and validate security compliance.

**Responsibilities:**
- Review all authentication/authorization implementations
- Validate `WHERE user_id = ?` enforcement in repositories
- Review file upload implementations (MIME validation, size limits)
- Verify rate limiting implementation
- Review CSP and security headers
- Validate encryption at rest/in transit
- Review AI feature privacy compliance

**Knowledge Required:**
- APPLICATION-006 (Security Architecture) — always loaded, full fidelity
- CORE-003, CORE-005 (always loaded)
- DOMAIN-007 (Platform — Activity audit trail) (always loaded)
- APPLICATION-005 (Database — data retention) (dynamically loaded)

**Knowledge Forbidden:**
- Business logic, UI design, feature strategy

**Always Loaded Context:** APPLICATION-006, CORE-003, DOMAIN-007

**Expected Inputs:** Code PRs, infrastructure changes, new feature proposals, incident reports

**Expected Outputs:** Security review report, compliance checklist, remediation recommendations

**Decision Boundaries:**
- CAN decide: security standard violations, remediation requirements
- CANNOT decide: architecture changes (Architect), data retention policy (human)

---

### AGENT: UX Agent

**Purpose:** Design user experience, validate UX quality, and maintain design system.

**Responsibilities:**
- Design feature UX following IA principles (IA-001 through IA-007)
- Maintain the Universal Workspace pattern consistency
- Define and validate progressive disclosure patterns
- Write UX specifications for features (filling the empty 08-ux/ files)
- Validate accessibility compliance
- Maintain design system documentation

**Knowledge Required:**
- CORE-002, CORE-004 (always loaded)
- UI-001 (Information Architecture) (always loaded)
- ORGANIZATION-001 (Personas) (always loaded)
- Current FEATURE-* spec (dynamically loaded)

**Knowledge Forbidden:**
- Backend implementation, database schema, business rule definitions

**Always Loaded Context:** CORE-002, CORE-004, UI-001, ORGANIZATION-001

**Dynamic Context:** FEATURE-* spec for the feature being designed; Product principles when making design decisions

**Expected Inputs:** Feature requirement, user persona reference, existing workspace pattern

**Expected Outputs:** UX spec documents (filling 08-ux/ gaps), wireframe descriptions, user flow definitions, accessibility notes

**Escalation Rules:**
- IA pattern conflict → Architect Agent (IA is architectural)
- Feature requirement impossible to implement well → PM Agent

---

### AGENT: Analytics Agent

**Purpose:** Design and implement analytics features and career metrics.

**Responsibilities:**
- Implement the 3-level analytics framework (Operational, Performance, Strategic)
- Define and track the North Star (Career Capital Growth)
- Implement career metrics and avoid anti-metrics
- Design Dashboard analytics widgets
- Implement Decision Quality Score (DQS)
- Ensure analytics don't compromise privacy

**Knowledge Required:**
- CORE-002, CORE-004 (always loaded)
- APPLICATION-003 (Analytics Engine) (always loaded)
- DOMAIN-001, DOMAIN-002, DOMAIN-003, DOMAIN-004 (dynamically loaded)
- APPLICATION-006 (Security — for analytics privacy) (always loaded)

**Knowledge Forbidden:**
- UI layout (delegates to Frontend Agent), backend implementation details

**Always Loaded Context:** CORE-002, CORE-004, APPLICATION-003, APPLICATION-006

**Dynamic Context:** DOMAIN-* for the metric domain; Feature spec for dashboard design

---

### AGENT: DevOps Agent

**Purpose:** Manage deployment, CI/CD, and infrastructure.

**Responsibilities:**
- Configure Vercel deployments and preview environments
- Manage Neon database branching per PR
- Configure environment variables (never in code)
- Set up CI/CD pipeline (lint → typecheck → test → build → deploy → migrations)
- Configure backup strategy
- Monitor error rates and performance

**Knowledge Required:**
- APPLICATION-007 (Tech Stack) (always loaded)
- APPLICATION-008 (Deployment) (always loaded)
- APPLICATION-006 (Security — env vars, secrets) (always loaded)

**Knowledge Forbidden:**
- Business logic, domain model, UI design

**Always Loaded Context:** APPLICATION-007, APPLICATION-008, APPLICATION-006

---

### AGENT: Performance Agent

**Purpose:** Ensure the system meets performance targets.

**Responsibilities:**
- Validate LCP <2.5s, FID <100ms, INP <200ms, CLS <0.1
- Validate API p95 <500ms, Search <500ms, AI extraction <10s
- Identify and fix slow database queries
- Optimize Next.js Server Components rendering
- Design caching strategies (Phase 2+)

**Knowledge Required:**
- CORE-003 (always loaded)
- APPLICATION-005 (Database — indexes) (always loaded)
- APPLICATION-007 (Tech Stack) (always loaded)
- Non-functional requirements from PRD §25

**Always Loaded Context:** CORE-003, APPLICATION-005, APPLICATION-007

---

### AGENT: Knowledge Graph Agent

**Purpose:** Design and implement the knowledge graph (Phase 3+) and manage RAG systems.

**Responsibilities:**
- Design the Career Knowledge Graph schema
- Implement vector embeddings using text-embedding-3-small
- Build RAG pipelines over KnowledgeEntries and Documents
- Connect Knowledge Entries to Goals (KnowledgeGoalLink)
- Implement Asset Suggestion Engine (AI Capability 3)

**Knowledge Required:**
- APPLICATION-001 (Intelligence Engine) (always loaded)
- DOMAIN-004 (Knowledge Domain) (always loaded)
- APPLICATION-005 (Database — KnowledgeGoalLink schema) (always loaded)

**Knowledge Forbidden:**
- Business rule changes, UI design, deployment

**Always Loaded Context:** APPLICATION-001, DOMAIN-004, APPLICATION-005

**Note:** This agent becomes active in Phase 2+ when vector embeddings are introduced.

---

### AGENT: PM Agent (Product Manager)

**Purpose:** Maintain product alignment, manage feature backlog, and validate product decisions.

**Responsibilities:**
- Validate features against product principles (P-001 through P-018)
- Apply the 7-question decision framework before approving features
- Maintain and prioritize feature backlog
- Write feature specifications following the Feature Specification Standard
- Fill in the 14 empty feature specification files
- Define acceptance criteria

**Knowledge Required:**
- CORE-001, CORE-002, CORE-004 (always loaded)
- ROADMAP-001 (Phase Registry) (always loaded)
- ORGANIZATION-001 (Personas) (always loaded)
- APPLICATION-003 (Analytics Engine — success metrics) (dynamically loaded)

**Always Loaded Context:** CORE-001, CORE-002, CORE-004, ROADMAP-001, ORGANIZATION-001

**Expected Outputs:** Feature specifications (filling feature/*.md gaps), acceptance criteria, backlog prioritization, sprint plans

---

### AGENT: Context Manager

**Purpose:** Maintain the context architecture itself — the meta-agent.

**Responsibilities:**
- Update context modules when documentation changes
- Detect stale, conflicting, or duplicated context
- Monitor for information leakage between modules
- Validate cross-references between modules
- Version-stamp all context modules
- Generate context loading recommendations for other agents
- Fill in empty placeholder files as they are created

**Knowledge Required:**
- This entire document (always loaded)
- All current module content (indexed)
- Document status registry (empty vs. populated)

**Always Loaded Context:** Full context architecture + module registry

**Expected Inputs:** Documentation updates, new files, agent reports of missing context

**Expected Outputs:** Updated context modules, validation reports, context loading recommendations, empty file alerts

**Escalation Rules:**
- Conflicting documentation between 2 canonical sources → Architect Agent + human resolution
- Missing critical document → alert to relevant agent owner

**Memory Requirements:** Long-term: complete module registry; Session: current validation pass

---

### AGENT: Documentation Agent

**Purpose:** Write and maintain technical documentation.

**Responsibilities:**
- Write the 26 missing/empty documentation files
- Maintain Architecture Decision Records (ADRs)
- Update API documentation
- Write developer onboarding guides
- Ensure all documentation follows naming conventions and frontmatter standards

**Knowledge Required:**
- ALL CORE-* modules (always loaded)
- Relevant DOMAIN-* and APPLICATION-* for the document being written

**Always Loaded Context:** CORE-001, CORE-002, CORE-003, CORE-004

**Expected Outputs:** Populated documentation files, ADRs, runbooks, onboarding guides

---

### AGENT: Prompt Engineering Agent

**Purpose:** Design, test, and optimize all AI prompts used in CareerOS.

**Responsibilities:**
- Write system prompts for each AI capability
- Test prompts for hallucination, boundary violations, explainability
- Optimize prompts for token efficiency and consistency
- Maintain the Prompt Engineering Guide (missing document)
- Version-control all prompt templates

**Knowledge Required:**
- APPLICATION-001 (Intelligence Engine) — always loaded, full fidelity
- CORE-002 (Glossary — canonical terminology in prompts) (always loaded)
- DOMAIN-002, DOMAIN-003, DOMAIN-004 (always loaded — prompt targets)

**Always Loaded Context:** APPLICATION-001, CORE-002, DOMAIN-002, DOMAIN-003, DOMAIN-004

**Expected Outputs:** Prompt template files, prompt test results, Prompt Engineering Guide document

---

### AGENT: Refactoring Agent

**Purpose:** Safely refactor code while preserving behavioral correctness.

**Responsibilities:**
- Identify and eliminate code that violates architectural boundaries
- Extract properly scoped modules
- Improve type safety
- Eliminate duplication
- Ensure all refactoring preserves domain invariants

**Knowledge Required:**
- CORE-002, CORE-003, CORE-005 (always loaded)
- Full current codebase snapshot (dynamically loaded)

**Always Loaded Context:** CORE-002, CORE-003, CORE-005

**Decision Boundaries:**
- CAN decide: internal implementation changes
- CANNOT decide: API changes, domain rule changes, architectural changes

---

# 6. Retrieval Architecture

## 6.1 Retrieval Strategy Matrix (Task 6)

| Knowledge Category | Strategy | Mechanism | Reason |
|---|---|---|---|
| Project Identity (CORE-001) | Always Loaded | Pre-load | Never omit — 400 tokens, zero overhead |
| Glossary (CORE-002) | Always Loaded | Pre-load | Terminology drift = reasoning errors |
| Architecture Principles (CORE-003) | Always Loaded (engineering) | Pre-load | Architectural violations must be actively prevented |
| Product Principles (CORE-004) | Always Loaded (product) | Pre-load | Design without principles = feature creep |
| Coding Standards (CORE-005) | Always Loaded (engineering) | Pre-load | Inconsistent code is expensive to maintain |
| Phase Registry (ROADMAP-001) | Always Loaded | Pre-load | Scope creep prevention is highest ROI |
| Security Architecture (APP-006) | Always Loaded (engineering) | Pre-load | Security omissions have irreversible consequences |
| Tech Stack (APP-007) | Always Loaded (engineering) | Pre-load | Wrong tool suggestions waste engineering cycles |
| Domain modules (DOMAIN-*) | Semantic Search | Vector similarity | Domain knowledge is large; agent loads what's relevant |
| Feature Specifications | Semantic Search | Vector similarity + keyword | Features are specific; only one is relevant at a time |
| Event Catalog | Keyword Search | Event name lookup | Exact event name matters; semantic is insufficient |
| API Layer | Keyword Search | Procedure name lookup | Procedure names are exact strings |
| Database Schema | Hybrid | Keyword (table names) + semantic | Table lookups are exact; design rationale is semantic |
| ADRs | Semantic Search | Vector similarity | ADRs are referenced by concept, not exact name |
| Historical Decisions | Lazy Loading | On-demand | Rarely needed; heavy to pre-load |
| Performance Targets | On-Demand Loading | Manual | Only needed for performance optimization work |
| Deployment Config | On-Demand Loading | Manual | Only needed for DevOps tasks |

## 6.2 Retrieval Pipeline (Task 11 — Improved)

```
USER/AGENT REQUEST
        │
        ▼
1. INTENT CLASSIFICATION
   ├── Is this a product question? → Load CORE-004
   ├── Is this engineering? → Load CORE-003, CORE-005, APP-006, APP-007
   ├── Is this a domain question? → Proceed to domain classification
   ├── Is this a feature question? → Load UI-001 + feature spec
   └── Is this architectural? → Load all CORE-* + architect agent

        │
        ▼
2. ALWAYS-LOAD INJECTION
   ├── CORE-001 (Identity) — injected into every session
   ├── CORE-002 (Glossary) — injected into every session
   └── ROADMAP-001 (Phase Registry) — injected into every session
   [+ engineering-specific always-loads if engineering intent]
   [+ product-specific always-loads if product intent]

        │
        ▼
3. DOMAIN CLASSIFICATION (if domain/feature intent)
   ├── "opportunity" keywords → DOMAIN-002 + check if Application also needed
   ├── "application" keywords → DOMAIN-003 + DOMAIN-002 (co-load rule)
   ├── "goal" / "strategy" keywords → DOMAIN-001
   ├── "knowledge" / "reflection" keywords → DOMAIN-004
   ├── "organization" keywords → DOMAIN-005
   ├── "document" keywords → DOMAIN-006
   ├── "platform" / "auth" / "notification" keywords → DOMAIN-007
   └── "event" / "automation" keywords → DOMAIN-008 + APPLICATION-002

        │
        ▼
4. PHASE VALIDATION
   └── Does the requested feature/capability exist in current phase?
       → If YES: proceed
       → If NO: return "Deferred to Phase X — see ROADMAP-001"

        │
        ▼
5. CONTEXT ASSEMBLY
   ├── Always-load modules (pre-cached)
   ├── Domain modules (retrieved by classification)
   ├── Application modules (retrieved by task type)
   └── Feature spec (retrieved by exact feature name)

        │
        ▼
6. CO-LOAD VALIDATION
   └── Verify co-loading requirements are satisfied (e.g., DOMAIN-003 triggers DOMAIN-002)

        │
        ▼
7. KNOWLEDGE GAP CHECK
   └── Is the required module empty/missing?
       → If YES: alert + load nearest parent module + note gap
       → If NO: proceed

        │
        ▼
8. CONTEXT COMPRESSION
   └── Apply compression rules (see §15 Context Compression)
       [Never compress: domain invariants, state machine transitions, security rules]
       [Always compress: historical narrative, extended rationale]

        │
        ▼
9. REASON + RESPOND
        │
        ▼
10. OUTPUT VALIDATION
    └── Verify response does not:
        - Use non-canonical terminology (validate against CORE-002)
        - Reference deferred features as implemented (validate against ROADMAP-001)
        - Violate architectural principles (validate against CORE-003)
        - Violate domain invariants (validate against relevant DOMAIN-*)
```

## 6.3 Retrieval Quality Rules

| Rule | Description |
|---|---|
| RQ-001 | Never load feature spec without also loading its parent domain module |
| RQ-002 | Never load DOMAIN-003 without DOMAIN-002 |
| RQ-003 | Never load APPLICATION-001 without CORE-004 (AI must know product principles) |
| RQ-004 | Never load APPLICATION-002 without DOMAIN-008 |
| RQ-005 | Always validate retrieved content version against current canonical state |
| RQ-006 | Empty/placeholder modules must be flagged, not silently ignored |

---

# 7. Memory Architecture

## 7.1 Memory Tier Definitions (Task 14)

### Tier 0 — Permanent Memory

**What it is:** Facts that never change or change only with major version changes.

**Contents:**
- CORE-001 through CORE-005 (all core modules)
- ROADMAP-001 (phase registry)
- APPLICATION-006 (security architecture)
- APPLICATION-007 (tech stack)
- Canonical domain invariants (INV-001 through INV-010)
- Architecture principles (ARCH-001 through ARCH-008)

**When to use:** Injected automatically into every agent session, every context window.

**Never store:**
- Implementation details
- Feature-specific state
- User-generated data

---

### Tier 1 — Long-term Project Memory

**What it is:** Project-specific decisions and evolving architecture that accumulates over time.

**Contents:**
- Architecture Decision Records (ADRs)
- All DOMAIN-* modules
- All APPLICATION-* modules (except security and tech stack, which are Tier 0)
- Feature Index (F-001 through F-014)
- Ubiquitous Language additions
- Approved anti-patterns registry

**When to use:** Loaded at session start for relevant domains. Persisted between sessions.

**Storage format:** Markdown with YAML frontmatter (version, status, owner, last-modified)

**Never store:**
- Sprint-specific tasks (session memory)
- Draft/in-progress decisions (scratchpad until approved)

---

### Tier 2 — Session Memory

**What it is:** Context relevant to a specific work session (e.g., "implementing the opportunity workspace").

**Contents:**
- Current feature specification being implemented
- Current bounded context modules
- Recent error messages and debugging context
- Current agent conversation history
- Current test results

**When to use:** At session start, agent loads relevant Tier 0 + Tier 1 + current Tier 2 context.

**Expiry:** Cleared when session ends. Summarized into Tier 1 if decisions were made.

**Never store:**
- Personal user data
- Production database contents
- Secrets or API keys

---

### Tier 3 — Task Memory

**What it is:** Context for a single discrete task (e.g., "implement the captureOpportunity tRPC procedure").

**Contents:**
- Current file being modified
- Specific function/component being implemented
- Immediate test results
- Short-term context from previous tool call

**When to use:** Within a single implementation step. Discarded after task completion.

**Never store:**
- Architectural decisions (escalate to Tier 1 via ADR)
- Anything requiring persistence

---

### Tier 4 — Scratchpad

**What it is:** Temporary working memory for in-progress reasoning.

**Contents:**
- Draft plans being evaluated
- Alternative approaches being compared
- Temporary variable computations
- Prompt experiments (Prompt Engineering Agent)

**When to use:** Internal to a single reasoning step. Never persisted.

**Never store:**
- Anything that should influence future sessions

---

### Tier 5 — Conversation Context

**What it is:** The in-context window for the current agent turn.

**Contents:**
- Assembled context from all tiers
- Current turn's input
- In-progress response

**When to use:** Always — this is the active context window.

**Token budget allocation:**
```
Tier 0 (Always-load)     ~4,000 tokens   ~15%
Tier 1 (Domain modules)  ~6,000 tokens   ~23%
Tier 2 (Session)         ~4,000 tokens   ~15%
Tier 3 (Task)            ~2,000 tokens   ~8%
Tier 4 (Scratchpad)      ~3,000 tokens   ~12%
Response budget          ~7,000 tokens   ~27%
────────────────────────────────────────────
Total:                  ~26,000 tokens  100%
```

## 7.2 Memory — What Must Never Be Stored (Task 10)

| Never Store | Reason |
|---|---|
| Personal user data (CVs, reflections) | Privacy (SEC-002, SEC-003) |
| Production database contents | Security |
| API keys, secrets, tokens | Security (SEC-004) |
| Session tokens | Security |
| Agent reasoning traces about a specific user | Privacy |
| Unapproved design decisions | Governance (must go through ADR process) |
| Superseded/deprecated module versions | Clarity (causes confusion) |
| Vendor-specific implementation details that may change | Stability |

## 7.3 Memory — What Must Always Be Stored Permanently (Task 10)

| Always Store | Reason |
|---|---|
| Architecture Decision Records (ADRs) | Reversibility, accountability |
| Domain invariants (INV-001 through INV-*) | Never violate without ADR |
| Ubiquitous Language definitions | Consistency |
| Security principles (SEC-001 through SEC-007) | Safety |
| Phase registry | Scope control |
| Anti-patterns registry | Prevent recurring mistakes |
| Event catalog | All events must be documented |
| Tech stack prohibitions | Prevent prohibited tool adoption |
| Coding standard violations log | Pattern learning |

---

# 8. Documentation Architecture

## 8.1 Taxonomy & Folder Structure (Task 13)

```
docs/
├── 00-overview/                    # Project Identity Layer
│   ├── vision.md                   # What CareerOS IS + long-term direction
│   ├── glossary.md                 # Canonical ubiquitous language
│   ├── product-principles.md       # 18 guiding principles
│   └── roadmap.md                  # [EMPTY → high priority]
│
├── 01-product/                     # Product Layer
│   ├── PRD.md                      # Master product requirements (137KB)
│   ├── feature-index.md            # F-001 through F-014 catalog
│   ├── feature-specifications.md   # High-level feature specs
│   ├── feature-template.md         # Template for feature specs
│   ├── Feature Contract.md         # Feature promise system
│   ├── Feature Specification Standard.md
│   ├── user-personas.md            # 3 canonical personas
│   ├── user-stories.md             # Story catalog
│   ├── success-metrics.md          # North Star + core metrics
│   ├── product-insights.md         # Strategic product insights
│   ├── deferral-registry.md        # Explicitly deferred features
│   ├── jobs-to-be-done.md          # [EMPTY → medium priority]
│   ├── release-plan.md             # [EMPTY → medium priority]
│   └── features/                   # [ALL 14 EMPTY → CRITICAL PRIORITY]
│       ├── dashboard.md
│       ├── inbox.md
│       ├── opportunities.md
│       ├── applications.md
│       ├── organizations.md
│       ├── documents.md
│       ├── goals.md
│       ├── calendar.md
│       ├── knowledge.md
│       ├── analytics.md
│       ├── search.md
│       ├── ai-assistant.md
│       ├── notifications.md
│       └── settings.md
│
├── 02-design/                      # Design Layer [ALL EMPTY → HIGH PRIORITY]
│   ├── design-system.md
│   ├── ui-principles.md
│   ├── information-architecture.md
│   ├── navigation.md
│   ├── dashboard-spec.md
│   └── accessibility.md
│
├── 03-domain/                      # Domain Layer [WELL POPULATED]
│   ├── domain-model.md
│   ├── entities.md                 # CANONICAL — all entity definitions
│   ├── erd.md                      # Mermaid ERD diagrams
│   ├── state-machines.md           # CANONICAL — all lifecycle FSMs
│   └── workflows.md                # Multi-aggregate interaction sequences
│
├── 04-automation/                  # Automation Layer [WELL POPULATED]
│   ├── ai-features.md              # 5 AI capabilities
│   ├── automation-spec.md          # Deterministic automations
│   ├── capture-flow.md             # 3-entry capture pipeline
│   ├── integrations.md             # External service integration
│   └── notifications.md            # Notification strategy
│
├── 05-engineering/                 # Engineering Layer [WELL POPULATED]
│   ├── architecture.md             # System architecture document
│   ├── sad.md                      # System architecture document (v2)
│   ├── architectural-insights.md   # Design decisions DD-001–DD-005
│   ├── tech-stack.md               # CANONICAL — technology choices
│   ├── database.md                 # CANONICAL — physical schema
│   ├── api-design.md               # CANONICAL — tRPC router specs
│   ├── ecs.md                      # Event Catalog Specification
│   ├── security.md                 # CANONICAL — security architecture
│   └── deployment.md               # CI/CD and infrastructure
│
├── 06-quality/                     # Quality Layer [ALL EMPTY → HIGH PRIORITY]
│   ├── testing-strategy.md
│   ├── acceptance-criteria.md
│   ├── qa-checklists.md
│   └── bug-triage.md
│
├── 07-product-management/          # PM Layer [ALL EMPTY → MEDIUM PRIORITY]
│   ├── backlog.md
│   ├── sprint-plans.md
│   ├── decisions.md
│   ├── changelog.md
│   └── retrospective.md
│
└── 08-ux/                          # UX Layer [MOSTLY EMPTY → HIGH PRIORITY]
    ├── InformationArchitecture.md  # Has content
    ├── UXSpecification.md          # [EMPTY]
    ├── UserFlows.md                # [EMPTY]
    └── Wireframes.md               # [EMPTY]

# NEW FOLDERS TO CREATE:
├── 09-adr/                         # Architecture Decision Records [NEW]
│   ├── adr-template.md
│   ├── ADR-001-nextjs-app-router.md
│   ├── ADR-002-trpc-over-rest.md
│   ├── ADR-003-prisma-orm.md
│   ├── ADR-004-single-postgresql.md
│   ├── ADR-005-bounded-contexts.md
│   └── ADR-006-no-event-bus-alpha.md
│
├── 10-operations/                  # Operational Documentation [NEW]
│   ├── runbooks.md
│   ├── incident-response.md
│   ├── onboarding.md
│   └── ai-usage-policy.md
│
└── 11-ai/                          # AI-specific Documentation [NEW]
    ├── prompt-engineering-guide.md
    ├── agent-operating-manual.md
    ├── context-loading-policy.md
    └── memory-policy.md
```

## 8.2 Naming Conventions

| Convention | Rule | Example |
|---|---|---|
| Files | `kebab-case.md` | `state-machines.md`, `api-design.md` |
| Folders | `NN-lowercase-hyphen` | `03-domain/`, `09-adr/` |
| Context modules | `{scope}.ctx.md` | `opportunity.ctx.md` |
| ADRs | `ADR-NNN-{decision-name}.md` | `ADR-001-nextjs-app-router.md` |
| Feature specs | `{feature-name}.md` | `opportunities.md`, `dashboard.md` |

## 8.3 Frontmatter Standard

Every documentation file should include:

```yaml
---
id: DOMAIN-002
title: "Opportunity Domain"
status: canonical | draft | review | deprecated | archived
version: "1.0"
owner: "DDD Agent / Architect Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: high | medium | low
change_frequency: low | medium | high
consumers:
  - DDD Agent
  - Backend Agent
depends_on:
  - CORE-002
  - CORE-003
related:
  - DOMAIN-003 (Application — co-load required)
tags:
  - domain
  - opportunity
  - lifecycle
---
```

## 8.4 Versioning Strategy

| Level | Version | Trigger |
|---|---|---|
| MAJOR (x.0.0) | Breaking change to canonical definition | Renaming entity, removing invariant |
| MINOR (x.y.0) | Additive change | New attribute, new business rule |
| PATCH (x.y.z) | Correction | Typo, clarification |

Version history table at bottom of every canonical document.

## 8.5 Linking Strategy

```markdown
# Preferred: semantic cross-reference with ID
See: [DOMAIN-002 — Opportunity Domain](../03-domain/entities.md#21-1-opportunity)

# For canonical references
**Canonical source:** `docs/03-domain/state-machines.md` (§1 — Opportunity Lifecycle)

# For related concepts
**Related:** DOMAIN-003 (Application) — must be co-loaded
```

## 8.6 Indexing Strategy

Create a master index at `.agents/context/index.ctx.md`:
```
MODULE_ID | FILE | STATUS | STABILITY | ALWAYS_LOAD | VERSION
CORE-001  | core/identity/project.ctx.md | canonical | very-high | YES | 1.0
...
```

---

# 9. Missing Documents Registry

## 9.1 Critical Priority (Blocks AI Agent Operation)

| Document | Current Status | Why Critical | Owner | Load Strategy |
|---|---|---|---|---|
| Feature specs: `features/dashboard.md` through `features/settings.md` (14 files) | All empty | Frontend, UX, Testing, and PM agents cannot reason about specific features | PM Agent | Semantic retrieval |
| `06-quality/testing-strategy.md` | Empty | Testing Agent has no canonical testing approach | Testing Agent | Semantic retrieval |
| `09-adr/` (entire ADR directory) | Doesn't exist | 6 architectural decisions (AD-001–AD-006) documented only in SAD, not as formal ADRs | Architect Agent | On-demand |
| `11-ai/prompt-engineering-guide.md` | Doesn't exist | Prompt Engineering Agent has no canonical prompts or prompt standards | Prompt Engineering Agent | Dynamic load |
| `11-ai/agent-operating-manual.md` | Doesn't exist | No documented procedures for agent team coordination | Context Manager | Always loaded |
| `11-ai/context-loading-policy.md` | Doesn't exist | This architecture document exists but no formal policy | Context Manager | Always loaded |

## 9.2 High Priority (Degrades AI Agent Quality)

| Document | Current Status | Why Needed | Owner | When Needed |
|---|---|---|---|---|
| `02-design/design-system.md` | Empty | No canonical component system for Frontend Agent | UX Agent | Before Phase 1 UI work |
| `02-design/ui-principles.md` | Empty | No UI decision framework | UX Agent | Before Phase 1 UI work |
| `02-design/accessibility.md` | Empty | No accessibility standard | UX Agent | Before Phase 1 UI work |
| `08-ux/UXSpecification.md` | Empty | No user experience specification | UX Agent | Before Phase 1 UI work |
| `08-ux/UserFlows.md` | Empty | No user flow definitions | UX Agent | Before Phase 1 UI work |
| `06-quality/acceptance-criteria.md` | Empty | Testing Agent needs formal AC | Testing Agent | Before testing begins |
| `06-quality/qa-checklists.md` | Empty | No QA process | Testing Agent | Before QA begins |
| Coding Standards document | Doesn't exist (no `.agents/context/core/standards/`) | Backend/Frontend Agents need canonical code standards | Architect Agent | Before implementation begins |
| `11-ai/memory-policy.md` | Doesn't exist | Memory architecture defined here but no operational policy | Context Manager | Before agent team launches |

## 9.3 Medium Priority (Improves Long-term Maintainability)

| Document | Why Needed | Owner | Change Frequency |
|---|---|---|---|
| `07-product-management/decisions.md` | Track product decisions | PM Agent | High |
| `07-product-management/changelog.md` | Track product evolution | PM Agent | High |
| `07-product-management/sprint-plans.md` | Coordinate agent work | PM Agent | Very High |
| `01-product/jobs-to-be-done.md` | JTBD framework for feature design | PM Agent | Low |
| `10-operations/runbooks.md` | Operational procedures | DevOps Agent | Medium |
| `10-operations/incident-response.md` | Security incident procedures | Security Agent | Low |
| `10-operations/onboarding.md` | Developer onboarding | Documentation Agent | Low |
| `10-operations/ai-usage-policy.md` | How AI is used in the product | Architect Agent | Low |
| Error Catalog | Typed error definitions beyond 5 tRPC codes | Backend Agent | Medium |
| API Design Guidelines (extended) | Pattern library beyond tRPC routers | Backend Agent | Low |

## 9.4 Document Creation Order (Implementation Roadmap for Docs)

```
Week 1:
  - context-loading-policy.md (enables agent team)
  - agent-operating-manual.md (enables agent team)
  - coding-standards.ctx.md (enables engineering agents)
  - memory-policy.md (enables memory system)

Week 2:
  - features/dashboard.md (F-001) — Phase 1 critical path
  - features/inbox.md (F-002) — Phase 1 critical path
  - features/opportunities.md (F-003) — Phase 1 critical path
  - features/applications.md (F-004) — Phase 1 critical path
  - testing-strategy.md

Week 3:
  - 02-design/design-system.md
  - 02-design/ui-principles.md
  - 08-ux/UXSpecification.md
  - 08-ux/UserFlows.md
  - ADR-001 through ADR-006

Week 4:
  - features/documents.md (F-006)
  - features/search.md (F-011)
  - features/settings.md (F-014)
  - prompt-engineering-guide.md
  - acceptance-criteria.md

Ongoing:
  - features/organizations.md, goals.md, calendar.md, knowledge.md (Phase 2)
  - analytics.md, ai-assistant.md (Phase 3)
```

---

# 10. Canonical File Structure

## 10.1 Context Architecture File Location

```
.agents/
└── context/
    ├── index.ctx.md                    # Master module registry
    │
    ├── core/                           # Always-loaded, permanent
    │   ├── identity/
    │   │   └── project.ctx.md          # CORE-001
    │   ├── language/
    │   │   └── glossary.ctx.md         # CORE-002
    │   ├── architecture/
    │   │   └── principles.ctx.md       # CORE-003
    │   ├── product/
    │   │   └── principles.ctx.md       # CORE-004
    │   └── standards/
    │       └── coding-standards.ctx.md # CORE-005
    │
    ├── domain/                         # Dynamically loaded
    │   ├── strategy/
    │   │   └── strategy.ctx.md         # DOMAIN-001
    │   ├── opportunity/
    │   │   └── opportunity.ctx.md      # DOMAIN-002
    │   ├── application/
    │   │   └── application.ctx.md      # DOMAIN-003
    │   ├── knowledge/
    │   │   └── knowledge.ctx.md        # DOMAIN-004
    │   ├── organization/
    │   │   └── organization.ctx.md     # DOMAIN-005
    │   ├── document/
    │   │   └── document.ctx.md         # DOMAIN-006
    │   ├── platform/
    │   │   └── platform.ctx.md         # DOMAIN-007
    │   └── events/
    │       └── event-catalog.ctx.md    # DOMAIN-008
    │
    ├── application/                    # Session-loaded
    │   ├── intelligence/
    │   │   └── intelligence.ctx.md     # APPLICATION-001
    │   ├── automation/
    │   │   └── automation.ctx.md       # APPLICATION-002
    │   ├── analytics/
    │   │   └── analytics.ctx.md        # APPLICATION-003
    │   ├── api/
    │   │   └── api-layer.ctx.md        # APPLICATION-004
    │   ├── database/
    │   │   └── schema.ctx.md           # APPLICATION-005
    │   ├── security/
    │   │   └── security.ctx.md         # APPLICATION-006
    │   └── infrastructure/
    │       ├── tech-stack.ctx.md       # APPLICATION-007
    │       └── deployment.ctx.md       # APPLICATION-008
    │
    ├── feature/                        # Task-loaded
    │   ├── dashboard/
    │   │   └── spec.ctx.md             # FEATURE-001
    │   ├── inbox/
    │   │   └── spec.ctx.md             # FEATURE-002
    │   ├── opportunities/
    │   │   └── spec.ctx.md             # FEATURE-003
    │   ├── applications/
    │   │   └── spec.ctx.md             # FEATURE-004
    │   ├── organizations/
    │   │   └── spec.ctx.md             # FEATURE-005
    │   ├── documents/
    │   │   └── spec.ctx.md             # FEATURE-006
    │   ├── goals/
    │   │   └── spec.ctx.md             # FEATURE-007
    │   ├── calendar/
    │   │   └── spec.ctx.md             # FEATURE-008
    │   ├── knowledge/
    │   │   └── spec.ctx.md             # FEATURE-009
    │   ├── analytics/
    │   │   └── spec.ctx.md             # FEATURE-010
    │   ├── search/
    │   │   └── spec.ctx.md             # FEATURE-011
    │   ├── ai-assistant/
    │   │   └── spec.ctx.md             # FEATURE-012
    │   ├── notifications/
    │   │   └── spec.ctx.md             # FEATURE-013
    │   └── settings/
    │       └── spec.ctx.md             # FEATURE-014
    │
    ├── ui/                             # UI/UX context
    │   ├── ia/
    │   │   └── information-architecture.ctx.md  # UI-001
    │   └── design/
    │       └── design-system.ctx.md             # UI-002 [TO CREATE]
    │
    └── product/                        # Product context
        ├── personas/
        │   └── personas.ctx.md         # ORGANIZATION-001
        └── roadmap/
            └── phase-registry.ctx.md   # ROADMAP-001
```

---

# 11. Loading Policies

## 11.1 Context Packages (Task 7)

### Package: Opportunity Package

**When to load:** Any agent session involving opportunity features, capture, or evaluation.

**Contains:**
- CORE-001, CORE-002, CORE-003, CORE-005
- DOMAIN-002 (Opportunity Domain)
- DOMAIN-005 (Organization Domain)
- DOMAIN-008 (Events — opportunity events)
- APPLICATION-002 (Automation — opportunity automations)
- FEATURE-003 (Opportunity spec) — if implementing
- FEATURE-002 (Inbox spec) — if implementing capture

**Why this package exists:** Opportunity is the primary user-facing entity. Its lifecycle (CAPTURED → EVALUATING → ACTIONED) intersects with Organization (auto-link), Automation (temporal rules), Events (OpportunityCaptured through OpportunityActioned), and the Inbox (entry point). These 7 items always need to be co-present for accurate opportunity reasoning.

**Total estimated tokens:** ~8,000–12,000 tokens

---

### Package: Application Package

**When to load:** Any agent session involving application tracking, submission, or outcome processing.

**Contains:**
- CORE-001, CORE-002, CORE-003, CORE-005
- DOMAIN-002 (Opportunity — required co-load via XAG-001)
- DOMAIN-003 (Application Domain)
- DOMAIN-004 (Knowledge — reflection triggers via APP-004)
- DOMAIN-008 (Events — application events)
- APPLICATION-002 (Automation — application automations)
- FEATURE-004 (Application spec) — if implementing

**Why this package exists:** Application lifecycle cannot be reasoned about in isolation. XAG-001 through XAG-005 create mandatory dependencies on Opportunity and Knowledge contexts. The reflection trigger (APP-004) requires Knowledge domain. All 3 domains must be co-present.

**Total estimated tokens:** ~12,000–16,000 tokens

---

### Package: Knowledge & Reflection Package

**When to load:** Any agent session involving reflections, knowledge entries, or compounding.

**Contains:**
- CORE-001, CORE-002, CORE-004
- DOMAIN-004 (Knowledge Domain)
- DOMAIN-003 (Application — reflection source)
- APPLICATION-001 (Intelligence — Reflection Synthesis AI feature)
- FEATURE-009 (Knowledge spec) — if implementing

**Why this package exists:** The knowledge compounding cycle (Application outcome → Reflection → KnowledgeEntry → Career Capital) requires all 3 contexts. The AI Reflection Synthesis feature operates on raw reflection notes, requiring the Intelligence module to be present.

---

### Package: Strategy & Goals Package

**When to load:** Any agent session involving goals, missions, or career capital.

**Contains:**
- CORE-001, CORE-002, CORE-004
- DOMAIN-001 (Strategy Domain)
- DOMAIN-002 (Opportunity — strategic alignment score, XAG-004)
- APPLICATION-003 (Analytics — career capital metrics)
- FEATURE-007 (Goals spec) — if implementing

**Why this package exists:** Strategy reasoning always involves the relationship between Goals and Opportunities (XAG-004). Career Capital tracking spans both domain and analytics.

---

### Package: AI Intelligence Package

**When to load:** Any agent session involving AI feature implementation or review.

**Contains:**
- CORE-001, CORE-002, CORE-004 (especially P-004, P-016)
- APPLICATION-001 (Intelligence Engine — ALWAYS full fidelity)
- APPLICATION-006 (Security — AI privacy section)
- DOMAIN-002, DOMAIN-003, DOMAIN-004 (AI operates on these)
- Prompt Engineering Guide (when writing prompts)

**Why this package exists:** AI ethical constraints must ALL be present simultaneously. Missing any one of them allows hallucination, missing explainability, or bypassing user approval requirements. Security (AI privacy section) is also required since AI processes confidential career data.

---

### Package: Security & Compliance Package

**When to load:** Any agent session involving auth, authorization, or security review.

**Contains:**
- APPLICATION-006 (Security Architecture — full fidelity)
- DOMAIN-007 (Platform — Activity audit trail)
- APPLICATION-005 (Database — data retention)
- APPLICATION-007 (Tech Stack — for understanding deployment security posture)

**Why this package exists:** Security review requires simultaneous view of authentication (NextAuth.js), authorization (`WHERE user_id = ?`), encryption (AES-256-GCM), audit trail (Activity table), and retention policy. Missing any one creates a security gap.

---

### Package: Engineering Bootstrap Package

**When to load:** At the start of every engineering agent session.

**Contains:**
- CORE-001, CORE-002, CORE-003, CORE-005
- APPLICATION-006, APPLICATION-007
- ROADMAP-001

**Why this package exists:** This is the minimum viable context for any engineering work. Any engineering agent working without these 7 modules will produce inconsistent, possibly security-violating, or phase-inappropriate code.

**Total estimated tokens:** ~6,000–8,000 tokens

---

## 11.2 Context Level System (Task 5)

### Level 0 — Permanent Session Context

**Always injected. Never removed.**

```
CORE-001  (Project Identity)
CORE-002  (Glossary)
ROADMAP-001 (Phase Registry)
APPLICATION-006 (Security — for engineering sessions)
APPLICATION-007 (Tech Stack — for engineering sessions)
```

**Why:** These 5 modules cost ~3,000–5,000 tokens but prevent categorical reasoning errors. The return on investment is near-infinite.

**How context moves to L0:** A module is promoted to L0 when omitting it causes systematic agent errors.

---

### Level 1 — Current Feature/Domain Context

**Loaded when task is identified.**

```
Current DOMAIN-* package (e.g., Opportunity Package)
Current FEATURE-* spec (e.g., FEATURE-003 for opportunity workspace)
CORE-003 (Architecture Principles — for engineering)
CORE-004 (Product Principles — for product work)
CORE-005 (Coding Standards — for implementation)
```

**How context moves to L1:** When a feature or domain is identified as the primary work target, its package is assembled and injected.

**How context moves OUT of L1:** When the task changes to a different feature/domain, L1 is swapped (not accumulated).

---

### Level 2 — Related/Neighboring Context

**Loaded when cross-context reasoning is needed.**

```
Co-load requirements (e.g., DOMAIN-002 when DOMAIN-003 is loaded)
Related feature specs (e.g., FEATURE-002 Inbox when implementing FEATURE-003 Opportunity)
APPLICATION-* module for the current implementation concern
```

**How context moves to L2:** When a reasoning step requires cross-context information (e.g., implementing an event handler requires both the source domain and the event catalog).

**How context moves OUT of L2:** After the cross-context step is complete. L2 is more volatile than L1.

---

### Level 3 — Historical/Archived Context

**Loaded only when explicitly needed.**

```
ADRs (when reviewing why a decision was made)
Sprint plans (when checking historical sprint context)
Changelog (when tracking feature evolution)
Old feature iterations (when understanding historical decisions)
Deprecated module versions (when tracing breaking changes)
```

**How context moves to L3:** Historical documents that are rarely consulted but must be accessible when needed.

**How context moves INTO L3 from L1/L2:** When a document is superseded or archived, it moves from L1/L2 to L3.

---

# 12. Retrieval Policies

## 12.1 Keyword → Module Mapping

| Keyword Pattern | Load Module |
|---|---|
| "opportunity", "capture", "inbox", "CAPTURED", "EVALUATING", "ACTIONED" | DOMAIN-002 |
| "application", "submit", "interview", "DRAFTING", "SUBMITTED", "INTERVIEWING" | DOMAIN-003 + DOMAIN-002 |
| "goal", "mission", "vision", "milestone", "career capital", "strategy" | DOMAIN-001 |
| "reflection", "knowledge entry", "knowledge compounding", "decision journal" | DOMAIN-004 |
| "organization", "company", "institution", "university" | DOMAIN-005 |
| "document", "CV", "resume", "upload", "version", "attachment" | DOMAIN-006 |
| "auth", "session", "user", "notification", "reminder", "calendar event" | DOMAIN-007 |
| "event", "EventCatalog", "OpportunityCaptured", "ApplicationSubmitted", "correlation" | DOMAIN-008 |
| "AI", "intelligence", "extract", "RAG", "embedding", "hallucin" | APPLICATION-001 |
| "automation", "auto-create", "temporal", "idempotent", "circuit breaker" | APPLICATION-002 |
| "analytics", "metric", "career capital growth", "funnel", "conversion rate" | APPLICATION-003 |
| "tRPC", "router", "procedure", "API", "Zod", "endpoint" | APPLICATION-004 |
| "schema", "table", "Prisma", "migration", "foreign key", "index", "enum" | APPLICATION-005 |
| "security", "auth", "token", "CORS", "CSP", "rate limit", "encryption" | APPLICATION-006 |
| "Next.js", "React", "TypeScript", "shadcn", "Tailwind", "Neon", "Vercel", "OpenAI" | APPLICATION-007 |
| "deploy", "CI/CD", "environment variable", "preview", "production", "backup" | APPLICATION-008 |
| "dashboard", "F-001" | FEATURE-001 + UI-001 |
| "inbox", "quick capture", "F-002" | FEATURE-002 + DOMAIN-002 |
| "design system", "component", "color", "typography", "spacing" | UI-002 |
| "persona", "user", "Strategic Starter", "Intentional Pivot", "Serial Achiever" | ORGANIZATION-001 |
| "Phase 1", "MVP", "alpha", "Phase 2", "Phase 3", "deferred" | ROADMAP-001 |

## 12.2 Anti-retrieval Rules (Never Load Together)

| Rule | Reason |
|---|---|
| Do NOT load APPLICATION-001 (AI) without APPLICATION-006 (Security) | AI processes confidential data — privacy rules must be co-present |
| Do NOT load APPLICATION-002 (Automation) without DOMAIN-008 (Events) | Automations are triggered by events — catalog must be co-present |
| Do NOT load DOMAIN-003 (Application) without DOMAIN-002 (Opportunity) | XAG-001/XAG-002 cross-aggregate rules cannot be evaluated without both |
| Do NOT load FEATURE-* without the parent DOMAIN-* | Feature reasoning without domain rules leads to business rule violations |
| Do NOT load APPLICATION-005 (Database) alone for domain questions | Database is implementation; domain model (DOMAIN-*) defines the truth |

---

# 13. Validation Policies

## 13.1 Documentation Validation (Task 16)

### Conflict Detection

**Trigger:** When any canonical document is updated.

**Validation rules:**

| Rule | Description | Detection Method |
|---|---|---|
| CV-001 | No entity definition in `entities.md` contradicts `glossary.md` | Semantic similarity scan on all entity names |
| CV-002 | No state in `database.md` enums contradicts `state-machines.md` | Exact string match on enum values |
| CV-003 | No API procedure in `api-design.md` contradicts domain rules | Cross-reference procedure → domain entity → business rules |
| CV-004 | No automation in `automation-spec.md` contradicts `state-machines.md` | Cross-reference trigger states against valid FSM states |
| CV-005 | No feature spec contradicts product principles | Semantic scan against P-001 through P-018 |
| CV-006 | No event name in `ecs.md` uses command tense | Regex: event names must be past tense (OpportunityCreated, not CreateOpportunity) |
| CV-007 | No tech stack addition contradicts explicit prohibitions | Keyword match against prohibition list in tech-stack.md |

### Staleness Detection

**Trigger:** Periodic scan (weekly) + on any commit to docs/.

| Rule | Description |
|---|---|
| ST-001 | Docs referencing "Phase 1" items for features deferred to Phase 2+ |
| ST-002 | Version numbers in entity definitions older than 90 days (prompt for review) |
| ST-003 | Empty placeholder files that have been empty for >30 days (escalate to owner) |
| ST-004 | ADRs without implementation evidence in codebase |

### Duplicate Detection

| Rule | Description |
|---|---|
| DU-001 | Same entity attribute defined in both `entities.md` AND `database.md` with different values |
| DU-002 | Same business rule expressed in both `state-machines.md` AND `automation-spec.md` |
| DU-003 | Same term defined differently in `glossary.md` vs `entities.md` |
| DU-004 | Same API endpoint described in both `api-design.md` AND a feature spec |

### Missing Documentation Detection

| Rule | Trigger | Action |
|---|---|---|
| MISS-001 | Feature in Feature Index has no corresponding spec | Alert PM Agent |
| MISS-002 | Domain event in ECS has no handler in `ecs.md` event consumers | Alert DDD Agent |
| MISS-003 | New entity added without state machine definition | Block implementation |
| MISS-004 | New automation added without audit record specification | Block implementation |

### Broken Reference Detection

| Rule | Description |
|---|---|
| BR-001 | Cross-reference to `state-machines.md §X` where §X doesn't exist |
| BR-002 | Reference to `INV-NNN` that doesn't exist in `entities.md` |
| BR-003 | Reference to `ARCH-NNN` that doesn't exist in `architecture.md` |
| BR-004 | Reference to `P-NNN` that doesn't exist in `product-principles.md` |

## 13.2 Validation Workflow

```
Document updated
      │
      ▼
1. Syntax validation (YAML frontmatter well-formed)
      │
      ▼
2. Cross-reference validation (all BR-* rules)
      │
      ▼
3. Conflict detection (all CV-* rules)
      │
      ▼
4. Duplicate detection (all DU-* rules)
      │
      ▼
5. Staleness check (all ST-* rules)
      │
      ▼
6. Missing documentation alert (all MISS-* rules)
      │
      ▼
7. Terminology validation (all terms match CORE-002)
      │
      ▼
8. Generate validation report
      ├── PASS → merge allowed
      └── FAIL → block merge + notify relevant agent
```

## 13.3 Agent Validation Behaviors Per Knowledge Lifecycle Stage (Task 12)

| Stage | Agent Behavior |
|---|---|
| DRAFT | Can reference, cannot rely upon. Must note: "Using draft: {document}; may change" |
| REVIEW | Can use but must note pending review. Escalate conflicts to Architect Agent |
| APPROVED (Canonical) | Full reliance. Reference by ID. No caveats needed |
| DEPRECATED | Alert user/agent. Recommend canonical replacement. Do not use for new decisions |
| ARCHIVED | Do not load unless specifically requested for historical research (Level 3 only) |
| DELETED | Must not reference. If encountered in codebase, flag for removal |

### Knowledge Lifecycle Transitions

```
DRAFT → REVIEW:        Author submits for review; notify relevant agent owners
REVIEW → APPROVED:     Architect Agent or designated owner approves; version locked
APPROVED → DEPRECATED: New superseding document exists; old marked DEPRECATED with redirect
DEPRECATED → ARCHIVED: After 90 days of deprecation; moved to /archive/
ARCHIVED → DELETED:    After 1 year of archival (or by explicit decision)
```

---

# 14. Evolution Strategy

## 14.1 Context Compression Policies (Task 15)

### What Should ALWAYS Be Summarized

| Content Type | Compression Strategy |
|---|---|
| Extended rationale/narrative in docs | Compress to one-line principle ID (e.g., "See P-004") |
| Example code in docs | Replace with type signature + behavior description |
| Meeting notes and discussion | Extract only decisions; discard deliberation |
| Sprint retrospectives | Extract only learnings; discard process details |
| PRD chapters duplicated in modules | Keep module version; cross-reference PRD for full fidelity |
| Historical version history | Keep latest + last major version only |

### What Should NEVER Be Summarized

| Content Type | Reason |
|---|---|
| Domain invariants (INV-001 through INV-010) | Invariants are binary — partial knowledge is dangerous |
| State machine transitions with side effects | Missing a side effect causes data integrity issues |
| Security rules (SEC-001 through SEC-007) | Security by design requires complete rules |
| Cross-aggregate rules (XAG-001 through XAG-005) | These prevent atomic consistency bugs |
| AI ethical constraints | Partial ethical rules enable harmful AI behavior |
| Event envelope definition | Events must be reproduced exactly — no summarization |
| Authorization rules (WHERE user_id = ?) | Data isolation must never be partial |

### What Deserves Full Fidelity Forever

| Content | Location |
|---|---|
| All state machine FSM definitions | `docs/03-domain/state-machines.md` |
| All domain invariants | `docs/03-domain/entities.md` |
| Complete event catalog | `docs/05-engineering/ecs.md` |
| Security architecture | `docs/05-engineering/security.md` |
| Complete database schema | `docs/05-engineering/database.md` |
| All product principles | `docs/00-overview/product-principles.md` |
| All glossary definitions | `docs/00-overview/glossary.md` |
| All ADRs | `docs/09-adr/*.md` |

## 14.2 Architecture Evolution Rules

### When Modules Should Split

| Trigger | Action |
|---|---|
| Module exceeds 4,000 tokens regularly | Split by sub-domain or concern |
| Module consumed by agents with incompatible knowledge domains | Split so each agent loads only what it needs |
| Module contains both stable and volatile content | Split stable → CORE or Tier 0; volatile → dynamic load |

### When Modules Should Merge

| Trigger | Action |
|---|---|
| Two modules always loaded together (100% co-occurrence) | Merge into single module |
| Module under 300 tokens | Merge into parent module |
| Splitting causes circular dependency | Merge and identify the shared concept |

### Module Promotion Rules

| From | To | Trigger |
|---|---|---|
| L3 (Historical) | L2 (Related) | Referenced in current sprint context |
| L2 (Related) | L1 (Current) | Becomes primary work area |
| L1 (Current) | L0 (Permanent) | Systematic errors occur when not loaded |
| L0 (Permanent) | L1 (Current) | Becomes too large for permanent loading; split first |

---

# 15. Implementation Roadmap

## 15.1 Phase 1 — Context Foundation (Weeks 1–2)

**Goal:** Minimum viable context system for engineering agents to operate correctly.

| Task | Owner | Output |
|---|---|---|
| Create `.agents/context/` directory structure | Context Manager | Empty folder tree |
| Write CORE-001 (Project Identity) | Architect Agent | `core/identity/project.ctx.md` |
| Write CORE-002 (Glossary) — derived from `glossary.md` | DDD Agent | `core/language/glossary.ctx.md` |
| Write CORE-003 (Architecture Principles) | Architect Agent | `core/architecture/principles.ctx.md` |
| Write CORE-004 (Product Principles) | PM Agent | `core/product/principles.ctx.md` |
| Write CORE-005 (Coding Standards) | Architect Agent | `core/standards/coding-standards.ctx.md` |
| Write ROADMAP-001 (Phase Registry) | PM Agent | `product/roadmap/phase-registry.ctx.md` |
| Write APPLICATION-006 (Security Architecture) — derived from `security.md` | Security Agent | `application/security/security.ctx.md` |
| Write APPLICATION-007 (Tech Stack) — derived from `tech-stack.md` | Architect Agent | `application/infrastructure/tech-stack.ctx.md` |
| Write `context-loading-policy.md` | Context Manager | `.agents/context/11-ai/context-loading-policy.ctx.md` |
| Write `agent-operating-manual.md` | Context Manager | `.agents/context/11-ai/agent-operating-manual.ctx.md` |

**Total new tokens created:** ~12,000–16,000  
**Unblocks:** All engineering agents

---

## 15.2 Phase 2 — Domain Context (Weeks 3–4)

**Goal:** All domain modules populated so domain reasoning is accurate.

| Task | Owner | Output |
|---|---|---|
| Write DOMAIN-001 (Strategy) | DDD Agent | `domain/strategy/strategy.ctx.md` |
| Write DOMAIN-002 (Opportunity) | DDD Agent | `domain/opportunity/opportunity.ctx.md` |
| Write DOMAIN-003 (Application) | DDD Agent | `domain/application/application.ctx.md` |
| Write DOMAIN-004 (Knowledge) | DDD Agent | `domain/knowledge/knowledge.ctx.md` |
| Write DOMAIN-005 (Organization) | DDD Agent | `domain/organization/organization.ctx.md` |
| Write DOMAIN-006 (Document) | DDD Agent | `domain/document/document.ctx.md` |
| Write DOMAIN-007 (Platform) | DDD Agent | `domain/platform/platform.ctx.md` |
| Write DOMAIN-008 (Event Catalog) | DDD Agent | `domain/events/event-catalog.ctx.md` |
| Write APPLICATION-001 (Intelligence) | AI Agent | `application/intelligence/intelligence.ctx.md` |
| Write APPLICATION-002 (Automation) | Automation Agent | `application/automation/automation.ctx.md` |
| Write APPLICATION-004 (API Layer) | Backend Agent | `application/api/api-layer.ctx.md` |
| Write APPLICATION-005 (Database) | Database Agent | `application/database/schema.ctx.md` |
| Write ORGANIZATION-001 (Personas) | PM Agent | `product/personas/personas.ctx.md` |
| Write UI-001 (IA) — derived from `InformationArchitecture.md` | UX Agent | `ui/ia/information-architecture.ctx.md` |

**Unblocks:** DDD Agent, AI Agent, Automation Agent, full reasoning quality

---

## 15.3 Phase 3 — Feature Context (Weeks 5–8)

**Goal:** All Phase 1 feature specs written and available for frontend/testing agents.

| Task | Owner | Priority |
|---|---|---|
| Write FEATURE-001 (Dashboard) | PM Agent + UX Agent | CRITICAL (Phase 1) |
| Write FEATURE-002 (Inbox) | PM Agent + UX Agent | CRITICAL (Phase 1) |
| Write FEATURE-003 (Opportunities) | PM Agent + UX Agent | CRITICAL (Phase 1) |
| Write FEATURE-004 (Applications) | PM Agent + UX Agent | CRITICAL (Phase 1) |
| Write FEATURE-006 (Documents) | PM Agent + UX Agent | HIGH (Phase 1) |
| Write FEATURE-011 (Search) | PM Agent + UX Agent | HIGH (Phase 1) |
| Write FEATURE-014 (Settings) | PM Agent + UX Agent | HIGH (Phase 1) |
| Write 6 ADRs (AD-001 through AD-006) | Architect Agent | HIGH |
| Write testing strategy | Testing Agent | HIGH |
| Write QA checklists | Testing Agent | HIGH |
| Write design system | UX Agent | HIGH |
| Write UX specifications | UX Agent | HIGH |
| Write prompt engineering guide | Prompt Engineering Agent | MEDIUM |

**Unblocks:** Frontend Agent, Testing Agent, UX Agent

---

## 15.4 Phase 4 — Validation & Operations (Weeks 9–12)

**Goal:** Context validation system active, operational documentation complete.

| Task | Owner |
|---|---|
| Implement context validation scripts | Context Manager |
| Write operational runbooks | DevOps Agent |
| Write incident response guide | Security Agent |
| Write developer onboarding guide | Documentation Agent |
| Write AI usage policy | Architect Agent |
| Write memory policy | Context Manager |
| Fill Phase 2+ feature specs (F-005, F-007–F-013) | PM Agent |
| Populate 07-product-management/ files | PM Agent |

---

# 16. Final Recommendations

## 16.1 Top 10 Highest-Impact Recommendations

### REC-001 — Implement the 9-module always-load set immediately

The 9 modules (CORE-001 through CORE-005, APPLICATION-006, APPLICATION-007, ROADMAP-001, APPLICATION-006) represent ~5,000–8,000 tokens and prevent the most common category of agent errors: scope creep, security violations, wrong tech stack suggestions, and terminology drift. Create these first.

### REC-002 — Treat DOMAIN-003 + DOMAIN-002 as an atomic unit

The cross-aggregate rules XAG-001 through XAG-005 make Application reasoning impossible without Opportunity context. Any agent working on Application features without Opportunity context will produce incorrect implementations. Enforce this in the context loading policy.

### REC-003 — Never load APPLICATION-001 (Intelligence) without APPLICATION-006 (Security)

AI features process confidential career data (CVs, reflections, essays). Any AI implementation without the security privacy section present risks GDPR violations, data leakage, or inappropriate data use. This must be a hard rule in the agent operating manual.

### REC-004 — Treat the 26 empty files as a project risk, not a documentation backlog

Empty placeholder files create silent knowledge gaps. An agent reading the file structure assumes completeness. The Context Manager must flag empty files to any agent that would otherwise rely on them, and the PM Agent must prioritize filling Phase 1 feature specs before implementation begins.

### REC-005 — Create Architecture Decision Records for AD-001 through AD-006 before any refactoring

The 6 architectural decisions (Next.js App Router, tRPC, Prisma, single database, bounded contexts, no event bus) are documented only in sad.md narratively. Without formal ADRs, a Refactoring Agent or new contributor will make decisions that contradict them. ADRs provide immutable decision rationale.

### REC-006 — Implement the co-load validation in the retrieval pipeline before agent team launch

The retrieval pipeline (§6.2) must include Step 6 (Co-load Validation) as an automated check. Without it, agents will occasionally load DOMAIN-003 without DOMAIN-002, producing subtle cross-aggregate rule violations that are hard to detect at review time.

### REC-007 — Distinguish deterministic automations from AI features at every level

APPLICATION-001 and APPLICATION-002 must be maintained as strictly separate modules. Mixing probabilistic AI reasoning with deterministic automation rules leads to agents implementing "smart automations" that violate P-016 (Explain Before You Automate) or that don't produce audit records. The distinction is architecturally fundamental.

### REC-008 — The Event Catalog (DOMAIN-008) should be the first module validated on every PR

Events are immutable business facts. An incorrectly named event (command tense instead of past tense) or a missing correlation ID creates downstream problems that are expensive to fix. Validation Rule CV-006 should run on every commit to `ecs.md`.

### REC-009 — Version the context modules independently from the product version

Context modules should have their own semantic versions separate from the product release version. A context module version bump tells the Context Manager to re-validate all dependent agents' cached context. Use the frontmatter `version` field introduced in §8.3.

### REC-010 — Budget 23–27% of context window for agent response generation

The token budget allocation in §7.1 allocates ~7,000 of 26,000 tokens for response generation. This is the minimum for high-quality engineering output. If context grows beyond budget, compress Tier 2/3 first, then Tier 1 (compress rationale, not rules). Never compress Tier 0.

## 16.2 Architecture Anti-Patterns to Prevent

| Anti-Pattern | Prevention |
|---|---|
| Loading full 137KB PRD as context | Context must be decomposed into retrievable modules |
| Assuming empty files are complete | Context Manager must flag empty files explicitly |
| Conflating AI features with automations | Separate modules + separate agents with different always-loads |
| Loading all domain modules simultaneously | Use context packages; load only relevant domains |
| Forgetting cross-aggregate rules | DOMAIN-003 co-load enforcement for Application |
| Adding features from future phases | ROADMAP-001 always loaded; phase validation in pipeline |
| Writing prompts without ethical constraints | AI Agent always loads APPLICATION-001 + APPLICATION-006 |
| Reasoning about state without FSM | Domain modules include FSM definitions |
| Trusting outdated module versions | Frontmatter version + periodic validation |
| Building without this architecture | Implement Phase 1 context foundation before code |

## 16.3 The Fundamental Truth

> The quality of AI-assisted software engineering on CareerOS is bounded by the quality of its context architecture. Every bug, every wrong decision, every inconsistency produced by an AI agent can be traced to a missing, conflicting, or improperly loaded context module. This document IS the product-quality guarantee for the next 5–10 years of AI-assisted CareerOS development.

---

**End of CareerOS Context Engineering Architecture v1.0**

*Designed for: AI Reasoning Accuracy, Not Human Reading*  
*Created: 2026-07-18*  
*Owner: Architect Agent / Context Manager*  
*Status: Canonical*  
*Next Review: After Phase 2 launch*
