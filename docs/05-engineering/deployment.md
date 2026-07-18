# Deployment Architecture

**File:** `docs/05-engineering/deployment.md`

---

# Deployment Architecture

**Status:** Canonical
**Version:** 1.0

---

## Purpose

This document defines the deployment and infrastructure architecture for CareerOS. It covers hosting, databases, CI/CD, environment configuration, monitoring, and disaster recovery.

---

## Infrastructure Overview

| Layer | Technology | Purpose |
|---|---|---|
| Hosting | Vercel | Serverless functions, edge middleware, static assets |
| Database | Neon (PostgreSQL) | Serverless relational database with branching |
| Auth | NextAuth.js (Auth.js) | Authentication framework |
| AI | OpenAI API | LLM and embeddings (external) |
| File Storage | Vercel Blob | Document uploads |
| CDN | Vercel Edge Network | Global asset delivery |
| DNS | Vercel | Domain management |

---

## Environments

| Environment | URL | Purpose | Database |
|---|---|---|---|
| Development | localhost:3000 | Local development | Neon branch or local PostgreSQL |
| Preview | *.vercel.app | PR preview deployments | Neon branch (per-PR) |
| Production | career-os.mostafayaser.earth | Live application | Neon production |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string (Neon) |
| `NEXTAUTH_SECRET` | Yes | NextAuth.js session encryption key |
| `NEXTAUTH_URL` | Yes | Application URL for callback |
| `OPENAI_API_KEY` | Yes | OpenAI API authentication |
| `OPENAI_ORG_ID` | No | OpenAI organization ID |
| `BLOB_READ_WRITE_TOKEN` | Yes | Vercel Blob access token |
| `NODE_ENV` | Yes | `development` or `production` |

---

## CI/CD Pipeline

### On Push to `main`

```
1. Install dependencies (pnpm install)
2. Lint (pnpm lint)
3. Typecheck (pnpm typecheck)
4. Run tests (pnpm test)
5. Build (pnpm build)
6. Deploy to Vercel production
7. Apply database migrations (prisma migrate deploy)
```

### On Pull Request

```
1. Install dependencies (pnpm install)
2. Lint (pnpm lint)
3. Typecheck (pnpm typecheck)
4. Run tests (pnpm test)
5. Build (pnpm build)
6. Deploy to Vercel preview (with Neon branch database)
7. Comment PR with preview URL
```

---

## Domain and DNS

| Domain | Target | Notes |
|---|---|---|
| career-os.mostafayaser.earth | Vercel | Primary application domain |
| *.vercel.app | Vercel | Auto-generated preview URLs |

- SSL/TLS: Automatic via Vercel
- HTTP → HTTPS: Enforced by Vercel

---

## Monitoring

| Tool | Purpose | Phase |
|---|---|---|
| Vercel Analytics | Core Web Vitals, page performance | Alpha |
| Vercel Logs | Serverless function logs, error tracking | Alpha |
| Prisma Query Logging | SQL query debugging (development) | Alpha |
| Sentry | Error tracking and alerting | Phase 2 |

---

## Backup Strategy

| Method | Frequency | Retention | Notes |
|---|---|---|---|
| Neon Automatic Backups | Continuous | 7 days | Point-in-time recovery |
| Manual pg_dump | Weekly | 30 days | Stored in Vercel Blob |
| Git Repository | On every push | Indefinite | Code and migrations |

---

## Disaster Recovery

| Metric | Alpha Target | Production Target |
|---|---|---|
| RTO (Recovery Time Objective) | 4 hours | 1 hour |
| RPO (Recovery Point Objective) | 24 hours | 1 hour |
| Uptime Target | 99.5% | 99.9% |

### Recovery Procedures

1. **Database corruption:** Restore from Neon point-in-time recovery
2. **Deployment failure:** Roll back to previous Vercel deployment
3. **Complete data loss:** Restore from pg_dump backup + replay events
4. **Vercel outage:** Wait (serverless, no infrastructure to manage)

---

## Security

| Control | Implementation |
|---|---|
| HTTPS | Enforced by Vercel |
| Environment variables | Encrypted at rest in Vercel |
| Database connection | SSL required (Neon default) |
| API keys | Never committed to repository |
| Auth sessions | Encrypted via NextAuth.js |
| CORS | Configured in Next.js middleware |

---

## Alpha Scope Note

This infrastructure is designed for a single-user alpha. Production infrastructure (multi-user, enterprise) will add:

- Redis for session caching and rate limiting
- Dedicated monitoring (Sentry, Datadog)
- Automated backup verification
- Load testing and capacity planning
- Multi-region deployment
