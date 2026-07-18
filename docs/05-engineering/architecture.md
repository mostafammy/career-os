# System Architecture Document (SAD)

**File:** `docs/05-engineering/architecture.md`

---

# System Architecture Document

**Status:** Canonical
**Version:** 1.0

---

## 1. Purpose

This document defines the logical architecture of CareerOS.

It describes:

- System decomposition
- Architectural boundaries
- Domain collaboration
- Module responsibilities
- Communication patterns
- Event flow
- Infrastructure independence

The architecture shall remain stable regardless of implementation technology.

---

## 2. Architectural Philosophy

CareerOS is not a monolithic CRUD application. It is a **domain-driven system** composed of bounded contexts that communicate through domain events.

The architecture is designed for:

- **Longevity** — the system should evolve for decades without losing conceptual integrity
- **Independence** — each bounded context can evolve, be tested, and potentially be deployed independently
- **Extensibility** — new capabilities (AI, integrations, collaboration) should integrate without major architectural changes
- **Observability** — every meaningful state change is an event that can be traced, audited, and reasoned about

---

## 3. Architectural Principles

| ID | Principle | Rationale |
|---|---|---|
| ARCH-001 | **Domain Independence** — The domain layer cannot import infrastructure code. | Ensures business rules remain testable and technology-agnostic. |
| ARCH-002 | **Bounded Context Isolation** — Each context owns its language, rules, and models. | Prevents a monolithic domain model from becoming unmanageable. |
| ARCH-003 | **Event-Driven Communication** — Contexts communicate through domain events, not direct method calls. | Enables loose coupling and future extensibility. |
| ARCH-004 | **CQRS-ready** — Commands and Queries are separated at the application layer. | Optimizes read and write models independently. |
| ARCH-005 | **Single Responsibility** — Every module has one reason to change. | Reduces blast radius of changes. |
| ARCH-006 | **Dependency Inversion** — High-level modules do not depend on low-level modules. Both depend on abstractions. | Enables provider swapping (AI, storage, calendar). |
| ARCH-007 | **Fail Independently** — Every subsystem should fail independently where possible. | Prevents cascading failures. |
| ARCH-008 | **Simplicity Over Cleverness** — Architecture should prioritize simplicity over unnecessary complexity. | Ensures maintainability by future contributors. |

---

## 4. Domain Context Map

CareerOS is divided into five bounded contexts. Each context owns its language, rules, and models. Cross-context relationships are implemented as loose references (IDs), not strong database foreign keys.

```
                        CareerOS
                             │
     ┌───────────────────────┼────────────────────────┐
     │                       │                        │
     ▼                       ▼                        ▼
 Strategy Context      Opportunity Context     Knowledge Context
 (Vision, Goals,      (Inbox, Opportunities,  (Reflections, Documents,
  Milestones,          Applications,            Knowledge Entries,
  Career Capital)      Organizations, Tasks)    Decision Journals)
     │                       │                        │
     └──────────────┐        │        ┌───────────────┘
                    ▼        ▼        ▼
                 Integration Context
          (Calendar, Email, Drive, GitHub,
           Browser Extension, Import/Export)
                    │
                    ▼
             Platform Context
      (Identity, Notifications, Search,
       Settings, Audit, Activity)
```

### 4.1 Context Responsibilities

| Context | Owns | Language | Does NOT Own |
|---|---|---|---|
| **Strategy** | Vision, Mission, Goal, Milestone, Career Capital | Strategic direction, long-term planning | Specific opportunity execution |
| **Opportunity** | Opportunity, Application, Organization, Task, Activity | Execution pipeline, capture, evaluation, application tracking | Long-term strategy, knowledge compounding |
| **Knowledge** | Document, Reflection, Knowledge Entry, Decision Journal | Compounding career capital, reusable assets | Execution tracking, strategic planning |
| **Integration** | Calendar Events, Email Processing, Drive Sync, Browser Extension | External service coordination | Domain logic, data ownership |
| **Platform** | User, Notification, Search Index, Settings, Audit Log | Cross-cutting infrastructure | Domain-specific business rules |

