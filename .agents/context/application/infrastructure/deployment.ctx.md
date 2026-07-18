---
id: APPLICATION-008
title: "Deployment"
status: canonical
version: "1.0"
owner: "DevOps Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: high
change_frequency: low
consumers:
  - DevOps Agent
  - Backend Agent
depends_on:
  - APPLICATION-007
  - APPLICATION-006
tags:
  - application
  - deployment
  - infrastructure
---

# APPLICATION-008 — Deployment

## Purpose

Hosting, CI/CD, environment configuration, monitoring, and disaster recovery for CareerOS.

## Infrastructure

| Layer | Technology | Purpose |
|---|---|---|
| Hosting | Vercel | Serverless functions, edge middleware, static assets |
| Database | Neon (PostgreSQL) | Serverless relational database with branching |
| Auth | NextAuth.js (Auth.js) | Authentication framework |
| AI | OpenAI API | LLM and embeddings (external) |
| File Storage | Vercel Blob | Document uploads |
| CDN | Vercel Edge Network | Global asset delivery |

## Environments

| Environment | URL | Database |
|---|---|---|
| Development | localhost:3000 | Neon branch or local PostgreSQL |
| Preview | *.vercel.app | Neon branch (per-PR) |
| Production | career-os.mostafayaser.earth | Neon production |

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string (Neon) |
| `NEXTAUTH_SECRET` | Yes | NextAuth.js session encryption key |
| `NEXTAUTH_URL` | Yes | Application URL for callback |
| `OPENAI_API_KEY` | Yes | OpenAI API authentication |
| `BLOB_READ_WRITE_TOKEN` | Yes | Vercel Blob access token |
| `NODE_ENV` | Yes | `development` or `production` |

## CI/CD Pipeline

### On Push to `main`

```
1. pnpm install
2. pnpm lint
3. pnpm typecheck
4. pnpm test
5. pnpm build
6. Deploy to Vercel production
7. prisma migrate deploy
```

### On Pull Request

```
1. pnpm install
2. pnpm lint
3. pnpm typecheck
4. pnpm test
5. pnpm build
6. Deploy to Vercel preview (Neon branch)
7. Comment PR with preview URL
```

## Monitoring

| Tool | Purpose | Phase |
|---|---|---|
| Vercel Analytics | Core Web Vitals, page performance | Alpha |
| Vercel Logs | Serverless function logs, error tracking | Alpha |
| Prisma Query Logging | SQL query debugging (development) | Alpha |
| Sentry | Error tracking and alerting | Phase 2 |

## Backup Strategy

| Method | Frequency | Retention |
|---|---|---|
| Neon Automatic Backups | Continuous | 7 days (point-in-time recovery) |
| Manual pg_dump | Weekly | 30 days |
| Git Repository | On every push | Indefinite |

## Disaster Recovery

| Metric | Alpha | Production |
|---|---|---|
| RTO | 4 hours | 1 hour |
| RPO | 24 hours | 1 hour |
| Uptime | 99.5% | 99.9% |

## Security Controls

| Control | Implementation |
|---|---|
| HTTPS | Enforced by Vercel |
| Environment variables | Encrypted at rest in Vercel |
| Database connection | SSL required (Neon default) |
| API keys | Never committed to repository |
| Auth sessions | Encrypted via NextAuth.js |
| CORS | Configured in Next.js middleware |

## Domain

| Domain | Target |
|---|---|
| career-os.mostafayaser.earth | Vercel (primary) |
| *.vercel.app | Vercel (preview) |

SSL/TLS automatic via Vercel. HTTP → HTTPS enforced.

## Future Phase Additions

- **Phase 2:** Redis (caching, rate limiting), Sentry
- **Phase 3:** Inngest/Trigger.dev (async automation)
- **Phase 5:** Multi-region, load testing, automated backup verification

## Canonical Source

`docs/05-engineering/deployment.md`
