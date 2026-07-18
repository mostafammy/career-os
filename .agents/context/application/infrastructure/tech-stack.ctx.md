---
id: APPLICATION-007
title: "Tech Stack"
status: canonical
version: "1.0"
owner: "Architect Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: medium
change_frequency: low
consumers:
  - All Engineering Agents
depends_on:
  - CORE-003
tags:
  - application
  - infrastructure
  - tech-stack
  - always-load
always_loaded: true
---

# APPLICATION-007 — Tech Stack

## Frontend

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 14+ (App Router) | Full-stack React framework with server components |
| React | 18+ | UI library |
| TypeScript | 5+ (strict) | Static type checking |
| Tailwind CSS | 3+ | Utility-first CSS |
| shadcn/ui | latest | Pre-built accessible component library |

## Backend

| Technology | Version | Purpose |
|---|---|---|
| tRPC | 11+ | Type-safe RPC layer over HTTP |
| Zod | 3+ | Runtime input validation and schema definition |
| Prisma | 6+ | Type-safe ORM for PostgreSQL |

## Database

| Technology | Version | Purpose |
|---|---|---|
| PostgreSQL | 16+ | Primary relational database |
| Neon | — | Serverless PostgreSQL with branching |
| Prisma | 6+ | ORM and migration tool |

## Authentication

| Technology | Version | Purpose |
|---|---|---|
| NextAuth.js (Auth.js) | 5+ | Authentication framework |

## AI

| Technology | Version | Purpose |
|---|---|---|
| OpenAI API | latest | GPT-4o for reasoning, extraction, analysis |
| OpenAI Embeddings | text-embedding-3-small | Vector embeddings for RAG |

## Deployment

| Technology | Purpose |
|---|---|
| Vercel | Hosting, CI/CD, edge functions |
| Neon | Serverless PostgreSQL |
| Vercel Blob | File storage for documents |

## Dev Tools

| Technology | Purpose |
|---|---|
| pnpm | Package manager |
| ESLint | Code linting |
| Prettier | Code formatting |
| Vitest | Unit and integration testing |
| Prisma Studio | Database visualization |

## Version Compatibility

| Technology | Minimum | Recommended |
|---|---|---|
| Node.js | 20 LTS | 22 LTS |
| Next.js | 14.0 | 14.2+ |
| React | 18.2 | 19+ |
| TypeScript | 5.0 | 5.5+ |
| Prisma | 6.0 | 6.5+ |
| PostgreSQL | 14 | 16+ |

## Explicit Prohibitions (Phase 1)

| Prohibited | Reason |
|---|---|
| MongoDB / document databases | Relational data requires PostgreSQL |
| GraphQL | tRPC provides type safety with less complexity |
| REST-only APIs | tRPC eliminates manual type definitions |
| Redis | Not needed for single-user alpha |
| Message queues | Sufficient for single-user |
| Docker / Kubernetes | Vercel serverless sufficient |
| AWS / GCP / Azure | Vercel + Neon covers all infrastructure |

## Future Phase Additions

- **Phase 2:** Redis (caching, background jobs)
- **Phase 3:** pgvector (production RAG), event store
- **Phase 4:** Inngest or Trigger.dev (async automation)
- **Phase 5:** Multi-tenant architecture, RBAC

## Canonical Source

`docs/05-engineering/tech-stack.md`