### 4.2 Cross-Context Relationships

Cross-context relationships are implemented as **loose ID references**, not database foreign keys. This allows contexts to evolve independently.

| Source Context | Target Context | Relationship | Implementation |
|---|---|---|---|
| Opportunity | Strategy | Opportunity influences Goal (N:N) | `goal_opportunity_link` table with `alignment_score` |
| Opportunity | Knowledge | Opportunity generates Reflection | `reflection.opportunity_id` (nullable FK) |
| Knowledge | Strategy | Knowledge Entry supports Goal (N:N) | `knowledge_goal_link` table with `provenance_note` |
| Integration | Opportunity | Calendar Event linked to Opportunity | `calendar_event.opportunity_id` (nullable FK) |
| Platform | All | Activity observes everything | `activity` table with polymorphic `entity_type` + `entity_id` |

### 4.3 The Career Lifecycle Pipeline

The core business spine runs vertically through Strategy → Opportunity → Knowledge:

```
Vision
    ↓
Mission
    ↓
Goal
    ↓
Milestone
    ↓
Opportunity
    ↓
Application
    ↓
Reflection
    ↓
Knowledge Entry
```

Everything else (Documents, Organizations, Tasks, Calendar Events, Activities) enriches this spine horizontally.

---

## 5. Layered Architecture

CareerOS follows a **Clean Architecture** pattern with four concentric layers. Dependencies point inward — outer layers depend on inner layers, never the reverse.

```
┌─────────────────────────────────────────────────┐
│                 PRESENTATION                     │
│         (Pages, Components, Hooks)               │
├─────────────────────────────────────────────────┤
│                 APPLICATION                      │
│    (Use Cases, Commands, Queries, DTOs)          │
├─────────────────────────────────────────────────┤
│                   DOMAIN                         │
│  (Entities, Value Objects, Events, Rules,        │
│   State Machines, Aggregate Roots)               │
├─────────────────────────────────────────────────┤
│                INFRASTRUCTURE                    │
│   (Database, External APIs, File Storage,        │
│    AI Providers, Email, Calendar)                │
└─────────────────────────────────────────────────┘
```

### 5.1 Layer Responsibilities

#### Domain Layer (`src/domain/`)

The innermost layer. Contains pure business logic with zero external dependencies.

- **Entities** — `Opportunity`, `Application`, `Goal`, `Organization`, `Document`, `Reflection`, `KnowledgeEntry`
- **Value Objects** — `OpportunityScore`, `DateRange`, `Money`, `Address`
- **State Machines** — Canonical lifecycle definitions (ref: `docs/03-domain/state-machines.md`)
- **Domain Events** — `OpportunityCaptured`, `ApplicationSubmitted`, `ReflectionCompleted`
- **Business Rules** — INV-001 through INV-010 (ref: `docs/03-domain/entities.md`)
- **Aggregate Roots** — Opportunity, Application, Goal, Organization, Document
- **Repository Interfaces** — Abstract contracts (`IOpportunityRepository`, `IApplicationRepository`)

**No imports from Infrastructure, Application, or Presentation layers.**

#### Application Layer (`src/application/`)

Orchestrates use cases. Coordinates domain objects and infrastructure services.

- **Commands** — `CaptureOpportunity`, `ActionOpportunity`, `SubmitApplication`, `CompleteReflection`
- **Queries** — `GetDashboard`, `SearchOpportunities`, `GetUpcomingDeadlines`
- **Use Cases** — Business workflows that coordinate multiple domain objects
- **DTOs** — Data Transfer Objects for cross-boundary communication
- **Event Handlers** — React to domain events and trigger side effects
- **Validators** — Input validation before domain processing

