# Technology Stack

**File:** `docs/05-engineering/tech-stack.md`

---

# Technology Stack

**Status:** Canonical
**Version:** 1.0

---

## 1. Purpose

This document defines the technology choices for CareerOS. Each choice is justified against the architectural principles defined in `docs/05-engineering/architecture.md` and the product requirements defined in `docs/01-product/PRD.md`.

The technology stack should evolve with the project. These choices are made for the **Phase 1 MVP** (single-user alpha) and are designed to scale to multi-user without major rewrites.

---

## 2. Selection Criteria

Every technology choice is evaluated against:

| Criterion | Weight | Rationale |
|---|---|---|
| **Developer Experience** | High | Solo developer — fast iteration matters |
| **Type Safety** | High | Domain model complexity demands strong typing |
| **Edge Deployment** | High | Global low-latency, serverless cost model |
| **Ecosystem Maturity** | Medium | Community, packages, documentation |
| **Longevity** | Medium | Technology should exist in 5+ years |
| **Cost at Scale** | Medium | Favor predictable, low-cost infrastructure |
| **Architectural Fit** | High | Must support Clean Architecture, DDD, CQRS |

---

## 3. Core Stack

### 3.1 Runtime & Language

| Technology | Version | Role | Justification |
|---|---|---|---|
| **Node.js** | 20 LTS | Server runtime | Edge-compatible via Cloudflare Workers, mature ecosystem |
| **TypeScript** | 5.x | Language | Strict typing enforced across all layers; essential for domain model correctness |

**Configuration:**

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### 3.2 Framework

| Technology | Version | Role | Justification |
|---|---|---|---|
| **Next.js** | 14+ | Web framework | App Router, React Server Components, edge middleware, file-based routing, SEO |

**Why Next.js over alternatives:**

| Alternative | Why Not |
|---|---|
| Remix | Smaller ecosystem, less edge support |
| SvelteKit | Smaller ecosystem, less TypeScript maturity |
| Plain React (Vite) | No SSR, no edge functions, manual routing |
| Nuxt/Angular/Vue | Ecosystem and community smaller for this use case |

**Key Next.js Features Used:**

- **App Router** — File-based routing with layouts, loading states, error boundaries
- **React Server Components** — Server-side rendering for dashboard, search results
- **Server Actions** — Form submissions without API routes (Phase 1)
- **Edge Middleware** — Auth checks, redirects at the edge
- **Image Optimization** — Automatic image optimization for documents
- **Metadata API** — SEO for public-facing pages

### 3.3 Package Manager

| Technology | Version | Role | Justification |
|---|---|---|---|
| **pnpm** | 11.x | Package management | Fast, disk-efficient, strict dependency resolution |

---

## 4. Data Layer

### 4.1 Database

| Technology | Role | Justification |
|---|---|---|
| **Cloudflare D1** | Primary database | SQLite at the edge, serverless, zero-config, free tier for alpha |

**D1 Characteristics:**

- SQLite-based (familiar SQL, battle-tested)
- Globally distributed reads
- Strongly consistent writes
- Automatic backups
- Built-in point-in-time recovery
- Free tier: 5 GB storage, 10M reads/day, 100K writes/day

**Why D1 over alternatives:**

| Alternative | Why Not |
|---|---|
| PostgreSQL (Neon/Supabase) | Higher latency from edge, more operational complexity |
| PlanetScale (MySQL) | Pricing changes, less edge-native |
| Turso (libSQL) | Similar but D1 has tighter Cloudflare integration |
| MongoDB Atlas | Schema complexity better served by relational |

### 4.2 ORM

| Technology | Version | Role | Justification |
|---|---|---|---|
| **Drizzle ORM** | 3.x | Database access | Type-safe, lightweight, D1-native, SQL-like API |

**Why Drizzle over alternatives:**

| Alternative | Why Not |
|---|---|
| Prisma | Heavier, slower migrations, less edge-friendly |
| TypeORM | Less TypeScript-native, heavier |
| Kysely | Good but Drizzle has better D1 integration |
| Raw SQL | No type safety, manual mapping |

**Drizzle Features Used:**

- Schema-first approach (define schema in TypeScript)
- Type-safe queries (inferred types from schema)
- Migration generation from schema changes
- Built-in D1 driver (`drizzle-orm/cloudflare-d1`)
- Relational queries for complex reads

### 4.3 File Storage

| Technology | Role | Justification |
|---|---|---|
| **Cloudflare R2** | Document storage | S3-compatible, zero egress fees, integrated with D1 |

