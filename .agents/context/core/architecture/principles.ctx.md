---
id: CORE-003
title: "Architecture Principles"
status: canonical
version: "1.0"
owner: "Architect Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: very-high
change_frequency: extremely-low
consumers:
  - Architect Agent
  - Backend Agent
  - Database Agent
  - DDD Agent
  - Review Agent
depends_on:
  - CORE-001
  - CORE-002
tags:
  - core
  - architecture
  - always-load
always_loaded: true
---

# CORE-003 — Architecture Principles

## Immutable Principles

| ID | Principle | Rationale |
|---|---|---|
| ARCH-001 | **Domain Independence** — Domain layer cannot import infrastructure code. | Business rules remain testable and technology-agnostic. |
| ARCH-002 | **Bounded Context Isolation** — Each context owns its language, rules, and models. | Prevents monolithic domain model from becoming unmanageable. |
| ARCH-003 | **Event-Driven Communication** — Contexts communicate through domain events, not direct method calls. | Loose coupling and future extensibility. |
| ARCH-004 | **CQRS-ready** — Commands and Queries separated at application layer. | Optimize read and write models independently. |
| ARCH-005 | **Single Responsibility** — Every module has one reason to change. | Reduces blast radius of changes. |
| ARCH-006 | **Dependency Inversion** — High-level modules depend on abstractions, not low-level implementations. | Enables provider swapping (AI, storage, calendar). |
| ARCH-007 | **Fail Independently** — Every subsystem fails independently where possible. | Prevents cascading failures. |
| ARCH-008 | **Simplicity Over Cleverness** — Prioritize simplicity over unnecessary complexity. | Ensures maintainability by future contributors. |

## Layered Architecture (Clean Architecture)

```
Presentation (Pages, Components, Hooks)
    ↑ depends on
Application (Use Cases, Commands, Queries, DTOs)
    ↑ depends on
Domain (Entities, Value Objects, Events, Rules, State Machines)
    ↑ implements interfaces from
Infrastructure (Database, External APIs, File Storage, AI, Auth)
```

**Rules:**
- Domain imports NOTHING from outer layers
- Application imports Domain interfaces (not implementations)
- Infrastructure implements Domain interfaces
- Presentation imports Application commands/queries

## Bounded Contexts

| Context | Owns | Does NOT Own |
|---|---|---|
| **Strategy** | Vision, Mission, Goal, Milestone, Career Capital | Opportunity execution |
| **Opportunity** | Opportunity, Application, Organization, Task, Activity | Long-term strategy, knowledge |
| **Knowledge** | Document, Reflection, Knowledge Entry, Decision Journal | Execution tracking |
| **Integration** | Calendar Events, Email, Drive, Browser Extension | Domain logic |
| **Platform** | User, Notification, Search, Settings, Audit Log | Domain business rules |

## Cross-Context Rules

- Cross-context relationships use **loose ID references**, not database foreign keys
- Domain-003 (Application) MUST always co-load with DOMAIN-002 (Opportunity) — XAG-001 through XAG-005
- Application-001 (Intelligence) MUST always co-load with APPLICATION-006 (Security)

## Architectural Fitness Functions

| Fitness Function | Enforcement |
|---|---|
| Domain Independence | ESLint import rules, CI check |
| Interface Segregation | Dependency injection, CI check |
| Event Immutability | TypeScript `readonly` properties, unit tests |
| Lifecycle Enforcement | Unit tests for every state transition |
| Aggregate Consistency | Repository tests |

## Canonical Source

`docs/05-engineering/architecture.md`