**Depends on Domain layer. Does not depend on Infrastructure or Presentation.**

#### Infrastructure Layer (`src/infrastructure/`)

Implements interfaces defined by Domain and Application layers.

- **Database** — Drizzle ORM schema, migrations, repository implementations
- **External APIs** — AI provider clients, calendar APIs, email processing
- **File Storage** — R2 client for document storage
- **Cache** — KV client for session and query caching
- **Authentication** — NextAuth.js configuration
- **Event Bus** — In-process event publishing (Phase 1), message queue (Phase 3+)

**Implements interfaces from Domain layer. Does not contain business logic.**

#### Presentation Layer (`src/presentation/`)

Next.js pages, React components, and client-side logic.

- **Pages** — Route components (`app/`, `pages/`)
- **Components** — Reusable UI components (`components/`)
- **Hooks** — Custom React hooks for data fetching and state management
- **Styles** — Tailwind CSS configuration and utility classes

**Depends on Application layer. Does not contain business logic.**

---

## 6. Module Decomposition

### 6.1 Source Code Structure

```
src/
├── domain/                          # Domain Layer (innermost)
│   ├── opportunity/
│   │   ├── opportunity.entity.ts
│   │   ├── opportunity.state.ts
│   │   ├── opportunity.events.ts
│   │   ├── opportunity.repository.ts      # Interface only
│   │   └── opportunity.rules.ts
│   ├── application/
│   │   ├── application.entity.ts
│   │   ├── application.state.ts
│   │   ├── application.events.ts
│   │   ├── application.repository.ts
│   │   └── application.rules.ts
│   ├── goal/
│   │   ├── goal.entity.ts
│   │   ├── goal.state.ts
│   │   ├── goal.events.ts
│   │   └── goal.repository.ts
│   ├── organization/
│   │   ├── organization.entity.ts
│   │   └── organization.repository.ts
│   ├── document/
│   │   ├── document.entity.ts
│   │   ├── document-version.value.ts
│   │   └── document.repository.ts
│   ├── knowledge/
│   │   ├── reflection.entity.ts
│   │   ├── knowledge-entry.entity.ts
│   │   ├── decision-journal.entity.ts
│   │   └── knowledge.repository.ts
│   ├── shared/
│   │   ├── aggregate-root.ts
│   │   ├── domain-event.ts
│   │   ├── entity.ts
│   │   ├── value-object.ts
│   │   └── unique-id.ts
│   └── activity/
│       ├── activity.entity.ts
│       └── activity.repository.ts
│
├── application/                     # Application Layer
│   ├── opportunity/
│   │   ├── capture-opportunity.command.ts
│   │   ├── action-opportunity.command.ts
│   │   ├── archive-opportunity.command.ts
│   │   ├── get-dashboard.query.ts
│   │   └── search-opportunities.query.ts
│   ├── application-module/
│   │   ├── submit-application.command.ts
│   │   ├── update-application-status.command.ts
│   │   └── get-application.query.ts
│   ├── goal/
│   │   ├── create-goal.command.ts
│   │   ├── complete-goal.command.ts
│   │   └── get-goals.query.ts
│   ├── knowledge/
│   │   ├── complete-reflection.command.ts
│   │   ├── create-knowledge-entry.command.ts
│   │   └── get-knowledge-base.query.ts
│   ├── document/
│   │   ├── upload-document.command.ts
│   │   ├── link-document.command.ts
│   │   └── get-document-versions.query.ts
│   └── event-handlers/
│       ├── opportunity-event-handler.ts
│       ├── application-event-handler.ts
│       └── goal-event-handler.ts
│
├── infrastructure/                  # Infrastructure Layer
│   ├── database/
│   │   ├── schema/                  # Drizzle schema definitions
│   │   ├── migrations/
│   │   ├── repositories/            # Repository implementations
│   │   └── connection.ts
│   ├── storage/
│   │   ├── r2-client.ts
│   │   └── document-storage.ts
│   ├── cache/
│   │   └── kv-client.ts
│   ├── ai/
│   │   ├── ai-provider.interface.ts
│   │   ├── openai-provider.ts
│   │   └── anthropic-provider.ts
│   ├── auth/
│   │   └── next-auth.config.ts
│   ├── email/
│   │   └── email-processor.ts
│   └── events/
│       └── in-process-event-bus.ts
│
├── presentation/                    # Presentation Layer (outermost)
│   ├── app/                         # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Dashboard
│   │   ├── inbox/
│   │   ├── opportunities/
│   │   ├── applications/
│   │   ├── goals/
│   │   ├── knowledge/
│   │   ├── documents/
│   │   ├── calendar/
│   │   ├── search/
│   │   └── settings/
│   ├── components/
│   │   ├── ui/                      # shadcn/ui primitives
│   │   ├── opportunity/
│   │   ├── application/
│   │   ├── goal/
│   │   ├── knowledge/
│   │   ├── document/
│   │   ├── calendar/
│   │   ├── dashboard/
│   │   └── shared/
│   ├── hooks/
│   └── lib/
│
└── shared/                          # Shared kernel
    ├── types/
    ├── constants/
    ├── utils/
    └── errors/
```