**R2 Characteristics:**

- S3-compatible API (easy migration if needed)
- Zero egress fees (critical for document-heavy app)
- 10 GB free storage
- Automatic CDN caching
- Lifecycle policies for cleanup

**What Goes in R2:**

- User-uploaded documents (CVs, transcripts, certificates)
- Document versions (immutable snapshots)
- Generated exports (PDF reports, backups)

**What Stays in D1:**

- Document metadata (title, type, tags, links)
- Document version history (references to R2 objects)
- All entity data

### 4.4 Cache

| Technology | Role | Justification |
|---|---|---|
| **Cloudflare KV** | Session and query caching | Edge-local, eventual consistency acceptable for cache |

**KV Use Cases (Phase 2+):**

- Session storage
- Dashboard query caching
- Search result caching
- Feature flag storage

**Phase 1:** KV is not used. Next.js built-in caching and D1 performance are sufficient.

---

## 5. Frontend Layer

### 5.1 UI Library

| Technology | Version | Role | Justification |
|---|---|---|---|
| **React** | 18+ | UI library | Server Components, mature ecosystem, Next.js native |

### 5.2 Component Library

| Technology | Version | Role | Justification |
|---|---|---|---|
| **shadcn/ui** | Latest | UI primitives | Copy-paste components, fully customizable, Radix UI primitives, Tailwind-based |

**Why shadcn/ui over alternatives:**

| Alternative | Why Not |
|---|---|
| Material UI | Opinionated design, heavy bundle |
| Chakra UI | Less customizable, heavier |
| Headless UI | Fewer components, less polished defaults |
| Custom components | Too much work for MVP |

**shadcn/ui Components Used:**

- Button, Input, Textarea, Select, Checkbox, Radio
- Dialog, Sheet, Popover, Tooltip
- Card, Table, Tabs, Accordion
- Form (with react-hook-form integration)
- Calendar, Command (search), Navigation menu

### 5.3 Styling

| Technology | Version | Role | Justification |
|---|---|---|---|
| **Tailwind CSS** | 3.x | Utility-first CSS | Rapid prototyping, consistent design, tree-shakeable |

### 5.4 Form Management

| Technology | Version | Role | Justification |
|---|---|---|---|
| **react-hook-form** | 7.x | Form state | Performant, minimal re-renders, schema validation |
| **Zod** | 3.x | Schema validation | Type-safe validation, integrates with react-hook-form and Drizzle |

### 5.5 State Management

| Phase | Approach | Justification |
|---|---|---|
| Phase 1 (MVP) | React Server Components + `use` hook | Minimal client state, server-first approach |
| Phase 2+ | Zustand (if needed) | Lightweight, no boilerplate, TypeScript-native |

**Principle:** Minimize client-side state. Prefer server components and URL state (search params, routing) over global stores.

### 5.6 Data Fetching

| Technology | Role | Justification |
|---|---|---|
| **Server Components** | Primary data fetching | Zero client-side JavaScript, direct database access |
| **Server Actions** | Mutations | Type-safe form submissions without API routes |
| **SWR** (Phase 2+) | Client-side revalidation | Real-time updates for dashboard, search |

---

## 6. Authentication

| Technology | Version | Role | Justification |
|---|---|---|---|
| **NextAuth.js** | 5.x | Authentication | OAuth providers, session management, CSRF protection |

**Providers (Phase 1):**

- Google OAuth
- GitHub OAuth
- Email (magic link)

**Providers (Phase 2+):**

- Microsoft OAuth
- Apple Sign-In
- University SSO (SAML)

---

## 7. Testing

| Technology | Version | Role | Justification |
|---|---|---|---|
| **Vitest** | 1.x | Unit/integration tests | Fast, TypeScript-native, Vite-compatible |
| **Testing Library** | Latest | Component tests | User-centric testing patterns |
| **Playwright** | Latest | E2E tests | Cross-browser, reliable, visual testing |

**Test Pyramid:**

```
        ╱╲
       ╱  ╲       E2E Tests (Playwright)
      ╱    ╲      — Critical user flows
     ╱──────╲
    ╱        ╲    Integration Tests (Vitest + Testing Library)
   ╱          ╲   — API routes, database operations, event handlers
  ╱────────────╲
 ╱              ╲  Unit Tests (Vitest)
╱                ╲ — Domain logic, state machines, business rules
──────────────────
```

**Coverage Targets:**

| Layer | Target | Rationale |
|---|---|---|
| Domain | > 90% | Core business logic — highest value |
| Application | > 80% | Use cases and command handlers |
| Infrastructure | > 70% | Repository implementations, external API clients |
| Presentation | > 60% | Component rendering, user interactions |

