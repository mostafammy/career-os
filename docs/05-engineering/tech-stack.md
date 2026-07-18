# Tech Stack Specification

**File:** `docs/05-engineering/tech-stack.md`

---

# Tech Stack

**Status:** Canonical
**Version:** 1.0

---

## Purpose

This document defines the technology choices for CareerOS and the rationale behind each decision. The stack is selected for a solo developer building a single-user alpha within a 3-month timeline, prioritizing developer velocity, type safety, and deployment simplicity.

---

## Frontend

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 14+ (App Router) | Full-stack React framework with server components, API routes, and file-based routing |
| React | 18+ | UI library |
| TypeScript | 5+ | Static type checking |
| Tailwind CSS | 3+ | Utility-first CSS |
| shadcn/ui | latest | Pre-built accessible component library |

**Rationale:** Next.js App Router provides server components for initial data loading (reducing client JS), API routes colocated with pages, and built-in optimization (image, font, metadata). TypeScript eliminates an entire class of runtime errors. Tailwind + shadcn/ui accelerates UI development without sacrificing accessibility.

---

## Backend

| Technology | Version | Purpose |
|---|---|---|
| tRPC | 11+ | Type-safe RPC layer over HTTP |
| Zod | 3+ | Runtime input validation and schema definition |
| Prisma | 6+ | Type-safe ORM for PostgreSQL |

**Rationale:** tRPC provides end-to-end type safety between client and server without code generation. Zod schemas serve as both validation rules and TypeScript types (single source of truth). Prisma generates types directly from the database schema, completing the type-safety chain: Database → Prisma → tRPC → React.

---

## Database

| Technology | Version | Purpose |
|---|---|---|
| PostgreSQL | 16+ | Primary relational database |
| Prisma | 6+ | ORM and migration tool |

**Rationale:** PostgreSQL supports complex queries, JSON columns for flexible data, full-text search (eliminating the need for Elasticsearch in alpha), and referential integrity. Prisma handles schema migrations and type generation. Neon provides serverless PostgreSQL with branching for preview deployments.

---

## Authentication

| Technology | Version | Purpose |
|---|---|---|
| NextAuth.js (Auth.js) | 5+ | Authentication framework |

**Rationale:** NextAuth.js integrates natively with Next.js App Router, supports multiple providers, and handles session management. For the alpha (single user), a simple email/magic-link or GitHub OAuth flow is sufficient.

---

## AI

| Technology | Version | Purpose |
|---|---|---|
| OpenAI API | latest | LLM for extraction, analysis, summarization |
| OpenAI Embeddings | text-embedding-3-small | Vector embeddings for RAG |

**Rationale:** GPT-4o provides strong extraction and analysis capabilities for opportunity summarization, requirement extraction, and document matching. Embeddings enable semantic search over career knowledge. The OpenAI API is well-documented, reliable, and cost-effective for a single user.

---

## Deployment

| Technology | Version | Purpose |
|---|---|---|
| Vercel | — | Hosting, CI/CD, edge functions |
| Neon | — | Serverless PostgreSQL |
| Vercel Blob | — | File storage for documents |

**Rationale:** Vercel provides zero-config deployment from Git, preview deployments on PRs, serverless functions, edge middleware, and built-in analytics. Neon provides serverless PostgreSQL with branching (each PR gets an isolated database branch). Vercel Blob handles file uploads without external storage configuration.

---

## Dev Tools

| Technology | Purpose |
|---|---|
| pnpm | Package manager (faster, disk-efficient) |
| ESLint | Code linting |
| Prettier | Code formatting |
| Vitest | Unit and integration testing |
| Prisma Studio | Database visualization |

---

## Technology Constraints

The following are explicitly **not permitted** in CareerOS alpha:

| Constraint | Reason |
|---|---|
| No MongoDB or document databases | Relational data with complex joins requires PostgreSQL |
| No GraphQL | tRPC provides type safety with less complexity |
| No REST-only APIs | tRPC eliminates manual type definitions |
| No Redis | Not needed for single-user alpha; add in Phase 2 if needed |
| No message queues | Sufficient for single-user; add in Phase 2 if needed |
| No Docker/Kubernetes | Vercel serverless is sufficient |
| No AWS/GCP/Azure | Vercel + Neon covers all infrastructure needs |

---

## Version Compatibility Matrix

| Technology | Minimum Version | Recommended | Notes |
|---|---|---|---|
| Node.js | 20 LTS | 22 LTS | Required by Next.js 14+ |
| Next.js | 14.0 | 14.2+ | App Router required |
| React | 18.2 | 19+ | Server components |
| TypeScript | 5.0 | 5.5+ | Strict mode |
| Prisma | 6.0 | 6.5+ | |
| PostgreSQL | 14 | 16+ | Full-text search support |
| pnpm | 9.0 | 11+ | |

---

## Alpha Scope Note

This stack is defined for the Private Alpha (single user, 3-month timeline). Future phases may introduce:

- **Phase 2:** Redis for caching, background job processing
- **Phase 3:** Vector database (pgvector or Pinecone) for production RAG
- **Phase 4:** Message queue (Inngest or Trigger.dev) for async automation
- **Phase 5:** Multi-tenant architecture, RBAC

Changes to the tech stack require approval and a written rationale in this document.