### 6.2 Bounded Context → Module Mapping

| Bounded Context | Domain Module | Application Module | Infrastructure Module |
|---|---|---|---|
| Strategy | `domain/goal/` | `application/goal/` | `infrastructure/database/repositories/goal.repository.ts` |
| Opportunity | `domain/opportunity/`, `domain/application/`, `domain/organization/` | `application/opportunity/`, `application/application-module/` | `infrastructure/database/repositories/opportunity.repository.ts` |
| Knowledge | `domain/knowledge/`, `domain/document/` | `application/knowledge/`, `application/document/` | `infrastructure/database/repositories/knowledge.repository.ts`, `infrastructure/storage/` |
| Integration | — (thin domain) | `application/integration/` | `infrastructure/email/`, `infrastructure/ai/` |
| Platform | `domain/activity/`, `domain/shared/` | `application/event-handlers/` | `infrastructure/auth/`, `infrastructure/cache/`, `infrastructure/events/` |

---

## 7. Communication Patterns

### 7.1 Synchronous Communication (Phase 1 MVP)

For the MVP, all communication is in-process:

```
User Action → Presentation → Application Command → Domain → Infrastructure → Database
                ↓
          Application Query → Domain Rules → Infrastructure → Database → Presentation
```

- **Commands** mutate state through domain entities
- **Queries** read state through repository interfaces
- All operations are transactional within a single database transaction

### 7.2 Event-Driven Communication (Phase 3+)

As the system evolves, cross-context communication transitions to events:

```
Opportunity Context
    │
    ├── publishes: OpportunityActioned
    │
    ▼
Event Bus
    │
    ├── Knowledge Context subscribes → creates Application
    ├── Strategy Context subscribes → updates Career Capital
    ├── Integration Context subscribes → creates Calendar Event
    └── Platform Context subscribes → creates Activity record
```

**Event Bus Evolution:**

| Phase | Mechanism | Use Case |
|---|---|---|
| Phase 1 (MVP) | In-process event emitter | Simple side effects within same process |
| Phase 2 | Async job queue (Cloudflare Queues) | Background processing, retries |
| Phase 3 | Event store + projections | Full CQRS, audit trail, replay |

### 7.3 CQRS Pattern

Commands and Queries are separated to optimize each path:

```
Commands (Write Side):
    CaptureOpportunity → validates → domain rules → repository.save() → emits event

Queries (Read Side):
    GetDashboard → repository.find() → DTO → returns to presentation
```

**Phase 1 (MVP):** Single database for both reads and writes. CQRS is enforced at the application layer (separate command/query classes) but not at the infrastructure level.

