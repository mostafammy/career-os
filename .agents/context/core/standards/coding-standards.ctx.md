---
id: CORE-005
title: "Coding Standards"
status: canonical
version: "1.0"
owner: "Architect Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: high
change_frequency: low
consumers:
  - Backend Agent
  - Frontend Agent
  - Database Agent
  - Testing Agent
  - Review Agent
depends_on:
  - CORE-003
tags:
  - core
  - standards
  - always-load
always_loaded: true
---

# CORE-005 — Coding Standards

## TypeScript

- **Strict mode** always (`"strict": true` in tsconfig)
- No `any` — use `unknown` and narrow with type guards
- Prefer `interface` for object shapes, `type` for unions/intersections
- Use `as const` for literal constants
- Exhaustive `switch` with `never` check for enums

## File Naming Conventions

| Layer | Pattern | Example |
|---|---|---|
| Domain Entity | `{name}.entity.ts` | `opportunity.entity.ts` |
| Domain State Machine | `{name}.state.ts` | `opportunity.state.ts` |
| Domain Events | `{name}.events.ts` | `opportunity.events.ts` |
| Domain Rules | `{name}.rules.ts` | `opportunity.rules.ts` |
| Repository Interface | `{name}.repository.ts` | `opportunity.repository.ts` |
| Application Command | `{verb}-{noun}.command.ts` | `capture-opportunity.command.ts` |
| Application Query | `{verb}-{noun}.query.ts` | `get-dashboard.query.ts` |
| Repository Impl | `{name}.repository.ts` | `prisma-opportunity.repository.ts` |
| tRPC Router | `{name}.router.ts` | `opportunity.router.ts` |
| React Component | `{Name}.tsx` | `OpportunityCard.tsx` |
| React Hook | `use{Name}.ts` | `useOpportunity.ts` |
| Test | `{name}.spec.ts` / `{name}.test.ts` | `opportunity.entity.spec.ts` |

## Import Order

```
1. Node built-ins
2. External packages
3. Domain layer (never from infrastructure)
4. Application layer
5. Infrastructure layer
6. Presentation layer
7. Shared utilities
```

**Rule:** Domain layer imports NOTHING from infrastructure, application, or presentation.

## tRPC Conventions

- Use **intent-based** naming: `captureOpportunity`, not `PATCH /opportunities/:id`
- All procedures validate input with Zod schemas
- Error codes: NOT_FOUND, FORBIDDEN, BAD_REQUEST, CONFLICT, INTERNAL_SERVER_ERROR
- Mutations use command pattern, queries use query pattern

## Prisma Conventions

- Primary keys: `cuid()` (not UUID, not auto-increment)
- Soft delete: `deleted_at` column (nullable DateTime), never hard delete in application code
- Timestamps: `created_at`, `updated_at` on every table
- Enums: match state machine values exactly (e.g., `opportunity_status` enum matches FSM states)
- Migrations: one migration per feature, named descriptively

## Error Handling

| Layer | Pattern |
|---|---|
| Domain | Throw domain-specific errors (e.g., `InvalidStateTransitionError`) |
| Application | Catch domain errors, return Result type or throw application errors |
| Infrastructure | Catch infrastructure errors, wrap in domain-agnostic errors |
| Presentation | Display user-friendly messages, never expose stack traces |

## Testing

- Unit tests for domain entities and state machines (Vitest)
- Integration tests for tRPC routers
- Test file co-located with source: `opportunity.entity.ts` → `opportunity.entity.spec.ts`
- Test naming: `describe('Opportunity')` → `it('should transition from CAPTURED to EVALUATING')`
- No test doubles in domain layer — domain logic is pure

## Code Style

- Prettier for formatting (no debates)
- ESLint for linting
- No comments unless explaining WHY (not WHAT)
- Functions: max 30 lines preferred, 50 hard limit
- Files: max 300 lines preferred, 500 hard limit
- Extract, don't duplicate

## Security Coding

- All queries include `WHERE user_id = ?` at repository layer
- Never log sensitive data (tokens, passwords, PII)
- Never use `dangerouslySetInnerHTML` without sanitization
- Validate all inputs at application layer with Zod
- Use parameterized queries only (no raw SQL with user input)
