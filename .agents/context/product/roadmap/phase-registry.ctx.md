---
id: ROADMAP-001
title: "Phase Registry"
status: canonical
version: "1.0"
owner: "PM Agent"
created: "2026-07-18"
modified: "2026-07-18"
phase: 1
stability: medium
change_frequency: low
consumers:
  - All Agents
depends_on:
  - CORE-001
  - CORE-004
tags:
  - product
  - roadmap
  - always-load
always_loaded: true
---

# ROADMAP-001 — Phase Registry

## Current Phase

**Phase 1 — MVP (Private Alpha)**
Single-user, 3-month timeline. Core career management loop.

## Phase Definitions

### Phase 0 — No-Code MVP
Notion + Make + Google Calendar. Validated demand before writing code.

### Phase 1 — MVP (Current)
**In Scope:**
- Auth (Google, GitHub, Magic Link)
- Dashboard
- Opportunity Inbox (Quick Capture)
- Opportunity Management (lifecycle, scoring)
- Application Management (8-state lifecycle)
- Document Library (upload, version, link)
- Goal Management (basic)
- Calendar & Timeline (basic)
- Notifications (in-app)
- Basic Analytics (operational)
- Global Search
- Settings
- tRPC API layer
- PostgreSQL (Neon) via Prisma

**Deferred (NOT in Phase 1):**
- Redis caching
- Background job queues
- Event bus (message queue)
- Multi-user / RBAC
- AI features (Phase 2+)
- Browser extension
- Email integration
- Public API / Webhooks
- Career Capital scoring algorithm
- Decision Engine
- Knowledge Graph
- Advanced analytics

### Phase 2 — Intelligence
AI Summaries, RAG, Browser Extension, Redis, MFA, Calendar Sync.

### Phase 3 — Automation
Event Bus, Workflows, Knowledge Graph, Advanced Analytics, Email Detection.

### Phase 4 — Platform
Public API, Webhooks, GitHub/LinkedIn integrations.

### Phase 5 — Collaboration
Mentors, Shared Workspaces, RBAC.

### Phase 6 — Enterprise
SSO, Multi-tenant, SAML.

## Deferral Registry

| Feature | Deferred To | Reason |
|---|---|---|
| Redis | Phase 2 | Not needed for single-user |
| Background jobs | Phase 2 | Sufficient in-process for alpha |
| Event bus | Phase 3 | In-process events sufficient for alpha |
| AI features | Phase 2 | Core loop must work first |
| Browser extension | Phase 2 | Capture flow works without it |
| Multi-user | Phase 5 | Single-user alpha first |
| RBAC | Phase 5 | Owner-only in Phase 1 |
| Knowledge Graph | Phase 3 | Basic knowledge entries sufficient |
| Career Capital scoring | Phase 2 | Manual tracking first |
| Decision Engine | Phase 2 | Manual decisions first |

## Phase Gate Rules

- Features from future phases MUST NOT be implemented in current phase
- Technology from future phases MUST NOT be introduced prematurely
- Phase progression requires: all Phase N features complete + validated
- Deferral exceptions require Architect Agent + human approval