**Phase 2+:** Separate read models (projections) can be introduced for complex queries without affecting the write model.

---

## 8. Event Flow

### 8.1 Core Loop Event Sequence

The core loop is the end-to-end journey from capture to knowledge compounding. Every step produces a domain event.

```
1. User captures URL/text
   → OpportunityCaptured

2. AI extracts data (async)
   → OpportunityClassified

3. User evaluates opportunity
   → OpportunityScored

4. User actions opportunity
   → OpportunityActioned
   → ApplicationCreated (side effect)

5. User prepares and submits
   → ApplicationSubmitted

6. Interview occurs
   → InterviewCompleted

7. Decision received
   → ApplicationAccepted / ApplicationRejected

8. Reflection prompted
   → ReflectionCompleted

9. Knowledge extracted
   → KnowledgeEntryCreated
   → CareerCapitalIncreased
```

### 8.2 Event Consumers

| Event | Consumers | Side Effects |
|---|---|---|
| `OpportunityCaptured` | AI Extraction Service, Activity Logger | AI extraction begins, Activity record created |
| `OpportunityActioned` | Application Factory, Task Generator | Application created in DRAFTING, tasks generated |
| `ApplicationSubmitted` | Follow-up Scheduler, Activity Logger | Follow-up reminder scheduled (14 days), Activity record |
| `ApplicationRejected` | Reflection Prompter, Analytics | Reflection task created, analytics updated |
| `ApplicationAccepted` | Celebration, Career Capital, Reflection Prompter | Celebration activity, Career Capital updated, reflection task |
| `ReflectionCompleted` | Knowledge Extractor, Career Capital | Knowledge entries extracted, Career Capital updated |

---

## 9. Dependency Rules

### 9.1 Import Rules

```
Domain ← Application ← Presentation
    ↑         ↑
    └── Infrastructure
```

- **Domain** imports nothing from outer layers
- **Application** imports Domain interfaces (not implementations)
- **Infrastructure** implements Domain interfaces
- **Presentation** imports Application commands/queries and UI components

### 9.2 Architectural Fitness Functions

Automated checks that verify architectural constraints:

| Fitness Function | Constraint | Enforcement |
|---|---|---|
| Domain Independence | Domain layer cannot import from `infrastructure/`, `presentation/` | ESLint import rules, CI check |
| Interface Segregation | Infrastructure implements domain interfaces, not vice versa | Dependency injection, CI check |
| Event Immutability | Domain events cannot be mutated after creation | TypeScript `readonly` properties, unit tests |
| Lifecycle Enforcement | No state transition bypasses state machine validation | Unit tests for every transition |
| Aggregate Consistency | Child entities cannot be modified without going through aggregate root | Repository tests |

---

## 10. Cross-Cutting Concerns

### 10.1 Authentication & Authorization

Handled by the Platform Context. Every request passes through an auth middleware that resolves the user identity. All data queries are scoped to the authenticated user.

- **Authentication:** NextAuth.js with OAuth providers (Google, GitHub, Microsoft, Apple)
- **Authorization:** Role-based (Owner, Collaborator — future phases)
- **Data Scoping:** Every query includes `WHERE user_id = ?` enforced at the repository level

### 10.2 Audit Trail

Every mutation generates an immutable `Activity` record:

```typescript
{
  id: string
  entity_type: string      // "opportunity" | "application" | "goal" | ...
  entity_id: string
  action: string           // "captured" | "actioned" | "submitted" | ...
  actor: string            // "user:<id>" | "system:automation" | "ai:extraction"
  occurred_at: timestamp
  metadata: JSON           // Additional context
}
```

- Activities are append-only (INV-004)
- Activities are never modified or deleted (INV-010)
- Activities are cross-context — any aggregate may generate them

### 10.3 Error Handling

