# Deployment & Infrastructure

**File:** `docs/05-engineering/deployment.md`

---

# Deployment & Infrastructure

**Status:** Canonical
**Version:** 1.0

---

## 1. Purpose

This document defines the deployment architecture, CI/CD pipeline, environment management, and infrastructure configuration for CareerOS.

CareerOS is deployed on Cloudflare's global edge network, providing low-latency access worldwide.

---

## 2. Infrastructure Overview

### 2.1 Deployment Model

| Component | Technology | Deployment Target |
|---|---|---|
| Web Application | Next.js | Cloudflare Pages |
| API Routes | Next.js Server Actions + Route Handlers | Cloudflare Workers (via Pages) |
| Database | Cloudflare D1 | Cloudflare edge network |
| File Storage | Cloudflare R2 | Cloudflare edge network |
| Cache | Cloudflare KV | Cloudflare edge network |
| DNS | Cloudflare DNS | Cloudflare |
| CDN | Cloudflare CDN | Automatic with Pages |
| SSL/TLS | Cloudflare | Automatic certificate management |

### 2.2 Why Cloudflare

| Criterion | Cloudflare Advantage |
|---|---|
| **Edge-first** | Database and compute at the edge, globally distributed |
| **Cost** | Generous free tier for alpha; predictable pricing at scale |
| **Simplicity** | Single platform for compute, storage, DNS, CDN, SSL |
| **Performance** | Sub-50ms TTFB for cached content worldwide |
| **Developer Experience** | Wrangler CLI, instant deploys, preview URLs |
| **Integration** | D1, R2, KV, Queues, AI — all native, no third-party glue |

---

## 3. Environments

### 3.1 Environment Matrix

| Environment | Purpose | URL | Database | Branch |
|---|---|---|---|---|
| **Local** | Development | `localhost:3000` | Local D1 (wrangler) | Feature branch |
| **Preview** | PR review | `<hash>.career-os.pages.dev` | Preview D1 binding | PR branch |
| **Development** | Integration testing | `dev.career-os.mostafayaser.earth` | Development D1 | `develop` |
| **Production** | Live application | `career-os.mostafayaser.earth` | Production D1 | `main` |

### 3.2 Environment Configuration

| Variable | Local | Preview | Development | Production |
|---|---|---|---|---|
| `DATABASE_URL` | `localD1` | `previewD1` | `devD1` | `prodD1` |
| `AUTH_SECRET` | `.env.local` | Pages secret | Pages secret | Pages secret |
| `AUTH_GOOGLE_ID` | `.env.local` | Pages secret | Pages secret | Pages secret |
| `AUTH_GOOGLE_SECRET` | `.env.local` | Pages secret | Pages secret | Pages secret |
| `R2_BUCKET` | `localR2` | Preview R2 | Dev R2 | Prod R2 |
| `AI_API_KEY` | `.env.local` | Pages secret | Pages secret | Pages secret |

---

## 4. CI/CD Pipeline

### 4.1 Pipeline Overview

```
Push to feature branch
    │
    ├── Lint (ESLint + Prettier)
    ├── Type Check (tsc --noEmit)
    ├── Unit Tests (Vitest)
    ├── Integration Tests (Vitest)
    └── Build (Next.js)
         │
         ▼
    Preview Deploy (Cloudflare Pages)
         │
         └── E2E Tests (Playwright)
              │
              ▼
         PR Review → Merge to develop
              │
              ├── All checks pass
              └── Deploy to Development
                   │
                   └── Manual QA → Merge to main
                        │
                        └── Deploy to Production
```

### 4.2 CI Pipeline (GitHub Actions)

#### On Every Push / PR

```yaml
name: CI
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm format:check

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:unit
      - run: pnpm test:integration

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
```

#### On Merge to `main`

```yaml
name: Deploy Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist --project-name=career-os
```

### 4.3 Branch Strategy

```
main (production)
    ↑
develop (integration)
    ↑
feature/* (feature branches)
    ↑
fix/* (bug fix branches)
```