---

## 8. Code Quality

### 8.1 Linting & Formatting

| Technology | Role | Justification |
|---|---|---|
| **ESLint** | Code linting | Catch errors, enforce patterns |
| **Prettier** | Code formatting | Consistent style across codebase |

**ESLint Rules:**

- `@typescript-eslint/strict-type-checked` — Strict TypeScript checking
- `import/no-restricted-paths` — Enforce layer boundaries (architecture fitness function)
- `no-console` — Prevent console.log in production
- `unicorn/prefer-module` — ESM-first

### 8.2 Git Hooks

| Technology | Role | Justification |
|---|---|---|
| **Husky** | Git hooks | Pre-commit linting, pre-push testing |
| **lint-staged** | Staged file processing | Fast incremental linting |

---

## 9. Development Tools

| Tool | Purpose |
|---|---|
| **VS Code** | Primary IDE |
| **Biome** (alternative to ESLint + Prettier) | Single-tool linting and formatting (faster) |
| **Drizzle Studio** | Database browser and query tool |
| **Wrangler** | Cloudflare CLI for D1, R2, KV management |

---

## 10. Dependency Management

### 10.1 Core Dependencies (Phase 1)

```json
{
  "dependencies": {
    "next": "^14.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "next-auth": "^5.x",
    "drizzle-orm": "^3.x",
    "@cloudflare/workers-types": "^4.x",
    "zod": "^3.x",
    "react-hook-form": "^7.x",
    "@hookform/resolvers": "^3.x",
    "swr": "^2.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "drizzle-kit": "^0.x",
    "vitest": "^1.x",
    "@testing-library/react": "^14.x",
    "@testing-library/jest-dom": "^6.x",
    "playwright": "^1.x",
    "eslint": "^8.x",
    "prettier": "^3.x",
    "tailwindcss": "^3.x",
    "autoprefixer": "^10.x",
    "postcss": "^8.x"
  }
}
```

### 10.2 Dependency Principles

- **Pin versions** in lockfile, use ranges in package.json
- **Audit regularly** — `pnpm audit` in CI
- **Minimize dependencies** — every dependency is a potential security and maintenance burden
- **Prefer built-in APIs** — Node.js `crypto`, `fetch`, `URL` over external packages

---

## 11. Environment Configuration

### 11.1 Required Environment Variables

| Variable | Purpose | Phase |
|---|---|---|
| `DATABASE_URL` | D1 database binding | 1 |
| `AUTH_SECRET` | NextAuth session encryption | 1 |
| `AUTH_GOOGLE_ID` | Google OAuth client ID | 1 |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret | 1 |
| `AUTH_GITHUB_ID` | GitHub OAuth client ID | 1 |
| `AUTH_GITHUB_SECRET` | GitHub OAuth client secret | 1 |
| `R2_BUCKET` | R2 bucket binding | 1 |
| `AI_API_KEY` | AI provider API key | 2 |
| `AI_PROVIDER` | AI provider selection | 2 |

### 11.2 Environment Files

```
.env.local              # Local development (gitignored)
.env.development.local  # Development overrides (gitignored)
.env.production         # Production (set in Cloudflare dashboard)
```

---

## 12. Build & Bundle

### 12.1 Build Configuration

- **Bundler:** Turbopack (Next.js built-in, fast development builds)
- **Output:** Static generation for public pages, server rendering for authenticated pages
- **Bundle Analysis:** `@next/bundle-analyzer` for identifying large dependencies

### 12.2 Performance Budget

| Metric | Budget |
|---|---|
| First Load JS | < 100 KB (gzipped) |
| Total Bundle Size | < 250 KB (gzipped) |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| Interaction to Next Paint | < 200ms |

---

## 13. Technology Risk Register

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| D1 maturity issues | Medium | Low | SQLite is battle-tested; D1 is a thin wrapper |
| Next.js breaking changes | Medium | Medium | Pin versions, upgrade gradually, test thoroughly |
| Cloudflare vendor lock-in | Low | Low | D1 is SQLite (portable), R2 is S3-compatible |
| shadcn/ui maintenance | Low | Low | Components are copy-paste, not runtime dependency |
| AI provider pricing changes | High | Medium | Abstract provider interface, support multiple providers |

---

## 14. Version History

| Version | Date | Description |
|---|---|---|
| 1.0 | Initial Draft | Established canonical technology stack for CareerOS Phase 1 MVP. |