| Error Category | Handling Strategy |
|---|---|
| Domain validation errors | Return structured error to presentation layer with user-friendly message |
| Infrastructure failures | Log error, return generic error to user, trigger retry if applicable |
| External API failures | Graceful degradation — core functionality continues without AI/integration features |
| Authentication errors | Redirect to login, preserve intended destination |

### 10.4 Logging & Observability

| Signal | Tool | Purpose |
|---|---|---|
| Application logs | Structured logging (pino/winston) | Debug, audit |
| Error tracking | Sentry | Error aggregation, alerting |
| Performance | Web Vitals, custom timers | UX optimization |
| Business metrics | Custom analytics events | Product decisions |

### 10.5 Configuration

Environment-based configuration with clear separation:

| Config | Source | Purpose |
|---|---|---|
| Database URL | Environment variable | Data persistence |
| Auth secrets | Environment variable (secret) | Authentication |
| AI API keys | Environment variable (secret) | AI features |
| Feature flags | Database or config file | Progressive feature rollout |

---

## 11. Scalability Considerations

### 11.1 Single-User Alpha

The initial deployment serves a single user. Architecture decisions are made for simplicity, not scale.

- Single database (D1)
- In-process event bus
- Direct function calls (no message queue)
- No caching layer beyond Next.js built-in

### 11.2 Multi-User Evolution

When scaling to multiple users:

- **Database:** D1 handles horizontal scaling automatically
- **Event Bus:** Introduce Cloudflare Queues for async processing
- **Cache:** Cloudflare KV for session and query caching
- **AI:** Rate limiting per user, cost tracking
- **Storage:** R2 with per-user bucket prefixes

### 11.3 Performance Targets

| Metric | Target | Measurement |
|---|---|---|
| Page load (LCP) | < 2.5s | Lighthouse |
| Navigation (INP) | < 200ms | Web Vitals |
| Layout stability (CLS) | < 0.1 | Web Vitals |
| API response (p95) | < 500ms | Server-side timing |
| Search results | < 300ms | Custom metric |

---

## 12. Technology Alignment

This architecture is implemented using the technology stack defined in `docs/05-engineering/tech-stack.md`.

Key technology decisions:

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js 14+ (App Router) | Server components, edge functions, SEO |
| Language | TypeScript (strict) | Type safety across all layers |
| Database | Cloudflare D1 (SQLite) | Edge-local, serverless, cost-effective |
| ORM | Drizzle ORM | Type-safe, lightweight, D1-compatible |
| Storage | Cloudflare R2 | S3-compatible, no egress fees |
| Cache | Cloudflare KV | Edge-local key-value |
| Auth | NextAuth.js | OAuth, session management |
| UI | shadcn/ui + Tailwind CSS | Accessible, customizable, unstyled primitives |
| Testing | Vitest + Testing Library | Fast, modern, TypeScript-native |

---

## 13. Migration Path

### Phase 1 (MVP) → Phase 2 (Intelligence)

- Add AI provider abstraction layer
- Introduce async job processing for AI extraction
- Add read model projections for analytics queries

### Phase 2 → Phase 3 (Automation)

- Replace in-process event bus with Cloudflare Queues
- Add workflow engine for complex automations
- Introduce event store for full audit trail

### Phase 3 → Phase 4 (Platform)

- Expose public API (versioned)
- Add webhook system
- Introduce multi-tenancy (if enterprise)

---

## 14. Open Items

1. **AI Provider Selection** — Final provider choice depends on cost, latency, and capability requirements during Phase 2 development.
2. **Event Store Design** — Full event sourcing deferred to Phase 3. Phase 1 uses Activity table as lightweight audit trail.
3. **Multi-User Architecture** — Tenant isolation strategy to be defined when moving beyond single-user alpha.
4. **Offline Support** — Service worker and local sync strategy deferred to Phase 2.

---

## Version History

| Version | Date | Description |
|---|---|---|
| 1.0 | Initial Draft | Established canonical system architecture for CareerOS. |