- **feature/*** — Feature branches, PR to `develop`
- **fix/*** — Bug fix branches, PR to `develop`
- **develop** — Integration branch, PR to `main` for production deploy
- **main** — Production, always deployable

### 4.4 Required Checks Before Merge

- [ ] ESLint passes (no errors, warnings documented)
- [ ] Prettier format check passes
- [ ] TypeScript type check passes (`tsc --noEmit`)
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Build succeeds
- [ ] Preview deploy succeeds
- [ ] E2E tests pass (on preview)
- [ ] Code review approved

---

## 5. Cloudflare Configuration

### 5.1 Wrangler Configuration

```toml
# wrangler.toml (simplified)
name = "career-os"
compatibility_date = "2024-01-01"
pages_build_output_dir = ".vercel/output/static"

# D1 Database
[[d1_databases]]
binding = "DB"
database_name = "career-os-production"
database_id = "<production-database-id>"

# R2 Bucket
[[r2_buckets]]
binding = "R2"
bucket_name = "career-os-documents"

# KV Namespace (Phase 2+)
# [[kv_namespaces]]
# binding = "KV"
# id = "<kv-namespace-id>"
```

### 5.2 Pages Configuration

| Setting | Value |
|---|---|
| Build Command | `pnpm build` |
| Build Output Directory | `.vercel/output/static` |
| Node.js Version | 20 |
| Framework | Next.js (auto-detected) |
| Build Cache | Enabled |

### 5.3 D1 Database Management

```bash
# Create database
wrangler d1 create career-os-production

# Run migrations locally
wrangler d1 execute career-os-production --local --file=./drizzle/0000_initial.sql

# Run migrations remotely
wrangler d1 execute career-os-production --remote --file=./drizzle/0000_initial.sql

# Backup database
wrangler d1 backup create career-os-production

# Query database
wrangler d1 execute career-os-production --remote --command="SELECT count(*) FROM opportunities"
```

### 5.4 R2 Bucket Management

```bash
# Create bucket
wrangler r2 bucket create career-os-documents

# List objects
wrangler r2 object list career-os-documents --prefix="documents/"

# Generate presigned URL for download
wrangler r2 presigned-url get career-os-documents --key="documents/user-1/doc-1/v1/cv.pdf"
```

---

## 6. Monitoring & Observability

### 6.1 Monitoring Stack

| Signal | Tool | Purpose |
|---|---|---|
| Application errors | Sentry | Error tracking, alerting, stack traces |
| Performance | Cloudflare Web Analytics | Core Web Vitals, page load metrics |
| Uptime | Cloudflare Health Checks | Endpoint availability monitoring |
| Database | D1 Dashboard | Query performance, storage usage |
| Logs | Cloudflare Workers Logs | Request logs, error logs |

### 6.2 Alerting Rules

| Alert | Condition | Channel |
|---|---|---|
| Application errors | > 10 errors in 5 minutes | Email + Sentry |
| Uptime failure | Endpoint down for > 2 minutes | Email |
| Database errors | Any connection failure | Email |
| High latency | p95 > 2 seconds for 10 minutes | Email |
| Storage quota | > 80% of R2 free tier | Email |

### 6.3 Custom Metrics

Track business metrics defined in `docs/01-product/success-metrics.md`:

| Metric | Collection Method |
|---|---|
| Time-to-Capture | Client-side timing on capture flow |
| Opportunity Conversion Rate | Database query (CAPTURED → ACTIONED) |
| Reflection Completion Rate | Database query (terminal state → reflection exists) |
| Asset Reuse Rate | Database query (document linked to multiple opportunities) |

---

## 7. Rollback Strategy

### 7.1 Application Rollback

Cloudflare Pages maintains deployment history. Rollback is instant:

```bash
# List recent deployments
wrangler pages deployment list --project-name=career-os

# Rollback to previous deployment
wrangler pages deployment rollback --project-name=career-os <deployment-id>
```

### 7.2 Database Rollback

D1 supports point-in-time recovery:

```bash
# List backups
wrangler d1 backup list career-os-production

# Restore from backup
wrangler d1 restore career-os-production --backup-id=<backup-id>
```

### 7.3 Rollback Decision Criteria

| Condition | Action |
|---|---|
| Build fails in production | Automatic rollback to last successful deploy |
| Error rate > 5% | Manual rollback within 15 minutes |
| Data corruption detected | Immediate rollback + database restore |
| Performance degradation > 50% | Investigate, rollback if not resolved in 30 minutes |

---

## 8. Development Workflow

### 8.1 Local Development Setup

```bash
# Clone repository
git clone https://github.com/user/career-os.mostafayaser.earth.git
cd career-os.mostafayaser.earth

# Install dependencies
pnpm install

# Set up local database
wrangler d1 execute career-os-local --local --file=./drizzle/0000_initial.sql

# Start development server
pnpm dev

# Run tests
pnpm test:unit
pnpm test:integration
pnpm test:e2e
```

### 8.2 Local Development Commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Start Next.js dev server with HMR |
| `pnpm build` | Production build |
| `pnpm test:unit` | Run unit tests |
| `pnpm test:integration` | Run integration tests |
| `pnpm test:e2e` | Run E2E tests (requires Playwright) |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Run Prettier |
| `pnpm typecheck` | Run TypeScript type check |
| `pnpm db:generate` | Generate Drizzle migration |
| `pnpm db:migrate` | Apply migrations to local D1 |
| `pnpm db:studio` | Open Drizzle Studio |

### 8.3 Database Development

```bash
# Generate migration from schema changes
pnpm db:generate

# Apply migrations to local database
wrangler d1 execute career-os-local --local --file=./drizzle/0001_add_feature.sql

# Reset local database
wrangler d1 execute career-os-local --local --command="DROP TABLE IF EXISTS opportunities"

# Open Drizzle Studio (visual database browser)
pnpm db:studio
```

---

## 9. Performance Optimization

### 9.1 Build Optimization

| Strategy | Implementation |
|---|---|
| Tree shaking | Next.js + Webpack automatic |
| Code splitting | Automatic via Next.js pages |
| Image optimization | Next.js `<Image>` component |
| Font optimization | Next.js `@next/font` |
| Bundle analysis | `@next/bundle-analyzer` |

### 9.2 Runtime Optimization

| Strategy | Implementation |
|---|---|
| Edge rendering | Cloudflare Workers (sub-50ms cold start) |
| Static generation | Next.js ISR for public pages |
| Database queries | Indexed queries, connection pooling via D1 |
| Caching | Next.js cache + Cloudflare CDN |
| Lazy loading | Dynamic imports for heavy components |

### 9.3 Performance Budget

| Metric | Budget | Measurement |
|---|---|---|
| First Load JS | < 100 KB (gzipped) | Lighthouse |
| Total Bundle | < 250 KB (gzipped) | Bundle analyzer |
| LCP | < 2.5s | Web Vitals |
| CLS | < 0.1 | Web Vitals |
| INP | < 200ms | Web Vitals |
| API p95 | < 500ms | Server timing |

---

## 10. Disaster Recovery

### 10.1 Backup Schedule

| Data | Frequency | Retention | Method |
|---|---|---|---|
| D1 Database | Daily automatic | 30 days | Cloudflare D1 backup |
| R2 Documents | Versioned | Indefinite | R2 versioning |
| Configuration | On change | Indefinite | Git repository |
| Environment secrets | On change | Indefinite | Cloudflare dashboard |

### 10.2 Recovery Objectives

| Metric | Target |
|---|---|
| **RPO** (Recovery Point Objective) | < 24 hours (daily backups) |
| **RTO** (Recovery Time Objective) | < 1 hour (rollback + restore) |

### 10.3 Recovery Procedures

| Scenario | Procedure |
|---|---|
| Application bug | Rollback Pages deployment (instant) |
| Database corruption | Restore D1 from backup |
| Accidental data deletion | Restore D1 from backup (point-in-time) |
| Infrastructure outage | Cloudflare automatic failover |
| Complete loss | Restore from backup to new Cloudflare account |

---

## 11. Cost Estimation

### 11.1 Free Tier Limits (Phase 1 Alpha)

| Service | Free Tier | Estimated Usage | Cost |
|---|---|---|---|
| Cloudflare Pages | Unlimited requests | < 10K/month | $0 |
| Cloudflare Workers | 100K requests/day | < 1K/day | $0 |
| D1 | 5 GB storage, 10M reads/day, 100K writes/day | < 100MB, < 1K reads/day | $0 |
| R2 | 10 GB storage, 1M Class A, 10M Class B | < 1 GB, < 1K operations | $0 |
| KV | 100K reads/day, 1K writes/day | Not used in Phase 1 | $0 |
| **Total Phase 1** | | | **$0** |

### 11.2 Scaling Costs (Phase 2+)

| Service | Pricing | Estimated Monthly |
|---|---|---|
| Pages | $0 (free tier covers) | $0 |
| Workers | $5/month + $0.30/M requests | $5–10 |
| D1 | $0.75/GB storage + $0.15/M reads | $1–5 |
| R2 | $0.015/GB storage + $0.36/M Class A | $1–3 |
| KV | $0.50/M reads + $0.50/M writes | $0–2 |
| Sentry | Free tier (5K errors/month) | $0 |
| **Total Phase 2** | | **$7–20/month** |

---

## 12. Security in Deployment

Ref: `docs/05-engineering/security.md`

### 12.1 Pre-Deploy Security Checks

- [ ] No secrets in code (grep for API keys, tokens)
- [ ] `.env.local` is gitignored
- [ ] `pnpm audit` passes (no critical/high vulnerabilities)
- [ ] Environment variables set in Cloudflare dashboard (not in code)
- [ ] CORS policy configured
- [ ] CSP headers configured
- [ ] Security headers configured

### 12.2 Production Hardening

- [ ] Error pages do not expose stack traces
- [ ] Debug mode is disabled
- [ ] Source maps are not uploaded to production
- [ ] Logging level is set to `warn` or `error` in production
- [ ] Rate limiting is enabled

---

## 13. Version History

| Version | Date | Description |
|---|---|---|
| 1.0 | Initial Draft | Established canonical deployment and infrastructure spec for CareerOS. |
